import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Package, Mail, CheckCircle2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const PremiumDocumentSuite = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const documents = [
    "Insurance Certificate",
    "WSIB Clearance",
    "Business License",
    "Company Profile",
    "Safety Manual",
    "References List",
    "Equipment Inventory"
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Complete Package - 3D Card Flip */}
          <div 
            className="relative h-[400px] mb-16 perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
          >
            <div className={cn(
              "relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer",
              isFlipped && "rotate-y-180"
            )}>
              {/* Front of card */}
              <Card className="absolute inset-0 backface-hidden border-2 border-primary/30 shadow-[var(--shadow-lg)] bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl mb-2">Pre-Qualification Package</CardTitle>
                  <p className="text-muted-foreground">Complete documentation suite for your RFP</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {documents.slice(0, 4).map((doc) => (
                      <div key={doc} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{doc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-lg px-6 py-2">
                      Available Upon Request
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Back of card - Request view */}
              <Card className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-primary shadow-[var(--shadow-lg)] bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="h-full flex flex-col items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {documents.map((doc, index) => (
                      <div 
                        key={doc}
                        className="flex items-center gap-2 p-3 bg-background/80 rounded-lg border border-primary/20 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">{doc}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/contact">
                    <Button size="lg" className="gap-2 shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-lg)]">
                      <Mail className="w-5 h-5" />
                      Request Document Package
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-4">
                    Documents updated monthly • Sent within 24 hours
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Individual Documents List */}
          <div>
            <h2 className="text-3xl font-bold mb-2">What's Included</h2>
            <p className="text-muted-foreground mb-8">Complete pre-qualification documentation for your RFP</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Certificate of Insurance", description: "$2M CGL - Valid Dec 2025" },
                { name: "WSIB Clearance", description: "Updated monthly" },
                { name: "Business License", description: "Current Ontario registration" },
                { name: "Company Profile", description: "Capabilities & experience" },
                { name: "Safety Manual", description: "Working toward COR certification" },
                { name: "Project References", description: "Recent completed projects" },
                { name: "Equipment Inventory", description: "Tools & equipment list" }
              ].map((doc, index) => (
                <Card 
                  key={doc.name}
                  className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8">
              <Link to="/contact">
                <Button size="lg" className="gap-2">
                  <Mail className="w-5 h-5" />
                  Request Complete Package
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                We'll send all documents within 24 hours of your request
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
