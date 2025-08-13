import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Alt = {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: string;
  replaces: string[];
  icon: string;
};

const alternatives: Alt[] = [
  {
    id: "rd-station",
    name: "RD Station",
    description: "Plataforma de automação de marketing e CRM brasileira.",
    category: "Marketing",
    pricing: "Pago (planos)",
    replaces: ["HubSpot", "Mailchimp"],
    icon: "🚀",
  },
  {
    id: "vtex",
    name: "VTEX",
    description: "Plataforma enterprise de e-commerce brasileira.",
    category: "E-commerce",
    pricing: "Pago (enterprise)",
    replaces: ["Shopify Plus", "Magento"],
    icon: "🛍️",
  },
  {
    id: "pipefy",
    name: "Pipefy",
    description: "Gestão de processos e automações no-code.",
    category: "Produtividade",
    pricing: "Freemium / Pago",
    replaces: ["Jira", "Trello", "Monday"],
    icon: "🧩",
  },
  {
    id: "hotmart",
    name: "Hotmart",
    description: "Plataforma para venda de produtos digitais.",
    category: "E-commerce",
    pricing: "Taxas sobre vendas",
    replaces: ["Gumroad", "Kajabi"],
    icon: "🔥",
  },
  {
    id: "asaas",
    name: "Asaas",
    description: "Cobranças, pagamentos e gestão financeira para negócios.",
    category: "Fintech",
    pricing: "Taxas / Pago",
    replaces: ["Stripe", "PayPal"],
    icon: "💳",
  },
  {
    id: "bling",
    name: "Bling",
    description: "ERP online para pequenas e médias empresas.",
    category: "ERP",
    pricing: "Pago",
    replaces: ["Zoho Books", "QuickBooks"],
    icon: "📦",
  },
  {
    id: "conta-azul",
    name: "Conta Azul",
    description: "Gestão financeira e emissão de notas para PMEs.",
    category: "Finanças",
    pricing: "Pago",
    replaces: ["QuickBooks", "Xero"],
    icon: "🧾",
  },
  {
    id: "take-blip",
    name: "Take Blip",
    description: "Plataforma de chatbots e atendimento em canais digitais.",
    category: "Atendimento",
    pricing: "Pago",
    replaces: ["Intercom", "Zendesk"],
    icon: "💬",
  },
  {
    id: "clicksign",
    name: "Clicksign",
    description: "Assinatura eletrônica com validade jurídica no Brasil.",
    category: "Assinaturas",
    pricing: "Pago",
    replaces: ["DocuSign", "Adobe Sign"],
    icon: "✍️",
  },
];

const Alternativas = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: alternatives.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'SoftwareApplication', name: a.name, applicationCategory: a.category, description: a.description }
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Alternativas | Alternativas BR"
        description="Catálogo curado de softwares brasileiros por categoria."
        canonical="/alternativas"
        jsonLd={jsonLd}
      />
      <Header />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Alternativas brasileiras de software</h1>
          <p className="text-muted-foreground mt-2">Explore ferramentas nacionais que substituem soluções internacionais.</p>
        </div>
      </header>

      <main>
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternatives.map((alt) => (
                <article key={alt.id} className="contents">
                  <Card className="group hover:shadow-card transition-all duration-300 border-border/50 bg-card hover:bg-card/80 cursor-pointer">
                    <Link to={`/produto/${alt.id}`} className="block h-full">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300" aria-hidden>
                            {alt.icon}
                          </div>
                          <Badge variant="secondary">{alt.category}</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{alt.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm">{alt.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {alt.replaces.map((r) => (
                            <Badge key={r} variant="outline" className="text-xs">
                              Substitui {r}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Modelo:</span> {alt.pricing}
                          </p>
                          <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-sm font-medium mr-1">Ver detalhes</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Alternativas;
