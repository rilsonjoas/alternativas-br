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
import Ranking from "./pages/Ranking";
import AdicionarProduto from "./pages/AdicionarProduto";
import Contato from "./pages/Contato";
import SearchResults from "./pages/SearchResults";
import ExploreProducts from "./pages/ExploreProducts";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPassword from "./pages/ForgotPassword";
import UserProfile from "./pages/UserProfile";
import UserSettings from "./pages/UserSettings";

// Templates dinâmicos
import CategoryTemplate from "./pages/CategoryTemplate";
import ProductTemplate from "./pages/ProductTemplate";

// Páginas de admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminSetup from "./pages/admin/AdminSetup";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

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
            <Route path="/explorar" element={<ExploreProducts />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/adicionar" element={<AdicionarProduto />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/produto/:slug" element={<ProductTemplate />} />
            <Route path="/buscar" element={<SearchResults />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/registrar" element={<RegisterForm />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/perfil" element={<UserProfile />} />
            <Route path="/configuracoes" element={<UserSettings />} />
            
            {/* Rotas de Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin/categorias" element={<AdminCategories />} />
            <Route path="/admin/produtos" element={<AdminProducts />} />
            <Route path="/admin/produtos/novo" element={<AdminProductForm />} />
            <Route path="/admin/produtos/:id/editar" element={<AdminProductForm />} />
            <Route path="/admin/avaliacoes" element={<AdminReviews />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/configuracoes" element={<AdminSettings />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
