import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/ui/Button";
import { cn } from "@/lib/utils";

interface VideoBackgroundProps {
  videoUrl: string;
  posterUrl?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
  showControls?: boolean;
}

export const VideoBackground = ({
  videoUrl,
  posterUrl,
  overlay = true,
  overlayOpacity = 0.6,
  children,
  className,
  showControls = true
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={posterUrl}
      >
        {/* Adaptive sources — browser picks the first it supports.
            WebM is ~30-40% smaller than the equivalent MP4 on supporting browsers.
            Drop a public/<name>.webm next to your MP4 and this will pick it up automatically. */}
        <source src={videoUrl.replace(/\.mp4$/i, '.webm')} type="video/webm" />
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support video backgrounds.
      </video>

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Video Controls */}
      {showControls && (
        <div className="absolute bottom-6 right-6 flex gap-2 z-20 animate-fade-in">
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlay}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleMute}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
