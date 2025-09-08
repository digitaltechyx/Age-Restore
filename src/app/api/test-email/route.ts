import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/real-email-service';

export async function POST(request: NextRequest) {
  try {
    let to, subject, message;
    
    try {
      const body = await request.json();
      to = body.to;
      subject = body.subject;
      message = body.message;
    } catch (jsonError) {
      // If no JSON body is sent, use default values
      to = 'digitaltechyx@gmail.com';
      subject = 'Test Email from AgeRestore';
      message = 'This is a test email to verify email functionality is working.';
    }

    // Send test email using real email service
    const result = await sendTestEmail(
      to || 'digitaltechyx@gmail.com',
      subject || 'Test Email from AgeRestore',
      message || 'This is a test email to verify email functionality is working.'
    );

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
