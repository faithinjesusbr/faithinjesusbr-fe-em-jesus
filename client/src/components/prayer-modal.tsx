import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { HandHeart } from "lucide-react";

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrayerModal({ isOpen, onClose }: PrayerModalProps) {
  const [prayerContent, setPrayerContent] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const savePrayer = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const res = await apiRequest("POST", "/api/prayers", {
        userId: user.id,
        content: content || undefined,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prayers"] });
      toast({
        title: "Amém! 🙏",
        description: "Sua oração foi registrada. Que Deus abençoe você!",
      });
      setPrayerContent("");
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua oração. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSayAmen = () => {
    savePrayer.mutate(prayerContent);
  };

  const handleClose = () => {
    setPrayerContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <HandHeart className="text-white w-10 h-10" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
              Momento de Oração
            </DialogTitle>
            <p className="text-gray-600 mb-6">
              Dedique este momento para falar com o Senhor
            </p>
          </div>
        </DialogHeader>
        
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <p className="font-serif italic text-green-700">
            "Não andeis ansiosos por coisa alguma; antes, em tudo, pela oração e súplicas, 
            com ação de graças, sejam as vossas petições conhecidas diante de Deus."
          </p>
          <p className="text-green-600 text-sm mt-2">Filipenses 4:6</p>
        </div>
        
        <Textarea
          value={prayerContent}
          onChange={(e) => setPrayerContent(e.target.value)}
          placeholder="Escreva sua oração aqui (opcional)..."
          className="w-full h-24 mb-4 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        
        <div className="flex space-x-3">
          <Button 
            onClick={handleSayAmen}
            disabled={savePrayer.isPending}
            className="flex-1 bg-green-500 hover:bg-green-600 py-3 font-semibold"
          >
            <HandHeart className="w-4 h-4 mr-2" />
            {savePrayer.isPending ? "Registrando..." : "Amém"}
          </Button>
          <Button 
            onClick={handleClose}
            variant="outline"
            className="flex-1 py-3"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
