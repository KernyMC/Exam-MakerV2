
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, CheckCircle, XCircle, Shuffle, BookOpen } from "lucide-react";

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [difficultCards, setDifficultCards] = useState<number[]>([]);

  // Mock flashcards data - en una app real vendría de una API
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      question: "¿En qué año comenzó la Guerra Civil Española?",
      answer: "1936",
      category: "Historia"
    },
    {
      id: 2,
      question: "¿Quién fue el primer presidente de la Segunda República?",
      answer: "Niceto Alcalá-Zamora",
      category: "Historia" 
    },
    {
      id: 3,
      question: "¿Cuándo murió Francisco Franco?",
      answer: "1975",
      category: "Historia"
    },
    {
      id: 4,
      question: "¿Qué evento marcó el inicio de la Transición Española?",
      answer: "La muerte de Francisco Franco",
      category: "Historia"
    },
    {
      id: 5,
      question: "¿En qué año se aprobó la Constitución española actual?",
      answer: "1978",
      category: "Historia"
    }
  ]);

  const handleKnowIt = () => {
    const cardId = flashcards[currentCard].id;
    if (!completedCards.includes(cardId)) {
      setCompletedCards(prev => [...prev, cardId]);
    }
    nextCard();
  };

  const handleRepeat = () => {
    const cardId = flashcards[currentCard].id;
    if (!difficultCards.includes(cardId)) {
      setDifficultCards(prev => [...prev, cardId]);
    }
    nextCard();
  };

  const nextCard = () => {
    setShowAnswer(false);
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(prev => prev + 1);
    } else {
      // Reiniciar con cartas difíciles si las hay
      if (difficultCards.length > 0) {
        const difficultCardsList = flashcards.filter(card => difficultCards.includes(card.id));
        setFlashcards(difficultCardsList);
        setCurrentCard(0);
        setDifficultCards([]);
      }
    }
  };

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCard(0);
    setShowAnswer(false);
  };

  const resetSession = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setCompletedCards([]);
    setDifficultCards([]);
  };

  const progress = ((currentCard + 1) / flashcards.length) * 100;

  if (flashcards.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="bg-white text-center py-16">
          <CardContent>
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No hay flash-cards disponibles</h2>
            <p className="text-gray-500 mb-6">
              Crea flash-cards convirtiendo las preguntas de tus exámenes
            </p>
            <Button onClick={() => window.location.href = "/exams"}>
              Ver mis exámenes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentCard];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Flash-cards</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={shuffleCards}>
              <Shuffle className="w-4 h-4 mr-2" />
              Mezclar
            </Button>
            <Button variant="outline" size="sm" onClick={resetSession}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Badge variant="outline">
            {currentCard + 1} de {flashcards.length}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Conocidas: {completedCards.length}
          </Badge>
          <Badge className="bg-orange-100 text-orange-800">
            <XCircle className="w-3 h-3 mr-1" />
            Por repetir: {difficultCards.length}
          </Badge>
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000 mb-8">
        <Card 
          className={`relative w-full h-80 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
            showAnswer ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Front side (Question) */}
          <div className={`absolute inset-0 backface-hidden ${showAnswer ? 'opacity-0' : 'opacity-100'}`}>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="secondary">{currentFlashcard.category}</Badge>
                <Badge variant="outline">Pregunta</Badge>
              </div>
              <CardTitle className="text-2xl text-blue-600">Haz clic para revelar la respuesta</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full pt-0">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xl text-gray-800 leading-relaxed max-w-md">
                  {currentFlashcard.question}
                </p>
              </div>
            </CardContent>
          </div>

          {/* Back side (Answer) */}
          <div className={`absolute inset-0 backface-hidden rotate-y-180 ${showAnswer ? 'opacity-100' : 'opacity-0'}`}>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="secondary">{currentFlashcard.category}</Badge>
                <Badge className="bg-green-100 text-green-800">Respuesta</Badge>
              </div>
              <CardTitle className="text-xl text-gray-600">¿Conocías la respuesta?</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full pt-0">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-700 mb-4">
                  {currentFlashcard.answer}
                </p>
                <p className="text-sm text-gray-500">
                  {currentFlashcard.question}
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      {showAnswer && (
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={handleRepeat}
            variant="outline"
            size="lg"
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Repetir
          </Button>
          
          <Button 
            onClick={handleKnowIt}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Lo sé
          </Button>
        </div>
      )}

      {!showAnswer && (
        <div className="text-center">
          <p className="text-gray-500 mb-4">Haz clic en la tarjeta para ver la respuesta</p>
          <Button variant="outline" onClick={handleFlip}>
            Revelar respuesta
          </Button>
        </div>
      )}

      {/* Session completed */}
      {currentCard === flashcards.length - 1 && completedCards.includes(currentFlashcard.id) && difficultCards.length === 0 && (
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">¡Sesión completada!</h3>
            <p className="text-green-700 mb-4">
              Has repasado todas las flash-cards. ¡Excelente trabajo!
            </p>
            <Button onClick={resetSession} className="bg-green-600 hover:bg-green-700">
              Nueva sesión
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Flashcards;
