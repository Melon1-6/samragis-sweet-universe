
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Heart, Check, X, Trophy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'personality' | 'preferences' | 'memories' | 'dreams';
}

const CouplesQuiz: React.FC = () => {
  const { themeConfig } = useTheme();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [hearts, setHearts] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: "What makes Samragi happiest?",
      options: ["Quiet moments together", "Sweet surprises", "Deep conversations", "All of the above"],
      correctAnswer: 3,
      category: 'personality'
    },
    {
      id: 2,
      question: "Samragi's perfect date would be:",
      options: ["Cozy movie night at home", "Stargazing adventure", "Bookstore browsing", "Surprise me!"],
      correctAnswer: 1,
      category: 'preferences'
    },
    {
      id: 3,
      question: "What's Samragi's love language?",
      options: ["Words of Affirmation", "Quality Time", "Physical Touch", "Acts of Service"],
      correctAnswer: 0,
      category: 'personality'
    },
    {
      id: 4,
      question: "Our most magical moment together was:",
      options: ["The first time we talked", "Every laugh we share", "When you smile at me", "All moments with you"],
      correctAnswer: 3,
      category: 'memories'
    },
    {
      id: 5,
      question: "Samragi's dream is to:",
      options: ["Travel the world", "Have a peaceful life", "Make beautiful memories", "Be truly loved"],
      correctAnswer: 3,
      category: 'dreams'
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
        setHearts(hearts + 1);
        toast({
          title: "Perfect! 💕",
          description: "You know Samragi so well!",
        });
      } else {
        toast({
          title: "Close! 💖",
          description: "Love is about learning each other better",
        });
      }

      setShowResult(true);
      
      setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          setQuizComplete(true);
        }
      }, 2000);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizComplete(false);
    setHearts(0);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! You're soulmates! 💕✨";
    if (percentage >= 80) return "Amazing! True love knows no bounds! 💖";
    if (percentage >= 60) return "Beautiful! You're learning each other's hearts! 💓";
    return "Sweet! Love grows with every moment! 💗";
  };

  const categoryColors = {
    personality: '#FF69B4',
    preferences: '#DDA0DD',
    memories: '#FFB6C1',
    dreams: '#FFC0CB'
  };

  if (quizComplete) {
    return (
      <div className="min-h-screen pt-24 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="glass-card p-12 text-center">
            <Trophy size={64} className="mx-auto mb-6" style={{ color: themeConfig.primary }} />
            <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
            <div className="text-6xl mb-6">{hearts} 💕</div>
            <p className="text-2xl mb-4">Score: {score}/{questions.length}</p>
            <p className="text-xl mb-8 opacity-80">{getScoreMessage()}</p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetQuiz}
                className="px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
            }}
          >
            How Well Do You Know Samragi?
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <div className="flex space-x-1">
              {Array.from({ length: hearts }).map((_, i) => (
                <Heart key={i} size={16} className="text-red-500 fill-current" />
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          {/* Category Badge */}
          <div className="text-center mb-6">
            <span 
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: categoryColors[currentQ.category] + '20',
                color: categoryColors[currentQ.category]
              }}
            >
              {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-semibold text-center mb-8">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg text-left transition-all duration-300 hover:scale-105 ${
                  selectedAnswer === index 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                } ${
                  showResult && index === currentQ.correctAnswer 
                    ? 'bg-green-500 bg-opacity-20 border-green-500' 
                    : showResult && selectedAnswer === index && index !== currentQ.correctAnswer
                    ? 'bg-red-500 bg-opacity-20 border-red-500'
                    : 'glass-card'
                }`}
                style={{
                  borderColor: selectedAnswer === index ? themeConfig.primary : 'transparent'
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && index === currentQ.correctAnswer && (
                    <Check className="text-green-500" size={20} />
                  )}
                  {showResult && selectedAnswer === index && index !== currentQ.correctAnswer && (
                    <X className="text-red-500" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedAnswer !== null 
                  ? 'hover:scale-105 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={{
                background: selectedAnswer !== null 
                  ? `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})` 
                  : '#666'
              }}
            >
              {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                background: `linear-gradient(45deg, ${themeConfig.primary}, ${themeConfig.secondary})`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouplesQuiz;
