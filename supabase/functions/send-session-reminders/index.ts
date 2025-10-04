import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Query bookings starting in 55-65 minutes
    const now = new Date();
    const hourFromNow = new Date(now.getTime() + 55 * 60000); // 55 minutes
    const hourFromNowPlus = new Date(now.getTime() + 65 * 60000); // 65 minutes
    
    console.log('Checking for sessions between:', hourFromNow, 'and', hourFromNowPlus);
    
    const { data: upcomingSessions, error: queryError } = await supabase
      .from('bookings')
      .select(`
        id,
        session_date,
        user_id,
        mentor_id,
        mentors (
          name,
          user_id,
          display_name
        ),
        profiles!bookings_user_id_fkey (
          display_name
        )
      `)
      .eq('status', 'confirmed')
      .gte('session_date', hourFromNow.toISOString())
      .lte('session_date', hourFromNowPlus.toISOString());

    if (queryError) {
      console.error('Query error:', queryError);
      throw queryError;
    }

    console.log(`Found ${upcomingSessions?.length || 0} upcoming sessions`);

    // Process each session
    for (const session of upcomingSessions || []) {
      const mentor = Array.isArray(session.mentors) ? session.mentors[0] : session.mentors;
      const profile = Array.isArray(session.profiles) ? session.profiles[0] : session.profiles;
      
      const mentorName = mentor?.display_name || mentor?.name || 'Your mentor';
      const menteeName = profile?.display_name || 'Your mentee';
      const sessionTime = new Date(session.session_date).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      
      // Get emails for both users
      const { data: menteeUser } = await supabase.auth.admin.getUserById(session.user_id);
      const { data: mentorUser } = await supabase.auth.admin.getUserById(mentor.user_id);

      const menteeEmail = menteeUser?.user?.email;
      const mentorEmail = mentorUser?.user?.email;

      console.log(`Processing session ${session.id}: mentee=${menteeEmail}, mentor=${mentorEmail}`);

      // Create in-app notifications
      const notifications = [
        {
          user_id: session.user_id,
          type: 'booking',
          title: '⏰ Session starts in 1 hour',
          message: `Your session with ${mentorName} starts soon. Please be ready!`,
          link: `/mentor/${session.mentor_id}`
        },
        {
          user_id: mentor.user_id,
          type: 'booking',
          title: '⏰ Session starts in 1 hour',
          message: `Your session with ${menteeName} starts soon. Please be ready!`,
          link: `/mentor/dashboard`
        }
      ];

      const { error: notifError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notifError) {
        console.error('Notification creation error:', notifError);
      } else {
        console.log('Created in-app notifications for session', session.id);
      }

      // Send emails
      const emailTemplate = (recipientName: string, partnerName: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Session Reminder</title>
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
          <p>👋 Hello ${recipientName},</p>
          <p>This is a quick reminder that your mentoring session starts in <strong>1 hour</strong> with <strong>${partnerName}</strong>.</p>
          <table cellpadding="10" cellspacing="0" width="100%" style="margin:15px 0; border:1px solid #ddd; border-radius:6px;">
            <tr>
              <td><strong>Session Time:</strong></td>
              <td>${sessionTime}</td>
            </tr>
          </table>
          <p>
            👉 <a href="https://habeshacommunity.com/mentor/${session.mentor_id}" 
            style="display:inline-block; padding:12px 20px; background:#002f6c; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:bold;">
              View Session Details
            </a>
          </p>
          <p style="margin-top:20px; font-size:14px; color:#777;">
            Please be ready a few minutes early to ensure a smooth start. 
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
</html>`;

      // Send to mentee
      if (menteeEmail) {
        try {
          const menteeResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: "HabeshaCommunity <no-reply@habeshacommunity.com>",
              to: [menteeEmail],
              subject: "⏰ Reminder: Your session starts in 1 hour",
              html: emailTemplate(menteeName, mentorName),
            }),
          });

          if (!menteeResponse.ok) {
            console.error('Failed to send email to mentee:', await menteeResponse.text());
          } else {
            console.log('Email sent to mentee:', menteeEmail);
          }
        } catch (emailError) {
          console.error('Error sending email to mentee:', emailError);
        }
      }

      // Send to mentor
      if (mentorEmail) {
        try {
          const mentorResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: "HabeshaCommunity <no-reply@habeshacommunity.com>",
              to: [mentorEmail],
              subject: "⏰ Reminder: Your session starts in 1 hour",
              html: emailTemplate(mentorName, menteeName),
            }),
          });

          if (!mentorResponse.ok) {
            console.error('Failed to send email to mentor:', await mentorResponse.text());
          } else {
            console.log('Email sent to mentor:', mentorEmail);
          }
        } catch (emailError) {
          console.error('Error sending email to mentor:', emailError);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: upcomingSessions?.length || 0,
        message: `Processed ${upcomingSessions?.length || 0} session reminders`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-session-reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
