import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import type { Verse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: Verse | null;
}

export default function VerseModal({ isOpen, onClose, verse }: VerseModalProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (!verse) return;

    const shareText = `"${verse.text}" - ${verse.reference}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Versículo do Dia",
          text: shareText,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Versículo copiado!",
          description: "O versículo foi copiado para sua área de transferência.",
        });
      } catch (err) {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o versículo.",
          variant: "destructive",
        });
      }
    }
  };

  if (!verse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-divine-500 to-divine-600 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-white w-8 h-8" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Versículo do Momento
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="bg-divine-50 rounded-lg p-4 mb-6">
          <p className="font-serif italic text-divine-700 text-lg mb-3">
            "{verse.text}"
          </p>
          <p className="text-divine-600 font-medium">
            {verse.reference}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={handleShare}
            className="flex-1 bg-divine-500 hover:bg-divine-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
