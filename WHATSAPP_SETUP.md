# WhatsApp Integration Setup

This document explains how to set up and configure WhatsApp integration for the Age Restore application.

## Quick Setup

To update your WhatsApp number, simply edit the `src/lib/contact-config.ts` file:

```typescript
export const config = {
  whatsapp: {
    // Replace this with your actual WhatsApp number (include country code, no + sign)
    // Example: "1234567890" for US number +1 (234) 567-890
    phoneNumber: "1234567890", // ← Change this to your WhatsApp number
  }
};
```

## Configuration Details

### WhatsApp Number Format
- **Include country code** (without the + sign)
- **No spaces or special characters**
- **Examples:**
  - US: `1234567890` (for +1 234 567 890)
  - UK: `447123456789` (for +44 712 345 6789)
  - India: `919876543210` (for +91 987 654 3210)

### What Gets Updated
When you change the phone number in `config.ts`, it automatically updates:

1. **Contact Page** - WhatsApp buttons and links
2. **Email Templates** - WhatsApp links in all email notifications
3. **User Sidebar** - Contact page link
4. **Admin Sidebar** - Contact page link

### Email Templates with WhatsApp
The following email templates include WhatsApp links:

1. **Refund Request Notifications** (Admin)
2. **Refund Response Emails** (User)
3. **Account Status Emails** (User)

### Testing WhatsApp Integration

1. **Test Contact Page:**
   - Go to `/contact`
   - Click "Start WhatsApp Chat"
   - Verify it opens WhatsApp with correct number

2. **Test Email Links:**
   - Submit a refund request
   - Check the admin email for WhatsApp link
   - Approve/reject the refund
   - Check the user email for WhatsApp link

### Customizing Messages

You can customize the default WhatsApp messages in `contact-config.ts`:

```typescript
messages: {
  general: "Hello! I need help with my Age Restore account.",
  refund: "Hello! I need help with my Age Restore refund request.",
  admin: "Hello! I need to discuss a refund request for Age Restore.",
}
```

### Contact Information

Update other contact details in the same config file:

```typescript
contact: {
  email: "digitaltechyx@gmail.com", // Your support email
  phone: "+1 (555) 123-4567",       // Your phone number
  address: {
    street: "123 Health Street",
    city: "Wellness City",
    state: "WC",
    zip: "12345",
    country: "United States"
  }
}
```

## Features

### Contact Page (`/contact`)
- **WhatsApp Integration** - Direct chat with pre-filled messages
- **Email Support** - Pre-filled email templates
- **Contact Form** - Custom message submission
- **Business Information** - Hours, address, response times
- **FAQ Section** - Common questions and answers

### Email Integration
- **WhatsApp Links** in all email templates
- **Contextual Messages** - Different messages for different scenarios
- **Professional Styling** - Beautiful HTML email templates

### Navigation Integration
- **User Sidebar** - Contact link in user dashboard
- **Admin Sidebar** - Contact link in admin panel
- **Consistent Experience** - Same contact options everywhere

## Troubleshooting

### WhatsApp Not Opening
- Check if the phone number format is correct
- Ensure no spaces or special characters in the number
- Test the link in a browser first

### Email Links Not Working
- Verify the config is imported correctly
- Check if the phone number is updated in all templates
- Clear browser cache and test again

### Contact Page 404 Error
- Ensure the contact page is created at `src/app/contact/page.tsx`
- Check if the file is properly exported
- Restart the development server

## Support

If you need help with WhatsApp integration:
1. Check this documentation
2. Test the contact page functionality
3. Verify the configuration file
4. Contact the development team

---

**Note:** Make sure to test the WhatsApp integration thoroughly before deploying to production!

This document explains how to set up and configure WhatsApp integration for the Age Restore application.

## Quick Setup

To update your WhatsApp number, simply edit the `src/lib/contact-config.ts` file:

```typescript
export const config = {
  whatsapp: {
    // Replace this with your actual WhatsApp number (include country code, no + sign)
    // Example: "1234567890" for US number +1 (234) 567-890
    phoneNumber: "1234567890", // ← Change this to your WhatsApp number
  }
};
```

## Configuration Details

### WhatsApp Number Format
- **Include country code** (without the + sign)
- **No spaces or special characters**
- **Examples:**
  - US: `1234567890` (for +1 234 567 890)
  - UK: `447123456789` (for +44 712 345 6789)
  - India: `919876543210` (for +91 987 654 3210)

### What Gets Updated
When you change the phone number in `config.ts`, it automatically updates:

1. **Contact Page** - WhatsApp buttons and links
2. **Email Templates** - WhatsApp links in all email notifications
3. **User Sidebar** - Contact page link
4. **Admin Sidebar** - Contact page link

### Email Templates with WhatsApp
The following email templates include WhatsApp links:

1. **Refund Request Notifications** (Admin)
2. **Refund Response Emails** (User)
3. **Account Status Emails** (User)

### Testing WhatsApp Integration

1. **Test Contact Page:**
   - Go to `/contact`
   - Click "Start WhatsApp Chat"
   - Verify it opens WhatsApp with correct number

2. **Test Email Links:**
   - Submit a refund request
   - Check the admin email for WhatsApp link
   - Approve/reject the refund
   - Check the user email for WhatsApp link

### Customizing Messages

You can customize the default WhatsApp messages in `contact-config.ts`:

```typescript
messages: {
  general: "Hello! I need help with my Age Restore account.",
  refund: "Hello! I need help with my Age Restore refund request.",
  admin: "Hello! I need to discuss a refund request for Age Restore.",
}
```

### Contact Information

Update other contact details in the same config file:

```typescript
contact: {
  email: "digitaltechyx@gmail.com", // Your support email
  phone: "+1 (555) 123-4567",       // Your phone number
  address: {
    street: "123 Health Street",
    city: "Wellness City",
    state: "WC",
    zip: "12345",
    country: "United States"
  }
}
```

## Features

### Contact Page (`/contact`)
- **WhatsApp Integration** - Direct chat with pre-filled messages
- **Email Support** - Pre-filled email templates
- **Contact Form** - Custom message submission
- **Business Information** - Hours, address, response times
- **FAQ Section** - Common questions and answers

### Email Integration
- **WhatsApp Links** in all email templates
- **Contextual Messages** - Different messages for different scenarios
- **Professional Styling** - Beautiful HTML email templates

### Navigation Integration
- **User Sidebar** - Contact link in user dashboard
- **Admin Sidebar** - Contact link in admin panel
- **Consistent Experience** - Same contact options everywhere

## Troubleshooting

### WhatsApp Not Opening
- Check if the phone number format is correct
- Ensure no spaces or special characters in the number
- Test the link in a browser first

### Email Links Not Working
- Verify the config is imported correctly
- Check if the phone number is updated in all templates
- Clear browser cache and test again

### Contact Page 404 Error
- Ensure the contact page is created at `src/app/contact/page.tsx`
- Check if the file is properly exported
- Restart the development server

## Support

If you need help with WhatsApp integration:
1. Check this documentation
2. Test the contact page functionality
3. Verify the configuration file
4. Contact the development team

---

**Note:** Make sure to test the WhatsApp integration thoroughly before deploying to production!
