import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Star, Sparkles, Play, RotateCcw } from 'lucide-react';

const MiniGame: React.FC = () => {
  const { themeConfig } = useTheme();
  const [currentGame, setCurrentGame] = useState<'hearts' | 'flappy'>('hearts');
  
  // Hearts Game State
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; collected: boolean }>>([]);
  const [gameMessage, setGameMessage] = useState("Click hearts to collect love points! 💕");

  // Harry Potter Broomstick Game State
  const [flappyScore, setFlappyScore] = useState(0);
  const [flappyGameActive, setFlappyGameActive] = useState(false);
  const [playerY, setPlayerY] = useState(50);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Array<{ id: number; x: number; gap: number; passed: boolean }>>([]);
  const gameLoopRef = useRef<number>();

  // Hearts Game Logic (UNCHANGED)
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

  // Optimized Harry Potter Game Logic
  useEffect(() => {
    if (flappyGameActive) {
      const gameLoop = () => {
        // Update player position
        setPlayerY(prev => {
          const newY = prev + velocity;
          if (newY < 0 || newY > 90) {
            setFlappyGameActive(false);
            return prev;
          }
          return newY;
        });

        // Simple gravity
        setVelocity(prev => prev + 0.6);

        // Update obstacles
        setObstacles(prev => {
          let newObstacles = prev.map(obstacle => ({
            ...obstacle,
            x: obstacle.x - 3
          })).filter(obstacle => obstacle.x > -15);

          // Check for scoring
          newObstacles.forEach(obstacle => {
            if (!obstacle.passed && obstacle.x < 10) {
              obstacle.passed = true;
              setFlappyScore(prevScore => prevScore + 10);
            }
          });

          // Add new obstacles
          if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < 70) {
            newObstacles.push({
              id: Date.now(),
              x: 110,
              gap: Math.random() * 30 + 35,
              height: 0,
              type: 'castle',
              passed: false
            });
          }

          return newObstacles;
        });

        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [flappyGameActive, velocity]);

  // Power-up effects timer
  useEffect(() => {
    let shieldTimer: NodeJS.Timeout;
    let speedTimer: NodeJS.Timeout;

    if (playerEffects.shield) {
      shieldTimer = setTimeout(() => {
        setPlayerEffects(prev => ({ ...prev, shield: false }));
      }, 5000);
    }

    if (playerEffects.speed) {
      speedTimer = setTimeout(() => {
        setPlayerEffects(prev => ({ ...prev, speed: false }));
      }, 3000);
    }

    return () => {
      clearTimeout(shieldTimer);
      clearTimeout(speedTimer);
    };
  }, [playerEffects]);

  const startHeartsGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setHearts([]);
    setGameMessage("Collect the hearts! 💕");
  };

  const startFlappyGame = () => {
    setFlappyScore(0);
    setFlappyGameActive(true);
    setPlayerY(50);
    setVelocity(0);
    setObstacles([]);
  };

  const collectHeart = (id: number) => {
    setHearts(prev => 
      prev.map(heart => 
        heart.id === id ? { ...heart, collected: true } : heart
      )
    );
    setScore(prev => prev + 10);
  };

  const flap = () => {
    if (flappyGameActive) {
      setVelocity(-8);
    }
  };

  // Add keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && flappyGameActive) {
        e.preventDefault();
        setVelocity(-8);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [flappyGameActive]);



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
            Love Games
          </h1>
          <p className="text-xl opacity-80">Fun games made with love for Samragi! 💕</p>
        </div>

        {/* Game Selection */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setCurrentGame('hearts')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
              currentGame === 'hearts' ? 'shadow-lg' : 'opacity-70'
            }`}
            style={{
              background: currentGame === 'hearts' 
                ? `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
                : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            💕 Heart Collection
          </button>
          <button
            onClick={() => setCurrentGame('flappy')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
              currentGame === 'flappy' ? 'shadow-lg' : 'opacity-70'
            }`}
            style={{
              background: currentGame === 'flappy' 
                ? `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
                : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            🧙‍♂️ Hogwarts Flight
          </button>
        </div>

        {currentGame === 'hearts' && (
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
                onClick={startHeartsGame}
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
        )}

        {currentGame === 'flappy' && (
          <div className="glass-card p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="text-primary mr-2" size={20} />
                  <span className="text-xl font-bold">Score: {flappyScore}</span>
                </div>
              </div>
              <button
                onClick={startFlappyGame}
                className="px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
                }}
              >
                {flappyGameActive ? <RotateCcw size={20} /> : <Play size={20} />}
                <span className="ml-2">{flappyGameActive ? 'Restart' : 'Start Flight'}</span>
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg">
                {flappyGameActive 
                  ? 'Click or press SPACEBAR to fly! Avoid the castle towers! 🧙‍♂️' 
                  : 'Ready for a magical flight through Hogwarts?'
                }
              </p>
            </div>

            <div 
              className="relative rounded-lg h-96 overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(to bottom, #1e3a8a 0%, #3730a3 50%, #581c87 100%)'
              }}
              onClick={flap}
            >
              {/* Player (Harry on Broomstick) */}
              <div
                className="absolute text-4xl transition-all duration-75"
                style={{
                  left: '10%',
                  top: `${playerY}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🧙‍♂️
              </div>

              {/* Simple Obstacles */}
              {obstacles.map(obstacle => (
                <React.Fragment key={obstacle.id}>
                  {/* Top castle */}
                  <div
                    className="absolute rounded-b-lg"
                    style={{
                      left: `${obstacle.x}%`,
                      top: '0%',
                      width: '10%',
                      height: `${obstacle.gap}%`,
                      background: 'linear-gradient(to bottom, #374151, #1f2937)'
                    }}
                  >
                    <div className="text-center pt-1 text-xl">🏰</div>
                  </div>
                  {/* Bottom castle */}
                  <div
                    className="absolute rounded-t-lg"
                    style={{
                      left: `${obstacle.x}%`,
                      bottom: '0%',
                      width: '10%',
                      height: `${100 - obstacle.gap - 25}%`,
                      background: 'linear-gradient(to top, #374151, #1f2937)'
                    }}
                  >
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xl">🏰</div>
                  </div>
                </React.Fragment>
              ))}

              {/* Simple background stars */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-yellow-300 opacity-60"
                  style={{
                    left: `${(i * 20 + 10) % 90}%`,
                    top: `${(i * 30 + 15) % 70}%`,
                    fontSize: '16px'
                  }}
                >
                  ⭐
                </div>
              ))}

              {!flappyGameActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="text-center text-white">
                    <div className="text-8xl mb-4">🧙‍♂️</div>
                    <p className="text-3xl font-bold mb-4">Hogwarts Flight</p>
                    <p className="text-lg opacity-90 mb-4">
                      Fly through the magical towers of Hogwarts!
                    </p>
                    <p className="text-sm opacity-75">
                      Click anywhere or press SPACEBAR to flap!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="glass-card p-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Achievement Levels!</h3>
          <p className="text-lg mb-4">
            {currentGame === 'hearts' 
              ? 'Can you collect more than 100 love points for Samragi?' 
              : 'How far can you fly through the magical world of Hogwarts?'
            }
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-3xl mb-2">{currentGame === 'hearts' ? '💕' : '🧙‍♂️'}</div>
              <div className="text-sm">{currentGame === 'hearts' ? '0-50 points' : '0-50 points'}</div>
              <div className="text-xs opacity-80">
                {currentGame === 'hearts' ? 'Sweet Start!' : 'Novice Wizard!'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">{currentGame === 'hearts' ? '💖' : '⚡'}</div>
              <div className="text-sm">{currentGame === 'hearts' ? '51-100 points' : '51-150 points'}</div>
              <div className="text-xs opacity-80">
                {currentGame === 'hearts' ? 'Love Master!' : 'Skilled Flyer!'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">{currentGame === 'hearts' ? '💝' : '🏆'}</div>
              <div className="text-sm">{currentGame === 'hearts' ? '100+ points' : '150+ points'}</div>
              <div className="text-xs opacity-80">
                {currentGame === 'hearts' ? 'Ultimate Romantic!' : 'Master of Magic!'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
