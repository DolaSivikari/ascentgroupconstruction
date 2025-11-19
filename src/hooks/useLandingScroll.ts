import { useState, useEffect } from 'react';

export const useLandingScroll = (sectionsCount: number) => {
  const [activeSection, setActiveSection] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentSection = Math.floor(scrollPosition / windowHeight);
      
      setActiveSection(Math.min(currentSection, sectionsCount - 1));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionsCount]);
  
  const scrollToSection = (index: number) => {
    const targetPosition = index * window.innerHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };
  
  return { activeSection, scrollToSection };
};
