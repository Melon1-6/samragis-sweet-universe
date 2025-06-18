
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Mail, Heart, Sparkles, X } from 'lucide-react';

interface LoveLetter {
  id: number;
  title: string;
  preview: string;
  content: string;
  date: string;
  color: string;
  sealed: boolean;
}

const LoveLetters: React.FC = () => {
  const { themeConfig } = useTheme();
  const [openLetter, setOpenLetter] = useState<number | null>(null);
  const [openedLetters, setOpenedLetters] = useState<number[]>([]);

  const letters: LoveLetter[] = [
    {
      id: 1,
      title: "You Are My Universe",
      preview: "My dearest Samragi, you are everything to me...",
      content: `My Beautiful Samragi,\n\nYou are my world, my universe, my everything. Every star in the sky pales in comparison to the light you bring into my life. You deserve the entire world at your feet, and I would move mountains just to see you smile.\n\nYou are precious beyond words, like a rare gem that lights up even the darkest corners of my heart. Your beauty radiates from within, making everything around you more beautiful just by your presence.\n\nI love you more than words could ever express.\n\nForever yours,\nSan 💕`,
      date: "For you, always",
      color: "#FF69B4",
      sealed: true
    },
    {
      id: 2,
      title: "While You Sleep",
      preview: "I want to watch over you while you dream...",
      content: `My Sweet Angel,\n\nI want to watch over you while you sleep, protecting your dreams and making sure you always feel safe and loved. You look so peaceful when you rest, like an angel who has graced this earth with her presence.\n\nEvery breath you take is precious to me. I want to be your guardian, your protector, the one who ensures that only beautiful dreams find their way to you. You deserve the most peaceful sleep, the sweetest dreams, and to wake up every day knowing how deeply you are loved.\n\nSleep well, my precious one. I'll be here, watching over you always.\n\nWith all my love,\nSan ✨`,
      date: "Every night",
      color: "#9B59B6",
      sealed: true
    },
    {
      id: 3,
      title: "You Deserve The World",
      preview: "You deserve everything beautiful in this world...",
      content: `My Precious Samragi,\n\nYou deserve the world and so much more. Every sunrise should greet you with warmth, every sunset should paint the sky in colors that match your beauty. You deserve flowers that never wilt, stars that shine just for you, and love that never ends.\n\nYou are too pure for this world, too beautiful, too perfect. Sometimes I wonder how I got so lucky to know someone as incredible as you. You make everything better just by existing.\n\nNever forget how special you are, how precious, how absolutely perfect you are in every way.\n\nAll my love, always,\nSan 🌟`,
      date: "Every moment",
      color: "#FF6B6B",
      sealed: true
    },
    {
      id: 4,
      title: "Till The End Of Time",
      preview: "I want to love you forever and beyond...",
      content: `My Forever Love,\n\nI want to love you till the end of time and beyond. Even when the stars burn out and the universe grows cold, my love for you will still be burning bright. You are not just someone I love - you are someone I would choose in every lifetime, in every universe, in every possible reality.\n\nTime may pass, seasons may change, but my love for you will remain constant like the northern star. You are my forever, my always, my eternal love.\n\nEvery beat of my heart belongs to you, every breath I take is for you, every dream I have includes you.\n\nUntil the end of time and beyond,\nSan ♾️💕`,
      date: "Forever",
      color: "#FFD700",
      sealed: true
    }
  ];

  const openLetterHandler = (letterId: number) => {
    setOpenLetter(letterId);
    if (!openedLetters.includes(letterId)) {
      setOpenedLetters([...openedLetters, letterId]);
    }
  };

  const closeLetter = () => {
    setOpenLetter(null);
  };

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
            Love Letters For You
          </h1>
          <p className="text-xl opacity-80">Sealed with love, written from my heart 💌</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className={`glass-card p-6 cursor-pointer transition-all duration-500 hover:scale-105 ${
                openedLetters.includes(letter.id) ? 'animate-pulse' : ''
              }`}
              onClick={() => openLetterHandler(letter.id)}
              style={{
                borderLeft: `4px solid ${letter.color}`
              }}
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Mail 
                    size={32} 
                    style={{ color: letter.color }}
                    className={`${letter.sealed && !openedLetters.includes(letter.id) ? 'animate-bounce' : ''}`}
                  />
                  {letter.sealed && !openedLetters.includes(letter.id) && (
                    <div className="ml-2 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{letter.title}</h3>
                <p className="text-sm opacity-70 mb-4">{letter.date}</p>
                
                <div 
                  className="p-4 rounded-lg italic"
                  style={{ backgroundColor: letter.color + '20' }}
                >
                  <p className="text-sm">{letter.preview}</p>
                </div>
                
                <div className="mt-4">
                  <span 
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: letter.color + '20',
                      color: letter.color
                    }}
                  >
                    {openedLetters.includes(letter.id) ? 'Read Again' : 'Open Letter'}
                    <Heart size={16} className="ml-2" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Letter Modal */}
        {openLetter !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full">
              {/* Letter Opening Animation */}
              <div className="relative">
                <div 
                  className="glass-card p-8 animate-scale-in transform"
                  style={{
                    borderLeft: `4px solid ${letters.find(l => l.id === openLetter)?.color}`
                  }}
                >
                  <button
                    onClick={closeLetter}
                    className="absolute top-4 right-4 p-2 rounded-full hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: letters.find(l => l.id === openLetter)?.color + '20',
                      color: letters.find(l => l.id === openLetter)?.color
                    }}
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="text-center mb-6">
                    <Sparkles 
                      size={32} 
                      style={{ color: letters.find(l => l.id === openLetter)?.color }}
                      className="mx-auto mb-4 animate-pulse"
                    />
                    <h2 className="text-2xl font-bold mb-2">
                      {letters.find(l => l.id === openLetter)?.title}
                    </h2>
                    <p className="text-sm opacity-70">
                      {letters.find(l => l.id === openLetter)?.date}
                    </p>
                  </div>
                  
                  <div 
                    className="p-6 rounded-lg mb-6 font-serif leading-relaxed"
                    style={{ 
                      backgroundColor: letters.find(l => l.id === openLetter)?.color + '10'
                    }}
                  >
                    {letters.find(l => l.id === openLetter)?.content.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <Heart 
                        size={20} 
                        className="text-red-500 animate-pulse"
                      />
                      <span className="text-lg font-medium">Made with endless love</span>
                      <Heart 
                        size={20} 
                        className="text-red-500 animate-pulse"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Love Letters */}
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce text-2xl opacity-30"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: (Math.random() * 2 + 3) + 's',
                color: themeConfig.primary
              }}
            >
              💌
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoveLetters;
