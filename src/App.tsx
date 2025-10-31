import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import Dashboard from "./pages/Dashboard";
import GenerateExam from "./pages/GenerateExam";
import UploadAiken from "./pages/UploadAiken";
import MyExams from "./pages/MyExams";
import ExamView from "./pages/ExamView";
import Practice from "./pages/Practice";
import Flashcards from "./pages/Flashcards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/generate" element={<GenerateExam />} />
                    <Route path="/upload-aiken" element={<UploadAiken />} />
                    <Route path="/exams" element={<MyExams />} />
                    <Route path="/exams/:id" element={<ExamView />} />
                    <Route path="/practice/:id" element={<Practice />} />
                    <Route path="/flashcards" element={<Flashcards />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
