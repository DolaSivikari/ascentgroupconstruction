import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Quote, CheckCircle, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CaseStudyMetric {
  label: string;
  value: string;
  icon?: React.ElementType;
  trend?: "up" | "down" | "neutral";
}

interface Testimonial {
  quote: string;
  author: string;
  position: string;
  company?: string;
  image?: string;
}

interface RelatedProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
}

interface ProjectCaseStudyProps {
  challenge?: string;
  solution?: string;
  results?: string;
  metrics?: CaseStudyMetric[];
  testimonial?: Testimonial;
  relatedProjects?: RelatedProject[];
  keyOutcomes?: string[];
}

export const ProjectCaseStudy = ({
  challenge,
  solution,
  results,
  metrics = [],
  testimonial,
  relatedProjects = [],
  keyOutcomes = []
}: ProjectCaseStudyProps) => {
  return (
    <div className="space-y-12">
      {/* Challenge Section */}
      {challenge && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <TrendingUp className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-3xl font-bold">The Challenge</h2>
          </div>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-6">
              <div 
                className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: challenge }}
              />
            </CardContent>
          </Card>
        </section>
      )}

      {/* Solution Section */}
      {solution && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl font-bold">Our Solution</h2>
          </div>
          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-6">
              <div 
                className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: solution }}
              />
            </CardContent>
          </Card>
        </section>
      )}

      {/* Key Metrics */}
      {metrics.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Key Project Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon || CheckCircle;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {metric.label}
                    </div>
                    {metric.trend && (
                      <Badge 
                        variant={metric.trend === "up" ? "default" : "secondary"}
                        className="mt-2"
                      >
                        {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Key Outcomes */}
      {keyOutcomes.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Key Outcomes</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{outcome}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Results Section */}
      {results && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">The Results</h2>
          </div>
          <Card className="border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div 
                className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: results }}
              />
            </CardContent>
          </Card>
        </section>
      )}

      {/* Client Testimonial */}
      {testimonial && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Client Testimonial</h2>
          <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Quote className="w-12 h-12 text-accent flex-shrink-0 opacity-50" />
                <div>
                  <p className="text-xl italic text-foreground leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    {testimonial.image && (
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author}
                        className="w-16 h-16 rounded-full object-cover border-2 border-accent/30"
                      />
                    )}
                    <div>
                      <p className="font-bold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.position}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.slug}`}>
                <Card className="hover:shadow-lg transition-all group overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {project.category}
                    </Badge>
                    <h3 className="font-bold group-hover:text-primary transition-colors mb-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <span>View Project</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
