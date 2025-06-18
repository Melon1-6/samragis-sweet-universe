
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Gallery: React.FC = () => {
  const { themeConfig } = useTheme();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const photos = [
    {
      src: '/lovable-uploads/f03e2e2a-e31e-41cc-9a24-2c573bd31554.png',
      message: "Your beauty radiates from within, lighting up every moment we share. That sweet smile of yours makes my heart skip beats I didn't know existed. 💕",
      lyric: "I'm giving you all my, giving you all my , giving you all my love",
      song: "Heavenly - Cigarettes After Sex"
    },
    {
      src: '/lovable-uploads/ee8d7e21-7b0b-4e6d-8a25-beff07976df2.png',
      message: "Even in the simplest moments, you're absolutely stunning. The way you hold that drink, the way you smile - everything about you is pure magic. ✨",
      lyric: "You're the closest to heaven that I'll ever be and I don't want to go home right now",
      song: "Iris - Goo Goo Dolls"
    },
    {
      src: '/lovable-uploads/920cebac-6f99-4cba-aacd-2ce908825585.png',
      message: "This gentle, beautiful soul captured in a single frame. Your eyes hold all the warmth and love in the world. You're my safe haven. 🌸",
      lyric: "I don't wanna miss one smile\nI don't wanna miss one kiss",
      song: "I Don't Want to Miss a Thing - Aerosmith"
    },
    {
      src: '/lovable-uploads/f5cbdb60-e84f-4a8a-9ce5-d7086fe29d2e.png',
      message: "My heart melts every time I see this photo. You're effortlessly beautiful, and that natural glow of yours makes me fall in love all over again. 💖",
      lyric: "Wise men say, only fools rush in\nBut I can't help falling in love with you",
      song: "Can't Help Falling in Love - Elvis Presley"
    }
  ];

  return (
    <div className="min-h-screen pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
            }}
          >
            My Beautiful Samragi
          </h1>
          <p className="text-xl opacity-80">Every photo tells a story of love 📸💕</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={photo.src}
                  alt={`Beautiful Samragi ${index + 1}`}
                  className="w-full h-80 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Song lyric preview */}
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <p className="text-sm font-mono italic text-center opacity-90">
                  "{photo.lyric.split('\n')[0]}..."
                </p>
                <p className="text-xs text-center opacity-70 mt-1">
                  {photo.song}
                </p>
              </div>
              
              <p className="text-center text-sm opacity-80">Click to see my love note 💕</p>
            </div>
          ))}
        </div>

        {selectedImage !== null && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="glass-card max-w-2xl w-full p-6 animate-scale-in">
              <img
                src={photos[selectedImage].src}
                alt={`Beautiful Samragi ${selectedImage + 1}`}
                className="w-full h-80 object-cover rounded-lg mb-6"
              />
              
              {/* Full song lyric */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <h3 className="text-lg font-semibold mb-2 text-center">🎵 Song Lyric 🎵</h3>
                <p className="font-mono italic text-center leading-relaxed">
                  {photos[selectedImage].lyric.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < photos[selectedImage].lyric.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
                <p className="text-sm text-center opacity-70 mt-2">
                  - {photos[selectedImage].song}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-lg leading-relaxed mb-4">
                  {photos[selectedImage].message}
                </p>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
