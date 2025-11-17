import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Shield, Award, CheckCircle, FileCheck } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  issued_by: string | null;
  display_order: number;
}

const iconMap: Record<string, any> = {
  Shield,
  Award,
  CheckCircle,
  FileCheck,
};

const CertificationsBar = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);

  useEffect(() => {
    const fetchCertifications = async () => {
      const { data } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (data) {
        setCertifications(data);
      }
    };

    fetchCertifications();
  }, []);

  const getIcon = (index: number) => {
    const icons = [Shield, Award, CheckCircle, FileCheck];
    return icons[index % icons.length];
  };

  return (
    <section ref={sectionRef} className="py-16 bg-background border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            Certifications & Affiliations
          </h2>
          <p className="text-muted-foreground">
            Industry credentials that demonstrate our commitment to quality and safety
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, index) => {
            const Icon = getIcon(index);
            return (
              <div
                key={cert.id}
                className={`flex flex-col items-center text-center p-6 rounded-lg border border-border/50 bg-card hover:shadow-md transition-all duration-300 group ${
                  isVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-sm mb-2 text-foreground">
                  {cert.name}
                </h3>
                {cert.issued_by && (
                  <p className="text-xs text-muted-foreground">
                    {cert.issued_by}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificationsBar;
