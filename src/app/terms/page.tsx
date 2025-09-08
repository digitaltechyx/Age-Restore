import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background shadow-sm border-b">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Age Restore ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Age Restore is a quality assurance (QA) product designed to help users achieve visible results within 30 days through a structured photo journaling and tracking system. Our service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>30-day structured program with daily photo documentation</li>
                <li>Progress tracking and milestone monitoring</li>
                <li>Quality assurance guidelines and best practices</li>
                <li>Results verification and outcome assessment</li>
                <li>Personalized feedback and improvement suggestions</li>
                <li>Community support and expert guidance</li>
              </ul>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-green-800 font-medium">
                  <strong>Quality Guarantee:</strong> We are committed to helping you achieve measurable results within 30 days. If you don't see the expected improvements, you are entitled to a full refund.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use our service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Content and Photo Uploads</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By uploading photos to our service, you agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You own the rights to all uploaded content</li>
                <li>Your content does not violate any laws or third-party rights</li>
                <li>You will not upload inappropriate, offensive, or harmful content</li>
                <li>We may remove content that violates these terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Quality Assurance & Results Guarantee</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">30-Day Results Guarantee</h3>
                <p className="text-green-800 leading-relaxed">
                  We guarantee that you will see measurable results within 30 days of following our QA program. If you don't achieve the expected improvements, you are entitled to a full refund.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">5.1 Refund Request Process</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To request a refund based on lack of results:
                </p>
                <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                  <li>Complete the full 30-day program as instructed</li>
                  <li>Document your progress with daily photos</li>
                  <li>Log into your account and navigate to your profile</li>
                  <li>Click on "Request Refund" button</li>
                  <li>Select "No Results After 30 Days" as the reason</li>
                  <li>Provide evidence of program completion and lack of results</li>
                  <li>Submit your request for admin review</li>
                  <li>Wait for admin approval (typically within 3-5 business days)</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-900">5.3 Results Verification</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our admin team will review your refund request by:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Checking your daily photo uploads and progress</li>
                  <li>Verifying you followed the program guidelines</li>
                  <li>Assessing visible improvements in your photos</li>
                  <li>Reviewing your completion rate and engagement</li>
                  <li>Evaluating any technical issues that may have affected results</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">5.4 Refund Timeline</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Refund requests are reviewed within 3-5 business days</li>
                  <li>Approved refunds are processed within 5-10 business days</li>
                  <li>Refunds are issued to the original payment method</li>
                  <li>Processing time may vary depending on your payment provider</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">5.5 Non-Refundable Circumstances</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Refunds requested before completing the 30-day program</li>
                  <li>Refunds for not following program instructions</li>
                  <li>Refunds for account termination due to terms violation</li>
                  <li>Refunds for external factors beyond our control (e.g., personal circumstances)</li>
                  <li>Refunds requested more than 7 days after program completion</li>
                </ul>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Note</h4>
                  <p className="text-yellow-800 text-sm">
                    To be eligible for a results-based refund, you must complete the full 30-day program as instructed. 
                    Partial completion or non-compliance with guidelines may affect refund eligibility.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information. By using our service, you consent to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Service Availability</h2>
              <p className="text-gray-700 leading-relaxed">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. We may temporarily suspend the service for maintenance, updates, or technical issues. We are not liable for any downtime or service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. Your continued use of the service after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> digitaltechyx@gmail.com<br />
                  <strong>WhatsApp:</strong> +1 (347) 661-3010
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
