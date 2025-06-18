
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Image, Gamepad } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const { themeConfig } = useTheme();

  const navItems = [
    { id: 'love-letter', label: 'Love Letter', icon: Heart },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'mini-game', label: 'Mini Game', icon: Gamepad }
  ];

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-card px-6 py-3">
        <div className="flex space-x-6">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                currentPage === id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
              style={{
                background: currentPage === id ? `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})` : undefined
              }}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
