import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PatientDashboard from "./pages/PatientDashboard";
import PatientMobile from "./pages/PatientMobile";
import DoctorDashboard from "./pages/DoctorDashboard";
import Chat from "./pages/Chat";
import Records from "./pages/Records";
import NotFound from "./pages/NotFound";
import EmergencyDashboardPage from "./pages/EmergencyDashboardPage";
import DoctorPortal from "@/pages/DoctorPortal";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/patient/*" element={<PatientDashboard />} />
              <Route path="/mobile" element={<PatientMobile />} />
              <Route path="/doctor/*" element={<DoctorDashboard />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/records" element={<Records />} />
              <Route path="/emergency" element={<EmergencyDashboardPage />} />
              <Route path="/doctor" element={<DoctorPortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
