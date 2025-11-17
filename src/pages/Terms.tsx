import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Use | Ascent Group Construction</title>
        <meta name="description" content="Terms of Use for Ascent Group Construction website - legal terms, disclaimers, and conditions for using our services." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Navigation />
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Use</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-CA')}</p>

          <div className="space-y-8 text-foreground">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                Welcome to the Ascent Group Construction website (the "Website"). By accessing or using this Website, you agree to be bound by these Terms of Use and our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. If you do not agree to these terms, please do not use this Website.
              </p>
              <p>
                These Terms of Use constitute a legally binding agreement between you and Ascent Group Construction ("Company," "we," "our," or "us").
              </p>
            </section>

            {/* Website Use */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use of Website</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">2.1 Permitted Use</h3>
                  <p className="mb-2">You may use this Website for:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Viewing information about our construction services</li>
                    <li>Submitting inquiries, RFP requests, and job applications</li>
                    <li>Subscribing to our newsletter (with consent)</li>
                    <li>Viewing our project portfolio and case studies</li>
                    <li>Accessing publicly available resources and content</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">2.2 Prohibited Use</h3>
                  <p className="mb-2">You may NOT:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Use the Website for any unlawful purpose or in violation of these Terms</li>
                    <li>Attempt to gain unauthorized access to our systems or networks</li>
                    <li>Transmit viruses, malware, or other harmful code</li>
                    <li>Scrape, copy, or reproduce content without permission</li>
                    <li>Impersonate any person or entity</li>
                    <li>Interfere with the proper functioning of the Website</li>
                    <li>Use automated systems (bots, scrapers) without authorization</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* No Warranty */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. No Warranty of Accuracy</h2>
              <p className="mb-4">
                The information provided on this Website is for general informational purposes only. While we strive to keep the information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>The accuracy, completeness, or reliability of any information</li>
                <li>The availability or functionality of the Website</li>
                <li>The suitability of our services for your specific needs</li>
                <li>The results you may achieve from using our services</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Information on this Website may contain technical inaccuracies or typographical errors. We reserve the right to make changes, corrections, and updates at any time without notice.
              </p>
            </section>

            {/* Professional Advice */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Not Professional Advice</h2>
              <p className="mb-4">
                The content on this Website is for informational purposes only and does not constitute professional construction, engineering, architectural, legal, or financial advice. You should not rely solely on information from this Website for important decisions.
              </p>
              <p className="mb-4">
                For specific construction projects, you should:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Obtain a detailed project proposal and contract</li>
                <li>Consult with qualified professionals (engineers, architects, lawyers)</li>
                <li>Obtain necessary permits and approvals</li>
                <li>Review project specifications and drawings</li>
                <li>Conduct proper due diligence</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="mb-4">
                To the fullest extent permitted by applicable law, Ascent Group Construction and its directors, officers, employees, agents, and affiliates shall not be liable for:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Website downtime, errors, or technical failures</li>
                <li>Reliance on information provided on the Website</li>
                <li>Unauthorized access to or alteration of your transmissions or data</li>
                <li>Third-party content, links, or services</li>
              </ul>
              <p className="mt-4">
                This limitation applies regardless of whether we were advised of the possibility of such damages and regardless of the theory of liability (contract, tort, negligence, strict liability, or otherwise).
              </p>
              <p className="mt-4 text-sm font-medium">
                Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability is limited to the greatest extent permitted by law.
              </p>
            </section>

            {/* External Links */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Third-Party Links and Content</h2>
              <p className="mb-4">
                This Website may contain links to third-party websites, partner sites, or external resources. These links are provided for your convenience only. We do not:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Control or endorse the content of third-party websites</li>
                <li>Make any representations about third-party services or products</li>
                <li>Assume responsibility for the accuracy or legality of third-party content</li>
                <li>Guarantee the privacy practices of third-party sites</li>
              </ul>
              <p className="mt-4">
                Your use of third-party websites is at your own risk and subject to their terms and conditions. We recommend reviewing the terms and privacy policies of any external sites you visit.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property Rights</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">7.1 Our Content</h3>
                  <p className="mb-2">
                    All content on this Website, including text, graphics, logos, images, videos, software, and compilation, is the property of Ascent Group Construction or its licensors and is protected by Canadian and international copyright laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, create derivative works, publicly display, or exploit any content without our prior written permission.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">7.2 Trademarks</h3>
                  <p className="mb-2">
                    "Ascent Group Construction" and our logo are trademarks of Ascent Group Construction. You may not use our trademarks without our express written consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">7.3 Partner Logos and Trademarks</h3>
                  <p className="mb-2">
                    Third-party logos, trademarks, and brand names displayed on this Website are the property of their respective owners. Their display on our Website:
                  </p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Is done with permission or under applicable trademark fair use provisions</li>
                    <li>Does not imply endorsement of our services by those parties</li>
                    <li>Does not grant you any right to use those marks</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">7.4 Project Photos and Images</h3>
                  <p>
                    Project photographs and images are used with permission from clients or are our original work. Unauthorized use of project images may violate copyright and privacy rights.
                  </p>
                </div>
              </div>
            </section>

            {/* WSIB and Licensing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Credentials and Certifications</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">8.1 WSIB Compliance</h3>
                  <p className="mb-2">
                    Ascent Group Construction maintains WSIB (Workplace Safety and Insurance Board) clearance as required for construction contractors in Ontario. Our current WSIB clearance certificate is available upon request.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    WSIB clearance status can be verified through the WSIB's online clearance verification tool at <a href="https://www.wsib.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.wsib.ca</a>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">8.2 Licensing and Insurance</h3>
                  <p>
                    We are a fully licensed and insured construction contractor. Proof of licensing, bonding, and insurance coverage is available upon request for qualified project inquiries.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">8.3 Certifications</h3>
                  <p>
                    Certifications, awards, and memberships displayed on this Website are current as of the date shown. We maintain documentation to substantiate all claims regarding our credentials.
                  </p>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Testimonials and Reviews</h2>
              <p className="mb-4">
                We are currently collecting verified client testimonials for display on this Website. When testimonials are displayed, they will:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Represent genuine experiences of actual clients</li>
                <li>Be obtained with proper written consent and documentation</li>
                <li>Reflect the client's authentic experience at the time of the project</li>
                <li>Not be fabricated, purchased, or materially altered</li>
                <li>Include disclosure of any material connection, compensation, or incentive provided</li>
                <li>Comply with FTC Guidelines and Canadian advertising standards</li>
              </ul>
              <p className="mt-4">
                We maintain documentation to verify the authenticity of all testimonials, including:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-2">
                <li>Client consent forms with signatures and dates</li>
                <li>Project documentation proving the business relationship</li>
                <li>Contact information for verification purposes (kept confidential)</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Important Notice:</strong> Individual results may vary. Past performance is not necessarily indicative of future results. Your experience may differ based on project scope, timeline, budget, site conditions, and other factors specific to your project.
              </p>
            </section>

            {/* User Content */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. User-Submitted Content</h2>
              <p className="mb-4">
                When you submit content through our contact forms, RFP submissions, or other communications (collectively, "User Content"), you:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Grant us a license to use, store, and process your submission for business purposes</li>
                <li>Represent that you have the right to submit the content</li>
                <li>Acknowledge that submissions are not confidential (except as covered by our Privacy Policy)</li>
                <li>Agree not to submit confidential, proprietary, or sensitive information without a proper confidentiality agreement</li>
              </ul>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Ascent Group Construction, its officers, directors, employees, agents, and affiliates from any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising from:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>Your use or misuse of the Website</li>
                <li>Your violation of these Terms of Use</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit through the Website</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to this page with an updated "Last Updated" date. Material changes may be communicated through a prominent notice on the Website.
              </p>
              <p>
                Your continued use of the Website after changes are posted constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law and Jurisdiction</h2>
              <p className="mb-4">
                These Terms of Use are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the courts located in Ontario, Canada.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Entire Agreement</h2>
              <p>
                These Terms of Use, together with our Privacy Policy and any other legal notices published on this Website, constitute the entire agreement between you and Ascent Group Construction regarding your use of the Website.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Contact Information</h2>
              <div className="p-6 bg-muted/50 rounded-lg">
                <p className="mb-4">
                  For questions or concerns about these Terms of Use:
                </p>
                <div className="space-y-2">
                  <p><strong>Ascent Group Construction</strong></p>
                  <p>Legal Department</p>
                  <p>Email: <a href="mailto:info@ascentgroupconstruction.com" className="text-primary hover:underline">info@ascentgroupconstruction.com</a></p>
                  <p>Phone: <a href="tel:647-528-6804" className="text-primary hover:underline">647-528-6804</a></p>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="border-t border-border pt-6">
              <h2 className="text-2xl font-semibold mb-4">Acknowledgment</h2>
              <p>
                By using this Website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy.
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

export default Terms;
