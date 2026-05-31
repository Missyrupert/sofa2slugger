/** Stripe key checks: report obvious mistakes without taking the whole site down. */
function validateStripeKeys(): void {
  if (typeof window !== "undefined") return;

  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  if (secretKey && !/^sk_(test|live)_/.test(secretKey)) {
    console.error("STRIPE CONFIGURATION ERROR: STRIPE_SECRET_KEY must start with sk_test_ or sk_live_.");
  }

  if (publishableKey && !/^pk_(test|live)_/.test(publishableKey)) {
    console.error("STRIPE CONFIGURATION ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_test_ or pk_live_.");
  }

  if (secretKey.startsWith("sk_test_") && publishableKey.startsWith("pk_live_")) {
    console.error("STRIPE KEY MISMATCH: test secret key cannot be used with live publishable key.");
  }

  if (secretKey.startsWith("sk_live_") && publishableKey.startsWith("pk_test_")) {
    console.error("STRIPE KEY MISMATCH: live secret key cannot be used with test publishable key.");
  }
}

/** Minimal env check - no DB or auth required for static site. */
export function getEnv(): Record<string, unknown> {
  validateStripeKeys();
  return {};
}
