
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, BookmarkIcon, Save, ArrowLeft, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ExamView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [examData, setExamData] = useState({
    name: "Historia de España - Siglo XX",
    category: "Historia",
    difficulty: "Media",
    questions: [
      {
        id: 1,
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
        id: 2,
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
        id: 3,
        question: "¿Cuándo murió Francisco Franco?",
        options: {
          A: "1974",
          B: "1975",
          C: "1976",
          D: "1977"
        },
        answer: "B"
      }
    ]
  });

  const handleQuestionChange = (questionId: number, field: string, value: string) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, [field]: value }
          : q
      )
    }));
  };

  const handleOptionChange = (questionId: number, option: string, value: string) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: { ...q.options, [option]: value } }
          : q
      )
    }));
  };

  const handleSave = () => {
    toast({
      title: "Examen guardado",
      description: "Los cambios se han guardado correctamente",
    });
    setIsEditing(false);
  };

  const convertToFlashcards = () => {
    toast({
      title: "Flash-cards creadas",
      description: `Se han convertido ${examData.questions.length} preguntas en flash-cards`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800";
      case "Media": return "bg-yellow-100 text-yellow-800";
      case "Difícil": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/exams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{examData.category}</Badge>
            <Badge className={getDifficultyColor(examData.difficulty)}>
              {examData.difficulty}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{examData.name}</h1>
            <p className="text-gray-600">{examData.questions.length} preguntas • Formato Aiken</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </>
              )}
            </Button>
            
            <Link to={`/practice/${id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Play className="w-4 h-4 mr-2" />
                Practicar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Acciones rápidas</h3>
              <p className="text-purple-100">Convierte este examen en otros formatos de estudio</p>
            </div>
            <Button 
              onClick={convertToFlashcards}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <BookmarkIcon className="w-4 h-4 mr-2" />
              Convertir a flash-cards
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-6">
        {examData.questions.map((question, index) => (
          <Card key={question.id} className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Pregunta {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Enunciado de la pregunta
                </label>
                {isEditing ? (
                  <Textarea
                    value={question.question}
                    onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg border">{question.question}</p>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <div key={option}>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Opción {option} {question.answer === option && (
                        <Badge className="ml-2 bg-green-100 text-green-800">Correcta</Badge>
                      )}
                    </label>
                    {isEditing ? (
                      <Input
                        value={question.options[option as keyof typeof question.options]}
                        onChange={(e) => handleOptionChange(question.id, option, e.target.value)}
                      />
                    ) : (
                      <p className={`p-3 rounded-lg border ${
                        question.answer === option 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        {question.options[option as keyof typeof question.options]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Answer Selection (only in edit mode) */}
              {isEditing && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Respuesta correcta
                  </label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <Button
                        key={option}
                        variant={question.answer === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleQuestionChange(question.id, 'answer', option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export/Practice Footer */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Listo para practicar?</h3>
            <p className="text-blue-600 mb-4">Pon a prueba tus conocimientos con este examen</p>
            <Link to={`/practice/${id}`}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Play className="w-5 h-5 mr-2" />
                Comenzar práctica
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamView;
