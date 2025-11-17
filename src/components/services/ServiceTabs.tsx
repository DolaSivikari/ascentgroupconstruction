import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceVariant {
  id: string;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  process: Array<{
    step: number;
    title: string;
    description: string;
    details: string;
  }>;
  quickFacts: {
    projectTypes: string[];
    timeline: string;
    certifications: string[];
  };
}

interface ServiceTabsProps {
  variants: ServiceVariant[];
  defaultVariant?: string;
}

export const ServiceTabs = ({ variants, defaultVariant }: ServiceTabsProps) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  return (
    <Tabs defaultValue={defaultVariant || variants[0]?.id} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-auto gap-2 bg-muted/50 p-2">
        {variants.map((variant) => (
          <TabsTrigger
            key={variant.id}
            value={variant.id}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-3 text-sm md:text-base font-semibold"
          >
            {variant.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {variants.map((variant) => (
        <TabsContent key={variant.id} value={variant.id} className="mt-8 space-y-12">
          {/* Tagline & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              {variant.tagline}
            </h3>
            <p className="text-lg text-muted-foreground">
              {variant.description}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="text-xl font-bold text-foreground mb-6">Key Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variant.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-base text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div>
            <h4 className="text-xl font-bold text-foreground mb-6">Our Process</h4>
            <div className="space-y-4">
              {variant.process.map((step) => (
                <Card key={step.step} className="overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedStep(
                        expandedStep === `${variant.id}-${step.step}`
                          ? null
                          : `${variant.id}-${step.step}`
                      )
                    }
                    className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-muted/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                        {step.step}
                      </div>
                      <div>
                        <h5 className="text-base md:text-lg font-bold text-foreground">
                          {step.title}
                        </h5>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ml-4',
                        expandedStep === `${variant.id}-${step.step}` && 'rotate-180'
                      )}
                    />
                  </button>
                  {expandedStep === `${variant.id}-${step.step}` && (
                    <div className="px-4 md:px-6 pb-4 md:pb-6 animate-fade-in">
                      <div className="ml-0 md:ml-14 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm md:text-base text-muted-foreground">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Facts */}
          <Card className="bg-muted/30">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="font-bold text-foreground mb-3">Project Types</h5>
                <ul className="space-y-2">
                  {variant.quickFacts.projectTypes.map((type, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-foreground mb-3">Typical Timeline</h5>
                <p className="text-sm text-muted-foreground">{variant.quickFacts.timeline}</p>
              </div>
              <div>
                <h5 className="font-bold text-foreground mb-3">Certifications</h5>
                <ul className="space-y-2">
                  {variant.quickFacts.certifications.map((cert, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
