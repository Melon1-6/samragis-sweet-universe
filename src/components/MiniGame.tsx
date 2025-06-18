
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Star, Sparkles } from 'lucide-react';

const MiniGame: React.FC = () => {
  const { themeConfig } = useTheme();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; collected: boolean }>>([]);
  const [gameMessage, setGameMessage] = useState("Click hearts to collect love points! 💕");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      setGameMessage(score > 50 ? "Amazing! You collected so much love! 💖" : "Sweet! Every heart counts! 💕");
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft, score]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive) {
      interval = setInterval(() => {
        const newHeart = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 15,
          collected: false
        };
        setHearts(prev => [...prev.filter(h => !h.collected), newHeart]);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [gameActive]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setHearts([]);
    setGameMessage("Collect the hearts! 💕");
  };

  const collectHeart = (id: number) => {
    setHearts(prev => 
      prev.map(heart => 
        heart.id === id ? { ...heart, collected: true } : heart
      )
    );
    setScore(prev => prev + 10);
  };

  return (
    <div className="min-h-screen pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
            }}
          >
            Love Collection Game
          </h1>
          <p className="text-xl opacity-80">Catch all the hearts for Samragi! 💕</p>
        </div>

        <div className="glass-card p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Heart className="text-primary mr-2" size={20} />
                <span className="text-xl font-bold">Score: {score}</span>
              </div>
              <div className="flex items-center">
                <Star className="text-accent mr-2" size={20} />
                <span className="text-xl font-bold">Time: {timeLeft}s</span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
              }}
            >
              {gameActive ? 'Restart' : 'Start Game'}
            </button>
          </div>

          <div className="text-center mb-6">
            <p className="text-lg">{gameMessage}</p>
          </div>

          <div className="relative bg-black bg-opacity-10 rounded-lg h-96 overflow-hidden">
            {hearts.map(heart => (
              !heart.collected && (
                <button
                  key={heart.id}
                  onClick={() => collectHeart(heart.id)}
                  className="absolute animate-pulse hover:scale-125 transition-transform duration-200"
                  style={{
                    left: `${heart.x}%`,
                    top: `${heart.y}%`,
                    color: themeConfig.primary
                  }}
                >
                  <Heart size={24} fill="currentColor" />
                </button>
              )
            ))}
            
            {!gameActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="mx-auto mb-4 text-accent" size={48} />
                  <p className="text-2xl font-bold mb-2">Ready to Play?</p>
                  <p className="text-lg opacity-80">Click hearts as they appear!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6 text-center">
          <h3 className="text-2xl font-bold mb-4">High Score Challenge!</h3>
          <p className="text-lg mb-4">Can you collect more than 100 love points for Samragi?</p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-3xl mb-2">💕</div>
              <div className="text-sm">0-50 points</div>
              <div className="text-xs opacity-80">Sweet Start!</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💖</div>
              <div className="text-sm">51-100 points</div>
              <div className="text-xs opacity-80">Love Master!</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💝</div>
              <div className="text-sm">100+ points</div>
              <div className="text-xs opacity-80">Ultimate Romantic!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
