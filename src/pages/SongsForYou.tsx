
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Music, Play, Pause, Heart, Volume2, ExternalLink } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  year: number;
  spotifyUrl?: string;
  youtubeUrl?: string;
  message: string;
  lyrics: string;
  color: string;
}

const SongsForYou: React.FC = () => {
  const { themeConfig } = useTheme();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [showLyrics, setShowLyrics] = useState<number | null>(null);

  const songs: Song[] = [
    {
      id: 1,
      title: "Heavenly",
      artist: "Cigarettes After Sex",
      album: "Cigarettes After Sex",
      year: 2017,
      spotifyUrl: "https://open.spotify.com/track/55h7vJchibLdUkxdlX3fK7",
      youtubeUrl: "https://www.youtube.com/watch?v=REF26ENz7J0",
      message: "This song captures how divine and ethereal you are to me. Every time I hear it, I think of your angelic presence in my life.",
      lyrics: "Under the chemtrails over the country club\nYou're so handsome when you're unconscious\nWishing to be the friction in your jeans",
      color: "#FF69B4"
    },
    {
      id: 2,
      title: "Iris",
      artist: "Goo Goo Dolls",
      album: "Dizzy Up the Girl",
      year: 1998,
      spotifyUrl: "https://open.spotify.com/track/6Qyc6fS4DsZjB2mRW9DsQs",
      youtubeUrl: "https://www.youtube.com/watch?v=NdYWuo9OFAw",
      message: "The most beautiful love song ever written. Every word speaks to how I feel about you - I just want you to know who I am.",
      lyrics: "And I don't want the world to see me\n'Cause I don't think that they'd understand\nWhen everything's made to be broken\nI just want you to know who I am",
      color: "#9B59B6"
    },
    {
      id: 3,
      title: "I Don't Want to Miss a Thing",
      artist: "Aerosmith",
      album: "Armageddon: The Album",
      year: 1998,
      spotifyUrl: "https://open.spotify.com/track/3QWj4B1Q2llMuFlFvhJJ4y",
      youtubeUrl: "https://www.youtube.com/watch?v=JkK8g6FMEXE",
      message: "This is exactly how I feel about every moment with you. I don't want to miss a single second of your beautiful existence.",
      lyrics: "I don't wanna miss one smile\nI don't wanna miss one kiss\nWell, I just wanna be with you\nRight here with you, just like this",
      color: "#FF6B6B"
    },
    {
      id: 4,
      title: "Can't Help Falling in Love",
      artist: "Elvis Presley",
      album: "Blue Hawaii",
      year: 1961,
      spotifyUrl: "https://open.spotify.com/track/6twIAGnYuIT1pncMAsXnEm",
      youtubeUrl: "https://www.youtube.com/watch?v=vGJTaP6anOU",
      message: "The timeless classic that perfectly describes how I fell for you - completely, helplessly, beautifully in love.",
      lyrics: "Wise men say\nOnly fools rush in\nBut I can't help falling in love with you",
      color: "#FFD700"
    }
  ];

  const togglePlay = (songId: number) => {
    if (currentlyPlaying === songId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(songId);
    }
  };

  const toggleLyrics = (songId: number) => {
    if (showLyrics === songId) {
      setShowLyrics(null);
    } else {
      setShowLyrics(songId);
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
            Songs That Remind Me of You
          </h1>
          <p className="text-xl opacity-80">Every melody, every lyric - they all lead back to you 🎵💕</p>
        </div>

        <div className="space-y-6">
          {songs.map((song) => (
            <div key={song.id} className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => togglePlay(song.id)}
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: song.color + '20',
                      color: song.color
                    }}
                  >
                    {currentlyPlaying === song.id ? (
                      <Pause size={24} />
                    ) : (
                      <Play size={24} className="ml-1" />
                    )}
                  </button>
                  
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: song.color }}>
                      {song.title}
                    </h3>
                    <p className="text-lg opacity-90">{song.artist}</p>
                    <p className="text-sm opacity-70">
                      {song.album} • {song.year}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {song.spotifyUrl && (
                    <a
                      href={song.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:scale-110 transition-transform"
                      style={{ backgroundColor: '#1DB954' + '20', color: '#1DB954' }}
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {song.youtubeUrl && (
                    <a
                      href={song.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:scale-110 transition-transform"
                      style={{ backgroundColor: '#FF0000' + '20', color: '#FF0000' }}
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-base leading-relaxed mb-4 italic">
                "{song.message}"
              </p>
              
              <button
                onClick={() => toggleLyrics(song.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 mb-4"
                style={{
                  backgroundColor: song.color + '20',
                  color: song.color
                }}
              >
                <Music size={16} />
                <span>{showLyrics === song.id ? 'Hide Lyrics' : 'Show Lyrics'}</span>
              </button>
              
              {showLyrics === song.id && (
                <div 
                  className="p-4 rounded-lg mb-4 font-mono text-sm leading-relaxed animate-fade-in"
                  style={{ backgroundColor: song.color + '10' }}
                >
                  {song.lyrics.split('\n').map((line, index) => (
                    <div key={index} className="mb-1">
                      {line || <br />}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Audio Visualization */}
              <div className="flex items-center space-x-1 h-8">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t rounded-full transition-all duration-300"
                    style={{
                      width: '2px',
                      height: currentlyPlaying === song.id 
                        ? `${Math.random() * 100}%` 
                        : '20%',
                      background: `linear-gradient(to top, ${song.color}, ${song.color}80)`,
                      opacity: currentlyPlaying === song.id ? 1 : 0.3,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Special Message */}
        <div className="glass-card p-8 mt-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-red-500 mr-2 animate-pulse" size={24} />
            <h2 className="text-2xl font-bold">Our Soundtrack</h2>
            <Heart className="text-red-500 ml-2 animate-pulse" size={24} />
          </div>
          <p className="text-lg leading-relaxed opacity-90">
            Music has a way of capturing feelings that words alone cannot express. 
            Each of these songs holds a piece of my heart, a memory of you, 
            a feeling that only you inspire. They are the soundtrack to our love story. 💕🎵
          </p>
        </div>

        {/* Floating Musical Notes */}
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce text-2xl opacity-30"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: (Math.random() * 2 + 3) + 's',
                color: themeConfig.primary
              }}
            >
              🎵
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongsForYou;
