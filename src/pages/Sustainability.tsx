import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import heroImage from "@/assets/heroes/hero-sustainable.jpg";
import { 
  Leaf,
  Recycle, 
  Sun, 
  Droplet, 
  Award,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const Sustainability = () => {
  const [sqft, setSqft] = useState("");
  const [co2Offset, setCo2Offset] = useState(0);

  const calculateOffset = (value: string) => {
    const size = parseFloat(value) || 0;
    // Approximate CO₂ offset: 0.15 kg per sq ft for eco-friendly painting practices
    const offset = (size * 0.15).toFixed(0);
    setCo2Offset(parseFloat(offset));
  };

  const handleSqftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSqft(value);
    calculateOffset(value);
  };

  const stats = [
    {
      icon: Recycle,
      value: "90%",
      label: "Waste Diverted from Landfills",
      color: "text-sustainability"
    },
    {
      icon: Sun,
      value: "100%",
      label: "Low-VOC Materials Used",
      color: "text-sustainability-dark"
    },
    {
      icon: Droplet,
      value: "35%",
      label: "Water Usage Reduction",
      color: "text-blue-600"
    },
    {
      icon: Award,
      value: "50+",
      label: "Eco-Friendly Projects",
      color: "text-sustainability"
    }
  ];

  const materialPractices = [
    {
      title: "Low-VOC Materials",
      description: "100% of our paints and coatings are low or zero-VOC, improving indoor air quality and reducing environmental impact.",
      items: [
        "Benjamin Moore Natura® zero-VOC paints",
        "Low-odor, eco-friendly stucco systems",
        "Water-based sealants and adhesives"
      ]
    },
    {
      title: "Local Sourcing",
      description: "We prioritize suppliers within the GTA, reducing transportation emissions and supporting local businesses.",
      items: [
        "Ontario-based paint distributors",
        "Local masonry and stucco suppliers",
        "GTA metal cladding fabricators"
      ]
    }
  ];

  const certifications = [
    {
      icon: Award,
      title: "Green Seal Certified",
      description: "Using products that meet rigorous environmental standards"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Partner",
      description: "Certified by leading environmental organizations"
    },
    {
      icon: CheckCircle2,
      title: "WSIB Certified",
      description: "Full compliance with safety and environmental regulations"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Sustainability - Building a Greener GTA"
        description="Ascen Group Construction leads the painting and finishing industry with eco-friendly practices, low-VOC materials, and sustainable construction methods across the Greater Toronto Area."
        keywords="sustainable painting, eco-friendly construction, low-VOC paint, green building, environmental construction GTA"
      />
      <Navigation />

      <div className="bg-background">
        <PageHeader
          eyebrow="Sustainability"
          title="Building a Greener Future"
          description="Our commitment to environmental responsibility through sustainable practices and eco-friendly solutions"
          backgroundImage={heroImage}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Sustainability" }
          ]}
          variant="standard"
        />
      </div>
      
      <main>

        {/* Commitment Section */}
        <section className="py-16 bg-background">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">Our Sustainability Commitment</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  At Ascen Group Construction, we believe that beautifying the GTA's buildings means protecting the environment for future generations. Our commitment to sustainability isn't just a policy—it's woven into every painting, stucco, and finishing project we undertake.
                </p>
                <p>
                  From exclusively using low-VOC and zero-VOC materials to implementing comprehensive waste diversion strategies, we're dedicated to minimizing our environmental footprint. We partner with eco-certified suppliers, properly dispose of all materials, and continuously innovate our methods to reduce environmental impact.
                </p>
                <p>
                  Our goal is to achieve carbon neutrality by 2030 while maintaining the exceptional quality and craftsmanship our clients expect.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Impact by the Numbers</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 ${stat.color}`}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Material Practices */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Sustainable Material Practices</h2>
              </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {materialPractices.map((practice, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">{practice.title}</h3>
                    <p className="text-muted-foreground mb-6">{practice.description}</p>
                    <ul className="space-y-3">
                      {practice.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Carbon Offset Calculator */}
            <Card className="bg-gradient-to-br from-sustainability-light/20 to-sustainability/10 border-sustainability/30">
              <CardContent className="p-8 md:p-12">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-center">Carbon Offset Calculator</h3>
                  <p className="text-muted-foreground text-center mb-8">
                    Estimate the CO₂ offset achieved through our sustainable painting practices
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sqft">Project Size (sq ft)</Label>
                      <Input
                        id="sqft"
                        type="number"
                        placeholder="Enter square footage"
                        value={sqft}
                        onChange={handleSqftChange}
                        className="mt-2"
                      />
                    </div>
                    
                    {co2Offset > 0 && (
                      <div className="bg-white p-6 rounded-lg text-center animate-fade-in">
                        <div className="text-sm text-muted-foreground mb-2">Estimated CO₂ Offset</div>
                        <div className="text-4xl font-bold text-sustainability-dark mb-2">
                          {co2Offset} kg
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Equivalent to planting {Math.ceil(co2Offset / 20)} trees annually*
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground text-center">
                      *Calculation based on industry averages for eco-friendly painting practices vs. conventional methods
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Certifications & Standards</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Committed to the highest environmental and safety standards
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {certifications.map((cert, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-sustainability-light/20 rounded-full mb-4">
                      <cert.icon className="w-8 h-8 text-sustainability-dark" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default Sustainability;
