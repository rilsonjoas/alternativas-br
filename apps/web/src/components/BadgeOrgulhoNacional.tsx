import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const BadgeOrgulhoNacional = () => {
  const [copied, setCopied] = useState(false);
  const badgeCode = `<a href="https://alternativasbr.com.br" target="_blank" rel="noopener noreferrer">
  <img src="https://alternativasbr.com.br/selo-orgulho.png" alt="Orgulho Nacional - AlternativasBR" width="150" height="150" />
</a>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(badgeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="max-w-md mx-auto overflow-hidden border-2 border-primary/20 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center border-2 border-primary/10">
            {/* Aqui usaremos o SVG que criaremos em seguida */}
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="white" stroke="#009739" strokeWidth="4"/>
              <path d="M50 10L10 50L50 90L90 50L50 10Z" fill="#FEDD00"/>
              <circle cx="50" cy="50" r="20" fill="#012169"/>
            </svg>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-foreground">Selo Orgulho Nacional</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Mostre ao mundo que sua tecnologia é feita no Brasil e ajude a fortalecer o ecossistema local.
            </p>
          </div>

          <div className="w-full bg-muted p-3 rounded-lg text-left overflow-x-auto">
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
              {badgeCode}
            </pre>
          </div>

          <Button 
            className="w-full gap-2 transition-all" 
            variant={copied ? "default" : "outline"}
            onClick={copyToClipboard}
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copiado!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copiar Código</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeOrgulhoNacional;
