
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
  }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newElement = {
        id: Date.now(),
        symbol: themeConfig.particles[Math.floor(Math.random() * themeConfig.particles.length)],
        x: Math.random() * 100,
        y: 100,
        size: Math.random() * 20 + 15,
        duration: Math.random() * 5 + 8
      };
      
      setElements(prev => [...prev.slice(-10), newElement]);
    }, 2000);

    return () => clearInterval(interval);
  }, [themeConfig.particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {elements.map(element => (
        <div
          key={element.id}
          className="absolute animate-float-up opacity-70"
          style={{
            left: `${element.x}%`,
            bottom: '-50px',
            fontSize: `${element.size}px`,
            animationDuration: `${element.duration}s`,
            animationDelay: '0s'
          }}
        >
          {element.symbol}
        </div>
      ))}
      
      {/* Sparkles */}
      <div className="stars-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              color: themeConfig.accent
            }}
          >
            ✨
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingElements;
