const STRIPE_PRICE_ID_499_GBP = 'price_1Tc9DWLOeUZSyE4Rr2I2a5WH';
const STRIPE_PAYMENT_LINK_LEGACY = 'https://buy.stripe.com/dRm7sM73Y3E80Unctn8k801';

function getSiteUrl(event) {
  const proto = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers.host;
  return `${proto}://${host}`;
}

function redirect(location) {
  return {
    statusCode: 303,
    headers: {
      Location: location,
      'Cache-Control': 'no-store'
    },
    body: ''
  };
}

exports.handler = async function handler(event) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  // Keep checkout working while Stripe server-side configuration is being completed.
  if (!stripeSecretKey) {
    console.warn('STRIPE_SECRET_KEY is not set. Redirecting to legacy Stripe Payment Link.');
    return redirect(STRIPE_PAYMENT_LINK_LEGACY);
  }

  const siteUrl = process.env.URL || getSiteUrl(event);
  const successUrl = `${siteUrl}/gym.html?payment=success`;
  const cancelUrl = `${siteUrl}/index.html#pricing`;

  const body = new URLSearchParams({
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    'line_items[0][price]': STRIPE_PRICE_ID_499_GBP,
    'line_items[0][quantity]': '1',
    'metadata[product]': 'Sofa2Slugger',
    'metadata[price_id]': STRIPE_PRICE_ID_499_GBP,
    'payment_intent_data[metadata][product]': 'Sofa2Slugger',
    'payment_intent_data[metadata][price_id]': STRIPE_PRICE_ID_499_GBP
  });

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    const session = await response.json();

    if (!response.ok || !session.url) {
      console.error('Stripe checkout session creation failed.', session);
      return redirect(STRIPE_PAYMENT_LINK_LEGACY);
    }

    return redirect(session.url);
  } catch (error) {
    console.error('Stripe checkout request failed.', error);
    return redirect(STRIPE_PAYMENT_LINK_LEGACY);
  }
};
