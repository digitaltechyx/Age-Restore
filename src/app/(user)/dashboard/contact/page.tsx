"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail } from "lucide-react";
import { config, getWhatsAppUrl } from "@/lib/contact-config";

export default function ContactPage() {
  const handleWhatsAppContact = () => {
    const whatsappUrl = getWhatsAppUrl();
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    const subject = "Age Restore Support Request";
    const body = "Hello,\n\nI need assistance with my Age Restore account.\n\nPlease provide the following information:\n- Your account email\n- Description of the issue\n- Any error messages you're seeing\n\nThank you!";
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${config.contact.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-lg text-gray-600">
          We're here to help! Get in touch with our support team.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    WhatsApp Support
                  </CardTitle>
                  <CardDescription>
                    Get instant help via WhatsApp - fastest response time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Click the button below to start a WhatsApp conversation with our support team.
                  </p>
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start WhatsApp Chat
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Email Support
                  </CardTitle>
                  <CardDescription>
                    Send us a detailed message and we'll respond within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    For detailed inquiries, refund requests, or account issues.
                  </p>
                  <Button 
                    onClick={handleEmailContact}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>

      </div>

      {/* FAQ Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  How do I request a refund?
                </h4>
                <p className="text-sm text-gray-600">
                  Go to your profile page and click "Request Refund". You'll be asked to provide a reason, and our team will review your request within 24-48 hours.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  How long does account approval take?
                </h4>
                <p className="text-sm text-gray-600">
                  New accounts are typically approved within 24 hours. You'll receive an email notification once your account status is updated.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Can I change my profile information?
                </h4>
                <p className="text-sm text-gray-600">
                  Yes! You can update your name, age, gender, and profile picture from your profile page at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
