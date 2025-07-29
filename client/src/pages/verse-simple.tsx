import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Share2, Copy, MessageCircle, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/bottom-nav";

interface Verse {
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
}

export default function VerseSimple() {
  const { toast } = useToast();

  const { data: verse, isLoading } = useQuery<Verse>({
    queryKey: ['/api/verses/daily'],
    staleTime: 24 * 60 * 60 * 1000,
  });

  const handleShareWhatsApp = () => {
    if (!verse) return;
    const message = `🙏 *Versículo do Dia* 📖\n\n"${verse.text}"\n\n📚 ${verse.reference}\n\n✨ Que esta palavra abençoe seu dia! Compartilhado pelo app Fé em Jesus BR`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareInstagram = () => {
    if (!verse) return;
    const message = `🙏 Versículo do Dia 📖\n\n"${verse.text}"\n\n📚 ${verse.reference}\n\n✨ Que esta palavra abençoe seu dia!`;
    navigator.clipboard.writeText(message);
    toast({
      title: "Texto copiado!",
      description: "Cole no Instagram Stories ou feed para compartilhar",
    });
  };

  const handleCopyVerse = () => {
    if (!verse) return;
    const message = `"${verse.text}" - ${verse.reference}`;
    navigator.clipboard.writeText(message);
    toast({
      title: "Versículo copiado!",
      description: "Cole onde quiser compartilhar",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">Versículo do Dia</h1>
            </div>
            <p className="text-base text-gray-600">
              Palavra especial de Deus para hoje
            </p>
          </div>

          {!verse ? (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-4">Carregando Versículo...</h2>
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-purple-900">Palavra de Deus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-8 text-center">
                  <blockquote className="text-purple-900 text-xl leading-relaxed mb-4 font-medium">
                    "{verse.text}"
                  </blockquote>
                  <cite className="text-purple-700 font-semibold text-lg">
                    {verse.reference}
                  </cite>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">
                    <Share2 className="h-4 w-4 inline mr-1" />
                    Compartilhar Versículo
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button
                      onClick={handleShareWhatsApp}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={handleShareInstagram}
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </Button>
                    <Button
                      onClick={handleCopyVerse}
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Texto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}