import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getResolvedBaseUrl } from "@/lib/env";

function getCoursePriceId() {
  return process.env.STRIPE_PRICE_ID_GBP_499;
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const requestBody = await readCheckoutRequest(request);
  const stripe = new Stripe(secretKey);
  const coursePriceId = getCoursePriceId();

  if (!coursePriceId) {
    return NextResponse.json(
      { error: "Stripe price is not configured" },
      { status: 500 }
    );
  }

  const baseUrl = getResolvedBaseUrl();
  const metadata = {
    product: "Sofa2Slugger Full Course",
    price_id: coursePriceId,
    source: requestBody.source,
    ...stringMetadata(requestBody.attribution),
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: coursePriceId,
          quantity: 1,
        },
      ],
      metadata,
      payment_intent_data: {
        metadata,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/gym`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function readCheckoutRequest(request: Request): Promise<{
  source: string;
  attribution: Record<string, unknown>;
}> {
  try {
    const body = (await request.json()) as {
      source?: unknown;
      attribution?: unknown;
    };
    const source =
      typeof body?.source === "string" ? body.source : "unknown_checkout_source";
    const attribution = isRecord(body.attribution) ? body.attribution : {};
    return { source, attribution };
  } catch {
    return { source: "unknown_checkout_source", attribution: {} };
  }
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === "object" && !Array.isArray(input);
}

function stringMetadata(input: Record<string, unknown>): Record<string, string> {
  const output: Record<string, string> = {};
  const allowed = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "initial_referrer",
  ];

  for (const key of allowed) {
    const value = input[key];
    if (typeof value === "string" && value) {
      output[key] = value.slice(0, 450);
    }
  }

  return output;
}
