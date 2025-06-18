
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Calendar, Clock, Sparkles } from 'lucide-react';

interface CountdownTimer {
  id: number;
  title: string;
  date: Date;
  description: string;
  color: string;
  isSpecial?: boolean;
}

const LoveCountdown: React.FC = () => {
  const { themeConfig } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  const countdowns: CountdownTimer[] = [
    {
      id: 1,
      title: "Days We've Been Together",
      date: new Date('2024-01-01'), // Adjust to your actual start date
      description: "Every single day has been a gift 💕",
      color: themeConfig.primary,
      isSpecial: true
    },
    {
      id: 2,
      title: "Until Our Next Adventure",
      date: new Date('2025-02-14'), // Valentine's Day
      description: "Planning something magical for us ✨",
      color: themeConfig.secondary
    },
    {
      id: 3,
      title: "Days Since First 'I Love You'",
      date: new Date('2024-02-01'), // Adjust to your date
      description: "The words that changed everything 💖",
      color: '#FF6B6B'
    },
    {
      id: 4,
      title: "Our Special Milestone",
      date: new Date('2025-01-01'), // Any future date
      description: "Another beautiful chapter awaits 🌟",
      color: '#9B59B6'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = (targetDate: Date, isPast: boolean = false) => {
    const difference = isPast 
      ? currentTime.getTime() - targetDate.getTime()
      : targetDate.getTime() - currentTime.getTime();
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const TimeUnit: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
    <div className="text-center">
      <div 
        className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center glass-card mb-2 font-bold text-xl md:text-2xl transition-all duration-300 hover:scale-110"
        style={{ 
          borderLeft: `4px solid ${color}`,
          color: color 
        }}
      >
        {value.toString().padStart(2, '0')}
      </div>
      <p className="text-sm opacity-80">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
            }}
          >
            Love Countdown
          </h1>
          <p className="text-xl opacity-80">Measuring moments, celebrating time together ⏰💕</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {countdowns.map((countdown, index) => {
            const isPast = countdown.id === 1 || countdown.id === 3; // Days together and since first I love you
            const timeLeft = calculateTimeLeft(countdown.date, isPast);
            
            return (
              <div 
                key={countdown.id}
                className={`glass-card p-8 transition-all duration-300 hover:scale-105 ${
                  countdown.isSpecial ? 'border-2' : ''
                }`}
                style={{
                  borderColor: countdown.isSpecial ? countdown.color : 'transparent'
                }}
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    {countdown.isSpecial ? (
                      <Sparkles size={24} style={{ color: countdown.color }} />
                    ) : (
                      <Heart size={24} style={{ color: countdown.color }} />
                    )}
                    <h3 className="text-xl font-semibold ml-2">{countdown.title}</h3>
                  </div>
                  <p className="opacity-80 text-sm">{countdown.description}</p>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <TimeUnit value={timeLeft.days} label="Days" color={countdown.color} />
                  <TimeUnit value={timeLeft.hours} label="Hours" color={countdown.color} />
                  <TimeUnit value={timeLeft.minutes} label="Minutes" color={countdown.color} />
                  <TimeUnit value={timeLeft.seconds} label="Seconds" color={countdown.color} />
                </div>

                <div className="text-center">
                  <div 
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: countdown.color + '20',
                      color: countdown.color
                    }}
                  >
                    <Calendar size={16} className="mr-2" />
                    {countdown.date.toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Special Message */}
        <div className="glass-card p-8 mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Time is Precious</h2>
          <p className="text-lg leading-relaxed opacity-90">
            Every second with you is a treasure I never want to waste. 
            These numbers aren't just time passing – they're moments of love, 
            laughter, and dreams we're building together. Time may tick away, 
            but our love only grows stronger. 💕
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

        {/* Floating Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's'
              }}
            >
              <Clock 
                size={16} 
                style={{ color: themeConfig.primary }}
                className="opacity-30"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoveCountdown;
