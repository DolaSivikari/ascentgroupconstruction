import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Section } from "@/components/sections/Section";
import { ServiceSelector as ServiceSelectorTool } from "@/components/tools/ServiceSelector";
import SEO from "@/components/SEO";
import heroImage from "@/assets/heroes/hero-general-contracting.jpg";

const ServiceSelector = () => {
  return (
    <>
      <SEO
        title="Service Selector Tool | Find Your Perfect Service Match"
        description="Answer 3 quick questions to get personalized building envelope and restoration service recommendations with typical timelines and costs for your Ontario property."
        keywords="service selector, building envelope assessment, property maintenance, construction services Ontario"
      />
      <Navigation />
      
      <PageHeader
        title="Find Your Perfect Service Match"
        description="Not sure which service you need? Answer 3 simple questions and we'll recommend the right solution with typical timelines and costs."
        backgroundImage={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Service Selector" }
        ]}
      />

      <Section size="major">
        <ServiceSelectorTool />
      </Section>

      <Footer />
    </>
  );
};

export default ServiceSelector;