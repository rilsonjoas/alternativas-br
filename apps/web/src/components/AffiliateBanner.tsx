import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";
import { logEvent } from "@/lib/analytics";

interface AffiliateBannerProps {
  productName: string;
  affiliateUrl: string;
  benefitText?: string;
  className?: string;
  variant?: "full" | "compact";
}

const AffiliateBanner = ({ 
  productName, 
  affiliateUrl, 
  benefitText = "Crie sua loja com condições especiais através do AlternativasBR",
  className = "",
  variant = "full"
}: AffiliateBannerProps) => {
  if (variant === "compact") {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 p-5 ${className}`}>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="tech" className="bg-primary text-primary-foreground text-[10px] px-2 py-0">
              <Star className="w-3 h-3 mr-1 fill-current" /> Parceiro
            </Badge>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground leading-tight">
              {productName} + Br
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {benefitText}.
            </p>
          </div>

          <Button asChild size="sm" className="w-full h-10 text-xs font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all">
            <a 
              href={affiliateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => logEvent('select_content', 'affiliate_click', productName)}
            >
              Aproveitar Benefício
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </Button>
          
          <p className="text-[10px] text-muted-foreground/60 text-center italic">
            * Link de parceiro oficial
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border-2 border-primary/20 p-6 sm:p-8 ${className}`}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl opacity-50" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
            <Badge variant="tech" className="bg-primary text-primary-foreground">
              <Star className="w-3 h-3 mr-1 fill-current" /> Parceiro Oficial
            </Badge>
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Oportunidade</span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-extrabold text-foreground leading-tight">
            {productName} + AlternativasBR
          </h3>
          
          <p className="text-muted-foreground text-sm md:text-base max-w-xl">
            {benefitText}. Ao contratar pelo nosso link, você ajuda a manter este projeto independente sem pagar nada a mais por isso.
          </p>
        </div>

        <div className="flex-shrink-0">
          <Button asChild size="lg" className="h-14 px-8 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105">
            <a 
              href={affiliateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => logEvent('select_content', 'affiliate_click', productName)}
            >
              Aproveitar Benefício
              <ExternalLink className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AffiliateBanner;
