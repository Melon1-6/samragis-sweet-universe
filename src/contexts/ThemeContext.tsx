
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'pink-romance' | 'purple-dreams' | 'midnight-noir' | 'starry-hogwarts';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeConfig: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = {
  'pink-romance': {
    name: 'Pink Romance',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    primary: '#ff69b4',
    secondary: '#ffc0cb',
    accent: '#ff1493',
    text: '#2d1b69',
    glass: 'rgba(255, 255, 255, 0.2)',
    particles: ['💕', '💖', '💗', '🌸', '🌺']
  },
  'purple-dreams': {
    name: 'Purple Dreams',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primary: '#9d4edd',
    secondary: '#c77dff',
    accent: '#7209b7',
    text: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.15)',
    particles: ['💜', '🔮', '✨', '🦄', '🌙']
  },
  'midnight-noir': {
    name: 'Midnight Noir',
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)',
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#45b7d1',
    text: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.05)',
    particles: ['🚬', '🎸', '🖤', '⚡', '🌃']
  },
  'starry-hogwarts': {
    name: 'Starry Hogwarts',
    background: 'linear-gradient(135deg, #0c1445 0%, #1e3c72 50%, #2a5298 100%)',
    primary: '#ffd700',
    secondary: '#ffeb3b',
    accent: '#ff9800',
    text: '#ffffff',
    glass: 'rgba(255, 215, 0, 0.1)',
    particles: ['⚡', '🌟', '✨', '🔮', '🦉']
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('pink-romance');

  useEffect(() => {
    const root = document.documentElement;
    const themeConfig = themes[theme];
    
    root.style.setProperty('--bg-gradient', themeConfig.background);
    root.style.setProperty('--primary-color', themeConfig.primary);
    root.style.setProperty('--secondary-color', themeConfig.secondary);
    root.style.setProperty('--accent-color', themeConfig.accent);
    root.style.setProperty('--text-color', themeConfig.text);
    root.style.setProperty('--glass-bg', themeConfig.glass);
    
    document.body.style.background = themeConfig.background;
    document.body.style.color = themeConfig.text;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeConfig: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
