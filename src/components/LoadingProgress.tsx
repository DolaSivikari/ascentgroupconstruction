import { useEffect, useState } from "react";

interface LoadingProgressProps {
  isLoading: boolean;
  duration?: number; // Duration in ms for the progress animation
}

/**
 * Loading progress indicator
 * Shows a smooth progress bar at the top of the page during initial load
 */
export const LoadingProgress = ({ isLoading, duration = 2000 }: LoadingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setProgress(0);

      // Simulate progress with easing
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min((elapsed / duration) * 100, 95); // Cap at 95% until actually loaded
        
        setProgress(percentage);

        if (percentage >= 95) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      // Complete the progress bar
      setProgress(100);
      
      // Hide after a short delay
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isLoading, duration]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div 
        className="h-full bg-gradient-to-r from-primary via-primary-glow to-accent transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
