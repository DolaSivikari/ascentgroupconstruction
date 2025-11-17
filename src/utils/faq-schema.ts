interface FAQItem {
  question: string;
  answer: string;
}

export const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const generateServiceSchema = (options: {
  name: string;
  description: string;
  areaServed: string[];
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: options.name,
    description: options.description,
    provider: {
      "@type": "GeneralContractor",
      name: "Ascent Group Construction",
      url: "https://ascentgroupconstruction.com",
    },
    areaServed: options.areaServed.map((area) => ({
      "@type": "City",
      name: area,
    })),
    url: options.url,
  };
};

export const generateHowToSchema = (options: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: options.name,
    description: options.description,
    totalTime: options.totalTime || "P3D",
    step: options.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };
};
