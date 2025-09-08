import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Age Restore ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our photo journaling application. Please read this privacy policy carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect the following personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Name and email address (for account creation)</li>
                <li>Profile information (age, gender, profile picture)</li>
                <li>Account status and approval information</li>
                <li>Registration and approval timestamps</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Photo Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect and store:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Photos you upload for your 30-day journey</li>
                <li>Upload dates and metadata</li>
                <li>File names and storage references</li>
                <li>Gallery organization data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Usage Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Usage patterns and feature interactions</li>
                <li>Error logs and performance data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Providing and maintaining our service</li>
                <li>Processing your account registration and approval</li>
                <li>Storing and organizing your photo gallery</li>
                <li>Tracking your 30-day journey progress</li>
                <li>Sending important service notifications</li>
                <li>Improving our application and user experience</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 We Do Not Sell Your Data</h3>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties for marketing purposes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Limited Sharing</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
                <li>In case of business transfer or merger (with notice to users)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Storage and Security</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Storage</h3>
              <p className="text-gray-700 leading-relaxed">
                Your data is stored securely using enterprise-grade cloud services with advanced security and encryption protocols.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Security Measures</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and authorization</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and monitoring</li>
                <li>Secure backup and recovery procedures</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Data Retention</h3>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Access and Update</h3>
              <p className="text-gray-700 leading-relaxed">
                You can access and update your personal information through your account settings or by contacting us.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Data Portability</h3>
              <p className="text-gray-700 leading-relaxed">
                You can download your photos and data at any time through your account dashboard.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Account Deletion</h3>
              <p className="text-gray-700 leading-relaxed">
                You can request account deletion, which will permanently remove your personal information and uploaded content from our systems.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.4 Communication Preferences</h3>
              <p className="text-gray-700 leading-relaxed">
                You can opt out of non-essential communications while still receiving important service notifications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> digitaltechyx@gmail.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>WhatsApp:</strong> +1 (347) 661-3010
                </p>
                <p className="text-gray-700">
                  <strong>Response Time:</strong> We typically respond within 24-48 hours
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}