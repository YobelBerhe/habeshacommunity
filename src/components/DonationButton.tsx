import React from "react";
import { useLanguage } from "@/store/language";
import { t } from "@/lib/i18n";

type Props = {
  variant?: "solid" | "ghost";
  provider?: "stripe" | "paypal";
  // later: pass your Stripe checkout/session link here
  href?: string;
};

export default function DonationButton({
  variant = "solid",
  provider = "stripe",
  href,
}: Props) {
  const { language } = useLanguage();
  const url =
    href ||
    (provider === "paypal"
      ? "https://www.paypal.com/donate"
      : "https://donate.stripe.com/test_123"); // TODO: replace with your real link

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
        variant === "solid"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border hover:bg-muted"
      }`}
    >
      <span>💙 {t(language, "support_habesha")}</span>
    </a>
  );
}