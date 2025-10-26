import { Link } from "react-router-dom";
import { FileText, Mail, AlertTriangle, Shield, Users, Gavel } from "lucide-react";

export default function Terms() {
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Terms of Service</h1>
              <p className="text-purple-100 mt-2">Last updated: October 26, 2025</p>
            </div>
          </div>
          <p className="text-lg text-purple-50 max-w-2xl">
            Please read these terms carefully before using HabeshaCommunity.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
          
          {/* Introduction */}
          <section className="mb-10">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Welcome to <strong>HabeshaCommunity</strong>! By accessing or using our platform, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use our services.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
            </div>
            <div className="text-gray-700 dark:text-gray-300 ml-13 space-y-3">
              <p>By creating an account or using HabeshaCommunity, you confirm that:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>You are at least 18 years old</li>
                <li>You have the legal capacity to enter into binding agreements</li>
                <li>You agree to comply with all applicable laws and regulations</li>
                <li>All information you provide is accurate and up-to-date</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold">2. Use of the Platform</h2>
            </div>
            <div className="text-gray-700 dark:text-gray-300 ml-13 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Permitted Use</h3>
                <p>You may use HabeshaCommunity for:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Connecting with other Habesha community members</li>
                  <li>Finding mentors or becoming a mentor</li>
                  <li>Using the marketplace to buy, sell, or rent items</li>
                  <li>Participating in forums and community discussions</li>
                  <li>Accessing spiritual resources and books</li>
                  <li>Tracking health and wellness activities</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Prohibited Conduct</h3>
                <p>You agree NOT to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Post illegal, harmful, or offensive content</li>
                  <li>Harass, bully, or threaten other users</li>
                  <li>Impersonate others or create fake accounts</li>
                  <li>Spam, scam, or engage in fraudulent activities</li>
                  <li>Violate intellectual property rights</li>
                  <li>Attempt to hack, disrupt, or compromise platform security</li>
                  <li>Scrape or collect user data without permission</li>
                  <li>Use the platform for commercial purposes without authorization</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Gavel className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">3. Account Responsibility</h2>
            </div>
            <div className="text-gray-700 dark:text-gray-300 ml-13 space-y-3">
              <p>You are responsible for:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Maintaining the confidentiality of your login credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of unauthorized access</li>
                <li>Keeping your profile information accurate and current</li>
              </ul>
              <p className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <strong>Important:</strong> HabeshaCommunity is not liable for losses resulting from unauthorized use of your account.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. User Content</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-3">
              <p>When you post content (messages, listings, forum posts, reviews, etc.):</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>You retain ownership of your content</li>
                <li>You grant us a license to use, display, and distribute your content on the platform</li>
                <li>You represent that you have the right to post the content</li>
                <li>We may remove content that violates these Terms</li>
                <li>We are not responsible for user-generated content</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-3">
              <p>All content on HabeshaCommunity (logos, designs, text, code) is owned by HabeshaCommunity or licensed to us. You may not:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our trademarks or branding</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Payments & Transactions</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-3">
              <p>When using paid features (mentor sessions, marketplace purchases):</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>All payments are processed securely through Stripe</li>
                <li>Prices are displayed clearly before purchase</li>
                <li>We may charge a service fee or commission</li>
                <li>Refunds are subject to our Refund Policy</li>
                <li>You are responsible for applicable taxes</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold">7. Limitation of Liability</h2>
            </div>
            <div className="text-gray-700 dark:text-gray-300 ml-13 space-y-3">
              <p>To the fullest extent permitted by law:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>HabeshaCommunity is provided "as is" without warranties</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>We are not responsible for third-party content or services</li>
                <li>Our total liability is limited to the amount you paid in the last 12 months</li>
              </ul>
              <p className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <strong>Disclaimer:</strong> Mentorship, matchmaking, and marketplace transactions are between users. We facilitate connections but are not party to agreements between users.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-3">
              <p>We may suspend or terminate your account if:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>You violate these Terms</li>
                <li>You engage in fraudulent or illegal activity</li>
                <li>Your account poses a security risk</li>
                <li>You request account deletion</li>
              </ul>
              <p className="mt-4">Upon termination, your right to use the platform ceases immediately. Some provisions of these Terms survive termination.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">9. Dispute Resolution</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-3">
              <p>If you have a dispute:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Contact us first to resolve informally</li>
                <li>Disputes will be governed by the laws of [Your Jurisdiction]</li>
                <li>You agree to binding arbitration for unresolved disputes</li>
                <li>Class action lawsuits are waived</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
            <div className="text-gray-700 dark:text-gray-300">
              <p>We may update these Terms periodically. Significant changes will be communicated via email or platform notification. Continued use after changes constitutes acceptance of the new Terms.</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">11. General Provisions</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-2">
              <p><strong>Severability:</strong> If any provision is unenforceable, the rest remains in effect.</p>
              <p><strong>Waiver:</strong> Our failure to enforce a right does not waive that right.</p>
              <p><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and HabeshaCommunity.</p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">12. Contact Us</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Questions about these Terms? Contact us:
                </p>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Email:</strong> <a href="mailto:legal@habeshacommunity.com" className="text-purple-600 hover:underline">legal@habeshacommunity.com</a></p>
                  <p><strong>Support:</strong> <a href="mailto:support@habeshacommunity.com" className="text-purple-600 hover:underline">support@habeshacommunity.com</a></p>
                  <p><strong>Website:</strong> <a href="https://habeshacommunity.com" className="text-purple-600 hover:underline">habeshacommunity.com</a></p>
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
