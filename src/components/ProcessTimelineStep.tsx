import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import OptimizedImage from "@/components/OptimizedImage";

interface ProcessTimelineStepProps {
  step: number;
  title: string;
  duration: string;
  description: string;
  details: string[];
  deliverables: string[];
  image?: string;
}

const ProcessTimelineStep = ({
  step,
  title,
  duration,
  description,
  details,
  deliverables,
  image,
}: ProcessTimelineStepProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-8 pb-8 border-l-2 border-primary/20 last:border-transparent last:pb-0">
      {/* Timeline dot */}
      <div className="absolute -left-[13px] top-0 h-6 w-6 rounded-full bg-primary border-4 border-background shadow-lg" />
      
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                {step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-1">{title}</h3>
                {duration && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>

          {/* Image */}
          {image && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <OptimizedImage
                src={image}
                alt={title}
                width={800}
                height={400}
                className="w-full"
              />
            </div>
          )}

          {/* Expandable Details */}
          {(details?.length > 0 || deliverables?.length > 0) && (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full justify-between hover:bg-muted/50"
              >
                <span className="font-medium">
                  {isExpanded ? "Show Less" : "Show More Details"}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </Button>

              {isExpanded && (
                <div className="mt-4 space-y-6 pt-4 border-t">
                  {details && details.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        What We Do
                      </h4>
                      <ul className="space-y-2">
                        {details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {deliverables && deliverables.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        What You Get
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {deliverables.map((item, idx) => (
                  <Badge key={idx} variant="success" size="sm">
                    {item}
                  </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessTimelineStep;
