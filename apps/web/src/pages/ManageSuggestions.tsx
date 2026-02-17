import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { useSuggestions, updateSuggestionStatus, deleteSuggestion } from "@/hooks/useFirebase";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ExternalLink, Mail, Clock, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const ManageSuggestions = () => {
  const { data: suggestions, isLoading, error } = useSuggestions();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleApprove = async (id: string) => {
    try {
      await updateSuggestionStatus(id, "approved");
      toast({ title: "Sugestão aprovada!", description: "O status foi atualizado para aprovado." });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    } catch (err) {
      toast({ title: "Erro ao aprovar", variant: "destructive" });
    }
  };

  const handleReject = async (id: string, isPermanent: boolean = false) => {
    try {
      if (isPermanent) {
        await deleteSuggestion(id);
        toast({ title: "Sugestão excluída permanentemente." });
      } else {
        await updateSuggestionStatus(id, "rejected");
        toast({ title: "Sugestão rejeitada." });
      }
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    } catch (err) {
      toast({ title: "Erro ao processar", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Gerenciar Sugestões | AlternativasBR Admin" description="Painel de moderação de sugestões." />
      <Header />

      <main className="container mx-auto px-4 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Sugestões Pendentes</h1>
          <p className="text-muted-foreground mt-2">Analise e aprove novas ferramentas sugeridas pela comunidade.</p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-8 rounded-xl border border-destructive/20 text-center max-w-2xl mx-auto">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">Erro de Permissão no Firebase</h2>
            <p className="mb-4 text-sm opacity-90">
              O Firebase bloqueou o acesso à coleção de sugestões. Para corrigir, adicione estas regras no seu Firebase Console (Firestore &gt; Rules):
            </p>
            <pre className="bg-black/90 text-green-400 p-4 rounded-lg text-xs text-left overflow-x-auto mb-4">
{`match /suggestions/{id} {
  allow create: if true;
  allow read, update, delete: if request.auth != null;
}`}
            </pre>
            <p className="text-xs opacity-70 italic">
              Nota: {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
        ) : suggestions && suggestions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="flex flex-col h-full border-border/50 shadow-card hover:border-primary/20 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs bg-muted/50">
                      {suggestion.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {suggestion.createdAt?.toDate().toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{suggestion.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {suggestion.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {suggestion.website && (
                      <div className="flex items-center gap-2 text-xs">
                        <ExternalLink className="w-3 h-3 text-primary" />
                        <a href={suggestion.website} target="_blank" rel="noopener" className="text-primary hover:underline truncate">
                          {suggestion.website}
                        </a>
                      </div>
                    )}
                    {suggestion.contactEmail && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {suggestion.contactEmail}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 border-t pt-4">
                  <Button variant="outline" className="gap-2 h-10 border-destructive/20 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleReject(suggestion.id!)}>
                    <X className="w-4 h-4" /> Rejeitar
                  </Button>
                  <Button className="gap-2 h-10 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(suggestion.id!)}>
                    <Check className="w-4 h-4" /> Aprovar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="col-span-2 mt-2 h-8 text-muted-foreground hover:text-destructive gap-2 border border-transparent hover:border-destructive/10"
                    onClick={() => handleReject(suggestion.id!, true)}
                  >
                    <Trash2 className="w-3 h-3" /> Excluir permanentemente
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
            <p className="text-muted-foreground">Não há sugestões pendentes no momento.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ManageSuggestions;
