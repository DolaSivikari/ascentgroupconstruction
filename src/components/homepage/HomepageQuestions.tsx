import contentModule, { homeEntry } from "@/content/pages/home-entry";
import { restoreStructured } from "@/content/structured";
import { useResolvedContent } from "@/lib/content/store";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { Link } from "react-router-dom";

export default function HomepageQuestions() {
  const c = restoreStructured(homeEntry, useResolvedContent(contentModule));
  return (
    <section
      className="container mx-auto px-4 py-16 max-w-4xl"
      aria-labelledby="project-questions-heading"
    >
      <h2 id="project-questions-heading" className="text-3xl font-bold mb-8">
        {c.faqTitle}
      </h2>
      <FAQAccordion faqs={c.faqs} />
      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-sm font-semibold text-primary">
        <Link className="underline underline-offset-4" to="/estimate">
          Request an Estimate
        </Link>
        <Link className="underline underline-offset-4" to="/submit-rfp">
          Submit an RFP
        </Link>
        <Link className="underline underline-offset-4" to="/projects">
          View Projects
        </Link>
      </div>
    </section>
  );
}
