import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, ArrowLeft as PrevIcon, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroLearningCard {
  id: string;
  title: string;
  summary: string;
  keyTakeaways: string[];
  quiz: {
    question: string;
    options: string[];
    answer: string;
  };
  explainLikeIm5: string;
}

const Learning = () => {
  const [cards, setCards] = useState<MicroLearningCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [quizResult, setQuizResult] = useState<boolean | null>(null);
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/data/microlearning.json')
      .then(response => response.json())
      .then((data: MicroLearningCard[]) => setCards(data))
      .catch(error => console.error('Error loading learning data:', error));
  }, []);

  const currentCard = cards[currentCardIndex];
  const progress = cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      resetQuizState();
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      resetQuizState();
    }
  };

  const resetQuizState = () => {
    setShowQuiz(false);
    setSelectedAnswer('');
    setQuizResult(null);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === currentCard.quiz.answer;
      setQuizResult(isCorrect);
      if (isCorrect) {
        setCompletedCards(prev => new Set([...prev, currentCard.id]));
      }
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p>Loading learning content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Micro-Learning Hub</h1>
            <p className="text-muted-foreground">Bite-sized lessons to accelerate your onboarding</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {completedCards.size} of {cards.length} completed
          </Badge>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {cards.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{currentCard.title}</CardTitle>
                  {completedCards.has(currentCard.id) && (
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  <p className="text-muted-foreground">{currentCard.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Takeaways</h3>
                  <ul className="space-y-2">
                    {currentCard.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Explain Like I'm 5</h3>
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <p className="text-accent-foreground">{currentCard.explainLikeIm5}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {!showQuiz ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Button onClick={handleStartQuiz} className="w-full" size="lg">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Test Your Knowledge
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold">Quick Quiz</h3>
                      <p className="font-medium">{currentCard.quiz.question}</p>
                      
                      <div className="space-y-2">
                        {currentCard.quiz.options.map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/10">
                            <input
                              type="radio"
                              name="quiz-option"
                              value={option}
                              checked={selectedAnswer === option}
                              onChange={(e) => setSelectedAnswer(e.target.value)}
                              className="text-primary"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>

                      {quizResult === null ? (
                        <Button 
                          onClick={handleQuizSubmit}
                          disabled={!selectedAnswer}
                          className="w-full"
                        >
                          Submit Answer
                        </Button>
                      ) : (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${
                          quizResult 
                            ? 'bg-success/10 text-success-foreground border-success/20' 
                            : 'bg-destructive/10 text-destructive-foreground border-destructive/20'
                        }`}>
                          {quizResult ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                          <div>
                            <p className="font-medium">
                              {quizResult ? 'Correct!' : 'Not quite right.'}
                            </p>
                            <p className="text-sm opacity-80">
                              The correct answer is: {currentCard.quiz.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
          >
            <PrevIcon className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCardIndex(index);
                  resetQuizState();
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentCardIndex
                    ? 'bg-primary'
                    : completedCards.has(cards[index].id)
                    ? 'bg-success'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentCardIndex === cards.length - 1}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learning;