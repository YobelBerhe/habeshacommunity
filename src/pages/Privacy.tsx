import { Link } from "react-router-dom";
import { Shield, Mail, Lock, Eye, Database, UserCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-lg">HabeshaCommunity</span>
          </Link>
          <Link 
            to="/" 
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-blue-100 mt-2">Last updated: October 26, 2025</p>
            </div>
          </div>
          <p className="text-lg text-blue-50 max-w-2xl">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
          
          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">1. Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 ml-13">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <p>When you sign up or sign in using Google, Facebook, or email, we collect:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Your name and email address</li>
                  <li>Profile picture (if provided by OAuth provider)</li>
                  <li>City and location (if you choose to share)</li>
                  <li>Phone number (if you use phone authentication)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Usage Data</h3>
                <p>We automatically collect certain information when you use our platform:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and general location</li>
                  <li>Pages visited and features used</li>
                  <li>Time and date of access</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Cookies & Analytics</h3>
                <p>We use cookies and similar technologies to improve your experience and analyze platform usage.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 ml-13">
              <p>We use your information to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Provide Services:</strong> Enable account creation, authentication, and platform features</li>
                <li><strong>Communication:</strong> Send you important updates, notifications, and community messages</li>
                <li><strong>Personalization:</strong> Customize your experience based on your interests and activity</li>
                <li><strong>Matching:</strong> Connect you with mentors, potential matches, or community members</li>
                <li><strong>Improvements:</strong> Analyze usage patterns to enhance our platform</li>
                <li><strong>Safety:</strong> Detect and prevent fraud, abuse, or security issues</li>
                <li><strong>Legal Compliance:</strong> Meet legal obligations and enforce our terms</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">3. How We Protect Your Data</h2>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 ml-13">
              <p>We take data security seriously:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>All data is encrypted in transit (HTTPS/TLS)</li>
                <li>Passwords are securely hashed and never stored in plain text</li>
                <li>We use industry-standard security measures (Supabase infrastructure)</li>
                <li>Access to personal data is restricted to authorized personnel only</li>
                <li>Regular security audits and updates</li>
              </ul>
              <p className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <strong>Note:</strong> While we implement strong security measures, no system is 100% secure. We encourage you to use strong passwords and enable two-factor authentication when available.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold">4. Sharing Your Information</h2>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 ml-13">
              <p>We <strong>DO NOT</strong> sell your personal information to third parties.</p>
              <p>We may share information in these situations:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Service Providers:</strong> With trusted partners who help us operate (Supabase, Stripe, email services)</li>
                <li><strong>Public Profile:</strong> Information you choose to make public (name, bio, profile picture)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">5. Your Rights & Choices</h2>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 ml-13">
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
                <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Object:</strong> Object to certain data processing activities</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@habeshacommunity.com" className="text-blue-600 hover:underline font-semibold">privacy@habeshacommunity.com</a>
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Children's Privacy</h2>
            <div className="text-gray-700 dark:text-gray-300">
              <p>Our platform is not intended for children under 18. We do not knowingly collect information from minors. If you believe we have collected information from a child, please contact us immediately.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">7. Third-Party Services</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-3">
              <p>We use the following third-party services:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Google OAuth:</strong> For Google sign-in (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Privacy Policy</a>)</li>
                <li><strong>Facebook OAuth:</strong> For Facebook sign-in (<a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Privacy Policy</a>)</li>
                <li><strong>Supabase:</strong> Database and authentication (<a href="https://supabase.com/privacy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Privacy Policy</a>)</li>
                <li><strong>Stripe:</strong> Payment processing (<a href="https://stripe.com/privacy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Privacy Policy</a>)</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">8. International Data Transfers</h2>
            <div className="text-gray-700 dark:text-gray-300">
              <p>Your information may be transferred and stored on servers in different countries. We ensure appropriate safeguards are in place for international transfers.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
            <div className="text-gray-700 dark:text-gray-300">
              <p>We may update this Privacy Policy periodically. Significant changes will be communicated via email or platform notification. Continued use after changes constitutes acceptance.</p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">10. Contact Us</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have questions about this Privacy Policy or your data, please contact us:
                </p>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Email:</strong> <a href="mailto:privacy@habeshacommunity.com" className="text-blue-600 hover:underline">privacy@habeshacommunity.com</a></p>
                  <p><strong>Support:</strong> <a href="mailto:support@habeshacommunity.com" className="text-blue-600 hover:underline">support@habeshacommunity.com</a></p>
                  <p><strong>Website:</strong> <a href="https://habeshacommunity.com" className="text-blue-600 hover:underline">habeshacommunity.com</a></p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            © 2025 HabeshaCommunity. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link to="/privacy" className="text-blue-600 hover:underline font-medium">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-blue-600 hover:underline font-medium">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-blue-600 hover:underline font-medium">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
