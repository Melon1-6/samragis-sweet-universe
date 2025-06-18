
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme, themeConfig } = useTheme();

  const themes = [
    { id: 'pink-romance', name: 'Pink Romance', emoji: '💕' },
    { id: 'purple-dreams', name: 'Purple Dreams', emoji: '💜' },
    { id: 'midnight-noir', name: 'Midnight Noir', emoji: '🖤' },
    { id: 'starry-hogwarts', name: 'Starry Hogwarts', emoji: '⚡' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium mb-3 text-center">Choose Theme</h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              className={`p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                theme === t.id ? 'ring-2 ring-primary' : ''
              }`}
              style={{
                background: theme === t.id ? themeConfig.glass : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="text-lg mb-1">{t.emoji}</div>
              <div className="text-xs">{t.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
