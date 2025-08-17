import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Categorias from "./pages/Categorias";
import Alternativas from "./pages/Alternativas";
import Sobre from "./pages/Sobre";
import AdicionarProduto from "./pages/AdicionarProduto";
import Contato from "./pages/Contato";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import ProtectedRoute from "@/components/ProtectedRoute";
import ManageUnifiedProducts from "./pages/ManageUnifiedProducts";
import ManageCategories from "./pages/ManageCategories";

// Templates dinâmicos
import CategoryTemplate from "./pages/CategoryTemplate";
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
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/categorias/:slug" element={<CategoryTemplate />} />
            <Route path="/alternativas" element={<Alternativas />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/adicionar" element={<AdicionarProduto />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/produto/:slug" element={<ProductTemplate />} />
            <Route path="/buscar" element={<SearchResults />} />
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
            <Route path="/dashboard/categorias" element={
              <ProtectedRoute adminOnly>
                <ManageCategories />
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
