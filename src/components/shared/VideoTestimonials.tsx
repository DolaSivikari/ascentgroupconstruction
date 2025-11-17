import { useState } from "react";
import { Play, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface VideoTestimonial {
  name: string;
  company: string;
  role: string;
  thumbnail: string;
  videoUrl: string;
  quote: string;
}

interface VideoTestimonialsProps {
  testimonials?: VideoTestimonial[];
  className?: string;
}

// Removed fake testimonials for legal compliance - only show verified testimonials
const defaultTestimonials: VideoTestimonial[] = [];

export const VideoTestimonials = ({
  testimonials = defaultTestimonials,
  className
}: VideoTestimonialsProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);

  return (
    <>
      <div className={cn("grid md:grid-cols-3 gap-6", className)}>
        {testimonials.map((testimonial, index) => (
          <button
            key={index}
            onClick={() => setSelectedVideo(testimonial)}
            className="text-left group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-xl">
              <div className="relative aspect-video bg-muted">
                <img
                  src={testimonial.thumbnail}
                  alt={testimonial.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex gap-2 mb-3">
                  <Quote className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground line-clamp-2 italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="border-t pt-3">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-primary font-medium">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">
            {selectedVideo?.name} - Video Testimonial
          </DialogTitle>
          {selectedVideo && (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              >
                Your browser does not support video playback.
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
