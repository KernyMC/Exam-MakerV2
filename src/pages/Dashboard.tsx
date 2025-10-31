
import { useState } from "react";
import { Plus, Upload, Play, BookOpen, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginModal } from "@/components/LoginModal";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleActionClick = (action: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    // Aquí iría la navegación normal
    console.log(`Navegando a: ${action}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">
          {user ? `¡Hola, ${user.name}!` : "¡Bienvenido a Exam Maker!"}
        </h1>
        <p className="text-gray-600">
          {user 
            ? "Gestiona tus exámenes y mejora tu aprendizaje con IA"
            : "Crea, practica y domina tus exámenes con inteligencia artificial"
          }
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-blue-800">Generar examen IA</CardTitle>
                <CardDescription className="text-blue-600">
                  Crea preguntas automáticamente desde PDFs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => handleActionClick('/generate')}
            >
              Comenzar ahora
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-green-800">Subir examen Aiken</CardTitle>
                <CardDescription className="text-green-600">
                  Importa tus exámenes en formato Aiken
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleActionClick('/upload-aiken')}
            >
              Subir archivo
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-purple-800">Practicar último</CardTitle>
                <CardDescription className="text-purple-600">
                  Continúa con tu último examen
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => handleActionClick('/practice')}
            >
              Practicar ahora
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de exámenes
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">12</div>
              <p className="text-xs text-gray-500">+2 desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Promedio de calificación
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">87%</div>
              <p className="text-xs text-green-600">+5% desde la semana pasada</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tiempo de estudio
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">24h</div>
              <p className="text-xs text-gray-500">Esta semana</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Flash-cards activas
              </CardTitle>
              <BookOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">156</div>
              <p className="text-xs text-gray-500">En 3 mazos</p>
            </CardContent>
          </Card>
        </div>
      )}

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}
