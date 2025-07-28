import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Heart, RefreshCw, Share2, Copy, MessageCircle, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import BottomNav from "@/components/bottom-nav";

export default function VerseOfDay() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBlessing, setShowBlessing] = useState(false);
  const [showDailyVerse, setShowDailyVerse] = useState(true);

  // Versículo do dia (baseado na data)
  const { data: dailyVerse, isLoading: dailyLoading } = useQuery({
    queryKey: ['/api/verses/daily'],
    staleTime: 24 * 60 * 60 * 1000, // Cache por 24 horas
  });

  // Novo versículo (aleatório)
  const { data: newVerse, isLoading: newLoading, refetch: refetchNew } = useQuery({
    queryKey: ['/api/verses/new'],
    enabled: false, // Só busca quando solicitado
  });

  // Versículo atual (diário ou novo)
  const currentVerse = showDailyVerse ? dailyVerse : newVerse;
  const isLoading = showDailyVerse ? dailyLoading : newLoading;

  const verseId = currentVerse ? (currentVerse as any)?.id || `${currentVerse.book}_${currentVerse.chapter}_${currentVerse.verse}` : null;
  
  const { data: hasReacted } = useQuery({
    queryKey: ['/api/verse-reactions', user?.id, verseId],
    enabled: !!user?.id && !!verseId,
  });

  const amenMutation = useMutation({
    mutationFn: async () => {
      if (!currentVerse || !user?.id) throw new Error("Missing data");
      await apiRequest("/api/verse-reactions", "POST", {
        userId: user.id,
        verseId: (currentVerse as any)?.id || `${currentVerse.book}_${currentVerse.chapter}_${currentVerse.verse}`,
        reaction: "amen"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verse-reactions'] });
      setShowBlessing(true);
      setTimeout(() => setShowBlessing(false), 3000);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível registrar sua reação.",
        variant: "destructive",
      });
    },
  });

  const handleNewVerse = () => {
    setShowDailyVerse(false);
    refetchNew();
  };

  const handleBackToDaily = () => {
    setShowDailyVerse(true);
  };

  const handleShareWhatsApp = () => {
    if (!currentVerse) return;
    const message = `🙏 *Versículo do Dia* 📖\n\n"${currentVerse.text}"\n\n📚 ${currentVerse.reference}\n\n✨ Que esta palavra abençoe seu dia! Compartilhado pelo app Fé em Jesus BR`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareInstagram = () => {
    if (!currentVerse) return;
    const message = `🙏 Versículo do Dia 📖\n\n"${currentVerse.text}"\n\n📚 ${currentVerse.reference}\n\n✨ Que esta palavra abençoe seu dia!`;
    navigator.clipboard.writeText(message);
    toast({
      title: "Texto copiado!",
      description: "Cole no Instagram Stories ou feed para compartilhar",
    });
  };

  const handleCopyVerse = () => {
    if (!currentVerse) return;
    const message = `"${currentVerse.text}" - ${currentVerse.reference}`;
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
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {showDailyVerse ? "Versículo do Dia" : "Novo Versículo"}
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              {showDailyVerse 
                ? "Palavra especial de Deus para hoje" 
                : "Uma nova mensagem para você"
              }
            </p>
          </div>

          {/* Botões de navegação */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 px-4">
            <Button
              onClick={handleBackToDaily}
              variant={showDailyVerse ? "default" : "outline"}
              className={`flex-1 py-3 rounded-full ${
                showDailyVerse 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "border-purple-300 text-purple-600 hover:bg-purple-50"
              }`}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Versículo do Dia
            </Button>
            
            <Button
              onClick={handleNewVerse}
              variant={!showDailyVerse ? "default" : "outline"}
              className={`flex-1 py-3 rounded-full ${
                !showDailyVerse 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "border-purple-300 text-purple-600 hover:bg-purple-50"
              }`}
              disabled={newLoading}
            >
              {newLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Novo Versículo
                </>
              )}
            </Button>
          </div>

          {!currentVerse ? (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur mx-4">
              <CardContent className="p-6 sm:p-8 text-center">
                <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Carregando Versículo...</h2>
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6 px-4">
              {showBlessing && (
                <Card className="shadow-xl border-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-pulse">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Amém! Deus te abençoe! 🙏</h3>
                    <p className="text-sm sm:text-base">Que a paz do Senhor esteja contigo hoje e sempre.</p>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
                <CardHeader className="text-center pb-2 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="text-xl sm:text-2xl text-purple-900">Palavra de Deus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="bg-purple-50 rounded-lg p-4 sm:p-8 text-center">
                    <blockquote className="text-purple-900 text-base sm:text-xl leading-relaxed mb-3 sm:mb-4 font-medium">
                      "{currentVerse?.text || 'Carregando versículo...'}"
                    </blockquote>
                    <cite className="text-purple-700 font-semibold text-sm sm:text-lg">
                      {currentVerse?.reference || ''}
                    </cite>
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4">
                    <Button
                      onClick={() => amenMutation.mutate()}
                      disabled={amenMutation.isPending || !!hasReacted}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 py-3 rounded-full w-full"
                    >
                      {amenMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registrando...
                        </>
                      ) : hasReacted ? (
                        <>
                          <Heart className="mr-2 h-4 w-4 fill-current" />
                          Amém Registrado
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          Amém
                        </>
                      )}
                    </Button>

                    {!showDailyVerse && (
                      <Button
                        onClick={handleNewVerse}
                        variant="outline"
                        className="px-6 sm:px-8 py-3 rounded-full w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                        disabled={newLoading}
                      >
                        {newLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Carregando...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Gerar Outro Versículo
                          </>
                        )}
                      </Button>
                    )}

                    {/* Botões de Compartilhamento */}
                    <div className="border-t pt-4 mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">
                        <Share2 className="h-4 w-4 inline mr-1" />
                        Compartilhar Versículo
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <Button
                          onClick={handleShareWhatsApp}
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <MessageCircle className="mr-1 h-4 w-4" />
                          WhatsApp
                        </Button>
                        <Button
                          onClick={handleShareInstagram}
                          variant="outline"
                          size="sm"
                          className="text-pink-600 border-pink-200 hover:bg-pink-50"
                        >
                          <Instagram className="mr-1 h-4 w-4" />
                          Instagram
                        </Button>
                        <Button
                          onClick={handleCopyVerse}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 sm:col-span-1 col-span-2"
                        >
                          <Copy className="mr-1 h-4 w-4" />
                          Copiar Texto
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs sm:text-sm text-gray-600 px-2">
                    <p>
                      {hasReacted 
                        ? "Você já disse amém para este versículo! 🙏" 
                        : "Clique em 'Amém' se este versículo tocou seu coração"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}