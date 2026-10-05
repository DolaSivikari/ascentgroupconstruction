import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/accessibility";
import { SITE_URL } from "@/constants/company";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { AscentEmailLink } from "@/components/EmailLink";
import { PhoneLink } from "@/components/shared/PhoneLink";

const Accessibility = () => {
  const c = usePageContent(contentModule);

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${SITE_URL}/accessibility`} />
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
            {/* Commitment */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f008}</h2>
              <p className="mb-4">{c.f009}</p>
              <p>{c.f010}</p>
            </section>

            {/* Conformance Status */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f011}</h2>
              <div className="p-6 bg-muted/50 rounded-lg mb-4">
                <p className="mb-2">
                  <strong>{c.f012}</strong> {c.f013}
                </p>
                <p className="text-sm text-muted-foreground">{c.f014}</p>
              </div>
              <p>{c.f015}</p>
            </section>

            {/* Accessibility Features */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f016}</h2>
              <p className="mb-4">{c.f017}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f018}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>{c.f019}</strong> {c.f020}
                    </li>
                    <li>
                      <strong>{c.f021}</strong> {c.f022}
                    </li>
                    <li>
                      <strong>{c.f023}</strong> {c.f024}
                    </li>
                    <li>
                      <strong>{c.f025}</strong> {c.f026}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f027}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>{c.f028}</strong> {c.f029}
                    </li>
                    <li>
                      <strong>{c.f030}</strong> {c.f031}
                    </li>
                    <li>
                      <strong>{c.f032}</strong> {c.f033}
                    </li>
                    <li>
                      <strong>{c.f034}</strong> {c.f035}
                    </li>
                    <li>
                      <strong>{c.f036}</strong> {c.f037}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f038}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>{c.f039}</strong> {c.f040}
                    </li>
                    <li>
                      <strong>{c.f041}</strong> {c.f042}
                    </li>
                    <li>
                      <strong>{c.f043}</strong> {c.f044}
                    </li>
                    <li>
                      <strong>{c.f045}</strong> {c.f046}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f047}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>{c.f048}</strong> {c.f049}
                    </li>
                    <li>
                      <strong>{c.f050}</strong> {c.f051}
                    </li>
                    <li>
                      <strong>{c.f052}</strong> {c.f053}
                    </li>
                    <li>
                      <strong>{c.f054}</strong> {c.f055}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f056}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>{c.f057}</strong> {c.f058}
                    </li>
                    <li>
                      <strong>{c.f059}</strong> {c.f060}
                    </li>
                    <li>
                      <strong>{c.f061}</strong> {c.f062}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f063}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>{c.f064}</strong> {c.f065}
                    </li>
                    <li>
                      <strong>{c.f066}</strong> {c.f067}
                    </li>
                    <li>
                      <strong>{c.f068}</strong> {c.f069}
                    </li>
                    <li>
                      <strong>{c.f070}</strong> {c.f071}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Known Limitations */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f072}</h2>
              <p className="mb-4">{c.f073}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>{c.f074}</strong> {c.f075}
                </li>
                <li>
                  <strong>{c.f076}</strong> {c.f077}
                </li>
                <li>
                  <strong>{c.f078}</strong> {c.f079}
                </li>
                <li>
                  <strong>{c.f080}</strong> {c.f081}
                </li>
              </ul>
              <p className="mt-4">{c.f082}</p>
            </section>

            {/* Assistive Technologies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f083}</h2>
              <p className="mb-4">{c.f084}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>{c.f085}</strong> {c.f086}
                </li>
                <li>
                  <strong>{c.f087}</strong> {c.f088}
                </li>
                <li>
                  <strong>{c.f089}</strong> {c.f090}
                </li>
                <li>
                  <strong>{c.f091}</strong> {c.f092}
                </li>
              </ul>
              <p className="mt-4">
                <strong>{c.f093}</strong> {c.f094}
              </p>
            </section>

            {/* Testing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f095}</h2>
              <p className="mb-4">{c.f096}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>{c.f097}</strong> {c.f098}
                </li>
                <li>
                  <strong>{c.f099}</strong> {c.f100}
                </li>
                <li>
                  <strong>{c.f101}</strong> {c.f102}
                </li>
                <li>
                  <strong>{c.f103}</strong> {c.f104}
                </li>
                <li>
                  <strong>{c.f105}</strong> {c.f106}
                </li>
              </ul>
            </section>

            {/* Alternative Formats */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f107}</h2>
              <p className="mb-4">{c.f108}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f109}</h3>
                  <p className="mb-2">{c.f110}</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>{c.f111}</li>
                    <li>{c.f112}</li>
                    <li>{c.f113}</li>
                    <li>{c.f114}</li>
                    <li>{c.f115}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f116}</h3>
                  <p className="mb-2">{c.f117}</p>
                  <div className="ml-6 space-y-2">
                    <p>
                      <strong>{c.f118}</strong>{" "}
                      <AscentEmailLink
                        className="text-primary hover:underline inline"
                        showIcon={false}
                      />
                    </p>
                    <p>
                      <strong>{c.f119}</strong>{" "}
                      <PhoneLink
                        showIcon={false}
                        className="text-primary hover:underline inline"
                      />
                    </p>
                    <p>
                      <strong>{c.f120}</strong> {c.f121}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Feedback */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f122}</h2>
              <p className="mb-4">{c.f123}</p>

              <div className="p-6 bg-muted/50 rounded-lg space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{c.f124}</h3>
                  <p className="mb-2">{c.f125}</p>
                  <ul className="list-disc ml-6 space-y-2 text-sm">
                    <li>{c.f126}</li>
                    <li>{c.f127}</li>
                    <li>{c.f128}</li>
                    <li>{c.f129}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">{c.f130}</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>{c.f131}</strong>
                    </p>
                    <p>
                      {c.f132}
                      <AscentEmailLink
                        className="text-primary hover:underline inline"
                        showIcon={false}
                      />
                    </p>
                    <p>
                      {c.f133}
                      <PhoneLink
                        showIcon={false}
                        className="text-primary hover:underline inline"
                      />
                    </p>
                    <p>
                      {c.f134}
                      <Link
                        to="/contact"
                        className="text-primary hover:underline"
                      >
                        {c.f135}
                      </Link>{" "}
                      {c.f136}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Ongoing Efforts */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f137}</h2>
              <p className="mb-4">{c.f138}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>{c.f139}</li>
                <li>{c.f140}</li>
                <li>{c.f141}</li>
                <li>{c.f142}</li>
                <li>{c.f143}</li>
                <li>{c.f144}</li>
              </ul>
            </section>

            {/* Standards and Guidelines */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f145}</h2>
              <p className="mb-4">{c.f146}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>{c.f147}</strong> {c.f148}
                </li>
                <li>
                  <strong>{c.f149}</strong> {c.f150}
                </li>
                <li>
                  <strong>{c.f151}</strong> {c.f152}
                </li>
                <li>
                  <strong>{c.f153}</strong> {c.f154}
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                {c.f155}
                <a
                  href="https://www.w3.org/WAI/WCAG21/quickref/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {c.f156}
                </a>
              </p>
            </section>

            {/* Third Party Content */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f157}</h2>
              <p className="mb-4">{c.f158}</p>
              <p>{c.f159}</p>
            </section>

            {/* Formal Complaints */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f160}</h2>
              <p className="mb-4">{c.f161}</p>
              <ol className="list-decimal ml-6 space-y-2">
                <li>{c.f162}</li>
                <li>{c.f163}</li>
                <li>{c.f164}</li>
              </ol>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
                <p className="font-medium mb-2">{c.f165}</p>
                <ul className="space-y-2">
                  <li>
                    <strong>{c.f166}</strong>
                    <br />
                    <a
                      href="https://www.ontario.ca/page/how-make-customer-service-accessible"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {c.f167}
                    </a>
                  </li>
                  <li>
                    <strong>{c.f168}</strong>
                    <br />
                    <a
                      href="http://www.ohrc.on.ca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {c.f169}
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Approval and Review */}
            <section className="border-t border-border pt-6">
              <h2 className="text-2xl font-semibold mb-4">{c.f170}</h2>
              <p className="mb-4">{c.f171}</p>
              <p className="text-sm text-muted-foreground">
                <strong>{c.f172}</strong>{" "}
                {new Date().toLocaleDateString("en-CA")}
                <br />
                <strong>{c.f173}</strong>{" "}
                {new Date(
                  new Date().setFullYear(new Date().getFullYear() + 1),
                ).toLocaleDateString("en-CA")}
              </p>
            </section>

            {/* Contact */}
            <section className="bg-primary/10 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">{c.f174}</h2>
              <p className="mb-4">{c.f175}</p>
              <div className="space-y-2">
                <p>
                  <strong>{c.f176}</strong>
                </p>
                <p>
                  {c.f177}
                  <AscentEmailLink
                    className="text-primary hover:underline inline"
                    showIcon={false}
                  />
                </p>
                <p>
                  {c.f178}
                  <PhoneLink
                    showIcon={false}
                    className="text-primary hover:underline inline"
                  />
                </p>
                <p>
                  {c.f179}
                  <Link to="/contact" className="text-primary hover:underline">
                    {c.f180}
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Accessibility;
