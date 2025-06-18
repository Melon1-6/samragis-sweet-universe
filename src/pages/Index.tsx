
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { MusicProvider } from '../contexts/MusicContext';
import Navigation from '../components/Navigation';
import LoveLetter from '../components/LoveLetter';
import Gallery from '../components/Gallery';
import MiniGame from '../components/MiniGame';
import ThemeSelector from '../components/ThemeSelector';
import FloatingElements from '../components/FloatingElements';
import LoveStoryTimeline from './LoveStoryTimeline';
import VoiceMessages from './VoiceMessages';
import CouplesQuiz from './CouplesQuiz';
import LoveCountdown from './LoveCountdown';
import ConstellationMap from './ConstellationMap';
import './Index.css';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('love-letter');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'love-letter':
        return <LoveLetter />;
      case 'gallery':
        return <Gallery />;
      case 'love-story':
        return <LoveStoryTimeline />;
      case 'voice-messages':
        return <VoiceMessages />;
      case 'couples-quiz':
        return <CouplesQuiz />;
      case 'countdown':
        return <LoveCountdown />;
      case 'mini-game':
        return <MiniGame />;
      case 'constellation':
        return <ConstellationMap />;
      default:
        return <LoveLetter />;
    }
  };

  return (
    <ThemeProvider>
      <MusicProvider>
        <div className="app-container">
          <FloatingElements />
          <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <ThemeSelector />
          
          <main className="main-content">
            {renderCurrentPage()}
          </main>

          {/* Easter Eggs and Micro-interactions */}
          <div className="fixed bottom-4 left-4 text-xs opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
            Made with 💕 for Samragi
          </div>
        </div>
      </MusicProvider>
    </ThemeProvider>
  );
};

export default Index;
