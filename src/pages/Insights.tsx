import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import InsightsFeed from "@/components/insights/InsightsFeed";
import SEO from "@/components/SEO";
import SkipLink from "@/components/SkipLink";
import PageHeader from "@/components/PageHeader";
import heroImage from "@/assets/heroes/hero-about-company.jpg";

const Insights = () => {
  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <SEO
        title="Industry Insights & Construction Trends | Ascent Group"
        description="Expert perspectives on construction industry trends, innovations, project management best practices, and building sector insights from Ascent Group Construction."
        canonical="/insights"
      />
      
      <Navigation />
      
      <main id="main-content">
        {/* Hero Section with PageHeader */}
        <section>
          <PageHeader
            title="Industry Insights"
            description="Stay informed with expert analysis, project updates, and construction industry trends from our team of professionals."
            backgroundImage={heroImage}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Insights' }
            ]}
          />
        </section>

        {/* Insights Feed */}
        <InsightsFeed 
          limit={24}
          showFilters={true}
          showPinnedFirst={true}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Insights;
