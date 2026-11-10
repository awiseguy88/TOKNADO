# TOKNADO Cloud

TOKNADO Cloud provides customer accounts, API keys, billing, usage reporting, and the Storm Console for the hosted TOKNADO gateway.

## Railway deployment

Deploy this directory as the Railway service root. Use Node.js 22.13 or later and the start command:

```sh
npm start
```

Set `RAILWAY_PUBLIC_DOMAIN=toknado.up.railway.app` along with the service’s required database, account, billing, email, proxy, and Stripe environment variables.

Configure Stripe webhook delivery at:

```text
https://toknado.up.railway.app/stripe/webhook
```

Subscribe to `invoice.paid` and `customer.subscription.deleted`, and place that endpoint’s signing secret in `STRIPE_WEBHOOK_SECRET`.

The service exposes `/healthz` for uptime monitoring and `/v1` as the OpenAI-compatible gateway endpoint.
