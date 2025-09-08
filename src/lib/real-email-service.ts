// Real email service using Gmail SMTP via Resend API
// Gmail credentials
const GMAIL_USER = 'digitaltechyx@gmail.com';
const GMAIL_APP_PASSWORD = 'vehr eyud jlnu xdus';

// Resend API configuration
const RESEND_API_KEY = 're_SFzxGX8p_483rFRWNoUPVffkBchcFK9Hh';

// Real email sending using Resend API (which works with Gmail)
export const sendRealEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log('📧 SENDING REAL EMAIL VIA RESEND (Gmail SMTP):');
    console.log('From: Mail <digitaltechyx@gmail.com>');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('---');

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Mail <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Resend error:', errorData);
      console.log('❌ Failed to send email to', to);
      return { success: false, error: errorData.error || 'Failed to send email' };
    }

    const result = await response.json();

    console.log('✅ REAL EMAIL SENT SUCCESSFULLY!');
    console.log('Email ID:', result.id);
    console.log('---');

    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Error sending real email:', error);
    return { success: false, error: 'Failed to send email' };
  }
};

// Email templates
export const emailTemplates = {
  adminNewUser: (userName: string, userEmail: string, signupDate: string) => ({
    subject: 'New User Registration - Mail',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New User Registered!</h2>
        <p>A new user has registered on Mail.</p>
        <ul>
          <li><strong>Name:</strong> ${userName}</li>
          <li><strong>Email:</strong> ${userEmail}</li>
          <li><strong>Signup Date:</strong> ${signupDate}</li>
        </ul>
        <p>Please review their account in the admin dashboard.</p>
        <p>Thank you,</p>
        <p>Mail Team</p>
      </div>
    `,
  }),
  userWelcome: (userName: string) => ({
    subject: 'Welcome to Mail!',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${userName},</h2>
        <p>Welcome to Mail! We're excited to have you on board.</p>
        <p>Start your journey to a healthier, more vibrant you by uploading your daily photos.</p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,</p>
        <p>The Mail Team</p>
      </div>
    `,
  }),
  userAccountStatus: (userName: string, status: 'approved' | 'disapproved', reason?: string) => ({
    subject: `Your Mail Account Has Been ${status === 'approved' ? 'Approved' : 'Disapproved'}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${userName},</h2>
        <p>Your Mail account has been <strong>${status}</strong>.</p>
        ${status === 'disapproved' && reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>You can now ${status === 'approved' ? 'log in and start using the application.' : 'contact support for more information.'}</p>
        <p>Thank you,</p>
        <p>The Mail Team</p>
      </div>
    `,
  }),
  adminRefundRequest: (userName: string, userEmail: string, refundReason: string, requestDate: string) => ({
    subject: 'New Refund Request - Mail',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Refund Request Received!</h2>
        <p>A user has submitted a refund request on Mail.</p>
        <ul>
          <li><strong>User Name:</strong> ${userName}</li>
          <li><strong>User Email:</strong> ${userEmail}</li>
          <li><strong>Reason:</strong> ${refundReason}</li>
          <li><strong>Request Date:</strong> ${requestDate}</li>
        </ul>
        <p>Please review this request in the admin dashboard and take appropriate action.</p>
        <p>Thank you,</p>
        <p>Mail Team</p>
      </div>
    `,
  }),
  userRefundResponse: (userName: string, status: 'approved' | 'rejected', adminMessage?: string) => ({
    subject: `Your Mail Refund Request Has Been ${status === 'approved' ? 'Approved' : 'Rejected'}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${userName},</h2>
        <p>Your refund request for Mail has been <strong>${status}</strong>.</p>
        ${adminMessage ? `<p><strong>Admin Message:</strong> ${adminMessage}</p>` : ''}
        <p>If you have any further questions, please contact support.</p>
        <p>Thank you,</p>
        <p>The Mail Team</p>
      </div>
    `,
  }),
  testEmail: (message: string, sentAt: string) => ({
    subject: 'Test Email from Mail',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Test Email from Mail</h2>
        <p>This is a test email to verify that your email configuration is working properly.</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Sent at:</strong> ${sentAt}</p>
        <p>If you received this email, your email configuration is working correctly!</p>
        <p>Best regards,<br>Mail Team</p>
      </div>
    `,
  }),
};

// Specific email functions, using templates and sendRealEmail
export const sendAdminNewUserNotification = async (userName: string, userEmail: string) => {
  const template = emailTemplates.adminNewUser(userName, userEmail, new Date().toLocaleString());
  return sendRealEmail(GMAIL_USER, template.subject, template.html); // Admin email hardcoded to GMAIL_USER
};

export const sendUserWelcomeEmail = async (userEmail: string, userName: string) => {
  const template = emailTemplates.userWelcome(userName);
  return sendRealEmail(userEmail, template.subject, template.html);
};

export const sendUserAccountStatusEmail = async (
  userEmail: string,
  userName: string,
  status: 'approved' | 'disapproved',
  reason?: string
) => {
  const template = emailTemplates.userAccountStatus(userName, status, reason);
  return sendRealEmail(userEmail, template.subject, template.html);
};

export const sendAdminRefundRequestNotification = async (
  userName: string,
  userEmail: string,
  refundReason: string
) => {
  console.log('🔔 SENDING ADMIN REFUND REQUEST NOTIFICATION:');
  console.log('User:', userName);
  console.log('Email:', userEmail);
  console.log('Reason:', refundReason);
  
  const template = emailTemplates.adminRefundRequest(userName, userEmail, refundReason, new Date().toLocaleString());
  console.log('Template subject:', template.subject);
  
  const result = await sendRealEmail(GMAIL_USER, template.subject, template.html);
  console.log('Email result:', result);
  
  return result;
};

export const sendUserRefundResponseEmail = async (
  userEmail: string,
  userName: string,
  status: 'approved' | 'rejected',
  adminMessage?: string
) => {
  const template = emailTemplates.userRefundResponse(userName, status, adminMessage);
  return sendRealEmail(userEmail, template.subject, template.html);
};

export const sendTestEmail = async (to: string, subject: string, message: string) => {
  const template = emailTemplates.testEmail(message, new Date().toLocaleString());
  return sendRealEmail(to, subject, template.html);
};

// Export sendEmail as an alias for sendRealEmail
export const sendEmail = sendRealEmail;