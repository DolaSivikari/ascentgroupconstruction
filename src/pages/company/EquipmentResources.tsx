import { Truck, Wrench, HardHat, Building2, Zap, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import heroEquipmentImage from "@/assets/heroes/hero-equipment.jpg";
import { Link } from "react-router-dom";

const EquipmentResources = () => {
  const capacityStats = [
    { label: "Fleet Size", value: "25+", icon: Truck },
    { label: "Spray Equipment", value: "15", icon: Wrench },
    { label: "Lift Capacity", value: "80ft", icon: HardHat },
    { label: "Concurrent Projects", value: "15+", icon: Building2 },
  ];

  const vehicles = [
    { name: "Heavy-duty work trucks", quantity: 10, description: "Fully equipped with tool storage and equipment racks" },
    { name: "Cargo vans", quantity: 8, description: "Climate-controlled for material transport" },
    { name: "Equipment trailers", quantity: 5, description: "Heavy-duty trailers for large equipment" },
    { name: "Flatbed trucks", quantity: 2, description: "For scaffolding and bulk material delivery" },
  ];

  const paintingEquipment = [
    { name: "Airless spray systems (Graco, Titan)", quantity: 10, description: "Commercial-grade high-pressure systems" },
    { name: "HVLP spray guns", quantity: 15, description: "Fine finish applications" },
    { name: "Backpack sprayers", quantity: 8, description: "Mobility for large areas" },
    { name: "Electrostatic sprayers", quantity: 4, description: "Advanced coating technology" },
    { name: "Paint mixing stations", quantity: 3, description: "Computerized color matching" },
  ];

  const accessEquipment = [
    { name: "Boom lifts (40ft, 60ft, 80ft)", quantity: 6, description: "Articulating and telescopic models" },
    { name: "Scissor lifts (various heights)", quantity: 8, description: "Indoor and rough-terrain models" },
    { name: "Scaffolding systems", quantity: "Extensive", description: "Modular systems for any configuration" },
    { name: "Swing stages", quantity: 4, description: "For high-rise building access" },
    { name: "Safety equipment", quantity: "Full stock", description: "Harnesses, lanyards, and fall protection" },
  ];

  const specialtyTools = [
    { name: "Concrete grinders & polishers", quantity: 5, description: "Surface preparation and finishing" },
    { name: "Tile saws & cutting equipment", quantity: 8, description: "Precision cutting for all materials" },
    { name: "Dustless sanders", quantity: 12, description: "HEPA filtration for clean worksite" },
    { name: "Power washers (hot & cold)", quantity: 6, description: "Commercial-grade cleaning systems" },
    { name: "Dehumidifiers & air movers", quantity: 10, description: "Climate control and drying" },
  ];

  const technology = [
    { name: "Procore Construction Management", description: "Project management and documentation" },
    { name: "Autodesk Construction Cloud", description: "Design coordination and collaboration" },
    { name: "Bluebeam", description: "Document management and markup" },
    { name: "BIM 360", description: "3D coordination and clash detection" },
    { name: "GPS Fleet Tracking", description: "Real-time equipment and vehicle tracking" },
  ];

  const partners = [
    { name: "Benjamin Moore", role: "Authorized Dealer" },
    { name: "Sherwin-Williams", role: "ProPartner" },
    { name: "Parex", role: "EIFS Systems" },
    { name: "Sto Corp", role: "Stucco & EIFS" },
  ];

  return (
    <>
      <SEO 
        title="Equipment & Resources | Ascent Group Construction"
        description="Industrial-grade equipment fleet including 25+ vehicles, commercial spray systems, boom lifts up to 80ft, and advanced construction technology."
        keywords="construction equipment, fleet, spray equipment, boom lifts, construction technology, resources"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <PageHeader
          title="Equipment & Resources"
          description="Industrial-Grade Tools for Projects of Any Scale"
          backgroundImage={heroEquipmentImage}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Company" },
            { label: "Equipment & Resources" }
          ]}
        />

        <main id="main-content" className="container mx-auto px-4 py-12 space-y-16">
          {/* Capacity Highlights */}
          <section>
            <div className="grid md:grid-cols-4 gap-6">
              {capacityStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <Icon className="h-10 w-10 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Equipment Inventory Tabs */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">Equipment Inventory</h2>
            <Tabs defaultValue="vehicles" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                <TabsTrigger value="vehicles" className="py-3">
                  <Truck className="h-4 w-4 mr-2" />
                  Vehicles
                </TabsTrigger>
                <TabsTrigger value="painting" className="py-3">
                  <Wrench className="h-4 w-4 mr-2" />
                  Painting
                </TabsTrigger>
                <TabsTrigger value="access" className="py-3">
                  <HardHat className="h-4 w-4 mr-2" />
                  Access
                </TabsTrigger>
                <TabsTrigger value="specialty" className="py-3">
                  <Building2 className="h-4 w-4 mr-2" />
                  Specialty
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vehicles" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {vehicles.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <span className="text-primary font-bold">{item.quantity}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="painting" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {paintingEquipment.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <span className="text-primary font-bold">{item.quantity}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="access" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {accessEquipment.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <span className="text-primary font-bold">{item.quantity}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="specialty" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {specialtyTools.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <span className="text-primary font-bold">{item.quantity}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* Technology & Software */}
          <section className="bg-muted/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Technology & Software</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technology.map((tech, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{tech.name}</h3>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Material Partnerships */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">Material Partnerships</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{partner.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Subcontractor Network */}
          <section className="bg-muted/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Subcontractor Network</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Vetted network of 50+ specialized subcontractors for comprehensive project delivery
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="font-semibold text-foreground">Electrical Contractors</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="font-semibold text-foreground">Plumbing Specialists</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="font-semibold text-foreground">HVAC Partners</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="font-semibold text-foreground">Structural Engineers</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Equipment Maintenance */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">Equipment Maintenance</h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <HardHat className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Regular Maintenance</h3>
                    <p className="text-sm text-muted-foreground">Scheduled preventive maintenance on all equipment</p>
                  </div>
                  <div>
                    <Wrench className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Safety Inspections</h3>
                    <p className="text-sm text-muted-foreground">Monthly safety checks and compliance verification</p>
                  </div>
                  <div>
                    <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Certifications</h3>
                    <p className="text-sm text-muted-foreground">All equipment professionally maintained and certified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section className="text-center py-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Have Equipment Questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact us to discuss your project equipment needs and how our resources can support your timeline.
            </p>
              <Button size="lg" asChild>
                <Link to="/contact">Contact Our Team</Link>
              </Button>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default EquipmentResources;
