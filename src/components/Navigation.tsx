
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Image, Gamepad, Clock, Mic, Users, Map, Star } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const { themeConfig } = useTheme();

  const navItems = [
    { id: 'love-letter', label: 'Love Letter', icon: Heart },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'love-story', label: 'Our Story', icon: Map },
    { id: 'voice-messages', label: 'Voice Notes', icon: Mic },
    { id: 'couples-quiz', label: 'Quiz', icon: Users },
    { id: 'countdown', label: 'Countdown', icon: Clock },
    { id: 'mini-game', label: 'Game', icon: Gamepad },
    { id: 'constellation', label: 'Stars', icon: Star }
  ];

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-card px-4 py-3 max-w-4xl">
        <div className="flex space-x-2 overflow-x-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap text-sm ${
                currentPage === id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                  : 'hover:bg-white hover:bg-opacity-10 hover:scale-105'
              }`}
              style={{
                background: currentPage === id ? `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})` : undefined
              }}
            >
              <Icon size={16} />
              <span className="hidden sm:inline font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
