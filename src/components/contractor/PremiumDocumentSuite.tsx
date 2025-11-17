import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Download, CheckCircle2, FileText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export const PremiumDocumentSuite = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const documents = [
    "Insurance Certificate",
    "WSIB Clearance",
    "Bonding Letter",
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
              "relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer",
              isFlipped && "rotate-y-180"
            )}>
              {/* Front of card */}
              <Card className="absolute inset-0 backface-hidden border-2 border-primary/30 shadow-2xl bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl mb-2">Premium Contractor Package</CardTitle>
                  <p className="text-muted-foreground">Everything you need in one comprehensive suite</p>
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
                      ZIP File • ~15MB
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Back of card - Exploding view */}
              <Card className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-primary shadow-2xl bg-gradient-to-br from-primary/10 to-primary/5">
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
                  <Button size="lg" className="gap-2 shadow-xl hover:shadow-2xl">
                    <Download className="w-5 h-5" />
                    Download Complete Package
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Updated monthly • Valid through 2025
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Individual Documents Grid */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Individual Documents</h2>
            <p className="text-muted-foreground mb-8">Download specific documents as needed</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Certificate of Insurance", size: "2MB", expiry: "Valid until Dec 2025" },
                { name: "WSIB Clearance", size: "1MB", expiry: "Updated monthly" },
                { name: "Bonding Letter", size: "500KB", expiry: "$10M capacity" },
                { name: "Business License", size: "1MB", expiry: "Valid 2025" },
                { name: "Company Profile", size: "5MB", expiry: "2024 Edition" },
                { name: "Safety Manual", size: "3MB", expiry: "COR Certified" },
                { name: "Project References", size: "2MB", expiry: "Current clients" },
                { name: "Equipment List", size: "2MB", expiry: "Updated 2024" }
              ].map((doc, index) => (
                <Card 
                  key={doc.name}
                  className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.expiry}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.size}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1 gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
