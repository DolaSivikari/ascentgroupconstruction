import { useState } from "react";
import { Play, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  thumbnail: string;
  videoUrl: string;
  quote: string;
  rating: number;
  projectType: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Smith",
    company: "ABC Property Management",
    role: "Property Manager",
    thumbnail: "/placeholder-video-thumb.jpg",
    videoUrl: "#", // Replace with actual video URL
    quote: "Ascent Group delivered exceptional results on our facade restoration project.",
    rating: 5,
    projectType: "Facade Restoration",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "XYZ Development",
    role: "Project Director",
    thumbnail: "/placeholder-video-thumb.jpg",
    videoUrl: "#", // Replace with actual video URL
    quote: "Professional, reliable, and committed to quality. Highly recommended!",
    rating: 5,
    projectType: "New Construction",
  },
  {
    id: 3,
    name: "Michael Chen",
    company: "Metro Condos",
    role: "Board President",
    thumbnail: "/placeholder-video-thumb.jpg",
    videoUrl: "#", // Replace with actual video URL
    quote: "Their attention to detail and communication was outstanding throughout the project.",
    rating: 5,
    projectType: "Parking Garage Restoration",
  },
];

export const VideoTestimonials = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [selectedVideo, setSelectedVideo] = useState<Testimonial | null>(null);

  return (
    <>
      <section
        ref={ref}
        className={cn(
          "py-16 bg-background",
          "transition-all duration-700",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Hear From Our Clients
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from real clients about their experience working with Ascent Group
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <button
                key={testimonial.id}
                onClick={() => setSelectedVideo(testimonial)}
                className={cn(
                  "group relative overflow-hidden rounded-lg",
                  "bg-background border border-border/50",
                  "transition-all duration-300",
                  "hover:border-construction-orange/50 hover:shadow-lg hover:shadow-construction-orange/10",
                  "text-left"
                )}
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-construction-orange/20 to-construction-orange/5 overflow-hidden">
                  {/* Placeholder - replace with actual thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-background/50 to-background/80 flex items-center justify-center">
                      <Play className="w-16 h-16 text-construction-orange" />
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                    <div className="w-16 h-16 rounded-full bg-construction-orange flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>

                  {/* Project Type Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-background/90 backdrop-blur-sm text-xs font-medium">
                    {testimonial.projectType}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-construction-orange text-construction-orange" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-4">
                    <Quote className="absolute -left-1 -top-1 w-6 h-6 text-construction-orange/20" />
                    <p className="text-sm text-muted-foreground pl-6 line-clamp-2">
                      {testimonial.quote}
                    </p>
                  </div>

                  {/* Author */}
                  <div className="border-t border-border/50 pt-4">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-[800px] p-0">
          {selectedVideo && (
            <div>
              <div className="aspect-video bg-black">
                {/* Replace with actual video player */}
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play className="w-20 h-20 mx-auto mb-4" />
                    <p>Video player would go here</p>
                    <p className="text-sm text-gray-400 mt-2">{selectedVideo.videoUrl}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(selectedVideo.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-construction-orange text-construction-orange" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{selectedVideo.quote}</p>
                <div>
                  <div className="font-semibold text-foreground">{selectedVideo.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedVideo.role}, {selectedVideo.company}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
