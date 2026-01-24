import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WidgetGenerator = () => {
  const [slug, setSlug] = useState("");
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const baseUrl = "https://alternativasbr.com.br"; // Domínio oficial
  
  const widgetCode = `<a href="${baseUrl}/produto/${slug || 'seu-slug'}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;">
  <img src="${baseUrl}/badge-recomendado.svg" alt="Recomendado por AlternativasBR" width="180" height="auto" style="border:none;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
</a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    toast({ title: "Código copiado!", description: "Cole no seu site para exibir o selo." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Gerador de Widget | AlternativasBR" 
        description="Gere seu selo de empresa recomendada e mostre ao mundo que você é uma tecnologia brasileira de topo." 
      />
      <Header />

      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <header className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Selo de Empresa Recomendada</h1>
          <p className="text-xl text-muted-foreground">O selo que certifica sua solução como uma das melhores alternativas nacionais.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle>Configure seu Widget</CardTitle>
              <CardDescription>Insira o slug do seu produto para gerar o código.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Slug do Produto</label>
                <Input 
                  placeholder="ex: pipefy" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-11"
                />
                <p className="text-[10px] text-muted-foreground mt-1">O slug é a parte final da URL do seu produto no nosso site.</p>
              </div>

              <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/60">Código HTML</span>
                <pre className="text-xs bg-black text-green-400 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {widgetCode}
                </pre>
                <Button onClick={handleCopy} className="w-full gap-2 transition-all">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copiado!" : "Copiar Código"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
              <h2 className="text-xl font-bold mb-4">Pré-visualização</h2>
              <div className="bg-white p-8 rounded-2xl shadow-inner flex items-center justify-center min-h-[200px] border border-gray-100">
                <a href="#" className="transition-transform hover:scale-105 duration-300">
                  <img src="/badge-recomendado.svg" alt="Preview" width="200" className="drop-shadow-xl" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Por que usar o selo?
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  <span>Aumenta a confiança de novos usuários através de prova social.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  <span>Fortalece sua marca como uma tecnologia brasileira de qualidade.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  <span>Melhora o SEO mútuo através de links de autoridade.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WidgetGenerator;
