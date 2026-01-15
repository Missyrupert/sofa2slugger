// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Stripe dependency removed per user request.

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  return {
    statusCode: 503,
    headers,
    body: JSON.stringify({ error: "Payment service unavailable. Stripe dependencies not installed." }),
  };
};
