import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import OrgChart from "./pages/OrgChart";
import Learning from "./pages/Learning";
import NotFound from "./pages/NotFound";
import OnboardingChatbot from "./components/OnboardingChatbot";

const queryClient = new QueryClient();

const AppContent = () => (
  <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/org" element={<OrgChart />} />
      <Route path="/learn" element={<Learning />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <OnboardingChatbot />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
