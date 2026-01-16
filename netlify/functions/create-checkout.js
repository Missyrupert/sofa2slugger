exports.handler = async (event, context) => {
  console.log("create-checkout invoked");
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    // Initialize Stripe inside handler to catch "Cannot find module" errors
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is missing from environment variables');
    }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Get the origin for redirect URLs
    const origin = event.headers.origin || event.headers.referer?.replace(/\/$/, '') || 'https://sofa2slugger.netlify.app';

    console.log(`Debug: Creating checkout session for price_1SpxlxLOeUZSyE4RbYV0byrU from origin ${origin}`);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: 'price_1SpxlxLOeUZSyE4RbYV0byrU',
          quantity: 1,
        },
      ],
      success_url: `${origin}/start?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    console.log("Debug: Session created successfully:", session.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe error details:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        details: "Check Function Logs for more info"
      }),
    };
  }
};
