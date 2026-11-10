export function siteOrigin() {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN || 'toknado.up.railway.app';
  return new URL(process.env.PUBLIC_BASE_URL || 'https://' + domain).origin;
}

export function welcomeMailer(store) {
  let running = false;
  return async function deliver() {
    if (running) return;
    running = true;
    try {
      for (let i = 0; i < 10; i++) {
        const job = store.nextWelcome();
        if (!job) break;
        try {
          const {email, username, temporaryPassword, key, quota, kind} = job.message;
          const origin = siteOrigin();
          if(kind==='registration'){
            const text=['Welcome to TOKNADO, '+username+'.','', 'Your account is ready. Start with the setup guide: '+origin+'/setup', 'Sign in: '+origin+'/login','', 'Follow TOKNADO:','LinkedIn: https://www.linkedin.com/in/aaron-wise-31b00349/','X: https://x.com/AaronWiseAI','Threads: https://www.threads.net/@open.clawsetup'].join('\n');
            const html='<main style="max-width:560px;margin:auto;padding:32px;font:16px/1.55 Arial,sans-serif;color:#172033"><p style="font-size:24px;font-weight:800;margin:0">◉ TOK<span style="color:#c58a00">NADO</span></p><h1>Welcome to TOKNADO, '+username+'.</h1><p>Your account is ready. Build with a managed model pool through one OpenAI-compatible endpoint.</p><p><a href="'+origin+'/setup" style="display:inline-block;padding:12px 16px;border-radius:8px;background:#ffcb3d;color:#171208;font-weight:700;text-decoration:none">Open the setup guide</a></p><p><a href="'+origin+'/login">Sign in to your account</a></p><hr style="border:0;border-top:1px solid #d7dee9"><p><strong>Follow TOKNADO</strong><br><a href="https://www.linkedin.com/in/aaron-wise-31b00349/">LinkedIn</a> · <a href="https://x.com/AaronWiseAI">X</a> · <a href="https://www.threads.net/@open.clawsetup">Threads</a></p></main>';
            const response=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'toknado-registration/'+job.sub},body:JSON.stringify({from:process.env.USAGE_EMAIL_FROM,to:[email],subject:'Welcome to TOKNADO 🌪️',text,html})});
            if(!response.ok||!(await response.json()).id)throw Error('Provider did not accept message');store.welcomeSent(job.sub);continue;
          }
          const text = [
            'Your TOKNADO subscription is ready.',
            'Hourly request limit: ' + quota.toLocaleString('en-US'),
            '', 'Username: ' + username,
            temporaryPassword ? 'Temporary password: ' + temporaryPassword + '\nChoose a new password on your first sign-in. If you already changed it, use your new password.' : 'Use your existing account password.',
            'Sign in: ' + origin + '/login', 'Dashboard: ' + origin + '/account',
            '', 'API key: ' + key, 'API base URL: ' + origin + '/v1',
            'Routing: managed model pool', 'Setup guide: ' + origin + '/setup',
            '', 'Keep this email private. Anyone with the API key can use your quota.'
          ].join('\n');
          const response = await fetch('https://api.resend.com/emails', {
            method:'POST', signal:AbortSignal.timeout(10000),
            headers:{Authorization:'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type':'application/json', 'Idempotency-Key':'kb-welcome/' + job.sub},
            body:JSON.stringify({from:process.env.USAGE_EMAIL_FROM, to:[email], subject:'Your TOKNADO account and API key', text})
          });
          if (!response.ok || !(await response.json()).id) throw Error('Provider did not accept message');
          store.welcomeSent(job.sub);
        } catch {
          store.welcomeFailed(job.sub,job.attempts);
          console.error('[welcome] Delivery deferred for subscription', job.sub);
        }
      }
    } catch { console.error('[welcome] Unable to read delivery queue'); }
    finally { running = false; }
  };
}
