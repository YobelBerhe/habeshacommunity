import { loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<import("@stripe/stripe-js").Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    // Use the publishable key from the image
    const pk = "pk_test_51S35dNJKXB1syg1zhsxtuRHcpoFXkEYr6jB9bMxsUEt2ev6j6ZwCXyx5Hd5Qh7CGbDsSPTNAJHnCuW5FHu09U6Z00iMuKNF2G";
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
}