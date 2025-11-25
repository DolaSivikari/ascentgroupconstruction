import { partnershipModels } from "@/data/partnership-models";
import { PartnershipModelDetail } from "./PartnershipModelDetail";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const PartnershipModelsSection = () => {
  return (
    <section id="partnership-models" className="scroll-mt-24 mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How We Partner With You
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We adapt our role to match your project structure. Whether you need a prime contractor, a specialty trade partner, 
          or consultant-aligned execution, we deliver the same quality and accountability.
        </p>
      </div>

      <div className="space-y-8">
        {partnershipModels.map((model, index) => (
          <ScrollReveal key={model.id} direction="up" delay={index * 100}>
            <PartnershipModelDetail model={model} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
