import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// ---- Env (make sure these are set in Supabase → Project Settings → Secrets)
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required env secrets.");
}

const stripe = new Stripe(STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

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

    // Fetch mentor profile
    const { data: mentor, error: selErr } = await supabase
      .from("mentors")
      .select("stripe_account_id, user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (selErr) {
      console.error(selErr);
      return new Response(JSON.stringify({ error: "Failed to fetch mentor profile." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    if (!mentor) {
      return new Response(JSON.stringify({ error: "No mentor profile found. Please create a mentor profile first." }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    let stripeAccountId = mentor.stripe_account_id as string | null;

    // Create Stripe Connect Standard account if missing
    if (!stripeAccountId) {
      const acct = await stripe.accounts.create({
        type: "standard",
        country: "US",
        email: user.email || undefined,
        business_type: "individual",
        capabilities: { transfers: { requested: true } },
      });
      stripeAccountId = acct.id;

      const { error: updErr } = await supabase
        .from("mentors")
        .update({ 
          stripe_account_id: stripeAccountId,
          onboarding_required: true,
          payouts_enabled: false
        })
        .eq("user_id", user.id);
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
    const appOrigin = origin ?? `${req.headers.get("origin") || "https://habeshanetwork.com"}`;
    const returnUrl = `${appOrigin}/mentor/payouts?onboarding=done`;
    const refreshUrl = `${appOrigin}/mentor/payouts?onboarding=retry=1`;

    // Check account status and update database
    const acct = await stripe.accounts.retrieve(stripeAccountId);
    const payoutsEnabled = acct.charges_enabled && acct.payouts_enabled;
    const onboardingRequired = !acct.details_submitted || acct.requirements?.currently_due?.length > 0;

    // Update mentor record with current status
    await supabase
      .from("mentors")
      .update({ 
        payouts_enabled: payoutsEnabled,
        onboarding_required: onboardingRequired
      })
      .eq("user_id", user.id);

    let url: string;

    if (onboardingRequired) {
      const link = await stripe.accountLinks.create({
        account: stripeAccountId,
        type: "account_onboarding",
        return_url: returnUrl,
        refresh_url: refreshUrl,
      });
      url = link.url;
    } else {
      // Already completed onboarding — send to Express dashboard
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
      url = loginLink.url;
    }

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  } catch (e) {
    console.error("connect-stripe error:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(req.headers.get("Origin")) },
    });
  }
});