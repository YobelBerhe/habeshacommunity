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

    // Send email via Resend API with branded HabeshaCommunity template
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "HabeshaCommunity <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `💬 New message on HabeshaCommunity`,
        html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>New Message Notification</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9f9f9;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border:1px solid #e0e0e0; border-radius:8px;">
      <tr>
        <td style="background:#002f6c; color:#ffffff; padding:20px; text-align:center; font-size:22px; font-weight:bold; border-top-left-radius:8px; border-top-right-radius:8px;">
          HabeshaCommunity
        </td>
      </tr>
      <tr>
        <td style="padding:20px; color:#333333; font-size:16px; line-height:1.5;">
          <p>👋 Hello,</p>
          <p>You've received a new message from <strong>${senderName}</strong> on HabeshaCommunity:</p>
          <blockquote style="border-left:4px solid #002f6c; padding-left:10px; margin:15px 0; color:#555;">
            ${messagePreview}
          </blockquote>
          <p>
            <a href="${replyUrl}" 
            style="display:inline-block; padding:12px 20px; background:#002f6c; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:bold;">
              Reply Now
            </a>
          </p>
          <p style="margin-top:20px; font-size:14px; color:#777;">
            This is an automated message. You can disable email notifications in your profile settings.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#f2f2f2; padding:15px; text-align:center; font-size:12px; color:#777; border-bottom-left-radius:8px; border-bottom-right-radius:8px;">
          © 2025 HabeshaCommunity — Building Connections, Growing Together
        </td>
      </tr>
    </table>
  </body>
</html>`,
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
