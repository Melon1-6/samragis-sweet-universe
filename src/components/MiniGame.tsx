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
  const [obstacles, setObstacles] = useState<Array<{ id: number; x: number; gap: number; height: number; type: 'castle' | 'tree' | 'tower'; passed: boolean }>>([]);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; type: 'star' | 'snitch' | 'spell' }>>([]);
  const [gameSpeed, setGameSpeed] = useState(2);
  const [distance, setDistance] = useState(0);
  const [powerUps, setPowerUps] = useState<Array<{ id: number; x: number; y: number; type: 'shield' | 'speed' | 'snitch'; collected: boolean }>>([]);
  const [playerEffects, setPlayerEffects] = useState({ shield: false, speed: false });
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

  // Enhanced Harry Potter Game Logic
  useEffect(() => {
    if (flappyGameActive) {
      const gameLoop = () => {
        // Update player position
        setPlayerY(prev => {
          const newY = prev + velocity;
          if (newY < 5 || newY > 85) {
            if (!playerEffects.shield) {
              setFlappyGameActive(false);
              return prev;
            }
          }
          return Math.max(5, Math.min(85, newY));
        });

        // Update velocity with more realistic physics
        setVelocity(prev => Math.min(12, prev + 0.4));

        // Update distance and speed
        setDistance(prev => prev + gameSpeed);
        setGameSpeed(prev => Math.min(4, prev + 0.001)); // Gradually increase difficulty

        // Update obstacles
        setObstacles(prev => {
          let newObstacles = prev.map(obstacle => ({
            ...obstacle,
            x: obstacle.x - gameSpeed
          })).filter(obstacle => obstacle.x > -15);

          // Check for scoring
          newObstacles.forEach(obstacle => {
            if (!obstacle.passed && obstacle.x < 8) {
              obstacle.passed = true;
              setFlappyScore(prevScore => prevScore + 10);
            }
          });

          // Add new obstacles with variety
          if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < 60) {
            const obstacleTypes: ('castle' | 'tree' | 'tower')[] = ['castle', 'tree', 'tower'];
            const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            const baseGap = type === 'castle' ? 35 : type === 'tree' ? 30 : 25;
            
            newObstacles.push({
              id: Date.now() + Math.random(),
              x: 110,
              gap: Math.random() * 25 + baseGap,
              height: Math.random() * 20 + 20,
              type,
              passed: false
            });
          }

          return newObstacles;
        });

        // Update power-ups
        setPowerUps(prev => {
          let newPowerUps = prev.map(powerUp => ({
            ...powerUp,
            x: powerUp.x - gameSpeed
          })).filter(powerUp => powerUp.x > -10 && !powerUp.collected);

          // Add new power-ups occasionally
          if (Math.random() < 0.003 && newPowerUps.length < 2) {
            const types: ('shield' | 'speed' | 'snitch')[] = ['shield', 'speed', 'snitch'];
            newPowerUps.push({
              id: Date.now() + Math.random(),
              x: 120,
              y: Math.random() * 60 + 20,
              type: types[Math.floor(Math.random() * types.length)],
              collected: false
            });
          }

          return newPowerUps;
        });

        // Update magical particles
        setParticles(prev => {
          let newParticles = prev.map(particle => ({
            ...particle,
            x: particle.x - gameSpeed * 0.5,
            y: particle.y + Math.sin(Date.now() * 0.01 + particle.id) * 0.5
          })).filter(particle => particle.x > -10);

          // Add new particles
          if (Math.random() < 0.1) {
            const types: ('star' | 'snitch' | 'spell')[] = ['star', 'snitch', 'spell'];
            newParticles.push({
              id: Date.now() + Math.random(),
              x: 110,
              y: Math.random() * 80 + 10,
              type: types[Math.floor(Math.random() * types.length)]
            });
          }

          return newParticles.slice(-20); // Limit particles for performance
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
  }, [flappyGameActive, velocity, gameSpeed, playerEffects.shield]);

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
    setParticles([]);
    setGameSpeed(2);
    setDistance(0);
    setPowerUps([]);
    setPlayerEffects({ shield: false, speed: false });
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
      const flapPower = playerEffects.speed ? -10 : -7;
      setVelocity(flapPower);
    }
  };

  const collectPowerUp = (id: number, type: 'shield' | 'speed' | 'snitch') => {
    setPowerUps(prev => 
      prev.map(powerUp => 
        powerUp.id === id ? { ...powerUp, collected: true } : powerUp
      )
    );
    
    if (type === 'shield') {
      setPlayerEffects(prev => ({ ...prev, shield: true }));
    } else if (type === 'speed') {
      setPlayerEffects(prev => ({ ...prev, speed: true }));
    } else if (type === 'snitch') {
      setFlappyScore(prev => prev + 50);
    }
  };

  const getObstacleEmoji = (type: 'castle' | 'tree' | 'tower') => {
    switch (type) {
      case 'castle': return '🏰';
      case 'tree': return '🌲';
      case 'tower': return '🗼';
      default: return '🏰';
    }
  };

  const getPowerUpEmoji = (type: 'shield' | 'speed' | 'snitch') => {
    switch (type) {
      case 'shield': return '🛡️';
      case 'speed': return '⚡';
      case 'snitch': return '🏐';
      default: return '✨';
    }
  };

  const getParticleEmoji = (type: 'star' | 'snitch' | 'spell') => {
    switch (type) {
      case 'star': return '⭐';
      case 'snitch': return '✨';
      case 'spell': return '🔮';
      default: return '✨';
    }
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
                <div className="flex items-center">
                  <span className="text-lg font-medium">Distance: {Math.floor(distance/10)}m</span>
                </div>
                {playerEffects.shield && (
                  <div className="flex items-center text-blue-400">
                    <span className="text-sm">🛡️ Shield Active</span>
                  </div>
                )}
                {playerEffects.speed && (
                  <div className="flex items-center text-yellow-400">
                    <span className="text-sm">⚡ Speed Boost</span>
                  </div>
                )}
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
                  ? 'Click to flap through Hogwarts! Collect power-ups and avoid obstacles! 🧙‍♂️✨' 
                  : 'Embark on a magical journey through Hogwarts castle!'
                }
              </p>
            </div>

            <div 
              className="relative rounded-lg h-96 overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(to bottom, #1e3a8a 0%, #3730a3 30%, #581c87 70%, #7c2d12 100%)'
              }}
              onClick={flap}
            >
              {/* Magical Background Particles */}
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="absolute animate-pulse"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    fontSize: '12px',
                    opacity: 0.7
                  }}
                >
                  {getParticleEmoji(particle.type)}
                </div>
              ))}

              {/* Player (Harry on Broomstick) */}
              <div
                className={`absolute text-4xl transition-all duration-100 ${
                  playerEffects.shield ? 'drop-shadow-lg' : ''
                }`}
                style={{
                  left: '8%',
                  top: `${playerY}%`,
                  transform: 'translate(-50%, -50%)',
                  filter: playerEffects.shield ? 'drop-shadow(0 0 10px #3b82f6)' : 'none'
                }}
              >
                🧙‍♂️
                {playerEffects.speed && (
                  <div className="absolute -right-2 -top-1 text-lg">⚡</div>
                )}
              </div>

              {/* Power-ups */}
              {powerUps.map(powerUp => (
                !powerUp.collected && (
                  <button
                    key={powerUp.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      collectPowerUp(powerUp.id, powerUp.type);
                    }}
                    className="absolute animate-bounce hover:scale-125 transition-transform duration-200 text-2xl"
                    style={{
                      left: `${powerUp.x}%`,
                      top: `${powerUp.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {getPowerUpEmoji(powerUp.type)}
                  </button>
                )
              ))}

              {/* Enhanced Obstacles */}
              {obstacles.map(obstacle => (
                <React.Fragment key={obstacle.id}>
                  {/* Top obstacle */}
                  <div
                    className="absolute rounded-b-lg shadow-lg"
                    style={{
                      left: `${obstacle.x}%`,
                      top: '0%',
                      width: '12%',
                      height: `${obstacle.gap}%`,
                      background: 'linear-gradient(to bottom, #374151, #1f2937)',
                      border: '2px solid #6b7280'
                    }}
                  >
                    <div className="text-center pt-2 text-2xl">
                      {getObstacleEmoji(obstacle.type)}
                    </div>
                  </div>
                  {/* Bottom obstacle */}
                  <div
                    className="absolute rounded-t-lg shadow-lg"
                    style={{
                      left: `${obstacle.x}%`,
                      bottom: '0%',
                      width: '12%',
                      height: `${100 - obstacle.gap - 30}%`,
                      background: 'linear-gradient(to top, #374151, #1f2937)',
                      border: '2px solid #6b7280'
                    }}
                  >
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl">
                      {getObstacleEmoji(obstacle.type)}
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Floating castle elements in background */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-gray-600 opacity-30"
                  style={{
                    left: `${(i * 15) % 100}%`,
                    top: `${(i * 23) % 80 + 10}%`,
                    fontSize: `${Math.random() * 20 + 15}px`,
                    animation: `float ${3 + i}s ease-in-out infinite alternate`
                  }}
                >
                  {i % 3 === 0 ? '🏰' : i % 3 === 1 ? '🌙' : '☁️'}
                </div>
              ))}

              {!flappyGameActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="text-center text-white">
                    <div className="text-8xl mb-4">🧙‍♂️</div>
                    <p className="text-3xl font-bold mb-4">Hogwarts Flight Adventure</p>
                    <p className="text-lg opacity-90 mb-4">
                      Fly through the magical world of Hogwarts!
                    </p>
                    <p className="text-sm opacity-75">
                      • Collect power-ups: 🛡️ Shield, ⚡ Speed Boost, 🏐 Golden Snitch<br/>
                      • Avoid castle towers, trees, and magical barriers<br/>
                      • Click anywhere to flap your broomstick!
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
              <div className="text-sm">{currentGame === 'hearts' ? '0-50 points' : '0-100 points'}</div>
              <div className="text-xs opacity-80">
                {currentGame === 'hearts' ? 'Sweet Start!' : 'Novice Wizard!'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">{currentGame === 'hearts' ? '💖' : '⚡'}</div>
              <div className="text-sm">{currentGame === 'hearts' ? '51-100 points' : '101-300 points'}</div>
              <div className="text-xs opacity-80">
                {currentGame === 'hearts' ? 'Love Master!' : 'Skilled Flyer!'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">{currentGame === 'hearts' ? '💝' : '🏆'}</div>
              <div className="text-sm">{currentGame === 'hearts' ? '100+ points' : '300+ points'}</div>
              <div className="text-xs opacity-80">
                {currentGame === 'hearts' ? 'Ultimate Romantic!' : 'Master of Magic!'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default MiniGame;
