/** Stripe key guards: prevent test keys in production and live keys in development. */
function validateStripeKeys(): void {
  if (typeof window !== "undefined") return;

  const nodeEnv = process.env.NODE_ENV;
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  if (nodeEnv === "production") {
    if (!secretKey || !secretKey.startsWith("sk_live_")) {
      throw new Error(
        `STRIPE CONFIGURATION ERROR: Production requires a valid live secret key.\n` +
          `   NODE_ENV is set to "production".\n` +
          `   STRIPE_SECRET_KEY must be set and start with "sk_live_".\n` +
          `   To fix: set STRIPE_SECRET_KEY to your live secret key in environment variables.`
      );
    }

    if (!publishableKey || !publishableKey.startsWith("pk_live_")) {
      throw new Error(
        `STRIPE CONFIGURATION ERROR: Production requires a valid live publishable key.\n` +
          `   NODE_ENV is set to "production".\n` +
          `   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be set and start with "pk_live_".\n` +
          `   To fix: set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your live publishable key in environment variables.`
      );
    }

    return;
  }

  if (secretKey.startsWith("sk_live_")) {
    throw new Error(
      `STRIPE KEY MISMATCH: Live secret key detected in ${nodeEnv} environment.\n` +
        `   NODE_ENV is "${nodeEnv}" (not production).\n` +
        `   Use ONLY test keys (sk_test_, pk_test_) in development and E2E.\n` +
        `   To fix: set STRIPE_SECRET_KEY to a test key or remove it from .env.local.`
    );
  }

  if (publishableKey.startsWith("pk_live_")) {
    throw new Error(
      `STRIPE KEY MISMATCH: Live publishable key detected in ${nodeEnv} environment.\n` +
        `   NODE_ENV is "${nodeEnv}" (not production).\n` +
        `   Use ONLY test keys (sk_test_, pk_test_) in development and E2E.\n` +
        `   To fix: set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to a test key or remove it from .env.local.`
    );
  }
}

/** Minimal env - no DB or auth required for static site. */
export function getEnv(): Record<string, unknown> {
  validateStripeKeys();
  return {};
}
