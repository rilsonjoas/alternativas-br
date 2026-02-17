import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

/**
 * Componente para exibição de anúncios AdSense.
 * Ajuda na aprovação do site garantindo que o layout já prevê espaço para ads.
 */
const AdUnit = ({ slot, format = "auto", className }: AdUnitProps) => {
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    // Inicializar o anúncio após o componente ser montado
    if (!isDev) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Erro ao carregar anúncio AdSense:", e);
      }
    }
  }, [isDev, slot]);

  return (
    <div 
      className={cn(
        "my-8 mx-auto w-full flex flex-col items-center justify-center overflow-hidden transition-all",
        "bg-muted/30 border border-dashed border-border/50 rounded-2xl min-h-[100px] md:min-h-[250px]",
        className
      )}
    >
      <div className="text-center p-4">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50 mb-2 block">
          Espaço Publicitário
        </span>
        {isDev && (
          <div className="text-xs text-muted-foreground italic">
            Slot AdSense: {slot} | Formato: {format}
          </div>
        )}
      </div>
      
      {!isDev && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-5482566824255473"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};

export default AdUnit;
