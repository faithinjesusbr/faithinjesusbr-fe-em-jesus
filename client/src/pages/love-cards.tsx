import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Download, Share2, Sparkles, Copy, CheckCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LoveCard {
  id: string;
  title: string;
  message: string;
  verse?: string;
  reference?: string;
  backgroundColor: string;
  textColor: string;
  category: string;
  isGenerated: boolean;
}

const categories = [
  { name: "love", label: "Amor", icon: "❤️" },
  { name: "encouragement", label: "Encorajamento", icon: "💪" },
  { name: "faith", label: "Fé", icon: "🙏" },
  { name: "hope", label: "Esperança", icon: "🌟" },
];

export default function LoveCardsPage() {
  const [selectedCategory, setSelectedCategory] = useState("love");
  const [shareText, setShareText] = useState("");
  const { toast } = useToast();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["/api/love-cards", selectedCategory],
    queryFn: () => apiRequest(`/api/love-cards?category=${selectedCategory}`),
  });

  const generateCardMutation = useMutation({
    mutationFn: async (category: string) => {
      return apiRequest("/api/love-cards/generate", {
        method: "POST",
        body: { category },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/love-cards"] });
      toast({
        title: "Cartão Gerado!",
        description: "Um novo cartão de amor foi criado com IA.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o cartão. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleShare = async (card: LoveCard) => {
    const message = `${card.title}\n\n${card.message}${card.verse ? `\n\n"${card.verse}"\n- ${card.reference}` : ''}\n\nCompartilhado com amor do app Fé em Jesus BR 💝`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: message,
        });
      } catch (error) {
        // Fallback to copy
        copyToClipboard(message);
      }
    } else {
      copyToClipboard(message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Cartão copiado para área de transferência.",
    });
  };

  const downloadCard = (card: LoveCard) => {
    // Criar SVG do cartão
    const svg = `
      <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${card.backgroundColor}" rx="20"/>
        <foreignObject x="20" y="20" width="360" height="560">
          <div xmlns="http://www.w3.org/1999/xhtml" style="
            color: ${card.textColor}; 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          ">
            <h2 style="font-size: 24px; margin-bottom: 20px;">${card.title}</h2>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">${card.message}</p>
            ${card.verse ? `
              <blockquote style="font-style: italic; margin: 20px 0; font-size: 14px;">
                "${card.verse}"
              </blockquote>
              <p style="font-size: 12px; font-weight: bold;">${card.reference}</p>
            ` : ''}
            <p style="margin-top: 30px; font-size: 10px; opacity: 0.7;">Fé em Jesus BR</p>
          </div>
        </foreignObject>
      </svg>
    `;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cartao-${card.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado!",
      description: "O cartão está sendo baixado.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
            Cartões de Amor
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Compartilhe mensagens de amor e fé com pessoas especiais
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "default" : "outline"}
            className={`px-4 py-2 ${
              selectedCategory === category.name 
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white" 
                : ""
            }`}
            onClick={() => setSelectedCategory(category.name)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>

      {/* Generate New Card */}
      <div className="text-center mb-8">
        <Button
          onClick={() => generateCardMutation.mutate(selectedCategory)}
          disabled={generateCardMutation.isPending}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {generateCardMutation.isPending ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Gerando Cartão...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Novo Cartão com IA
            </>
          )}
        </Button>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-80 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card: LoveCard) => (
            <Card 
              key={card.id} 
              className="h-80 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: card.backgroundColor, color: card.textColor }}
            >
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg font-bold">{card.title}</CardTitle>
                <div className="flex justify-center">
                  {card.isGenerated && (
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      IA
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-4 pb-4">
                <p className="text-sm leading-relaxed">{card.message}</p>
                
                {card.verse && (
                  <div className="border-t pt-3 space-y-2">
                    <blockquote className="text-xs italic opacity-90">
                      "{card.verse}"
                    </blockquote>
                    <p className="text-xs font-semibold opacity-80">{card.reference}</p>
                  </div>
                )}
                
                <div className="flex justify-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleShare(card)}
                    className="bg-white/20 hover:bg-white/30 text-current border-white/30"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Compartilhar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => downloadCard(card)}
                    className="bg-white/20 hover:bg-white/30 text-current border-white/30"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {cards.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum cartão encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Gere um novo cartão com IA para começar!
          </p>
          <Button
            onClick={() => generateCardMutation.mutate(selectedCategory)}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Gerar Primeiro Cartão
          </Button>
        </div>
      )}

      {/* Instructions */}
      <Card className="mt-12 bg-gradient-to-r from-red-50 to-pink-50 border-none">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Como usar os Cartões de Amor
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Escolha uma categoria de cartão (amor, encorajamento, fé, esperança)</li>
            <li>• Gere novos cartões com IA personalizada para cada momento</li>
            <li>• Compartilhe diretamente no WhatsApp, Instagram ou outras redes</li>
            <li>• Baixe em formato SVG para imprimir ou usar em outros apps</li>
            <li>• Todos os cartões incluem versículos bíblicos inspiradores</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}