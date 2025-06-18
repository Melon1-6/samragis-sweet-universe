
import React, { createContext, useContext, useState, useRef } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  playSound: (soundName: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => console.log('Audio play failed'));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playSound = (soundName: string) => {
    // Play sound effects
    const audio = new Audio();
    switch (soundName) {
      case 'click':
        // Soft click sound
        break;
      case 'heart':
        // Heart sound
        break;
      case 'magic':
        // Magic sound
        break;
    }
    audio.play().catch(() => console.log('Sound play failed'));
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, playSound }}>
      {children}
      <audio ref={audioRef} loop>
        <source src="/placeholder-music.mp3" type="audio/mpeg" />
      </audio>
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
