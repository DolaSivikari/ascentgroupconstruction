import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import SEO from "./SEO";
import { reviewSchema } from "@/utils/structured-data";
import { supabase } from "@/integrations/supabase/client";
import { calculateISODate, inferServiceFromReview, getConsistentAggregateRating } from "@/utils/review-helpers";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useCarousel } from "@/hooks/useCarousel";
import { Button } from "@/ui/Button";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });
  const aggregateRating = getConsistentAggregateRating();
  const averageRating = parseFloat(aggregateRating.ratingValue);
  const totalReviews = parseInt(aggregateRating.reviewCount);

  const carousel = useCarousel({ 
    totalItems: testimonials.length, 
    autoplayInterval: 5000,
    itemsPerView: 1
  });

  // Google Reviews - Removed fake testimonials for legal compliance
  const googleReviews: any[] = [];

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('publish_state', 'published')
        .eq('is_featured', true)
        .order('display_order')
        .limit(3);
      
      if (data) {
        const formattedData = data.map(t => ({
          quote: t.quote,
          author: t.author_name,
          position: t.author_position,
          company: t.company_name,
          rating: Number(t.rating),
          date: t.date_published,
          project: t.project_name
        }));
        setTestimonials(formattedData);
      }
    };

    fetchTestimonials();
  }, []);

  // Generate review schemas only for verified testimonials
  const testimonialSchemas = testimonials.map(t => 
    reviewSchema({
      author: t.author,
      reviewRating: t.rating,
      reviewBody: t.quote,
      datePublished: t.date,
      itemReviewed: {
        name: t.project,
        type: "Service"
      },
      publisher: {
        name: t.company,
        type: "Organization"
      }
    })
  );

  return (
    <>
      <SEO structuredData={testimonialSchemas} />
      <section ref={sectionRef} className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          
          {/* Section Header */}
          <div className="max-w-3xl mb-8 text-center mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Client Testimonials
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We're currently collecting verified client testimonials. Check back soon to hear about our clients' experiences.
            </p>
          </div>

          {/* Featured Client Stories - Carousel */}
          {testimonials.length > 0 && (
            <div className="border-t border-border pt-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl md:text-3xl font-bold">
                  Featured Client Stories
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={carousel.prev}
                    disabled={!carousel.canGoPrev}
                    className="h-10 w-10"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={carousel.next}
                    disabled={!carousel.canGoNext}
                    className="h-10 w-10"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${carousel.currentIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial) => {
                    const fullStars = Math.floor(testimonial.rating);
                    
                    return (
                      <div key={testimonial.author} className="w-full flex-shrink-0 px-2">
                        <Card className="relative border-border hover:[box-shadow:var(--shadow-card-elevated)] card-hover max-w-4xl mx-auto">
                          <CardContent className="p-6">
                            
                            {/* Quote Icon */}
                            <div className="mb-4">
                              <div className="w-12 h-12 rounded-lg bg-steel-blue/10 flex items-center justify-center">
                                <Quote className="h-6 w-6 text-steel-blue" />
                              </div>
                            </div>

                            {/* Star Rating */}
                            <div className="flex mb-4">
                              {[...Array(fullStars)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-steel-blue text-steel-blue" />
                              ))}
                            </div>

                            {/* Quote Text */}
                            <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed">
                              "{testimonial.quote}"
                            </p>

                            {/* Author Info */}
                            <div className="pt-6 border-t border-border">
                              <p className="font-bold text-foreground mb-1 text-lg">
                                {testimonial.author}
                              </p>
                              <p className="text-sm text-muted-foreground mb-2">
                                {testimonial.position}
                              </p>
                              <p className="text-sm font-semibold text-steel-blue">
                                {testimonial.company}
                              </p>
                              {testimonial.project && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Project: {testimonial.project}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dots Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => carousel.goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === carousel.currentIndex 
                        ? 'w-8 bg-steel-blue' 
                        : 'w-2 bg-border hover:bg-muted-foreground'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default Testimonials;
