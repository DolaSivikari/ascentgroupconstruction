import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import InsightsFeed from "@/components/insights/InsightsFeed";
import SEO from "@/components/SEO";
import SkipLink from "@/components/SkipLink";
import PageHero from "@/components/shared/PageHero";
import { mainPageHeroes } from "@/data/hero-images";

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
        <PageHero
          title="Industry Insights"
          description="Stay informed with expert analysis, project updates, and construction industry trends from our team of professionals."
          image={mainPageHeroes.insights}
          imageAlt="Construction industry insights"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Insights' }
          ]}
          height="medium"
        />

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
