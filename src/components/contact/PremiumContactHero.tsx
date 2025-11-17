import { MapPin, Phone, Mail, Clock, HardHat, Ruler, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContactInfo {
  officeAddress: string;
  mainPhone: string;
  tollFreePhone: string;
  generalEmail: string;
  projectsEmail: string;
  careersEmail: string;
  weekdayHours: string;
  saturdayHours: string;
  sundayHours: string;
}

interface Props {
  contactInfo: ContactInfo;
  loading?: boolean;
}

export const PremiumContactHero = ({ contactInfo, loading }: Props) => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <Badge className="mb-4 text-sm px-4 py-1">Available 24/7</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Let's Start Building <span className="text-primary">Together</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your project? Our team responds within 2 hours during business hours.
          </p>
        </div>

        {/* Floating contact cards with glass morphism */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-card/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Head Office</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {contactInfo.officeAddress}
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-card/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Phone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href={`tel:${contactInfo.mainPhone}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                <span className="font-medium">Main:</span> {contactInfo.mainPhone}
              </a>
              <a href={`tel:${contactInfo.tollFreePhone}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                <span className="font-medium">Toll Free:</span> {contactInfo.tollFreePhone}
              </a>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-card/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href={`mailto:${contactInfo.generalEmail}`} className="block text-xs text-muted-foreground hover:text-primary transition-colors break-all">
                <span className="font-medium">General:</span> {contactInfo.generalEmail}
              </a>
              <a href={`mailto:${contactInfo.projectsEmail}`} className="block text-xs text-muted-foreground hover:text-primary transition-colors break-all">
                <span className="font-medium">Projects:</span> {contactInfo.projectsEmail}
              </a>
              <a href={`mailto:${contactInfo.careersEmail}`} className="block text-xs text-muted-foreground hover:text-primary transition-colors break-all">
                <span className="font-medium">Careers:</span> {contactInfo.careersEmail}
              </a>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-2 hover:border-secondary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br from-secondary/5 to-transparent backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium text-foreground">{contactInfo.weekdayHours}</p>
              <p className="text-muted-foreground">{contactInfo.saturdayHours}</p>
              <p className="text-muted-foreground">{contactInfo.sundayHours}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
