
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Star, Heart, MapPin, Calendar } from 'lucide-react';

interface Constellation {
  id: number;
  name: string;
  stars: { x: number; y: number; size: number }[];
  story: string;
  date: string;
  significance: string;
}

const ConstellationMap: React.FC = () => {
  const { themeConfig } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedConstellation, setSelectedConstellation] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const constellations: Constellation[] = [
    {
      id: 1,
      name: "The First Hello",
      stars: [
        { x: 100, y: 150, size: 3 },
        { x: 180, y: 120, size: 4 },
        { x: 250, y: 180, size: 3 },
        { x: 200, y: 200, size: 2 }
      ],
      story: "The moment our paths crossed and the universe aligned perfectly",
      date: "The Beginning",
      significance: "First Encounter"
    },
    {
      id: 2,
      name: "Growing Hearts",
      stars: [
        { x: 400, y: 100, size: 4 },
        { x: 450, y: 140, size: 3 },
        { x: 380, y: 160, size: 3 },
        { x: 420, y: 190, size: 4 },
        { x: 460, y: 210, size: 2 }
      ],
      story: "Every conversation that brought us closer, every shared laugh",
      date: "Our Journey",
      significance: "Building Connection"
    },
    {
      id: 3,
      name: "Love's Declaration",
      stars: [
        { x: 200, y: 350, size: 5 },
        { x: 250, y: 320, size: 4 },
        { x: 180, y: 380, size: 3 },
        { x: 220, y: 400, size: 3 },
        { x: 270, y: 370, size: 2 }
      ],
      story: "The constellation that appeared when love was finally spoken",
      date: "Our Promise",
      significance: "First 'I Love You'"
    },
    {
      id: 4,
      name: "Forever Together",
      stars: [
        { x: 500, y: 300, size: 4 },
        { x: 550, y: 280, size: 5 },
        { x: 580, y: 320, size: 3 },
        { x: 520, y: 350, size: 4 },
        { x: 480, y: 330, size: 3 },
        { x: 560, y: 360, size: 2 }
      ],
      story: "The brightest constellation - our future shining together",
      date: "Always",
      significance: "Eternal Love"
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background stars
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw constellations
    constellations.forEach((constellation, index) => {
      const isSelected = selectedConstellation === constellation.id;
      const alpha = isSelected ? 1 : 0.7;
      
      // Draw constellation lines
      ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.beginPath();
      
      constellation.stars.forEach((star, i) => {
        if (i === 0) {
          ctx.moveTo(star.x, star.y);
        } else {
          ctx.lineTo(star.x, star.y);
        }
      });
      ctx.stroke();

      // Draw stars
      constellation.stars.forEach(star => {
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${alpha})`);
        gradient.addColorStop(1, `rgba(255, 215, 0, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * (isSelected ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();
        
        // Star twinkle effect
        if (Math.random() < 0.1) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw constellation name
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      ctx.font = isSelected ? '16px serif' : '14px serif';
      ctx.textAlign = 'center';
      const centerX = constellation.stars.reduce((sum, star) => sum + star.x, 0) / constellation.stars.length;
      const centerY = constellation.stars.reduce((sum, star) => sum + star.y, 0) / constellation.stars.length;
      ctx.fillText(constellation.name, centerX, centerY - 30);
    });
  }, [selectedConstellation]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is near any constellation
    constellations.forEach(constellation => {
      const centerX = constellation.stars.reduce((sum, star) => sum + star.x, 0) / constellation.stars.length;
      const centerY = constellation.stars.reduce((sum, star) => sum + star.y, 0) / constellation.stars.length;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      if (distance < 50) {
        setSelectedConstellation(constellation.id);
      }
    });
  };

  const selectedConstellationData = constellations.find(c => c.id === selectedConstellation);

  return (
    <div className="min-h-screen pt-24 p-6 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
            }}
          >
            Our Constellation Map
          </h1>
          <p className="text-xl opacity-80">The stars that tell our love story ✨</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Star Map */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <canvas
                ref={canvasRef}
                width={600}
                height={500}
                className="w-full h-auto border border-gray-700 rounded-lg cursor-pointer bg-gradient-to-b from-slate-900 to-slate-800"
                onClick={handleCanvasClick}
                onMouseMove={(e) => {
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) {
                    setMousePos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top
                    });
                  }
                }}
              />
              <p className="text-center mt-4 text-sm opacity-70">
                Click on a constellation to learn its story
              </p>
            </div>
          </div>

          {/* Constellation Details */}
          <div className="space-y-6">
            {selectedConstellationData ? (
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400 mr-2" size={24} />
                  <h3 className="text-2xl font-bold">{selectedConstellationData.name}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-sm opacity-80">
                    <Calendar size={16} className="mr-2" />
                    {selectedConstellationData.date}
                  </div>
                  
                  <div className="flex items-center text-sm opacity-80">
                    <MapPin size={16} className="mr-2" />
                    {selectedConstellationData.significance}
                  </div>
                  
                  <p className="leading-relaxed">{selectedConstellationData.story}</p>
                  
                  <div className="pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-center">
                      <Heart className="text-red-500 mr-2" size={16} />
                      <span className="text-sm">Stars in this constellation: {selectedConstellationData.stars.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <Star className="mx-auto text-yellow-400 mb-4" size={48} />
                <h3 className="text-xl mb-2">Explore Our Stars</h3>
                <p className="opacity-80">Click on any constellation to discover the beautiful story behind it</p>
              </div>
            )}

            {/* Constellation List */}
            <div className="glass-card p-6">
              <h4 className="text-lg font-bold mb-4">All Constellations</h4>
              <div className="space-y-2">
                {constellations.map(constellation => (
                  <button
                    key={constellation.id}
                    onClick={() => setSelectedConstellation(constellation.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      selectedConstellation === constellation.id 
                        ? 'bg-yellow-400 bg-opacity-20 text-yellow-400' 
                        : 'hover:bg-white hover:bg-opacity-5'
                    }`}
                  >
                    <div className="flex items-center">
                      <Star size={16} className="mr-2" />
                      <span className="font-medium">{constellation.name}</span>
                    </div>
                    <p className="text-xs opacity-70 ml-6">{constellation.significance}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Love Message */}
        <div className="glass-card p-8 mt-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Written in the Stars</h2>
          <p className="text-lg leading-relaxed opacity-90">
            Just like ancient lovers looked to the stars for guidance, our love story 
            is written across the cosmos. Each constellation represents a precious moment, 
            a milestone in our journey together. The stars witness our love and shine 
            brighter because of it. ✨💕
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConstellationMap;
