import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import FeaturedAlternatives from "@/components/sections/FeaturedAlternatives";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Alternativas BR - Descubra Softwares Brasileiros" 
        description="O maior diretório de softwares e SaaS brasileiros. Encontre a alternativa nacional ideal para as ferramentas que você já usa."
        canonical="/"
      />
      <Header />
      <main>
        <Hero />
        <FeaturedAlternatives />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
