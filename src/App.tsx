import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import TouristOnboarding from "./pages/TouristOnboarding";
import TouristMap from "./pages/TouristMap";
import TouristAlerts from "./pages/TouristAlerts";
import TouristSettings from "./pages/TouristSettings";
import OfficerDashboard from "./pages/OfficerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TouristOnboarding />} />
            <Route path="map" element={<TouristMap />} />
            <Route path="alerts" element={<TouristAlerts />} />
            <Route path="settings" element={<TouristSettings />} />
            <Route path="officer" element={<OfficerDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
