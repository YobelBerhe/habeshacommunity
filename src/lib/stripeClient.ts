import { loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<import("@stripe/stripe-js").Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    // Use the publishable key from the user
    const pk = "pk_test_51S35dNJKXBIsyg1zhsxtuRHcpoFXkEYr6jb9bAwxsUEt2ey6j6ZwCXyx5Hd5Qh7CGbDpSPTWA1MnCuW5FHu09U6z00iMuKNF2G";
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
}