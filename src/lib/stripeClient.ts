import { loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<import("@stripe/stripe-js").Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      throw new Error("VITE_STRIPE_PUBLISHABLE_KEY is not set");
    }
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
}