import { Button } from "@/components/ui/button";
import { Share2, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyShareBarProps {
  productName: string;
  onVote: () => void;
  onShare: () => void;
  hasVoted: boolean;
  className?: string;
}

const StickyShareBar = ({ 
  productName, 
  onVote, 
  onShare, 
  hasVoted,
  className 
}: StickyShareBarProps) => {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden",
      "bg-background/80 backdrop-blur-lg border-t border-border/50",
      "safe-area-bottom", // Helper class for iPhone home bar if needed
      className
    )}>
      <div className="flex gap-3 max-w-sm mx-auto">
        <Button 
          size="lg" 
          className={cn(
            "flex-1 font-bold shadow-lg transition-all",
            hasVoted 
              ? "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20" 
              : "bg-primary hover:bg-primary/90 shadow-primary/20"
          )}
          onClick={onVote}
        >
          <ThumbsUp className={cn("mr-2 h-5 w-5", hasVoted && "fill-current")} />
          {hasVoted ? "Já votei!" : "Votar"}
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="flex-1 font-semibold border-primary/20 hover:bg-primary/5"
          onClick={onShare}
        >
          <Share2 className="mr-2 h-5 w-5" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};

export default StickyShareBar;
