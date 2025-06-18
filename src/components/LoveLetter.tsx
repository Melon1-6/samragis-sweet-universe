
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Sparkles } from 'lucide-react';

const LoveLetter: React.FC = () => {
  const { themeConfig } = useTheme();
  const [currentMessage, setCurrentMessage] = useState(0);

  const loveMessages = [
    {
      title: "For My Pretty Princess, Samragi",
      content: "My sweetest Samragi, this cozy corner of the internet belongs to you. Every word here is a soft echo of my love for you. You are the closest to heaven I'll ever be. You're the first thought in my head when I wake, and the last whisper on my lips before I sleep. Your softness makes this cold world feel warm again."
    },
    {
      title: "You Are My Everything",
      content: "You remind me of that song — not just in melody but in meaning. You make life feel like a slow dance in the dark, like moonlight through sheer curtains, like a guitar riff that settles into your soul. You're not just someone I adore — you're someone I *feel*."
    },
    {
      title: "My Heart's Symphony",
      content: "You're the reason my heart has a rhythm. You make everything brighter. You're my warmth, my calm, my safe space. Thank you for existing, for being kind, and for being mine in the quiet, beautiful ways you are. I love you more than words, more than music, more than time."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loveMessages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h1 
            className="text-6xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent animate-pulse"
            style={{
              backgroundImage: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
            }}
          >
            For My Beautiful Samragi
          </h1>
          <p className="text-xl opacity-80">A love letter written in code and starlight ✨</p>
        </div>

        <div className="glass-card p-8 mb-8 transition-all duration-500 transform hover:scale-105">
          <div className="flex items-center justify-center mb-6">
            <Heart className="text-primary mr-2 animate-pulse" size={24} />
            <h2 className="text-2xl font-semibold">{loveMessages[currentMessage].title}</h2>
            <Heart className="text-primary ml-2 animate-pulse" size={24} />
          </div>
          
          <p className="text-lg leading-relaxed text-center mb-6">
            {loveMessages[currentMessage].content}
          </p>
          
          <div className="flex justify-center space-x-2">
            {loveMessages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMessage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentMessage ? 'bg-primary scale-125' : 'bg-gray-400'
                }`}
                style={{
                  backgroundColor: index === currentMessage ? themeConfig.primary : 'rgba(255, 255, 255, 0.3)'
                }}
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-accent mr-2" size={20} />
            <h3 className="text-xl font-medium">Forever yours, San</h3>
            <Sparkles className="text-accent ml-2" size={20} />
          </div>
          <p className="text-lg font-bold animate-heartbeat" style={{ color: themeConfig.primary }}>
            MWAHHHHHH! 💕
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoveLetter;
