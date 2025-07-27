import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sun, BookOpen, HandHeart, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import VerseModal from "@/components/verse-modal";
import PrayerModal from "@/components/prayer-modal";
import type { Devotional, Verse } from "@shared/schema";

export default function Home() {
  const [showVerseModal, setShowVerseModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devotional, isLoading: devotionalLoading } = useQuery<Devotional>({
    queryKey: ["/api/devotionals/daily"],
  });

  const { data: recentVerses = [], isLoading: versesLoading } = useQuery<Verse[]>({
    queryKey: ["/api/verses"],
    select: (data) => data.slice(0, 3), // Show only first 3 verses
  });

  const randomVerseMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/verses/random");
      return res.json();
    },
    onSuccess: (verse: Verse) => {
      setCurrentVerse(verse);
      setShowVerseModal(true);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível carregar um versículo.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateVerse = () => {
    randomVerseMutation.mutate();
  };

  const handleStartPrayer = () => {
    setShowPrayerModal(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h2>
          <p className="text-gray-600">Que a paz de Cristo esteja com você hoje</p>
        </div>

        {/* Daily Devotional Card */}
        {devotionalLoading ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : devotional ? (
          <Card className="mb-8 border border-divine-100">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-golden-400 to-golden-500 rounded-full flex items-center justify-center mr-4">
                  <Sun className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Devoção Diária</h3>
                  <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-divine-700">{devotional.title}</h4>
                <p className="text-gray-700 leading-relaxed">{devotional.content}</p>
                
                <div className="bg-divine-50 rounded-lg p-4 border-l-4 border-divine-500">
                  <p className="font-serif italic text-divine-700">"{devotional.verse}"</p>
                  <p className="text-sm text-divine-600 mt-2">{devotional.reference}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Nenhuma devoção disponível para hoje.</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Random Verse Generator */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-white w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Versículo Aleatório</h3>
              <p className="text-gray-600 text-sm mb-4">Receba uma palavra de Deus para seu dia</p>
              <Button 
                onClick={handleGenerateVerse}
                disabled={randomVerseMutation.isPending}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                {randomVerseMutation.isPending ? "Gerando..." : "Gerar Versículo"}
              </Button>
            </CardContent>
          </Card>

          {/* Prayer Button */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandHeart className="text-white w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Momento de Oração</h3>
              <p className="text-gray-600 text-sm mb-4">Dedique um momento para falar com Deus</p>
              <Button 
                onClick={handleStartPrayer}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Orar Agora
              </Button>
            </CardContent>
          </Card>

          {/* Bible Study */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-white w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estudo Bíblico</h3>
              <p className="text-gray-600 text-sm mb-4">Aprofunde-se na Palavra de Deus</p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Estudar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Verses Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Versículos Recentes</h3>
            
            {versesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="border-l-4 border-gray-200 pl-4 py-2">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentVerses.map((verse) => (
                  <div key={verse.id} className="border-l-4 border-divine-500 pl-4 py-2">
                    <p className="font-serif italic text-gray-700 mb-2">
                      "{verse.text}"
                    </p>
                    <p className="text-sm text-divine-600">{verse.reference}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
      
      <VerseModal 
        isOpen={showVerseModal}
        onClose={() => setShowVerseModal(false)}
        verse={currentVerse}
      />
      
      <PrayerModal 
        isOpen={showPrayerModal}
        onClose={() => setShowPrayerModal(false)}
      />
    </div>
  );
}
