import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailNotificationRequest {
  recipientEmail: string;
  senderName: string;
  messagePreview: string;
  conversationId: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, senderName, messagePreview, conversationId }: EmailNotificationRequest = await req.json();

    console.log('Sending email notification to:', recipientEmail);

    const appUrl = Deno.env.get('SITE_URL') || 'https://your-app.lovable.app';
    const replyUrl = `${appUrl}/inbox`;

    // Send email via Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Mentorship Platform <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `💬 New message from ${senderName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">You have a new message</h2>
            <p style="color: #666; font-size: 16px;">
              <strong>${senderName}</strong> sent you a message:
            </p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #333;">${messagePreview}</p>
            </div>
            <a href="${replyUrl}" 
               style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Reply Now
            </a>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              To stop receiving email notifications, update your settings in the app.
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse.json();

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, emailData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-message-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
