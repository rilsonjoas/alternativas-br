import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import FeaturedAlternatives from "@/components/sections/FeaturedAlternatives";
import Stats from "@/components/sections/Stats";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Categories />
        <Stats />
        <FeaturedAlternatives />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
