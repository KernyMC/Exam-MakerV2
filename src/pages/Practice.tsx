import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, List, LayoutGrid, Dice5 } from "lucide-react";
import confetti from 'canvas-confetti';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Definiciones de tipos para evitar any
interface Question {
  question: string;
  options: Record<string, string>;
  answer: string;
}
interface ExamData {
  name: string;
  questions: Question[];
}

const Practice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'moodle' | 'list'>('moodle');
  const [feedback, setFeedback] = useState<{ [key: number]: boolean }>({});
  const [showNav, setShowNav] = useState(true);
  const [navExpanded, setNavExpanded] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [shake, setShake] = useState<{ qIdx: number; option: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/exams");
      return;
    }
    if (id === "imported") {
      const imported = localStorage.getItem("importedExam");
      if (imported) {
        setExamData(JSON.parse(imported));
      } else {
        alert("No hay examen importado disponible. Sube uno desde la sección correspondiente.");
        navigate("/upload-aiken");
      }
      setLoading(false);
    } else {
      setExamData({
        name: "Historia de España - Siglo XX",
        questions: [
          {
            question: "¿En qué año comenzó la Guerra Civil Española?",
            options: {
              A: "1935",
              B: "1936", 
              C: "1937",
              D: "1938"
            },
            answer: "B"
          },
          {
            question: "¿Quién fue el primer presidente de la Segunda República?",
            options: {
              A: "Manuel Azaña",
              B: "Niceto Alcalá-Zamora",
              C: "Alejandro Lerroux", 
              D: "Francisco Largo Caballero"
            },
            answer: "B"
          },
          {
            question: "¿Cuándo murió Francisco Franco?",
            options: {
              A: "1974",
              B: "1975",
              C: "1976",
              D: "1977"
            },
            answer: "B"
          },
          {
            question: "¿Qué evento marcó el inicio de la Transición Española?",
            options: {
              A: "La muerte de Franco",
              B: "La aprobación de la Constitución",
              C: "Las primeras elecciones democráticas",
              D: "El 23-F"
            },
            answer: "A"
          },
          {
            question: "¿En qué año se aprobó la Constitución española actual?",
            options: {
              A: "1977",
              B: "1978",
              C: "1979", 
              D: "1980"
            },
            answer: "B"
          }
        ]
      });
      setLoading(false);
    }
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [id, navigate, startTime]);

  useEffect(() => {
    if (!examData || !examData.questions) return;
    if (Object.keys(selectedAnswers).length === examData.questions.length) {
      setShowFinalModal(true);
    }
  }, [selectedAnswers, examData]);

  const handleAnswerSelect = (option: string, qIdx?: number) => {
    const idx = qIdx !== undefined ? qIdx : currentQuestion;
    setSelectedAnswers(prev => ({ ...prev, [idx]: option }));
    if (examData && examData.questions[idx]) {
      setFeedback(prev => ({ ...prev, [idx]: option === examData.questions[idx].answer }));
      if (option !== examData.questions[idx].answer) {
        setShake({ qIdx: idx, option });
        setTimeout(() => setShake(null), 400);
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(200);
        }
      }
    }
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => examData && examData.questions[idx] && ans === examData.questions[idx].answer
  ).length;
  const wrongCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => examData && examData.questions[idx] && ans !== examData.questions[idx].answer
  ).length;

  const handleViewChange = (mode: 'moodle' | 'list') => setViewMode(mode);

  const handleNext = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    setShowConfirmModal(true);
  };

  const calculateResults = () => {
    const correctAnswers = examData.questions.filter((q, index) => 
      selectedAnswers[index] === q.answer
    ).length;
    
    const percentage = Math.round((correctAnswers / examData.questions.length) * 100);
    
    const wrongAnswers = examData.questions
      .map((q, index) => ({ ...q, questionIndex: index }))
      .filter((q, index) => selectedAnswers[index] !== q.answer);

    return { correctAnswers, percentage, wrongAnswers };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shuffleQuestions = () => {
    if (!examData) return;
    const shuffled = [...examData.questions].sort(() => Math.random() - 0.5);
    setExamData({ ...examData, questions: shuffled });
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setFeedback({});
  };

  if (loading || !examData || !examData.questions) {
    return <div className="p-8 text-center text-gray-500">Cargando examen...</div>;
  }

  if (showResults) {
    const { correctAnswers, percentage, wrongAnswers } = calculateResults();
    
    const totalAnswered = Object.keys(selectedAnswers).length;
    const totalQuestions = examData.questions.length;
    let finalMsg = "";
    if (totalAnswered === totalQuestions) {
      if (percentage >= 70) {
        finalMsg = `¡Felicidades! Has respondido correctamente el ${percentage}% 🎉`;
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      } else {
        finalMsg = `¡Ánimo! Has respondido correctamente el ${percentage}%. ¡Sigue practicando! ✨`;
      }
    }

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="bg-white">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 mx-auto mb-4">
              {percentage >= 70 ? (
                <CheckCircle className="w-20 h-20 text-green-500" />
              ) : (
                <XCircle className="w-20 h-20 text-red-500" />
              )}
            </div>
            <CardTitle className="text-3xl mb-2">
              {percentage >= 70 ? "¡Excelente trabajo!" : "Sigue practicando"}
            </CardTitle>
            <p className="text-gray-600">Has completado el examen "{examData.name}"</p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{percentage}%</div>
                <div className="text-sm text-blue-700">Puntuación final</div>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {correctAnswers}/{examData.questions.length}
                </div>
                <div className="text-sm text-green-700">Respuestas correctas</div>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">{formatTime(timeSpent)}</div>
                <div className="text-sm text-purple-700">Tiempo empleado</div>
              </div>
            </div>

            {/* Wrong Answers */}
            {wrongAnswers.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Respuestas incorrectas</h3>
                <div className="space-y-4">
                  {wrongAnswers.map((question, index) => (
                    <Card key={index} className="border border-red-200 bg-red-50">
                      <CardContent className="p-4">
                        <p className="font-medium text-gray-800 mb-3">
                          Pregunta {question.questionIndex + 1}: {question.question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-red-600 mb-1">Tu respuesta:</p>
                            <p className="bg-red-100 p-2 rounded border">
                              {selectedAnswers[question.questionIndex] ? 
                                `${selectedAnswers[question.questionIndex]}) ${question.options[selectedAnswers[question.questionIndex] as keyof typeof question.options]}` :
                                "Sin responder"
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-green-600 mb-1">Respuesta correcta:</p>
                            <p className="bg-green-100 p-2 rounded border">
                              {question.answer}) {question.options[question.answer as keyof typeof question.options]}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center pt-6">
              <Button 
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setSelectedAnswers({});
                }}
                variant="outline"
              >
                Repetir examen
              </Button>
              <Button onClick={() => navigate("/exams")}>
                Volver a mis exámenes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const header = (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{examData.name}</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </Badge>
          <Badge>
            {Object.keys(selectedAnswers).length} / {examData.questions.length} respondidas
          </Badge>
          <Badge className="bg-green-100 text-green-700 border-green-200">✔ {correctCount}</Badge>
          <Badge className="bg-red-100 text-red-700 border-red-200">✗ {wrongCount}</Badge>
          <Button size="icon" variant={viewMode === 'moodle' ? 'default' : 'outline'} onClick={() => handleViewChange('moodle')} title="Vista Moodle">
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button size="icon" variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => handleViewChange('list')} title="Vista Lista">
            <List className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={shuffleQuestions}
            title="Mezclar preguntas"
            className="ml-2 bg-yellow-300 border-yellow-400 text-yellow-900 shadow-md hover:scale-110 hover:border-yellow-500 hover:bg-yellow-400"
          >
            <Dice5 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <Progress value={((Object.keys(selectedAnswers).length) / examData.questions.length) * 100} className="h-2" />
    </div>
  );

  const moodleView = (
    <>
      {header}
      <Card className="bg-white mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Pregunta {currentQuestion + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-lg text-gray-800 leading-relaxed">{examData.questions[currentQuestion].question}</p>
          </div>
          <div className="space-y-3">
            {Object.entries(examData.questions[currentQuestion].options).map(([option, text]) => {
              const isSelected = selectedAnswers[currentQuestion] === option;
              const isCorrect = examData.questions[currentQuestion].answer === option;
              const answered = selectedAnswers[currentQuestion] !== undefined;
              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={answered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center gap-3
                    ${isSelected && isCorrect ? 'border-green-500 bg-green-50' : ''}
                    ${isSelected && !isCorrect ? 'border-red-500 bg-red-50' : ''}
                    ${!isSelected && isCorrect && answered ? 'border-green-300 bg-green-50' : ''}
                    ${!isSelected && !isCorrect && answered ? 'border-gray-200' : ''}
                    ${(shake && shake.qIdx === currentQuestion && shake.option === option) ? 'shake' : ''}
                  `}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold
                    ${isSelected && isCorrect ? 'border-green-500 bg-green-500 text-white' : ''}
                    ${isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' : ''}
                    ${!isSelected && isCorrect && answered ? 'border-green-300 bg-green-100 text-green-700' : ''}
                    ${!isSelected && !isCorrect && answered ? 'border-gray-300 text-gray-600' : ''}
                  `}>
                    {option}
                  </div>
                  <span className="text-gray-800">{text}</span>
                  {answered && isSelected && isCorrect && <span className="ml-2 text-green-600 font-bold">✔ Correcta</span>}
                  {answered && isSelected && !isCorrect && <span className="ml-2 text-red-600 font-bold">✗ Incorrecta</span>}
                  {answered && !isSelected && isCorrect && <span className="ml-2 text-green-600 font-bold">✔ Correcta</span>}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
          <ChevronLeft className="w-4 h-4 mr-2" />Anterior
        </Button>
        <div className="text-sm text-gray-500">
          {Object.keys(selectedAnswers).length} de {examData.questions.length} respondidas
        </div>
        {currentQuestion === examData.questions.length - 1 ? (
          <Button variant="outline" onClick={() => { console.log('Finalizar presionado'); setShowConfirmModal(true); }}>
            Finalizar
          </Button>
        ) : (
          <Button variant="outline" onClick={handleNext}>
            Siguiente<ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </>
  );

  const listView = (
    <>
      {header}
      {examData.questions.map((q: Question, idx: number) => (
        <Card className="bg-white mb-6" key={idx}>
          <CardHeader>
            <CardTitle className="text-xl">Pregunta {idx + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-lg text-gray-800 leading-relaxed">{q.question}</p>
            </div>
            <div className="space-y-3">
              {Object.entries(q.options).map(([option, text]) => {
                const isSelected = selectedAnswers[idx] === option;
                const isCorrect = q.answer === option;
                const answered = selectedAnswers[idx] !== undefined;
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option, idx)}
                    disabled={answered}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center gap-3
                      ${isSelected && isCorrect ? 'border-green-500 bg-green-50' : ''}
                      ${isSelected && !isCorrect ? 'border-red-500 bg-red-50' : ''}
                      ${!isSelected && isCorrect && answered ? 'border-green-300 bg-green-50' : ''}
                      ${!isSelected && !isCorrect && answered ? 'border-gray-200' : ''}
                      ${(shake && shake.qIdx === idx && shake.option === option) ? 'shake' : ''}
                    `}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold
                      ${isSelected && isCorrect ? 'border-green-500 bg-green-500 text-white' : ''}
                      ${isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' : ''}
                      ${!isSelected && isCorrect && answered ? 'border-green-300 bg-green-100 text-green-700' : ''}
                      ${!isSelected && !isCorrect && answered ? 'border-gray-300 text-gray-600' : ''}
                    `}>
                      {option}
                    </div>
                    <span className="text-gray-800">{text}</span>
                    {answered && isSelected && isCorrect && <span className="ml-2 text-green-600 font-bold">✔ Correcta</span>}
                    {answered && isSelected && !isCorrect && <span className="ml-2 text-red-600 font-bold">✗ Incorrecta</span>}
                    {answered && !isSelected && isCorrect && <span className="ml-2 text-green-600 font-bold">✔ Correcta</span>}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );

  return (
    <>
      <div className="flex w-full min-h-screen">
        {/* Contenido principal */}
        <div className={`flex-1 transition-all duration-300 ${viewMode === 'moodle' && showNav ? 'lg:mr-80' : ''} p-6 max-w-4xl mx-auto`}> 
          {viewMode === 'moodle' ? moodleView : listView}
        </div>
        {/* Navegador lateral derecho tipo Moodle SOLO en vista Moodle */}
        {viewMode === 'moodle' && (
          <div className={`hidden lg:flex flex-col items-center bg-white border-l border-blue-200 shadow-md transition-all duration-300 ${showNav ? 'w-80' : 'w-0 overflow-hidden'} h-full fixed right-0 top-0 z-30 pt-24`}>
            {showNav && (
              <>
                <button
                  onClick={() => setShowNav(false)}
                  className="mb-4 mt-2 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 hover:bg-blue-200"
                  title="Ocultar navegador"
                >
                  &gt;
                </button>
                <div className="w-full px-4">
                  <div className={`grid grid-cols-5 gap-2 ${navExpanded ? '' : 'max-h-72 overflow-hidden'}`}>
                    {(navExpanded ? examData.questions : examData.questions.slice(0, 45)).map((q, idx) => {
                      const answered = selectedAnswers[idx] !== undefined;
                      const isCorrect = answered && selectedAnswers[idx] === q.answer;
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`w-12 h-12 rounded-[15px] border-2 font-bold transition-all flex items-center justify-center text-lg
                            ${currentQuestion === idx ? 'border-blue-600 bg-blue-100' : ''}
                            ${answered && isCorrect ? 'border-green-500 bg-green-100 text-green-700' : ''}
                            ${answered && !isCorrect ? 'border-red-500 bg-red-100 text-red-700' : ''}
                            ${!answered && currentQuestion !== idx ? 'border-gray-300 bg-white text-gray-700' : ''}
                          `}
                          title={`Ir a pregunta ${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  {examData.questions.length > 45 && !navExpanded && (
                    <button
                      onClick={() => setNavExpanded(true)}
                      className="w-full mt-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      title="Mostrar todas las preguntas"
                    >
                      ...
                    </button>
                  )}
                  {navExpanded && examData.questions.length > 45 && (
                    <button
                      onClick={() => setNavExpanded(false)}
                      className="w-full mt-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      title="Mostrar menos"
                    >
                      ▲
                    </button>
                  )}
                </div>
              </>
            )}
            {!showNav && viewMode === 'moodle' && (
              <button
                onClick={() => setShowNav(true)}
                className="fixed right-0 top-1/2 z-40 w-8 h-16 rounded-l-xl bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 hover:bg-blue-200"
                style={{ transform: 'translateY(-50%)' }}
                title="Mostrar navegador"
              >
                &lt;
              </button>
            )}
          </div>
        )}
        {/* MODALES SIEMPRE DISPONIBLES */}
      </div>
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md mx-auto text-center">
          <DialogHeader>
            <DialogTitle>¿Terminar cuestionario?</DialogTitle>
          </DialogHeader>
          <div className="my-4 text-lg text-blue-700 font-semibold">
            ¿Estás seguro de que quieres terminar el cuestionario?
          </div>
          <DialogFooter>
            <Button onClick={() => { setShowConfirmModal(false); setShowResults(true); setShowFinalModal(true); }} className="bg-blue-600 text-white hover:bg-blue-700">Sí, terminar</Button>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>No, revisar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showResults && showFinalModal} onOpenChange={v => { setShowFinalModal(v); if (!v) setShowResults(false); }}>
        <DialogContent className="max-w-md mx-auto text-center">
          <DialogHeader>
            <DialogTitle>Resultados</DialogTitle>
          </DialogHeader>
          <div className="my-4 text-lg font-semibold text-blue-700">
            {(() => {
              const total = examData.questions.length;
              const correct = Object.entries(selectedAnswers).filter(([idx, ans]) => examData.questions[idx] && ans === examData.questions[idx].answer).length;
              const percentage = Math.round((correct / total) * 100);
              return percentage >= 70
                ? `¡Felicidades! Has respondido correctamente el ${percentage}% 🎉`
                : `¡Ánimo! Has respondido correctamente el ${percentage}%. ¡No te rindas, sigue practicando! ✨`;
            })()}
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button onClick={() => {
              setShowResults(false);
              setShowFinalModal(false);
              setCurrentQuestion(0);
              setSelectedAnswers({});
            }} className="bg-green-600 text-white hover:bg-green-700 w-full">Reiniciar prueba</Button>
            <Button onClick={() => { setShowResults(false); setShowFinalModal(false); navigate('/upload-aiken'); }} className="bg-blue-600 text-white hover:bg-blue-700 w-full">Volver a generar examen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Practice;