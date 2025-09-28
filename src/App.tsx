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

// Templates dinâmicos
import ProductTemplate from "./pages/ProductTemplate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
