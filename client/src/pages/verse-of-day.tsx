import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Heart, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import BottomNav from "@/components/bottom-nav";

export default function VerseOfDay() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBlessing, setShowBlessing] = useState(false);

  const { data: verse, isLoading, refetch } = useQuery({
    queryKey: ['/api/verses/random'],
  });

  const { data: hasReacted } = useQuery({
    queryKey: ['/api/verse-reactions', user?.id, verse?.id],
    enabled: !!user?.id && !!verse?.id,
  });

  const amenMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/verse-reactions", "POST", {
        userId: user?.id,
        verseId: verse?.id,
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
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">Versículo do Dia</h1>
            </div>
            <p className="text-gray-600">Palavras de esperança e fé para seu coração</p>
          </div>

          {!verse ? (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-4">Carregando Versículo...</h2>
                <Button 
                  onClick={handleNewVerse}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Gerar Versículo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {showBlessing && (
                <Card className="shadow-xl border-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-pulse">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">Amém! Deus te abençoe! 🙏</h3>
                    <p>Que a paz do Senhor esteja contigo hoje e sempre.</p>
                  </CardContent>
                </Card>
              )}

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

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => amenMutation.mutate()}
                      disabled={amenMutation.isPending || hasReacted}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full flex-1 sm:flex-none"
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

                    <Button
                      onClick={handleNewVerse}
                      variant="outline"
                      className="px-8 py-3 rounded-full flex-1 sm:flex-none"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Novo Versículo
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    <p>
                      {hasReacted 
                        ? "Você já disse amém para este versículo hoje! 🙏" 
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