import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Accessibility = () => {
  return (
    <>
      <Helmet>
        <title>Accessibility Statement | Ascent Group Construction</title>
        <meta name="description" content="Ascent Group Construction's commitment to web accessibility - WCAG 2.0 Level AA compliance, accessibility features, and how to request assistance." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Navigation />
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Accessibility Statement</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-CA')}</p>

          <div className="space-y-8 text-foreground">
            {/* Commitment */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Commitment to Accessibility</h2>
              <p className="mb-4">
                Ascent Group Construction is committed to ensuring digital accessibility for people with disabilities. We continually work to improve the user experience for all visitors and apply relevant accessibility standards to ensure our website is accessible to everyone.
              </p>
              <p>
                We are committed to complying with the Accessibility for Ontarians with Disabilities Act (AODA) and strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.0 Level AA standards.
              </p>
            </section>

            {/* Conformance Status */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Conformance Status</h2>
              <div className="p-6 bg-muted/50 rounded-lg mb-4">
                <p className="mb-2">
                  <strong>Conformance Level:</strong> WCAG 2.0 Level AA (Partial Conformance)
                </p>
                <p className="text-sm text-muted-foreground">
                  Partial conformance means that some parts of the content do not fully conform to the accessibility standard. We are actively working to achieve full conformance.
                </p>
              </div>
              <p>
                Our website has been designed with accessibility in mind and tested using industry-standard tools and manual testing procedures. We are committed to ongoing improvements and regular accessibility audits.
              </p>
            </section>

            {/* Accessibility Features */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
              <p className="mb-4">Our website includes the following accessibility features:</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">Keyboard Navigation</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Skip Links:</strong> Skip to main content links on all pages</li>
                    <li><strong>Logical Tab Order:</strong> Keyboard navigation follows a logical sequence</li>
                    <li><strong>Focus Indicators:</strong> Clear visual indicators show keyboard focus</li>
                    <li><strong>No Keyboard Traps:</strong> All interactive elements are keyboard accessible</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Screen Reader Support</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Semantic HTML:</strong> Proper use of HTML5 semantic elements</li>
                    <li><strong>ARIA Landmarks:</strong> Page regions identified with ARIA landmarks</li>
                    <li><strong>ARIA Labels:</strong> Descriptive labels for interactive elements</li>
                    <li><strong>Alt Text:</strong> Alternative text for all meaningful images</li>
                    <li><strong>Form Labels:</strong> Clear labels and instructions for all form fields</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Visual Accessibility</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Color Contrast:</strong> Text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)</li>
                    <li><strong>Resizable Text:</strong> Text can be resized up to 200% without loss of functionality</li>
                    <li><strong>Color Independence:</strong> Information is not conveyed by color alone</li>
                    <li><strong>Responsive Design:</strong> Content adapts to different screen sizes and orientations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Content Structure</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Heading Hierarchy:</strong> Proper use of heading levels (H1-H6)</li>
                    <li><strong>Descriptive Links:</strong> Link text describes the destination or purpose</li>
                    <li><strong>List Markup:</strong> Lists are properly marked up with semantic HTML</li>
                    <li><strong>Table Headers:</strong> Data tables include proper header associations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Media and Content</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Video Captions:</strong> Videos include captions where applicable</li>
                    <li><strong>Reduced Motion:</strong> Respect for user's motion preferences (prefers-reduced-motion)</li>
                    <li><strong>No Auto-play:</strong> Media does not auto-play with sound</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Forms and Input</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Clear Labels:</strong> Every form field has a visible and programmatic label</li>
                    <li><strong>Error Identification:</strong> Form errors are clearly identified and described</li>
                    <li><strong>Required Fields:</strong> Required fields are clearly marked</li>
                    <li><strong>Input Assistance:</strong> Instructions provided for complex inputs</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Known Limitations */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Known Limitations</h2>
              <p className="mb-4">
                Despite our efforts to ensure accessibility, some limitations may still exist. We are aware of the following areas that require ongoing improvement:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Third-Party Content:</strong> Some embedded third-party content (maps, videos, social media feeds) may have accessibility limitations outside our control</li>
                <li><strong>PDF Documents:</strong> Some downloadable PDF documents may not be fully accessible. We can provide alternative formats upon request</li>
                <li><strong>Complex Interactions:</strong> Some advanced interactive features may present challenges for certain assistive technologies</li>
                <li><strong>Historical Content:</strong> Older content predating our current accessibility standards may not meet WCAG 2.0 Level AA</li>
              </ul>
              <p className="mt-4">
                We are actively working to address these limitations and welcome your feedback on any accessibility barriers you encounter.
              </p>
            </section>

            {/* Assistive Technologies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Compatible Technologies</h2>
              <p className="mb-4">
                This website is designed to be compatible with the following assistive technologies:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Screen Readers:</strong> NVDA, JAWS, VoiceOver, TalkBack</li>
                <li><strong>Screen Magnification:</strong> ZoomText, built-in browser zoom</li>
                <li><strong>Speech Recognition:</strong> Dragon NaturallySpeaking, Windows Speech Recognition</li>
                <li><strong>Alternative Input Devices:</strong> Switch controls, head pointers, eye-tracking devices</li>
              </ul>
              <p className="mt-4">
                <strong>Supported Browsers:</strong> Chrome, Firefox, Safari, Edge (latest versions)
              </p>
            </section>

            {/* Testing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Testing and Validation</h2>
              <p className="mb-4">
                We employ multiple testing methods to ensure accessibility:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Automated Testing:</strong> WAVE, axe DevTools, Lighthouse audits</li>
                <li><strong>Manual Testing:</strong> Keyboard navigation, screen reader testing, color contrast verification</li>
                <li><strong>User Testing:</strong> Feedback from users with disabilities</li>
                <li><strong>Code Review:</strong> Regular review of HTML, CSS, and JavaScript for accessibility</li>
                <li><strong>Regular Audits:</strong> Periodic comprehensive accessibility audits</li>
              </ul>
            </section>

            {/* Alternative Formats */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Alternative Formats and Assistance</h2>
              <p className="mb-4">
                We are committed to providing information in accessible formats when needed. If you encounter content that is not accessible to you:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">Request Alternative Formats</h3>
                  <p className="mb-2">We can provide information in alternative formats such as:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Large print documents</li>
                    <li>Plain text versions of web content</li>
                    <li>Accessible PDF versions</li>
                    <li>Audio descriptions</li>
                    <li>Information via phone or email</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">How to Request Assistance</h3>
                  <p className="mb-2">Contact our accessibility team:</p>
                  <div className="ml-6 space-y-2">
                    <p><strong>Email:</strong> <a href="mailto:info@ascentgroupconstruction.com" className="text-primary hover:underline">info@ascentgroupconstruction.com</a></p>
                    <p><strong>Phone:</strong> <a href="tel:647-528-6804" className="text-primary hover:underline">647-528-6804</a></p>
                    <p><strong>Response Time:</strong> We aim to respond within 2 business days</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Feedback */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Feedback and Reporting Issues</h2>
              <p className="mb-4">
                We welcome your feedback on the accessibility of our website. If you encounter an accessibility barrier or have suggestions for improvement:
              </p>
              
              <div className="p-6 bg-muted/50 rounded-lg space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Report an Accessibility Issue</h3>
                  <p className="mb-2">When reporting an issue, please include:</p>
                  <ul className="list-disc ml-6 space-y-2 text-sm">
                    <li>Description of the issue and how it affects you</li>
                    <li>The page or section where you encountered the problem</li>
                    <li>The assistive technology and browser you are using</li>
                    <li>Any suggestions for improvement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Accessibility Coordinator</strong></p>
                    <p>Email: <a href="mailto:info@ascentgroupconstruction.com" className="text-primary hover:underline">info@ascentgroupconstruction.com</a></p>
                    <p>Phone: <a href="tel:647-528-6804" className="text-primary hover:underline">647-528-6804</a></p>
                    <p>Or use our <Link to="/contact" className="text-primary hover:underline">contact form</Link> (Subject: "Accessibility Feedback")</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Ongoing Efforts */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Ongoing Efforts and Improvements</h2>
              <p className="mb-4">
                Accessibility is an ongoing effort. We are continuously working to improve the accessibility of our website through:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Regular accessibility audits and testing</li>
                <li>Staff training on accessibility best practices</li>
                <li>Incorporating accessibility into our design and development process</li>
                <li>Monitoring and implementing new accessibility standards and techniques</li>
                <li>Responding to user feedback and addressing reported issues</li>
                <li>Reviewing and updating third-party tools and plugins for accessibility</li>
              </ul>
            </section>

            {/* Standards and Guidelines */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Standards and Guidelines</h2>
              <p className="mb-4">
                Our accessibility efforts are guided by:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>WCAG 2.0:</strong> Web Content Accessibility Guidelines 2.0 Level AA</li>
                <li><strong>AODA:</strong> Accessibility for Ontarians with Disabilities Act</li>
                <li><strong>IASR:</strong> Integrated Accessibility Standards Regulation (Ontario Reg. 191/11)</li>
                <li><strong>WAI-ARIA:</strong> Web Accessibility Initiative - Accessible Rich Internet Applications</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Learn more about WCAG 2.0: <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WCAG 2.0 Quick Reference</a>
              </p>
            </section>

            {/* Third Party Content */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Content</h2>
              <p className="mb-4">
                Our website may include content from third-party providers (Google Maps, YouTube, social media platforms). While we strive to ensure all content is accessible, we cannot always guarantee the accessibility of third-party content.
              </p>
              <p>
                If you experience difficulties with third-party content, please contact us, and we will work to provide the information in an alternative format.
              </p>
            </section>

            {/* Formal Complaints */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Formal Complaints Process</h2>
              <p className="mb-4">
                If you are not satisfied with our response to an accessibility concern, you may:
              </p>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Contact our Accessibility Coordinator to escalate your concern</li>
                <li>File a complaint with the Accessibility Directorate of Ontario</li>
                <li>Contact the Ontario Human Rights Commission</li>
              </ol>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
                <p className="font-medium mb-2">External Resources:</p>
                <ul className="space-y-2">
                  <li>
                    <strong>Accessibility Directorate of Ontario:</strong><br />
                    <a href="https://www.ontario.ca/page/how-make-customer-service-accessible" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ontario.ca/accessibility</a>
                  </li>
                  <li>
                    <strong>Ontario Human Rights Commission:</strong><br />
                    <a href="http://www.ohrc.on.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ohrc.on.ca</a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Approval and Review */}
            <section className="border-t border-border pt-6">
              <h2 className="text-2xl font-semibold mb-4">Statement Review and Updates</h2>
              <p className="mb-4">
                This Accessibility Statement is reviewed and updated regularly to reflect our current efforts and the evolving accessibility landscape.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Last Review Date:</strong> {new Date().toLocaleDateString('en-CA')}<br />
                <strong>Next Scheduled Review:</strong> {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-CA')}
              </p>
            </section>

            {/* Contact */}
            <section className="bg-primary/10 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Contact Our Accessibility Team</h2>
              <p className="mb-4">
                We are here to help. If you have questions, feedback, or need assistance accessing our website or services:
              </p>
              <div className="space-y-2">
                <p><strong>Ascent Group Construction - Accessibility Team</strong></p>
                <p>Email: <a href="mailto:info@ascentgroupconstruction.com" className="text-primary hover:underline">info@ascentgroupconstruction.com</a></p>
                <p>Phone: <a href="tel:647-528-6804" className="text-primary hover:underline">647-528-6804</a></p>
                <p>Contact Form: <Link to="/contact" className="text-primary hover:underline">ascentgroupconstruction.com/contact</Link></p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <BackToTop />
      <Footer />
    </>
  );
};

export default Accessibility;
