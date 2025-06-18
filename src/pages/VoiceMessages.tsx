
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Mic, Play, Pause, Heart, Download, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceMessage {
  id: number;
  title: string;
  duration: number;
  date: string;
  audioBlob?: Blob;
  isPlaying: boolean;
}

const VoiceMessages: React.FC = () => {
  const { themeConfig } = useTheme();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const newMessage: VoiceMessage = {
          id: Date.now(),
          title: `Love Message ${messages.length + 1}`,
          duration: recordingTime,
          date: new Date().toLocaleDateString(),
          audioBlob,
          isPlaying: false
        };
        setMessages(prev => [...prev, newMessage]);
        setRecordingTime(0);
        
        toast({
          title: "Voice message saved! 💕",
          description: "Your love note has been captured forever",
        });
      };

      mediaRecorder.start();
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Please allow microphone access to record love messages",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const playMessage = (id: number) => {
    const message = messages.find(msg => msg.id === id);
    if (message?.audioBlob) {
      const audio = new Audio(URL.createObjectURL(message.audioBlob));
      audio.play();
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, isPlaying: true } : { ...msg, isPlaying: false }
        )
      );

      audio.onended = () => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === id ? { ...msg, isPlaying: false } : msg
          )
        );
      };
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            Voice Love Notes
          </h1>
          <p className="text-xl opacity-80">Record your heart's whispers 🎤💕</p>
        </div>

        {/* Recording Section */}
        <div className="glass-card p-8 mb-8 text-center">
          <div className="mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full border-4 transition-all duration-300 hover:scale-110 ${
                isRecording 
                  ? 'bg-red-500 border-red-300 animate-pulse' 
                  : 'border-4 hover:shadow-lg'
              }`}
              style={{
                borderColor: isRecording ? '#ef4444' : themeConfig.primary,
                backgroundColor: isRecording ? '#ef4444' : 'transparent'
              }}
            >
              <Mic 
                size={32} 
                className={`mx-auto ${isRecording ? 'text-white' : ''}`}
                style={{ color: isRecording ? 'white' : themeConfig.primary }}
              />
            </button>
          </div>
          
          <div className="text-lg mb-4">
            {isRecording ? (
              <div className="text-red-500 font-bold">
                Recording... {formatTime(recordingTime)}
              </div>
            ) : (
              <div>Tap to record a love message</div>
            )}
          </div>
          
          <p className="text-sm opacity-80">
            {isRecording ? 'Tap again to stop and save' : 'Share your voice, share your heart'}
          </p>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => playMessage(message.id)}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: themeConfig.primary + '20',
                      color: themeConfig.primary
                    }}
                  >
                    {message.isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  <div>
                    <h3 className="font-semibold">{message.title}</h3>
                    <p className="text-sm opacity-80">
                      {message.date} • {formatTime(message.duration)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Heart 
                    size={20} 
                    className="text-red-500 hover:scale-125 transition-transform cursor-pointer"
                  />
                  <Volume2 
                    size={20} 
                    style={{ color: themeConfig.primary }}
                  />
                </div>
              </div>
              
              {/* Audio Waveform Visual */}
              <div className="mt-4 flex items-center space-x-1 h-8">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t rounded-full transition-all duration-300"
                    style={{
                      width: '3px',
                      height: `${Math.random() * 100}%`,
                      background: `linear-gradient(to top, ${themeConfig.primary}, ${themeConfig.secondary})`,
                      opacity: message.isPlaying ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="glass-card p-12 text-center">
              <Mic size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl mb-2">No voice messages yet</h3>
              <p className="opacity-80">Record your first love note above 💕</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceMessages;
