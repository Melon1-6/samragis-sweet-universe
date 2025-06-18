
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { MusicProvider } from '../contexts/MusicContext';
import Navigation from '../components/Navigation';
import LoveLetter from '../components/LoveLetter';
import Gallery from '../components/Gallery';
import MiniGame from '../components/MiniGame';
import ThemeSelector from '../components/ThemeSelector';
import FloatingElements from '../components/FloatingElements';
import './Index.css';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('love-letter');

  return (
    <ThemeProvider>
      <MusicProvider>
        <div className="app-container">
          <FloatingElements />
          <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <ThemeSelector />
          
          <main className="main-content">
            {currentPage === 'love-letter' && <LoveLetter />}
            {currentPage === 'gallery' && <Gallery />}
            {currentPage === 'mini-game' && <MiniGame />}
          </main>
        </div>
      </MusicProvider>
    </ThemeProvider>
  );
};

export default Index;
