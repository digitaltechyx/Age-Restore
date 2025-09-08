import { NextRequest, NextResponse } from 'next/server';
import {
  sendAdminNewUserNotification,
  sendUserWelcomeEmail,
  sendUserAccountStatusEmail,
  sendAdminRefundRequestNotification,
  sendUserRefundResponseEmail,
} from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    console.log('Email request received:', { type, data });

    let result;

    switch (type) {
      case 'admin_new_user':
        result = await sendAdminNewUserNotification(
          data.userName,
          data.userEmail
        );
        break;

      case 'user_welcome':
        result = await sendUserWelcomeEmail(
          data.email,
          data.userName
        );
        break;

      case 'user_account_status':
        result = await sendUserAccountStatusEmail(
          data.userEmail,
          data.userName,
          data.status
        );
        break;

      case 'admin_refund_request':
        result = await sendAdminRefundRequestNotification(
          data.userName,
          data.userEmail,
          data.refundReason
        );
        break;

      case 'user_refund_response':
        result = await sendUserRefundResponseEmail(
          data.email,
          data.userName,
          data.status,
          data.adminMessage
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Unknown email type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully'
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
