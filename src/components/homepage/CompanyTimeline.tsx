import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useRef } from "react";
import { CheckCircle } from "lucide-react";

const milestones = [
  {
    year: "2009",
    title: "Company Founded",
    description: "Ascent Group Construction established with a focus on quality general contracting and construction management services in the GTA"
  },
  {
    year: "2012",
    title: "First $1M+ Project",
    description: "Completed our first major commercial project, a 20-story condo tower exterior restoration in downtown Toronto"
  },
  {
    year: "2015",
    title: "Commercial Expansion",
    description: "Expanded services to include specialized building envelope systems, restoration, and self-performed specialty trades across Ontario"
  },
  {
    year: "2018",
    title: "500 Projects Milestone",
    description: "Reached 500 successfully completed projects with 98% client satisfaction rate"
  },
  {
    year: "2020",
    title: "Safety Excellence",
    description: "Achieved OSHA Safety Excellence certification and maintained zero lost-time incident record"
  },
  {
    year: "2022",
    title: "Sustainability Leadership",
    description: "Launched green construction initiatives and became certified in low-VOC and eco-friendly application methods"
  },
  {
    year: "2025",
    title: "Industry Recognition",
    description: "Named as one of the top construction contractors in the GTA, serving 1,000+ satisfied clients"
  }
];

const CompanyTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            15+ years of consistent growth, innovation, and excellence in construction services
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 left-1/2 -translate-x-1/2" />

            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative mb-12 transition-all duration-700 ${
                  isVisible 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`flex items-start gap-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  {/* Content */}
                  <div className={`flex-1 ${
                    index % 2 === 0 ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block ${
                      index % 2 === 0 ? 'mr-0' : 'ml-0'
                    }`}>
                      <div className="bg-card border-2 border-primary/20 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-4 border-background shadow-lg">
                      <CheckCircle className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyTimeline;
