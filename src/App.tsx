import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import Guests from "./pages/Guests";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/billing" element={<ComingSoon title="Facturation" description="Gestion des factures et paiements" />} />
          <Route path="/staff" element={<ComingSoon title="Personnel" description="Gestion du personnel et des horaires" />} />
          <Route path="/restaurant" element={<ComingSoon title="Restauration" description="Gestion du restaurant et services" />} />
          <Route path="/reports" element={<ComingSoon title="Rapports" description="Statistiques et analyses" />} />
          <Route path="/settings" element={<ComingSoon title="Paramètres" description="Configuration du système" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
