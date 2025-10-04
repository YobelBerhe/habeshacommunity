import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  conversationId: string;
  senderId: string;
  messageContent: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, senderId, messageContent }: NotificationRequest = await req.json();

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get conversation participants
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('participant1_id, participant2_id')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      console.error('Error fetching conversation:', convError);
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine recipient
    const recipientId = senderId === conversation.participant1_id 
      ? conversation.participant2_id 
      : conversation.participant1_id;

    // Get recipient's email notification preference
    const { data: recipientProfile, error: profileError } = await supabase
      .from('profiles')
      .select('email_notifications_enabled, display_name')
      .eq('id', recipientId)
      .single();

    if (profileError || !recipientProfile) {
      console.error('Error fetching recipient profile:', profileError);
      return new Response(JSON.stringify({ error: 'Recipient not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if recipient wants email notifications
    if (!recipientProfile.email_notifications_enabled) {
      console.log('Recipient has email notifications disabled');
      return new Response(JSON.stringify({ message: 'Email notifications disabled' }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if recipient has unread messages (is offline)
    const { count, error: unreadError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)
      .eq('sender_id', senderId)
      .eq('read', false);

    if (unreadError) {
      console.error('Error checking unread messages:', unreadError);
    }

    // Only send email if there are unread messages (recipient is offline)
    if (!count || count === 0) {
      console.log('No unread messages, recipient is likely online');
      return new Response(JSON.stringify({ message: 'Recipient is online' }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get recipient's email from auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(recipientId);

    if (userError || !userData.user?.email) {
      console.error('Error fetching user email:', userError);
      return new Response(JSON.stringify({ error: 'User email not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get sender's name
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', senderId)
      .single();

    const senderName = senderProfile?.display_name || 'A user';
    const messagePreview = messageContent.length > 100 
      ? messageContent.substring(0, 100) + '...' 
      : messageContent;

    // Send email via Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Mentor Platform <onboarding@resend.dev>",
        to: [userData.user.email],
        subject: `💬 New message from ${senderName}`,
        html: `
          <h2>You have a new message</h2>
          <p><strong>${senderName}</strong> sent you a message:</p>
          <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #333; margin: 20px 0;">
            ${messagePreview}
          </blockquote>
          <p>
            <a href="${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/inbox" 
               style="background: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reply to Message
            </a>
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            You can disable email notifications in your profile settings.
          </p>
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
