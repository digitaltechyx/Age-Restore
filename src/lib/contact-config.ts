// Configuration file for the Age Restore application

export const config = {
  // WhatsApp Configuration
  whatsapp: {
    // Replace this with your actual WhatsApp number (include country code, no + sign)
    // Example: "1234567890" for US number +1 (234) 567-890
    phoneNumber: "13476613010",
    
    // Default messages for different scenarios
    messages: {
      general: "Hello! I need help with my Age Restore account.",
      refund: "Hello! I need help with my Age Restore refund request.",
      admin: "Hello! I need to discuss a refund request for Age Restore.",
    }
  },
  
  // Contact Information
  contact: {
    email: "digitaltechyx@gmail.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Health Street",
      city: "Wellness City",
      state: "WC",
      zip: "12345",
      country: "United States"
    }
  },
  
  // Business Hours
  businessHours: {
    weekdays: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed"
  },
  
  // Response Times
  responseTimes: {
    whatsapp: "Within 1 hour",
    email: "Within 24 hours",
    phone: "Immediate"
  }
};

// Helper function to generate WhatsApp URLs
export const getWhatsAppUrl = (message: string = config.whatsapp.messages.general) => {
  return `https://wa.me/${config.whatsapp.phoneNumber}?text=${encodeURIComponent(message)}`;
};
