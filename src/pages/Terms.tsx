import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/terms";
import { SITE_URL } from "@/constants/company";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { AscentEmailLink } from "@/components/EmailLink";
import { PhoneLink } from "@/components/shared/PhoneLink";

const Terms = () => {
  const c = usePageContent(contentModule);

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${SITE_URL}/terms`} />
        <title>{c.f001}</title>
        <meta name={"description"} content={c.f003} />
        <meta name={"robots"} content={c.f005} />
      </Helmet>

      <Navigation />
      <div className="min-h-screen bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{c.f006}</h1>
          <p className="text-muted-foreground mb-8">
            {c.f007}
            {new Date().toLocaleDateString("en-CA")}
          </p>

          <div className="space-y-8 text-foreground">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f008}</h2>
              <p className="mb-4">
                {c.f009}
                <Link to="/privacy" className="text-primary underline underline-offset-2">
                  {c.f010}
                </Link>
                {c.f011}
              </p>
              <p>{c.f012}</p>
            </section>

            {/* Website Use */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f013}</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f014}</h3>
                  <p className="mb-2">{c.f015}</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>{c.f016}</li>
                    <li>{c.f017}</li>
                    <li>{c.f018}</li>
                    <li>{c.f019}</li>
                    <li>{c.f020}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f021}</h3>
                  <p className="mb-2">{c.f022}</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>{c.f023}</li>
                    <li>{c.f024}</li>
                    <li>{c.f025}</li>
                    <li>{c.f026}</li>
                    <li>{c.f027}</li>
                    <li>{c.f028}</li>
                    <li>{c.f029}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* No Warranty */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f030}</h2>
              <p className="mb-4">{c.f031}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>{c.f032}</li>
                <li>{c.f033}</li>
                <li>{c.f034}</li>
                <li>{c.f035}</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">{c.f036}</p>
            </section>

            {/* Professional Advice */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f037}</h2>
              <p className="mb-4">{c.f038}</p>
              <p className="mb-4">{c.f039}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>{c.f040}</li>
                <li>{c.f041}</li>
                <li>{c.f042}</li>
                <li>{c.f043}</li>
                <li>{c.f044}</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f045}</h2>
              <p className="mb-4">{c.f046}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>{c.f047}</li>
                <li>{c.f048}</li>
                <li>{c.f049}</li>
                <li>{c.f050}</li>
                <li>{c.f051}</li>
                <li>{c.f052}</li>
              </ul>
              <p className="mt-4">{c.f053}</p>
              <p className="mt-4 text-sm font-medium">{c.f054}</p>
            </section>

            {/* External Links */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f055}</h2>
              <p className="mb-4">{c.f056}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>{c.f057}</li>
                <li>{c.f058}</li>
                <li>{c.f059}</li>
                <li>{c.f060}</li>
              </ul>
              <p className="mt-4">{c.f061}</p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f062}</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f063}</h3>
                  <p className="mb-2">{c.f064}</p>
                  <p>{c.f065}</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f066}</h3>
                  <p className="mb-2">{c.f067}</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f068}</h3>
                  <p className="mb-2">{c.f069}</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>{c.f070}</li>
                    <li>{c.f071}</li>
                    <li>{c.f072}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f073}</h3>
                  <p>{c.f074}</p>
                </div>
              </div>
            </section>

            {/* WSIB and Licensing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f075}</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f076}</h3>
                  <p className="mb-2">{c.f077}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.f078}
                    <a
                      href="https://www.wsib.ca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      {c.f079}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f080}</h3>
                  <p>{c.f081}</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f082}</h3>
                  <p>{c.f083}</p>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f084}</h2>
              <p className="mb-4">{c.f085}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>{c.f086}</li>
                <li>{c.f087}</li>
                <li>{c.f088}</li>
                <li>{c.f089}</li>
                <li>{c.f090}</li>
                <li>{c.f091}</li>
              </ul>
              <p className="mt-4">{c.f092}</p>
              <ul className="list-disc ml-6 space-y-2 mt-2">
                <li>{c.f093}</li>
                <li>{c.f094}</li>
                <li>{c.f095}</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>{c.f096}</strong> {c.f097}
              </p>
            </section>

            {/* User Content */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f098}</h2>
              <p className="mb-4">{c.f099}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>{c.f100}</li>
                <li>{c.f101}</li>
                <li>{c.f102}</li>
                <li>{c.f103}</li>
              </ul>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f104}</h2>
              <p>{c.f105}</p>
              <ul className="list-disc ml-6 space-y-2 mt-4">
                <li>{c.f106}</li>
                <li>{c.f107}</li>
                <li>{c.f108}</li>
                <li>{c.f109}</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f110}</h2>
              <p className="mb-4">{c.f111}</p>
              <p>{c.f112}</p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f113}</h2>
              <p className="mb-4">{c.f114}</p>
              <p>{c.f115}</p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f116}</h2>
              <p>{c.f117}</p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f118}</h2>
              <p>{c.f119}</p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f120}</h2>
              <div className="p-6 bg-muted/50 rounded-lg">
                <p className="mb-4">{c.f121}</p>
                <div className="space-y-2">
                  <p>
                    <strong>{c.f122}</strong>
                  </p>
                  <p>{c.f123}</p>
                  <p>
                    {c.f124}
                    <AscentEmailLink
                      className="text-primary underline underline-offset-2 inline"
                      showIcon={false}
                    />
                  </p>
                  <p>
                    {c.f125}
                    <PhoneLink
                      showIcon={false}
                      className="text-primary underline underline-offset-2 inline"
                    />
                  </p>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="border-t border-border pt-6">
              <h2 className="text-2xl font-semibold mb-4">{c.f126}</h2>
              <p>{c.f127}</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
