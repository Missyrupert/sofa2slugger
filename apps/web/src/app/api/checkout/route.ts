import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getResolvedBaseUrl } from "@/lib/env";

const COURSE_PRICE_PENCE = 999;

export async function POST() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  const baseUrl = getResolvedBaseUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Sofa2Slugger Full Course",
              description:
                "Lifetime access to all 12 guided audio boxing rounds.",
            },
            unit_amount: COURSE_PRICE_PENCE,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/gym`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
