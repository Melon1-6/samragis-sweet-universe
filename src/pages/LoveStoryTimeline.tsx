
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Calendar, MapPin, Camera, Star } from 'lucide-react';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  location?: string;
  image?: string;
  icon: string;
  emotion: 'joy' | 'love' | 'excitement' | 'peace';
}

const LoveStoryTimeline: React.FC = () => {
  const { themeConfig } = useTheme();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);

  const timelineEvents: TimelineEvent[] = [
    {
      id: 1,
      date: "The Beginning",
      title: "First Hello",
      description: "The moment our eyes met and the world suddenly made sense. Everything changed in that perfect instant.",
      location: "In my heart",
      icon: "💕",
      emotion: 'love'
    },
    {
      id: 2,
      date: "Every Day Since",
      title: "Growing Closer",
      description: "Each conversation, each laugh, each shared silence has woven our hearts together more tightly.",
      icon: "🌸",
      emotion: 'joy'
    },
    {
      id: 3,
      date: "Right Now",
      title: "This Moment",
      description: "Here, in this digital space I created for you, surrounded by all my love made visible.",
      icon: "✨",
      emotion: 'excitement'
    },
    {
      id: 4,
      date: "Forever",
      title: "Our Future",
      description: "All the tomorrows we'll share, all the dreams we'll build, all the love that's yet to bloom.",
      icon: "🌟",
      emotion: 'peace'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleEvents(prev => {
        if (prev.length < timelineEvents.length) {
          return [...prev, prev.length + 1];
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const emotionColors = {
    joy: '#FFD700',
    love: '#FF69B4',
    excitement: '#FF6B6B',
    peace: '#87CEEB'
  };

  return (
    <div className="min-h-screen pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
            }}
          >
            Our Love Story
          </h1>
          <p className="text-xl opacity-80">A timeline of our beautiful journey together 💕</p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${themeConfig.primary}, ${themeConfig.secondary})`,
              height: `${timelineEvents.length * 300}px`
            }}
          />

          {timelineEvents.map((event, index) => (
            <div
              key={event.id}
              className={`relative mb-12 transition-all duration-1000 ${
                visibleEvents.includes(event.id) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                animationDelay: `${index * 0.5}s`
              }}
            >
              <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Content */}
                <div className="w-1/2 p-6">
                  <div 
                    className="glass-card p-6 cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => setSelectedEvent(event.id)}
                    style={{
                      borderLeft: `4px solid ${emotionColors[event.emotion]}`
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{event.icon}</span>
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                    </div>
                    <p className="text-sm opacity-80 mb-2">{event.date}</p>
                    {event.location && (
                      <div className="flex items-center text-sm opacity-70 mb-3">
                        <MapPin size={14} className="mr-1" />
                        {event.location}
                      </div>
                    )}
                    <p className="leading-relaxed">{event.description}</p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div 
                    className="w-6 h-6 rounded-full border-4 border-white shadow-lg"
                    style={{
                      backgroundColor: emotionColors[event.emotion],
                      boxShadow: `0 0 20px ${emotionColors[event.emotion]}50`
                    }}
                  />
                </div>

                {/* Empty space for alternating layout */}
                <div className="w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Hearts */}
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                fontSize: Math.random() * 10 + 15 + 'px',
                color: themeConfig.primary,
                opacity: 0.3
              }}
            >
              💕
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoveStoryTimeline;
