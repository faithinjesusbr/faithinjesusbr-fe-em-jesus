import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Heart, Share2, Download, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface LoveCard {
  id: string;
  title: string;
  message: string;
  verse?: string;
  reference?: string;
  imageUrl?: string;
  backgroundColor: string;
  textColor: string;
}

export default function LoveCardsPage() {
  const [selectedCard, setSelectedCard] = useState<LoveCard | null>(null);
  const { toast } = useToast();

  const { data: loveCards, isLoading } = useQuery({
    queryKey: ["/api/love-cards"],
  });

  const handleShare = (card: LoveCard) => {
    const message = `${card.title}\n\n${card.message}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownload = (card: LoveCard) => {
    // Create a canvas to generate the card image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Set background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ec4899'); // pink-500
    gradient.addColorStop(1, '#be185d'); // pink-700
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(card.title, canvas.width / 2, 100);

    ctx.font = '24px Inter, sans-serif';
    const words = card.message.split(' ');
    let line = '';
    let y = 200;
    const lineHeight = 35;
    const maxWidth = canvas.width - 100;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    if (card.verse) {
      y += lineHeight * 2;
      ctx.font = 'italic 20px Inter, sans-serif';
      ctx.fillText(`"${card.verse}"`, canvas.width / 2, y);
      if (card.reference) {
        y += lineHeight;
        ctx.font = '18px Inter, sans-serif';
        ctx.fillText(`- ${card.reference}`, canvas.width / 2, y);
      }
    }

    // Download the image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${card.title.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
          title: "Download iniciado!",
          description: "O cartão foi salvo em suas imagens.",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-800 dark:text-pink-200 mb-2 flex items-center justify-center gap-2">
            <Heart className="h-8 w-8" />
            Cartões Jesus te Ama
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compartilhe o amor de Cristo com mensagens inspiradoras
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loveCards?.map((card: LoveCard) => (
            <Card
              key={card.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${card.backgroundColor} ${card.textColor} border-0 relative overflow-hidden`}
              onClick={() => setSelectedCard(card)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className={`text-xl ${card.textColor} flex items-center gap-2`}>
                  <Heart className="h-5 w-5" />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className={`${card.textColor} leading-relaxed mb-4 line-clamp-4`}>
                  {card.message}
                </p>
                {card.verse && (
                  <div className="border-t border-white/20 pt-4">
                    <p className={`${card.textColor} text-sm italic`}>
                      "{card.verse}"
                    </p>
                    {card.reference && (
                      <p className={`${card.textColor} text-xs mt-1 opacity-80`}>
                        - {card.reference}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="text-pink-600 border-pink-300 hover:bg-pink-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>

        {/* Card Detail Modal */}
        <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
          <DialogContent className="max-w-2xl">
            {selectedCard && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-pink-800 dark:text-pink-200 flex items-center gap-2">
                    <Heart className="h-6 w-6" />
                    {selectedCard.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className={`${selectedCard.backgroundColor} ${selectedCard.textColor} p-6 rounded-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                      <p className={`${selectedCard.textColor} text-lg leading-relaxed mb-4`}>
                        {selectedCard.message}
                      </p>
                      {selectedCard.verse && (
                        <div className="border-t border-white/20 pt-4">
                          <p className={`${selectedCard.textColor} font-medium italic`}>
                            "{selectedCard.verse}"
                          </p>
                          {selectedCard.reference && (
                            <p className={`${selectedCard.textColor} text-sm mt-2 opacity-80`}>
                              - {selectedCard.reference}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => handleShare(selectedCard)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar no WhatsApp
                    </Button>
                    <Button
                      onClick={() => handleDownload(selectedCard)}
                      variant="outline"
                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Imagem
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}