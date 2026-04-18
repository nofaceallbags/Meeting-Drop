import Stripe from "stripe";

export const FREE_MEETING_LIMIT = 3;

export function getStripeClient(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}
