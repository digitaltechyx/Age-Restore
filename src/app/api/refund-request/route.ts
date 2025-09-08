import { NextRequest, NextResponse } from 'next/server';
import { sendAdminRefundRequestNotification } from '@/lib/email-utils';

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, userName, refundReason } = await request.json();

    if (!userId || !userEmail || !userName || !refundReason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔔 Processing refund request:', {
      userId,
      userEmail,
      userName,
      refundReason: refundReason.trim()
    });

    // Send email notification to admin
    try {
      const emailResult = await sendAdminRefundRequestNotification(
        userName,
        userEmail,
        refundReason.trim()
      );
      
      console.log('✅ Admin refund request notification sent:', emailResult);
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError);
      return NextResponse.json(
        { success: false, error: 'Failed to send email notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Refund request submitted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Refund request API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
