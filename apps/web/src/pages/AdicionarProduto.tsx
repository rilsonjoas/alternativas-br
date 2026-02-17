import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Upload, CheckCircle } from "lucide-react";
import { FormEvent } from "react";
import { submitSuggestion } from "@/hooks/useFirebase";

const AdicionarProduto = () => {
  const { toast } = useToast();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const payload = {
      name: formData.get("nome") as string,
      description: formData.get("descricao") as string,
      category: formData.get("categoria") as string,
      pricing: formData.get("preco") as string,
      website: formData.get("site") as string,
      alternativeTo: formData.get("substitui") as string,
      contactEmail: formData.get("contato") as string,
      observations: formData.get("observacoes") as string,
    };

    try {
      await submitSuggestion(payload);
      toast({
        title: "Sugestão enviada!",
        description: "Recebemos sua sugestão e vamos revisar em breve.",
        variant: "default"
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar sugestão",
        description: "Tente novamente ou envie para aalternativabr@gmail.com.",
        variant: "destructive"
      });
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Adicionar Produto - AlternativasBR",
    description: "Envie uma sugestão de software brasileiro para o nosso catálogo.",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Adicionar Produto | AlternativasBR"
        description="Sugira um software brasileiro para entrar no nosso ranking e catálogo."
        canonical="/adicionar"
        jsonLd={jsonLd}
      />
      <Header />

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <PlusCircle className="text-primary" /> Adicionar produto
          </h1>
          <p className="text-muted-foreground mt-2">Envie sua sugestão de ferramenta brasileira. Amamos boas descobertas!</p>
        </div>
      </header>

      <main>
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3">
            <form onSubmit={onSubmit} className="md:col-span-2 space-y-5">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium mb-2">Nome do produto</label>
                <Input name="nome" id="nome" placeholder="Ex.: Pipefy" required />
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea name="descricao" id="descricao" placeholder="O que esse produto faz?" required rows={5} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium mb-2">Categoria</label>
                  <Select name="categoria" required>
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                      <SelectItem value="design">Design & UX</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="produtividade">Produtividade</SelectItem>
                      <SelectItem value="fintech">Fintech</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium mb-2">Modelo de preço</label>
                <Input name="preco" id="preco" placeholder="Ex.: Gratuito, Freemium, Pago" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="site" className="block text-sm font-medium mb-2">Site oficial</label>
                <Input name="site" id="site" type="url" placeholder="URL oficial (opcional)" />
                </div>
                <div>
                  <label htmlFor="substitui" className="block text-sm font-medium mb-2">Substitui (separar por vírgulas)</label>
                  <Input name="substitui" id="substitui" placeholder="Ex.: Trello, Jira" />
                </div>
              </div>
              <div>
                <label htmlFor="contato" className="block text-sm font-medium mb-2">Email para contato (opcional)</label>
                <Input name="contato" id="contato" placeholder="Seu email para contato (opcional)" />
              </div>
              <div>
                <label htmlFor="logo" className="block text-sm font-medium mb-2">Logo (opcional)</label>
                <div className="flex items-center gap-3">
                <Input name="logo" id="logo" type="file" accept="image/*" />
                  <Button type="button" variant="outline" onClick={() => alert("Upload real em breve")}> 
                    <Upload /> Pré-visualizar
                  </Button>
                </div>
              </div>
              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium mb-2">Observações (opcional)</label>
                <Textarea name="observacoes" id="observacoes" placeholder="Observações (opcional)" rows={3} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="accent">
                  <CheckCircle /> Enviar sugestão
                </Button>
              </div>
            </form>

            <aside className="p-6 rounded-xl border border-border/50 bg-card h-fit">
              <h2 className="text-lg font-semibold mb-2">Dicas para aprovação</h2>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Produto precisa ter operação no Brasil.</li>
                <li>Descreva claramente o diferencial.</li>
                <li>Inclua links úteis (documentação, site, blog).</li>
              </ul>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdicionarProduto;
