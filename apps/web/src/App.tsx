import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Alternativas from "./pages/Alternativas";
import Sobre from "./pages/Sobre";
import AdicionarProduto from "./pages/AdicionarProduto";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import SearchResults from "./pages/SearchResults";
import ProtectedRoute from "@/components/ProtectedRoute";
import ManageUnifiedProducts from "./pages/ManageUnifiedProducts";
import ManageSuggestions from "./pages/ManageSuggestions";
import WidgetGenerator from "./pages/WidgetGenerator";

// Templates dinâmicos
import ProductTemplate from "./pages/ProductTemplate";

import { HelmetProvider } from "react-helmet-async";
import { initGA } from "@/lib/analytics";
import { RouteTracker } from "@/components/RouteTracker";

// Inicializa GA4
initGA();

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <RouteTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/alternativas" element={<Alternativas />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/adicionar" element={<AdicionarProduto />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/buscar" element={<SearchResults />} />
              <Route path="/produto/:slug" element={<ProductTemplate />} />
              <Route path="/login" element={<Login />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/dashboard" element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/produtos" element={
                <ProtectedRoute adminOnly>
                  <ManageUnifiedProducts />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/sugestoes" element={
                <ProtectedRoute adminOnly>
                  <ManageSuggestions />
                </ProtectedRoute>
              } />
              <Route path="/parceiros" element={<WidgetGenerator />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
