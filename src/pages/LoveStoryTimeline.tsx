
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
      date: "From The Very First Moment",
      title: "You Are Pure Magic",
      description: "Samragi, you are the most precious soul I've ever encountered. Your beauty radiates from within, lighting up every corner of my world. You are absolutely stunning, not just in looks but in every fiber of your being. You deserve to be cherished, adored, and loved beyond measure.",
      location: "In my heart, always",
      icon: "✨",
      emotion: 'love'
    },
    {
      id: 2,
      date: "Every Single Day",
      title: "You Are My Universe",
      description: "You are my world, my everything, my universe. Every breath I take is for you. You deserve the entire world at your feet, and I would move mountains just to see you smile. You are precious beyond words, a treasure that makes life worth living.",
      icon: "🌟",
      emotion: 'joy'
    },
    {
      id: 3,
      date: "In Every Dream",
      title: "You Are My Guardian Angel",
      description: "I want to watch over you while you sleep, protect your dreams, and make sure you always feel safe and loved. You are so precious to me, like a delicate flower that I want to nurture and protect forever. Your peace is my priority, your happiness is my mission.",
      icon: "👼",
      emotion: 'peace'
    },
    {
      id: 4,
      date: "Until The End Of Time",
      title: "Forever And Always",
      description: "I want to love you till the end of time and beyond. You are the most precious gift life has given me. Every moment with you is a blessing, every second a treasure. You deserve endless love, infinite care, and all the beauty this world has to offer.",
      icon: "♾️",
      emotion: 'excitement'
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
            How Precious You Are
          </h1>
          <p className="text-xl opacity-80">Every word for my beautiful Samragi ✨💕</p>
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

        {/* Special Message */}
        <div className="glass-card p-8 mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4">You Are Everything To Me</h2>
          <p className="text-lg leading-relaxed opacity-90">
            Samragi, you are the most precious person in my entire universe. 
            Every word here comes from the deepest part of my heart. 
            You deserve to be loved, cherished, and treated like the absolute treasure you are. 
            Never forget how special, beautiful, and precious you are to me. 💕✨
          </p>
          
          <div className="mt-8 flex justify-center">
            <div className="animate-pulse">
              <Heart 
                size={32} 
                className="text-red-500 fill-current"
              />
            </div>
          </div>
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
