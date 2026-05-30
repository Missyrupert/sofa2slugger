import { NextResponse } from "next/server";

type StripeKeyMode = "test" | "live" | "missing" | "unknown";

export function GET() {
  return NextResponse.json(
    {
      secretKeyMode: getSecretKeyMode(process.env.STRIPE_SECRET_KEY),
      publishableKeyMode: getPublishableKeyMode(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ),
      priceConfigured: Boolean(process.env.STRIPE_PRICE_ID_GBP_499),
      webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

function getSecretKeyMode(value: string | undefined): StripeKeyMode {
  if (!value) return "missing";
  if (value.startsWith("sk_test_")) return "test";
  if (value.startsWith("sk_live_")) return "live";
  return "unknown";
}

function getPublishableKeyMode(value: string | undefined): StripeKeyMode {
  if (!value) return "missing";
  if (value.startsWith("pk_test_")) return "test";
  if (value.startsWith("pk_live_")) return "live";
  return "unknown";
}
