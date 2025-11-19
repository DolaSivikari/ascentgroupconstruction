import { useState, useEffect } from 'react';
import lightBg from '@/assets/landing-bg-light.png';
import darkBg from '@/assets/landing-bg-dark.png';

export const RotatingBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const backgrounds = [lightBg, darkBg];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div className="absolute inset-0 w-full h-full">
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${bg})`,
            opacity: currentIndex === index ? 1 : 0,
            zIndex: 0,
          }}
        />
      ))}
    </div>
  );
};
