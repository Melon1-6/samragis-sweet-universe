import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, Sparkles, Play, RotateCcw } from 'lucide-react';

const MiniGame: React.FC = () => {
  // Default theme config
  const themeConfig = {
    primary: '#e91e63',
    secondary: '#9c27b0',
    accent: '#ff9800'
  };
  const [currentGame, setCurrentGame] = useState<'hearts' | 'pacman'>('hearts');
  
  // Hearts Game State
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; collected: boolean }>>([]);
  const [gameMessage, setGameMessage] = useState("Click hearts to collect love points! 💕");

  // Pac-Man Game State
  const [pacmanScore, setPacmanScore] = useState(0);
  const [pacmanGameActive, setPacmanGameActive] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 7, y: 7 });
  const [dementors, setDementors] = useState([
    { x: 1, y: 1, direction: 1 },
    { x: 13, y: 1, direction: 2 },
    { x: 1, y: 13, direction: 3 },
    { x: 13, y: 13, direction: 4 }
  ]);
  const [snitches, setSnitches] = useState<Set<string>>(new Set());
  const [powerUps, setPowerUps] = useState<Set<string>>(new Set());
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const [vulnerableDementors, setVulnerableDementors] = useState<Set<number>>(new Set());
  const gameLoopRef = useRef<number>();

  // Maze layout (15x15 grid, 1 = wall, 0 = path)
  const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

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

  // Pac-Man Game Logic
  useEffect(() => {
    if (pacmanGameActive) {
      const gameLoop = () => {
        // Move Dementors
        setDementors(prev => prev.map((dementor, index) => {
          let newX = dementor.x;
          let newY = dementor.y;
          let newDirection = dementor.direction;

          // Simple AI: try to move towards player, but respect walls
          const dx = playerPos.x - dementor.x;
          const dy = playerPos.y - dementor.y;
          
          let moveX = 0, moveY = 0;
          if (Math.abs(dx) > Math.abs(dy)) {
            moveX = dx > 0 ? 1 : -1;
          } else {
            moveY = dy > 0 ? 1 : -1;
          }

          if (maze[dementor.y + moveY] && maze[dementor.y + moveY][dementor.x + moveX] === 0) {
            newX += moveX;
            newY += moveY;
          } else {
            // If can't move towards player, move randomly
            const directions = [
              { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
            ];
            for (const dir of directions) {
              if (maze[dementor.y + dir.y] && maze[dementor.y + dir.y][dementor.x + dir.x] === 0) {
                newX += dir.x;
                newY += dir.y;
                break;
              }
            }
          }

          return { x: newX, y: newY, direction: newDirection };
        }));

        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [pacmanGameActive, playerPos]);

  // Check collisions and game end conditions
  useEffect(() => {
    if (pacmanGameActive) {
      // Check Dementor collisions
      const collision = dementors.some(dementor => 
        dementor.x === playerPos.x && dementor.y === playerPos.y
      );
      
      if (collision && !isPoweredUp) {
        setPacmanGameActive(false);
      } else if (collision && isPoweredUp) {
        // Banish Dementor
        setPacmanScore(prev => prev + 50);
        setDementors(prev => prev.filter(d => !(d.x === playerPos.x && d.y === playerPos.y)));
      }

      // Check if all snitches collected
      if (snitches.size === 0) {
        setPacmanGameActive(false);
      }
    }
  }, [playerPos, dementors, pacmanGameActive, isPoweredUp, snitches.size]);

  // Power-up timer
  useEffect(() => {
    if (isPoweredUp) {
      const timer = setTimeout(() => {
        setIsPoweredUp(false);
        setVulnerableDementors(new Set());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPoweredUp]);

  const startHeartsGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setHearts([]);
    setGameMessage("Collect the hearts! 💕");
  };

  const startPacmanGame = () => {
    setPacmanScore(0);
    setPacmanGameActive(true);
    setPlayerPos({ x: 7, y: 7 });
    setDementors([
      { x: 1, y: 1, direction: 1 },
      { x: 13, y: 1, direction: 2 },
      { x: 1, y: 13, direction: 3 },
      { x: 13, y: 13, direction: 4 }
    ]);
    setIsPoweredUp(false);
    setVulnerableDementors(new Set());
    
    // Initialize snitches and power-ups
    const newSnitches = new Set<string>();
    const newPowerUps = new Set<string>();
    
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        if (maze[y][x] === 0 && !(x === 7 && y === 7)) {
          if (Math.random() < 0.1) {
            newPowerUps.add(`${x},${y}`);
          } else if (Math.random() < 0.7) {
            newSnitches.add(`${x},${y}`);
          }
        }
      }
    }
    
    setSnitches(newSnitches);
    setPowerUps(newPowerUps);
  };

  const collectHeart = (id: number) => {
    setHearts(prev => 
      prev.map(heart => 
        heart.id === id ? { ...heart, collected: true } : heart
      )
    );
    setScore(prev => prev + 10);
  };

  const movePlayer = (direction: string) => {
    if (!pacmanGameActive) return;
    
    setPlayerPos(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch (direction) {
        case 'up': newY = Math.max(0, prev.y - 1); break;
        case 'down': newY = Math.min(14, prev.y + 1); break;
        case 'left': newX = Math.max(0, prev.x - 1); break;
        case 'right': newX = Math.min(14, prev.x + 1); break;
      }
      
      // Check if move is valid (not a wall)
      if (maze[newY][newX] === 1) {
        return prev;
      }
      
      // Check for snitch collection
      const pos = `${newX},${newY}`;
      if (snitches.has(pos)) {
        setSnitches(prev => {
          const newSet = new Set(prev);
          newSet.delete(pos);
          return newSet;
        });
        setPacmanScore(prev => prev + 10);
      }
      
      // Check for power-up collection
      if (powerUps.has(pos)) {
        setPowerUps(prev => {
          const newSet = new Set(prev);
          newSet.delete(pos);
          return newSet;
        });
        setIsPoweredUp(true);
        setVulnerableDementors(new Set([0, 1, 2, 3]));
      }
      
      return { x: newX, y: newY };
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (pacmanGameActive) {
        switch (e.key) {
          case 'ArrowUp': movePlayer('up'); break;
          case 'ArrowDown': movePlayer('down'); break;
          case 'ArrowLeft': movePlayer('left'); break;
          case 'ArrowRight': movePlayer('right'); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pacmanGameActive]);

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
            onClick={() => setCurrentGame('pacman')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
              currentGame === 'pacman' ? 'shadow-lg' : 'opacity-70'
            }`}
            style={{
              background: currentGame === 'pacman' 
                ? `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
                : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            🧙‍♂️ Dementor Escape
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

        {currentGame === 'pacman' && (
          <div className="glass-card p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="text-primary mr-2" size={20} />
                  <span className="text-xl font-bold">Score: {pacmanScore}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg">🏐 Snitches: {snitches.size}</span>
                </div>
                {isPoweredUp && (
                  <div className="flex items-center">
                    <span className="text-lg animate-pulse">⚡ POWERED UP!</span>
                  </div>
                )}
              </div>
              <button
                onClick={startPacmanGame}
                className="px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
                }}
              >
                {pacmanGameActive ? <RotateCcw size={20} /> : <Play size={20} />}
                <span className="ml-2">{pacmanGameActive ? 'Restart' : 'Start Game'}</span>
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg">
                {pacmanGameActive 
                  ? 'Use arrow keys to move! Collect snitches and avoid Dementors! ⚡ for power!' 
                  : 'Navigate the maze, collect Golden Snitches, and escape the Dementors!'
                }
              </p>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-15 gap-0 bg-gray-800 p-2 rounded-lg">
                {maze.map((row, y) => 
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className="w-6 h-6 flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: cell === 1 ? '#4a5568' : '#1a202c'
                      }}
                    >
                      {/* Player */}
                      {playerPos.x === x && playerPos.y === y && '🧙‍♂️'}
                      
                      {/* Dementors */}
                      {dementors.map((dementor, index) => 
                        dementor.x === x && dementor.y === y && (
                          <span 
                            key={index}
                            className={isPoweredUp ? 'opacity-50' : ''}
                          >
                            {isPoweredUp ? '👻' : '🖤'}
                          </span>
                        )
                      )}
                      
                      {/* Snitches */}
                      {snitches.has(`${x},${y}`) && '🏐'}
                      
                      {/* Power-ups */}
                      {powerUps.has(`${x},${y}`) && '⚡'}
                      
                      {/* Walls */}
                      {cell === 1 && '🪨'}
                    </div>
                  ))
                )}
              </div>
            </div>

            {!pacmanGameActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg">
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">🧙‍♂️</div>
                  <p className="text-3xl font-bold mb-4">Dementor Escape</p>
                  <p className="text-lg opacity-90 mb-4">
                    Navigate the maze and collect all Golden Snitches!
                  </p>
                  <p className="text-sm opacity-75 mb-2">
                    Use arrow keys to move
                  </p>
                  <p className="text-sm opacity-75">
                    Collect ⚡ to make Dementors vulnerable!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="glass-card p-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Achievement Levels!</h3>
          <p className="text-lg mb-4">
            {currentGame === 'hearts' 
              ? 'Can you collect more than 100 love points for Samragi?' 
              : 'How many Golden Snitches can you collect while escaping the Dementors?'
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
                {currentGame === 'hearts' ? 'Love Master!' : 'Skilled Escapee!'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">{currentGame === 'hearts' ? '💝' : '🏆'}</div>
              <div className="text-sm">{currentGame === 'hearts' ? '100+ points' : '150+ points'}</div>
              <div className="text-xs opacity-80">
                {currentGame === 'hearts' ? 'Ultimate Romantic!' : 'Dementor Master!'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
