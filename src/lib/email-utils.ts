// Utility functions for sending emails
import {
  sendAdminNewUserNotification as sendAdminNewUserEmail,
  sendUserWelcomeEmail as sendUserWelcomeEmailService,
  sendUserAccountStatusEmail as sendUserAccountStatusEmailService,
  sendAdminRefundRequestNotification as sendAdminRefundRequestEmail,
  sendUserRefundResponseEmail as sendUserRefundResponseEmailService,
} from './email-service';

export const sendAdminNewUserNotification = async (userName: string, userEmail: string) => {
  try {
    const result = await sendAdminNewUserEmail(userName, userEmail);
    return result;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const sendUserWelcomeEmail = async (userEmail: string, userName: string) => {
  try {
    const result = await sendUserWelcomeEmailService(userEmail, userName);
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
};

export const sendUserAccountStatusEmail = async (
  userEmail: string, 
  userName: string, 
  status: 'approved' | 'disapproved', 
  reason?: string
) => {
  try {
    console.log('📧 Attempting to send account status email:', {
      userEmail,
      userName,
      status,
      reason
    });

    const result = await sendUserAccountStatusEmailService(userEmail, userName, status);
    console.log('📧 Email service response:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending account status email:', error);
    return { success: false, error };
  }
};

export const sendAdminRefundRequestNotification = async (
  userName: string, 
  userEmail: string, 
  refundReason: string
) => {
  try {
    console.log('📧 Attempting to send admin refund request notification:', {
      userName,
      userEmail,
      refundReason
    });

    const result = await sendAdminRefundRequestEmail(userName, userEmail, refundReason);
    console.log('📧 Email service response:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending admin refund request notification:', error);
    return { success: false, error };
  }
};

export const sendUserRefundResponseEmail = async (
  userEmail: string, 
  userName: string, 
  status: 'approved' | 'rejected', 
  adminMessage?: string
) => {
  try {
    console.log('📧 Attempting to send user refund response email:', {
      userEmail,
      userName,
      status,
      adminMessage
    });

    const result = await sendUserRefundResponseEmailService(userEmail, userName, status, adminMessage);
    console.log('📧 Email service response:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending user refund response email:', error);
    return { success: false, error };
  }
};