import { Link } from "react-router-dom";
import { useServicePromotions } from "@/hooks/useFeaturedServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { Section } from "@/components/sections/Section";
import { ArrowRight, Percent } from "lucide-react";

export const ServicePromotionsSection = () => {
  const { data: promotions, isLoading } = useServicePromotions();

  // Don't render if no promotions or still loading
  if (isLoading || !promotions || promotions.length === 0) {
    return null;
  }

  return (
    <Section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Offers</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Take advantage of our current promotions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion, index) => (
          <Card 
            key={promotion.id} 
            className="h-full hover:shadow-lg transition-all duration-200 ease-out hover:-translate-y-0.5 border-primary/20 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-xl">{promotion.title}</CardTitle>
                {promotion.badge_text && (
                  <Badge 
                    variant="default"
                    className="ml-2"
                    style={{
                      backgroundColor: promotion.badge_color || 'hsl(var(--primary))',
                      color: 'white'
                    }}
                  >
                    {promotion.badge_text}
                  </Badge>
                )}
              </div>
              {promotion.discount_percentage && (
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <Percent className="w-6 h-6" />
                  <span>{promotion.discount_percentage}% OFF</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {promotion.promotion_message && (
                <p className="text-muted-foreground">{promotion.promotion_message}</p>
              )}
              <Button asChild className="w-full group">
                <Link to={promotion.service_link}>
                  View Service
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};
