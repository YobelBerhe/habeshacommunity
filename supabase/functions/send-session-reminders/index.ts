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
    
    const now = new Date();
    
    // 1-hour reminder window: 55-65 minutes
    const in55min = new Date(now.getTime() + 55 * 60000);
    const in65min = new Date(now.getTime() + 65 * 60000);
    
    // 5-minute reminder window: 4-6 minutes
    const in4min = new Date(now.getTime() + 4 * 60000);
    const in6min = new Date(now.getTime() + 6 * 60000);
    
    console.log('Checking for 1-hour reminders:', in55min, 'to', in65min);
    console.log('Checking for 5-minute reminders:', in4min, 'to', in6min);
    
    // Fetch 1-hour reminders not yet sent
    const { data: sessions1h, error: error1h } = await supabase
      .from('bookings')
      .select(`
        id,
        session_date,
        user_id,
        mentor_id,
        reminder_1h_sent,
        reminder_5m_sent,
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
      .eq('reminder_1h_sent', false)
      .gte('session_date', in55min.toISOString())
      .lte('session_date', in65min.toISOString());

    if (error1h) {
      console.error('Query error (1h):', error1h);
      throw error1h;
    }

    // Fetch 5-minute reminders not yet sent
    const { data: sessions5m, error: error5m } = await supabase
      .from('bookings')
      .select(`
        id,
        session_date,
        user_id,
        mentor_id,
        reminder_1h_sent,
        reminder_5m_sent,
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
      .eq('reminder_5m_sent', false)
      .gte('session_date', in4min.toISOString())
      .lte('session_date', in6min.toISOString());

    if (error5m) {
      console.error('Query error (5m):', error5m);
      throw error5m;
    }

    console.log(`Found ${sessions1h?.length || 0} sessions needing 1-hour reminder`);
    console.log(`Found ${sessions5m?.length || 0} sessions needing 5-minute reminder`);

    // Helper function to send notifications
    async function notifyForSession(session: any, isFiveMin: boolean) {
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
        
        const { data: menteeUser } = await supabase.auth.admin.getUserById(session.user_id);
        const { data: mentorUser } = await supabase.auth.admin.getUserById(mentor.user_id);

        const menteeEmail = menteeUser?.user?.email;
        const mentorEmail = mentorUser?.user?.email;

        const timeText = isFiveMin ? '5 minutes' : '1 hour';
        const title = `⏰ Session starts in ${timeText}`;
        const subject = `⏰ Reminder: Your session starts in ${timeText}`;

        console.log(`Processing ${timeText} reminder for session ${session.id}: mentee=${menteeEmail}, mentor=${mentorEmail}`);

        // Create in-app notifications
        const notifications = [
          {
            user_id: session.user_id,
            type: 'booking',
            title,
            message: `Your session with ${mentorName} is about to start. Please be ready!`,
            link: `/mentor/${session.mentor_id}`
          },
          {
            user_id: mentor.user_id,
            type: 'booking',
            title,
            message: `Your session with ${menteeName} is about to start. Please be ready!`,
            link: `/mentor/dashboard`
          }
        ];

        const { error: notifError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notifError) {
          console.error('Notification creation error:', notifError);
        } else {
          console.log(`Created in-app notifications for session ${session.id}`);
        }

        // Email template
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
          <p>This is a quick reminder that your mentoring session starts in <strong>${timeText}</strong> with <strong>${partnerName}</strong>.</p>
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
            ${isFiveMin ? 'Your session is starting very soon!' : 'Please be ready a few minutes early to ensure a smooth start.'}
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
                subject,
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
                subject,
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

        // Mark reminder as sent
        const flagField = isFiveMin ? 'reminder_5m_sent' : 'reminder_1h_sent';
        await supabase
          .from('bookings')
          .update({ [flagField]: true })
          .eq('id', session.id);

        console.log(`Marked ${flagField} for session ${session.id}`);
      }

    // Process 1-hour reminders
    for (const session of sessions1h || []) {
      await notifyForSession(session, false);
    }

    // Process 5-minute reminders
    for (const session of sessions5m || []) {
      await notifyForSession(session, true);
    }

    const totalProcessed = (sessions1h?.length || 0) + (sessions5m?.length || 0);

    return new Response(
      JSON.stringify({ 
        success: true, 
        reminders_1h: sessions1h?.length || 0,
        reminders_5m: sessions5m?.length || 0,
        total_processed: totalProcessed,
        message: `Processed ${totalProcessed} reminders (${sessions1h?.length || 0} × 1h, ${sessions5m?.length || 0} × 5min)`
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
