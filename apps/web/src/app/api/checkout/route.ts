import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getResolvedBaseUrl } from "@/lib/env";

const DEFAULT_STRIPE_PRICE_ID_GBP_499 = "price_1Tc9DWLOeUZSyE4Rr2I2a5WH";

function getCoursePriceId() {
  return (
    process.env.STRIPE_PRICE_ID_GBP_499 || DEFAULT_STRIPE_PRICE_ID_GBP_499
  );
}

export async function POST() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);
  const coursePriceId = getCoursePriceId();

  const baseUrl = getResolvedBaseUrl();

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
      metadata: {
        product: "Sofa2Slugger Full Course",
        price_id: coursePriceId,
      },
      payment_intent_data: {
        metadata: {
          product: "Sofa2Slugger Full Course",
          price_id: coursePriceId,
        },
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/gym`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
