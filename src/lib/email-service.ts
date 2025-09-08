// Import the real email service
import {
  sendRealEmail,
  sendAdminNewUserNotification as sendAdminNewUserEmail,
  sendUserWelcomeEmail as sendUserWelcomeEmailService,
  sendUserAccountStatusEmail as sendUserAccountStatusEmailService,
  sendAdminRefundRequestNotification as sendAdminRefundRequestEmail,
  sendUserRefundResponseEmail as sendUserRefundResponseEmailService,
} from './real-email-service';

// Send email function
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> => {
  return sendRealEmail(to, subject, html);
};

// Specific email functions - using real email service
export const sendAdminNewUserNotification = async (userName: string, userEmail: string) => {
  return sendAdminNewUserEmail(userName, userEmail);
};

export const sendUserWelcomeEmail = async (userEmail: string, userName: string) => {
  return sendUserWelcomeEmailService(userEmail, userName);
};

export const sendUserAccountStatusEmail = async (
  userEmail: string,
  userName: string,
  status: 'approved' | 'disapproved',
  reason?: string
) => {
  return sendUserAccountStatusEmailService(userEmail, userName, status, reason);
};

export const sendAdminRefundRequestNotification = async (
  userName: string,
  userEmail: string,
  refundReason: string
) => {
  return sendAdminRefundRequestEmail(userName, userEmail, refundReason);
};

export const sendUserRefundResponseEmail = async (
  userEmail: string,
  userName: string,
  status: 'approved' | 'rejected',
  adminMessage?: string
) => {
  return sendUserRefundResponseEmailService(userEmail, userName, status, adminMessage);
};