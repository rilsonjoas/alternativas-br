import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Categorias from "./pages/Categorias";
import Alternativas from "./pages/Alternativas";
import Sobre from "./pages/Sobre";
import Ranking from "./pages/Ranking";
import AdicionarProduto from "./pages/AdicionarProduto";
import Contato from "./pages/Contato";

// Templates dinâmicos
import CategoryTemplate from "./pages/CategoryTemplate";
import ProductTemplate from "./pages/ProductTemplate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/adicionar" element={<AdicionarProduto />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/produto/:slug" element={<ProductTemplate />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
