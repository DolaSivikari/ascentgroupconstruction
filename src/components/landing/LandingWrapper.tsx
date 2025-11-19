import { useState } from 'react';
import { LandingGateway } from '@/pages/LandingGateway';
import Index from '@/pages/Index';
import { cn } from '@/lib/utils';

export const LandingWrapper = () => {
  const [showLanding, setShowLanding] = useState(() => {
    // Check if user has entered site this session
    return !sessionStorage.getItem('landing-completed');
  });

  const handleEnterSite = () => {
    // Mark landing as completed for this session
    sessionStorage.setItem('landing-completed', 'true');
    
    // Smooth fade transition
    setShowLanding(false);
    
    // Scroll to top after transition
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }, 100);
  };

  return (
    <div className="relative">
      {/* Landing page with fade-out transition */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-background transition-opacity duration-1000",
          !showLanding && "opacity-0 pointer-events-none"
        )}
      >
        {showLanding && <LandingGateway onEnter={handleEnterSite} />}
      </div>
      
      {/* Homepage - hidden behind landing initially */}
      <div 
        className={cn(
          "transition-opacity duration-1000",
          showLanding && "opacity-0"
        )}
      >
        <Index />
      </div>
    </div>
  );
};
