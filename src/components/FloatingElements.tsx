
import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const FloatingElements: React.FC = () => {
  const { themeConfig } = useTheme();
  const [elements, setElements] = useState<Array<{
    id: number;
    symbol: string;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newElement = {
        id: Date.now() + Math.random(),
        symbol: themeConfig.particles[Math.floor(Math.random() * themeConfig.particles.length)],
        x: Math.random() * 100,
        y: 100,
        size: Math.random() * 20 + 15,
        duration: Math.random() * 5 + 8,
        delay: Math.random() * 2
      };
      
      setElements(prev => [...prev.slice(-15), newElement]);
    }, 1500);

    return () => clearInterval(interval);
  }, [themeConfig.particles]);

  // Interactive flower petals on mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() < 0.02) { // 2% chance on mouse move
        const petal = {
          id: Date.now() + Math.random(),
          symbol: '🌸',
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
          size: Math.random() * 15 + 10,
          duration: 3,
          delay: 0
        };
        
        setElements(prev => [...prev.slice(-20), petal]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map(element => (
        <div
          key={element.id}
          className="absolute animate-float-up opacity-70"
          style={{
            left: `${element.x}%`,
            bottom: '-50px',
            fontSize: `${element.size}px`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`
          }}
        >
          {element.symbol}
        </div>
      ))}
      
      {/* Enhanced Sparkles with better positioning */}
      <div className="stars-container">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: (Math.random() * 2 + 2) + 's',
              color: themeConfig.accent,
              fontSize: Math.random() * 8 + 12 + 'px'
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Floating hearts that respond to scroll */}
      <div className="love-hearts">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute animate-pulse"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 4 + 's',
              animationDuration: (Math.random() * 3 + 2) + 's',
              color: themeConfig.primary,
              fontSize: Math.random() * 12 + 16 + 'px',
              opacity: 0.6
            }}
          >
            💕
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingElements;
