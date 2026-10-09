import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/privacy";
import { SITE_URL } from "@/constants/company";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { AscentEmailLink } from "@/components/EmailLink";
import { PhoneLink } from "@/components/shared/PhoneLink";

const Privacy = () => {
  const c = usePageContent(contentModule);

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${SITE_URL}/privacy`} />
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
              <p className="mb-4">{c.f009}</p>
              <p>{c.f010}</p>
            </section>

            {/* What We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f011}</h2>
              <p className="mb-4">{c.f012}</p>

              <div className="ml-6 space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f013}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>{c.f014}</strong> {c.f015}
                    </li>
                    <li>
                      <strong>{c.f016}</strong> {c.f017}
                    </li>
                    <li>
                      <strong>{c.f018}</strong> {c.f019}
                    </li>
                    <li>
                      <strong>{c.f020}</strong> {c.f021}
                    </li>
                    <li>
                      <strong>{c.f022}</strong> {c.f023}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f024}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>{c.f025}</strong> {c.f026}
                    </li>
                    <li>
                      <strong>{c.f027}</strong> {c.f028}
                    </li>
                    <li>
                      <strong>{c.f029}</strong> {c.f030}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Why We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f031}</h2>
              <p className="mb-4">{c.f032}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>{c.f033}</strong> {c.f034}
                </li>
                <li>
                  <strong>{c.f035}</strong> {c.f036}
                </li>
                <li>
                  <strong>{c.f037}</strong> {c.f038}
                </li>
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
            </section>

            {/* How We Use */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f047}</h2>
              <p className="mb-4">{c.f048}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>{c.f049}</li>
                <li>{c.f050}</li>
                <li>{c.f051}</li>
                <li>{c.f052}</li>
                <li>{c.f053}</li>
                <li>{c.f054}</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f055}</h2>
              <p className="mb-4">{c.f056}</p>
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
                <li>
                  <strong>{c.f063}</strong> {c.f064}
                </li>
                <li>
                  <strong>{c.f065}</strong> {c.f066}
                </li>
                <li>
                  <strong>{c.f067}</strong> {c.f068}
                </li>
              </ul>
              <p className="mt-4">{c.f069}</p>
            </section>

            {/* Where Data is Stored */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f070}</h2>
              <p className="mb-4">{c.f071}</p>
              <p>{c.f072}</p>
            </section>

            {/* Third Party Sharing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f073}</h2>
              <p className="mb-4">{c.f074}</p>

              <div className="ml-6 space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f075}</h3>
                  <ul className="list-disc ml-6 space-y-2">
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
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f082}</h3>
                  <p className="mb-2">{c.f083}</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>{c.f084}</li>
                    <li>{c.f085}</li>
                    <li>{c.f086}</li>
                    <li>{c.f087}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f088}</h3>
                  <p>{c.f089}</p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f090}</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f091}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>{c.f092}</strong> {c.f093}
                    </li>
                    <li>
                      <strong>{c.f094}</strong> {c.f095}
                    </li>
                    <li>
                      <strong>{c.f096}</strong> {c.f097}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f098}</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>{c.f099}</li>
                    <li>{c.f100}</li>
                    <li>{c.f101}</li>
                    <li>{c.f102}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">{c.f103}</h3>
                  <p className="mb-2">{c.f104}</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>{c.f105}</li>
                    <li>{c.f106}</li>
                    <li>
                      {c.f107}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-2"
                      >
                        https://tools.google.com/dlpage/gaoptout
                      </a>
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">{c.f108}</p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f109}</h2>
              <p className="mb-4">{c.f110}</p>

              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>{c.f111}</strong> {c.f112}
                </li>
                <li>
                  <strong>{c.f113}</strong> {c.f114}
                </li>
                <li>
                  <strong>{c.f115}</strong> {c.f116}
                </li>
                <li>
                  <strong>{c.f117}</strong> {c.f118}
                </li>
                <li>
                  <strong>{c.f119}</strong> {c.f120}
                </li>
                <li>
                  <strong>{c.f121}</strong> {c.f122}
                </li>
              </ul>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">{c.f123}</h3>
                <p className="mb-2">{c.f124}</p>
                <ul className="list-none space-y-1">
                  <li>
                    <strong>{c.f125}</strong>{" "}
                    <AscentEmailLink className="inline" showIcon={false} />
                  </li>
                  <li>
                    <strong>{c.f126}</strong>{" "}
                    <PhoneLink showIcon={false} className="inline" />
                  </li>
                  <li>
                    <strong>{c.f127}</strong> {c.f128}
                  </li>
                </ul>
                <p className="mt-2 text-sm">{c.f129}</p>
              </div>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f130}</h2>
              <p className="mb-4">{c.f131}</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>{c.f132}</strong> {c.f133}
                </li>
                <li>
                  <strong>{c.f134}</strong> {c.f135}
                </li>
                <li>
                  <strong>{c.f136}</strong> {c.f137}
                </li>
                <li>
                  <strong>{c.f138}</strong> {c.f139}
                </li>
                <li>
                  <strong>{c.f140}</strong> {c.f141}
                </li>
                <li>
                  <strong>{c.f142}</strong> {c.f143}
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">{c.f144}</p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f145}</h2>
              <p>{c.f146}</p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f147}</h2>
              <p className="mb-4">{c.f148}</p>
              <p>{c.f149}</p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{c.f150}</h2>
              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">{c.f151}</h3>
                <p className="mb-4">{c.f152}</p>
                <div className="space-y-2">
                  <p>
                    <strong>{c.f153}</strong>
                  </p>
                  <p>{c.f154}</p>
                  <p>
                    {c.f155}
                    <AscentEmailLink
                      className="text-primary underline underline-offset-2 inline"
                      showIcon={false}
                    />
                  </p>
                  <p>
                    {c.f156}
                    <PhoneLink
                      showIcon={false}
                      className="text-primary underline underline-offset-2 inline"
                    />
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {c.f157}
                    <a
                      href="https://www.priv.gc.ca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      {c.f158}
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* PIPEDA Compliance */}
            <section className="border-t border-border pt-6">
              <h2 className="text-2xl font-semibold mb-4">{c.f159}</h2>
              <p>{c.f160}</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
