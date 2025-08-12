import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  MessageSquare, 
  Github, 
  Twitter, 
  Send,
  Clock,
  Users,
  Heart
} from "lucide-react";

const Contato = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contato - Alternativas BR",
    description: "Entre em contato conosco para sugestões, parcerias ou dúvidas sobre alternativas brasileiras de software",
    mainEntity: {
      "@type": "Organization",
      name: "Alternativas BR",
      email: "contato@alternativas-br.com.br",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "Portuguese"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contato | Alternativas BR"
        description="Entre em contato conosco para sugestões, parcerias ou dúvidas sobre alternativas brasileiras de software."
        canonical="/contato"
        jsonLd={jsonLd}
      />
      <Header />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Fale Conosco</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Tem uma sugestão, dúvida ou quer fazer parte da nossa missão? 
            Adoraríamos ouvir você!
          </p>
        </div>
      </header>

      <main>
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Formulário de Contato */}
              <div>
                <Card className="border-border/50 bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Envie sua mensagem
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome</Label>
                          <Input 
                            id="nome" 
                            placeholder="Seu nome completo" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="seu@email.com" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="empresa">Empresa (opcional)</Label>
                        <Input 
                          id="empresa" 
                          placeholder="Nome da sua empresa" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="assunto">Assunto</Label>
                        <Input 
                          id="assunto" 
                          placeholder="Sobre o que você quer falar?" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="mensagem">Mensagem</Label>
                        <Textarea 
                          id="mensagem"
                          placeholder="Conte-nos mais detalhes..."
                          rows={6}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" variant="hero">
                        Enviar Mensagem
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-6">
                <Card className="border-border/50 bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Como podemos ajudar?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Sugestões de Produtos</h3>
                      <p className="text-sm text-muted-foreground">
                        Conhece um software brasileiro incrível? Queremos saber!
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Parcerias</h3>
                      <p className="text-sm text-muted-foreground">
                        Interessado em colaborar ou fazer parte do projeto?
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Feedback</h3>
                      <p className="text-sm text-muted-foreground">
                        Sugestões para melhorar a plataforma são sempre bem-vindas.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-gradient-card">
                  <CardHeader>
                    <CardTitle>Outras formas de contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Github className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">GitHub</p>
                        <a 
                          href="https://github.com/rilsonjoas/alternativas-br" 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Contribua no GitHub
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <a 
                          href="mailto:contato@alternativas-br.com.br" 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          contato@alternativas-br.com.br
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Twitter className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Twitter</p>
                        <a 
                          href="https://twitter.com/alternativasbr" 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @alternativasbr
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Tempo de resposta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Respondemos em até 48h (dias úteis)
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Projeto colaborativo e voluntário</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-10 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-foreground">
                Feito com amor pela tecnologia brasileira
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Este projeto é uma iniciativa da comunidade para valorizar e promover 
              soluções tecnológicas desenvolvidas no Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <a href="/adicionar">Sugerir Produto</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/sobre">Saiba Mais</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contato;
