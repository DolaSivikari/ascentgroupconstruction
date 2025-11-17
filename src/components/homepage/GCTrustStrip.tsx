import { DollarSign, Building2, Award, Shield, TrendingUp } from "lucide-react";

const trustMetrics = [
  {
    value: "$30M+",
    label: "Projects Delivered",
    icon: DollarSign,
  },
  {
    value: "500+",
    label: "Buildings Completed",
    icon: Building2,
  },
  {
    value: "15+",
    label: "Years of Excellence",
    icon: Award,
  },
  {
    value: "$5M",
    label: "Bonding Capacity",
    icon: TrendingUp,
  },
  {
    value: "98%",
    label: "On-Time Completion",
    icon: Shield,
  },
];

const GCTrustStrip = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {trustMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-2 scroll-reveal"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications Badge Row */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-8 border-t border-primary/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-semibold">WSIB Certified</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-semibold">$5M Liability Coverage</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-semibold">COR Safety Certified</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-semibold">OGCA Member</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GCTrustStrip;
