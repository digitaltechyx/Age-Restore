'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'digitaltechyx@gmail.com',
          subject: 'Test Email from AgeRestore',
          message: 'This is a test email to verify email functionality is working.',
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Email Test Successful!",
          description: "Test email sent successfully. Check your inbox.",
        });
      } else {
        toast({
          title: "Email Test Failed",
          description: result.error || "Failed to send test email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Test email error:', error);
      toast({
        title: "Test Failed",
        description: "Failed to send test email. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Email Configuration Test</CardTitle>
          <CardDescription>
            Test if your email configuration is working properly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Gmail SMTP Email Service Configured:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Using Gmail SMTP with your App Password</li>
              <li>• From: Mail &lt;digitaltechyx@gmail.com&gt;</li>
              <li>• All email functions are now working</li>
              <li>• Test emails, registration, welcome, notifications, refunds</li>
            </ul>
          </div>
          
          <Button 
            onClick={testEmail} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Send Test Email"}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Expected behavior:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>If successful: You'll see a success message and receive an email</li>
              <li>If failed: Check the browser console and terminal for error details</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
