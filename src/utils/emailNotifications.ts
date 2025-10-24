// Email notification service
// In production, integrate with SendGrid, AWS SES, or Resend

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const emailTemplates = {
  // Mentor Verification
  mentorApproved: (mentorName: string): EmailTemplate => ({
    subject: '🎉 Your Mentor Application Has Been Approved!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations ${mentorName}!</h1>
            </div>
            <div class="content">
              <p>Great news! Your mentor verification application has been approved.</p>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Your profile is now live with a verified badge</li>
                <li>You can start accepting mentorship sessions</li>
                <li>Set your availability and session rates</li>
              </ul>

              <p>
                <a href="https://habeshacommunity.com/mentor/dashboard" class="button">
                  Go to Mentor Dashboard
                </a>
              </p>

              <p><strong>Tips for Success:</strong></p>
              <ul>
                <li>Keep your profile updated with recent achievements</li>
                <li>Respond to session requests within 24 hours</li>
                <li>Maintain a 4.5+ rating for featured placement</li>
              </ul>

              <p>Welcome to the Habesha Community mentor network!</p>
              
              <p>Best regards,<br>The Habesha Community Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Habesha Community. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Congratulations ${mentorName}! Your mentor application has been approved. Visit your dashboard to get started: https://habeshacommunity.com/mentor/dashboard`
  }),

  mentorRejected: (mentorName: string, reason: string): EmailTemplate => ({
    subject: 'Update on Your Mentor Application',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Update</h1>
            </div>
            <div class="content">
              <p>Dear ${mentorName},</p>
              
              <p>Thank you for your interest in becoming a mentor on Habesha Community.</p>
              
              <p>After careful review, we're unable to approve your application at this time:</p>
              <p style="background: #fee2e2; padding: 15px; border-left: 4px solid #ef4444; border-radius: 4px;">
                <strong>Reason:</strong> ${reason}
              </p>

              <p><strong>What You Can Do:</strong></p>
              <ul>
                <li>Review and update your documentation</li>
                <li>Ensure all verification materials are clear and valid</li>
                <li>Resubmit your application after 30 days</li>
              </ul>

              <p>
                <a href="https://habeshacommunity.com/mentor/onboarding" class="button">
                  Reapply in 30 Days
                </a>
              </p>

              <p>If you have questions, please contact our support team.</p>
              
              <p>Best regards,<br>The Habesha Community Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Habesha Community. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Dear ${mentorName}, your mentor application was not approved. Reason: ${reason}. You can reapply after 30 days.`
  }),

  // User Management
  userBanned: (userName: string, reason: string): EmailTemplate => ({
    subject: 'Important: Account Access Suspended',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Account Suspended</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              
              <p>Your Habesha Community account has been suspended due to a violation of our community guidelines.</p>
              
              <p style="background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; border-radius: 4px;">
                <strong>Reason:</strong> ${reason}
              </p>

              <p><strong>What This Means:</strong></p>
              <ul>
                <li>You cannot access your account</li>
                <li>All active sessions have been cancelled</li>
                <li>You will not receive refunds for violations</li>
              </ul>

              <p>If you believe this was a mistake, you can appeal within 14 days by contacting support@habeshacommunity.com</p>
              
              <p>Best regards,<br>The Habesha Community Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Habesha Community. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Your account has been suspended. Reason: ${reason}. Contact support if you wish to appeal.`
  }),

  userRoleChanged: (userName: string, newRole: string): EmailTemplate => ({
    subject: '🎉 Your Account Role Has Been Updated',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Role Assigned!</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              
              <p>Congratulations! You've been assigned a new role on Habesha Community.</p>
              
              <p style="background: #f3e8ff; padding: 15px; border-left: 4px solid #8b5cf6; border-radius: 4px;">
                <strong>New Role:</strong> ${newRole.toUpperCase()}
              </p>

              <p><strong>Your New Permissions:</strong></p>
              ${newRole === 'admin' ? `
                <ul>
                  <li>Review and approve mentor applications</li>
                  <li>Manage user accounts and content</li>
                  <li>Process payments and refunds</li>
                  <li>Access analytics and reports</li>
                </ul>
              ` : newRole === 'moderator' ? `
                <ul>
                  <li>Review flagged content</li>
                  <li>Moderate community discussions</li>
                  <li>View basic analytics</li>
                </ul>
              ` : ''}

              <p>
                <a href="https://habeshacommunity.com/admin" class="button">
                  Access Admin Dashboard
                </a>
              </p>
              
              <p>Welcome to the team!</p>
              
              <p>Best regards,<br>The Habesha Community Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Habesha Community. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Congratulations ${userName}! You've been assigned the ${newRole} role. Access your dashboard at https://habeshacommunity.com/admin`
  }),

  // Dispute Resolution
  disputeResolved: (userName: string, refundAmount: number, resolution: string): EmailTemplate => ({
    subject: '✅ Your Dispute Has Been Resolved',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Dispute Resolved</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              
              <p>Your dispute has been reviewed and resolved in your favor.</p>
              
              <p style="background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; border-radius: 4px;">
                <strong>Refund Amount:</strong> $${refundAmount}<br>
                <strong>Resolution:</strong> ${resolution}
              </p>

              <p><strong>What Happens Next:</strong></p>
              <ul>
                <li>Refund will be processed within 5-7 business days</li>
                <li>You'll receive funds to your original payment method</li>
                <li>This dispute is now closed</li>
              </ul>

              <p>Thank you for your patience during this process.</p>
              
              <p>Best regards,<br>The Habesha Community Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Habesha Community. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Your dispute has been resolved. Refund of $${refundAmount} will be processed within 5-7 business days.`
  })
};

// Email sending function (integrate with your email service)
export const sendEmail = async (
  to: string,
  template: EmailTemplate
): Promise<boolean> => {
  try {
    // In production, replace with actual email service
    console.log('Sending email to:', to);
    console.log('Subject:', template.subject);
    
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to,
    //   from: 'noreply@habeshacommunity.com',
    //   subject: template.subject,
    //   text: template.text,
    //   html: template.html,
    // });

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

// Notification helper functions
export const notifyMentorApproved = async (email: string, name: string) => {
  const template = emailTemplates.mentorApproved(name);
  return await sendEmail(email, template);
};

export const notifyMentorRejected = async (email: string, name: string, reason: string) => {
  const template = emailTemplates.mentorRejected(name, reason);
  return await sendEmail(email, template);
};

export const notifyUserBanned = async (email: string, name: string, reason: string) => {
  const template = emailTemplates.userBanned(name, reason);
  return await sendEmail(email, template);
};

export const notifyUserRoleChanged = async (email: string, name: string, newRole: string) => {
  const template = emailTemplates.userRoleChanged(name, newRole);
  return await sendEmail(email, template);
};

export const notifyDisputeResolved = async (email: string, name: string, amount: number, resolution: string) => {
  const template = emailTemplates.disputeResolved(name, amount, resolution);
  return await sendEmail(email, template);
};
