# Email Integration Guide

## Current Implementation

The refund notification system is currently set up with:
- ✅ API endpoint (`/api/send-notification`) for handling notifications
- ✅ Firestore storage for tracking all notifications
- ✅ Admin notifications page to view and manage requests
- ✅ User profile refund button with loading states

## Production Email Setup

To enable actual email notifications, you need to integrate with an email service. Here are the recommended options:

### Option 1: Resend (Recommended)
```bash
npm install resend
```

Update `src/app/api/send-notification/route.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In the POST function, replace the console.log with:
await resend.emails.send({
  from: 'noreply@yourdomain.com',
  to: 'admin@yourdomain.com',
  subject: `New ${type} Request from ${userName}`,
  html: `
    <h2>New ${typeLabels[type]} Request</h2>
    <p><strong>User:</strong> ${userName} (${userEmail})</p>
    <p><strong>Message:</strong> ${message}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    ${Object.entries(additionalData).map(([key, value]) => 
      `<p><strong>${key}:</strong> ${value}</p>`
    ).join('')}
  `
});
```

### Option 2: Nodemailer with SMTP
```bash
npm install nodemailer
npm install @types/nodemailer
```

### Option 3: AWS SES
```bash
npm install @aws-sdk/client-ses
```

### Option 4: EmailJS (Client-side)
For a simpler setup without server-side email:
```bash
npm install @emailjs/browser
```

## Environment Variables

Add to your `.env.local`:
```bash
# Email Service
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
```

## Testing

1. **User Side**: Go to profile page and click "Request Refund"
2. **Admin Side**: Go to `/admin/notifications` to see the request
3. **Console**: Check server logs for notification details

## Features

- ✅ Refund requests are saved to Firestore
- ✅ Admin can view all notifications
- ✅ Admin can mark notifications as reviewed/resolved
- ✅ Real-time status updates
- ✅ User gets confirmation when request is sent
- ✅ Loading states and error handling

## Next Steps

1. Choose an email service provider
2. Set up API keys and domain verification
3. Update the API route with actual email sending
4. Test the complete flow
5. Deploy to production

The notification system is ready to use - just add your preferred email service! 🚀

