(()=>{
const canCustomize=['/account','/admin/users','/dashboard'].includes(location.pathname);
const header=document.querySelector('header'),nav=header?.querySelector('nav');
if(header&&nav){
  const toggle=document.createElement('button');toggle.type='button';toggle.className='mobile-nav-toggle';toggle.textContent='Menu ☰';toggle.setAttribute('aria-expanded','false');nav.id=nav.id||'primary-navigation';toggle.setAttribute('aria-controls',nav.id);header.insertBefore(toggle,nav);
  toggle.addEventListener('click',()=>{const open=nav.classList.toggle('mobile-open');toggle.setAttribute('aria-expanded',String(open));});
  nav.addEventListener('click',event=>{if(event.target.closest('a')){nav.classList.remove('mobile-open');toggle.setAttribute('aria-expanded','false')}});
}
if(canCustomize&&header){
  const defaults={theme:localStorage.getItem('toknado-theme')||'dark',accent:localStorage.getItem('toknado-accent')||'lime'};
  document.documentElement.dataset.theme=defaults.theme;document.documentElement.dataset.accent=defaults.accent;
  const appearance=document.createElement('div');appearance.className='appearance';appearance.innerHTML='<button id="appearanceToggle" class="appearance-button" type="button" aria-expanded="false">Appearance ▾</button><div id="appearanceMenu" class="appearance-menu" hidden><label>Theme<select id="themeSelect"><option value="dark">Dark</option><option value="light">Light</option></select></label><label>Accent<select id="accentSelect"><option value="lime">Lime</option><option value="blue">Blue</option><option value="violet">Violet</option><option value="orange">Orange</option></select></label></div>';
  header.append(appearance);const menu=appearance.querySelector('.appearance-menu'),button=appearance.querySelector('.appearance-button');
  appearance.querySelector('#themeSelect').value=defaults.theme;appearance.querySelector('#accentSelect').value=defaults.accent;
  button.onclick=()=>{menu.hidden=!menu.hidden;button.setAttribute('aria-expanded',String(!menu.hidden))};
  appearance.querySelector('#themeSelect').onchange=event=>{document.documentElement.dataset.theme=event.target.value;localStorage.setItem('toknado-theme',event.target.value)};
  appearance.querySelector('#accentSelect').onchange=event=>{document.documentElement.dataset.accent=event.target.value;localStorage.setItem('toknado-accent',event.target.value)};
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.hidden=true;button.setAttribute('aria-expanded','false');nav?.classList.remove('mobile-open');header.querySelector('.mobile-nav-toggle')?.setAttribute('aria-expanded','false')}});
}
if(location.pathname==='/account')new MutationObserver(()=>document.querySelectorAll('button').forEach(button=>{if(button.textContent.trim()==='Rotate key')button.remove()})).observe(document.body,{childList:true,subtree:true});
})();
