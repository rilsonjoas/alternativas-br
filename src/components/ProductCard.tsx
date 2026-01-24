import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { voteProduct, useHasVoted } from "@/hooks/useFirebase";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: hasVoted } = useHasVoted(product.id);
  const [imgError, setImgError] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVoted) return;
    
    try {
      await voteProduct(product.id);
      toast({ title: "Curtida registrada!", description: "Obrigado por apoiar tecnologia nacional. ❤️" });
      queryClient.invalidateQueries({ queryKey: ["hasVoted", product.id] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (err: any) {
      toast({ 
        title: "Erro ao votar", 
        description: err.message || "Tente novamente mais tarde.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <Card
      className="flex flex-col justify-between h-full shadow-md border border-gray-100 bg-white rounded-2xl transition hover:shadow-xl hover:border-primary/40 cursor-pointer group"
      onClick={() => window.location.href = `/produto/${product.slug}`}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
          {product.logo && !imgError ? (
            <img 
              src={product.logo} 
              alt={product.name} 
              className="w-full h-full object-contain p-2" 
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-2xl font-bold text-primary/40">{product.name[0]}</span>
          )}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">{product.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            {product.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-0.5 text-[10px] font-semibold rounded-full shadow-sm">{tag}</Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pb-5">
        <p className="text-xs md:text-sm text-gray-700 mb-1 min-h-[40px] line-clamp-2">{product.description}</p>
        
        {/* Seção Alternativa a */}
        {product.alternativeTo && product.alternativeTo.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Alternativa nacional a:</p>
            <div className="flex flex-wrap gap-1">
              {product.alternativeTo.slice(0, 2).map((alternative, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5"
                >
                  {alternative}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <Button
            variant={hasVoted ? "default" : "outline"}
            size="sm"
            className={cn(
              "gap-1 rounded-xl h-9 px-3 transition-all",
              hasVoted ? "bg-red-500 text-white border-red-500" : "hover:bg-red-50 hover:border-red-200 text-gray-600 hover:text-red-500"
            )}
            onClick={handleVote}
            disabled={hasVoted}
          >
            <Heart className={cn("w-4 h-4", hasVoted ? "fill-white" : "")} />
            <span className="font-bold text-xs">{product.upvotes || 0}</span>
          </Button>

          <Button
            variant="outline"
            className="h-9 px-4 bg-primary/5 text-primary border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition rounded-xl font-bold text-xs shadow-sm"
            asChild
          >
            <a href={product.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
              Visitar site
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
