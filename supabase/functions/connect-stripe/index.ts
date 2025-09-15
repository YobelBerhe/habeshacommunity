// Deno Deploy / Supabase Edge
// File: supabase/functions/connect-stripe/index.ts

import Stripe from "https://esm.sh/stripe@16.6.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---- Env (make sure these are set in Supabase → Project Settings → Secrets)
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required env secrets.");
}

const stripe = new Stripe(STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" });

// CORS helper
function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  try {
    // Require auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Not authenticated." }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }
    const access_token = authHeader.replace("Bearer ", "");

    // Supabase client using SERVICE ROLE (so we can update users despite RLS)
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${access_token}` } },
    });

    // Get current user (from JWT)
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Cannot read current user." }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    // Fetch existing stripe_account_id if any
    const { data: row, error: selErr } = await supabase
      .from("users")
      .select("stripe_account_id, email, name")
      .eq("id", user.id)
      .maybeSingle();

    if (selErr) {
      console.error(selErr);
      return new Response(JSON.stringify({ error: "Failed to fetch user row." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    let stripeAccountId = row?.stripe_account_id as string | null;

    // Create Stripe account if missing
    if (!stripeAccountId) {
      const acct = await stripe.accounts.create({
        type: "express",
        email: row?.email || user.email || undefined,
        business_type: "individual",
        capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
      });
      stripeAccountId = acct.id;

      const { error: updErr } = await supabase
        .from("users")
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", user.id);
      if (updErr) {
        console.error(updErr);
        return new Response(JSON.stringify({ error: "Failed to save Stripe account ID." }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }
    }

    // Build safe return/refresh URLs (use your app's public URL)
    // If you have a dedicated payouts page, use that path.
    const appOrigin = origin ?? "https://your-app.lovable.dev";
    const returnUrl = `${appOrigin}/mentor/payouts?onboarding=done`;
    const refreshUrl = `${appOrigin}/mentor/payouts?onboarding=retry=1`;

    // If account still needs onboarding, create an onboarding link; otherwise create a dashboard link
    const acct = await stripe.accounts.retrieve(stripeAccountId);
    let url: string;

    if (!acct.details_submitted) {
      const link = await stripe.accountLinks.create({
        account: stripeAccountId,
        type: "account_onboarding",
        return_url: returnUrl,
        refresh_url: refreshUrl,
      });
      url = link.url;
    } else {
      // Already completed onboarding — send them to Express dashboard
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
      url = loginLink.url;
    }

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  } catch (e) {
    console.error("connect-stripe error:", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(req.headers.get("Origin")) },
    });
  }
});