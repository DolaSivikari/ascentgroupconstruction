import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Ascent Group Construction</title>
        <meta name="description" content="Privacy policy for Ascent Group Construction - PIPEDA compliant information about how we collect, use, and protect your personal information." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Navigation />
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-CA')}</p>

          <div className="space-y-8 text-foreground">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Ascent Group Construction ("we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information in compliance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy laws.
              </p>
              <p>
                By using our website or services, you consent to the collection and use of your information as described in this Privacy Policy.
              </p>
            </section>

            {/* What We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. What Personal Information We Collect</h2>
              <p className="mb-4">We collect the following types of personal information:</p>
              
              <div className="ml-6 space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">2.1 Information You Provide Directly</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Contact Forms:</strong> Name, email address, phone number, company name, and message content</li>
                    <li><strong>Newsletter Subscriptions:</strong> Email address, subscription preferences, consent timestamp</li>
                    <li><strong>RFP/Estimate Requests:</strong> Project details, timeline, budget information, contact information</li>
                    <li><strong>Job Applications:</strong> Name, email, phone, resume, cover letter, portfolio links</li>
                    <li><strong>Prequalification Forms:</strong> Company information, project requirements, contact details</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">2.2 Information Collected Automatically</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
                    <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, referral sources</li>
                    <li><strong>Cookies:</strong> Session cookies, analytics cookies (see Section 7 for details)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Why We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Why We Collect Your Information</h2>
              <p className="mb-4">We collect and use your personal information for the following purposes:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Respond to Inquiries:</strong> To answer your questions and provide information about our services</li>
                <li><strong>Newsletter Communications:</strong> To send industry insights, project updates, and company news (with your consent)</li>
                <li><strong>Project Proposals:</strong> To prepare estimates, RFP responses, and project documentation</li>
                <li><strong>Job Applications:</strong> To review qualifications and contact candidates</li>
                <li><strong>Website Improvement:</strong> To analyze usage patterns and improve user experience</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                <li><strong>Security:</strong> To protect against fraud, unauthorized access, and abuse</li>
              </ul>
            </section>

            {/* How We Use */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
              <p className="mb-4">Your personal information is used internally for:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Processing and responding to your requests and communications</li>
                <li>Sending newsletters and marketing communications (with consent)</li>
                <li>Improving our website and services</li>
                <li>Analyzing trends and user behavior</li>
                <li>Maintaining security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. How Long We Keep Your Information</h2>
              <p className="mb-4">We retain personal information for the following periods:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Contact Form Inquiries:</strong> 2 years from submission date</li>
                <li><strong>Newsletter Subscriptions:</strong> Until you unsubscribe or request deletion</li>
                <li><strong>Job Applications:</strong> 1 year from submission date</li>
                <li><strong>RFP/Estimate Requests:</strong> 3 years from project completion or proposal date</li>
                <li><strong>Analytics Data:</strong> 26 months (Google Analytics default)</li>
                <li><strong>Audit Logs:</strong> 7 years for legal and regulatory compliance</li>
              </ul>
              <p className="mt-4">
                After the retention period expires, we securely delete or anonymize your information unless we are required by law to retain it longer.
              </p>
            </section>

            {/* Where Data is Stored */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Where Your Information is Stored</h2>
              <p className="mb-4">
                Your personal information is stored on secure servers located in Canada. We use Lovable Cloud (powered by Supabase) which maintains data centers in Canada and complies with Canadian data protection standards.
              </p>
              <p>
                Some service providers (such as Google Analytics) may process data outside of Canada. When we transfer data internationally, we ensure appropriate safeguards are in place through standard contractual clauses and PIPEDA-compliant transfer mechanisms.
              </p>
            </section>

            {/* Third Party Sharing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Who We Share Your Information With</h2>
              <p className="mb-4">We may share your personal information with:</p>
              
              <div className="ml-6 space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">7.1 Service Providers</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Cloud Hosting:</strong> Lovable Cloud/Supabase (data storage and processing)</li>
                    <li><strong>Analytics:</strong> Google Analytics (website usage analysis)</li>
                    <li><strong>Email Services:</strong> Resend (newsletter delivery)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">7.2 Legal Requirements</h3>
                  <p className="mb-2">We may disclose your information when required by law, such as:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>In response to a court order, subpoena, or legal process</li>
                    <li>To comply with regulatory requirements (WSIB, CRA, etc.)</li>
                    <li>To protect our rights, property, or safety</li>
                    <li>To prevent fraud or illegal activity</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">7.3 Business Transfers</h3>
                  <p>
                    If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">8.1 What Cookies We Use</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for website functionality (session management, security)</li>
                    <li><strong>Analytics Cookies:</strong> Google Analytics to understand how visitors use our site</li>
                    <li><strong>Preference Cookies:</strong> Remember your cookie consent choices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">8.2 Why We Use Cookies</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Ensure website security and functionality</li>
                    <li>Analyze site traffic and usage patterns</li>
                    <li>Improve user experience and website performance</li>
                    <li>Remember your preferences and settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">8.3 Managing Cookies</h3>
                  <p className="mb-2">You can control cookies through:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Our cookie banner (shown on first visit)</li>
                    <li>Your browser settings (disable or delete cookies)</li>
                    <li>Google Analytics opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://tools.google.com/dlpage/gaoptout</a></li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Note: Disabling essential cookies may affect website functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Your Privacy Rights</h2>
              <p className="mb-4">Under PIPEDA, you have the following rights regarding your personal information:</p>
              
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Right to Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</li>
                <li><strong>Right to Withdraw Consent:</strong> Unsubscribe from newsletters or withdraw consent at any time</li>
                <li><strong>Right to Object:</strong> Object to certain uses of your information</li>
                <li><strong>Right to Complain:</strong> File a complaint with the Privacy Commissioner of Canada</li>
              </ul>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">How to Exercise Your Rights</h3>
                <p className="mb-2">To exercise any of these rights, contact us at:</p>
                <ul className="list-none space-y-1">
                  <li><strong>Email:</strong> info@ascentgroupconstruction.com</li>
                  <li><strong>Phone:</strong> 647-528-6804</li>
                  <li><strong>Mail:</strong> Ascent Group Construction, Privacy Officer, 2 Jody Ave, North York, ON M3N 1H1</li>
                </ul>
                <p className="mt-2 text-sm">We will respond to your request within 30 days as required by PIPEDA.</p>
              </div>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. How We Protect Your Information</h2>
              <p className="mb-4">We implement appropriate technical and organizational security measures to protect your personal information, including:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Encryption:</strong> SSL/TLS encryption for data transmission</li>
                <li><strong>Access Controls:</strong> Restricted access to personal information on a need-to-know basis</li>
                <li><strong>Secure Storage:</strong> Encrypted database storage with regular backups</li>
                <li><strong>Security Monitoring:</strong> Regular security audits and vulnerability assessments</li>
                <li><strong>Employee Training:</strong> Staff trained on privacy and data protection practices</li>
                <li><strong>Breach Response:</strong> Incident response plan to address potential data breaches</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Children's Privacy</h2>
              <p>
                Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will delete the information.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or for other operational reasons. We will post the updated policy on this page with a new "Last Updated" date.
              </p>
              <p>
                Material changes will be communicated through a prominent notice on our website or via email to newsletter subscribers. Your continued use of our website after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Privacy Officer</h3>
                <p className="mb-4">
                  For questions, concerns, or requests regarding this Privacy Policy or your personal information:
                </p>
                <div className="space-y-2">
                  <p><strong>Ascent Group Construction</strong></p>
                  <p>Privacy Officer</p>
                  <p>Email: <a href="mailto:info@ascentgroupconstruction.com" className="text-primary hover:underline">info@ascentgroupconstruction.com</a></p>
                  <p>Phone: <a href="tel:647-528-6804" className="text-primary hover:underline">647-528-6804</a></p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    If you are not satisfied with our response, you may file a complaint with the Office of the Privacy Commissioner of Canada: <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.priv.gc.ca</a>
                  </p>
                </div>
              </div>
            </section>

            {/* PIPEDA Compliance */}
            <section className="border-t border-border pt-6">
              <h2 className="text-2xl font-semibold mb-4">14. PIPEDA Compliance Statement</h2>
              <p>
                This Privacy Policy has been designed to comply with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and the ten principles of fair information practices. We are committed to protecting your privacy rights and maintaining transparency in our data handling practices.
              </p>
            </section>
          </div>
        </div>
      </div>
      <BackToTop />
      <Footer />
    </>
  );
};

export default Privacy;
