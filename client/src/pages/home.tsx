import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Sun, 
  BookOpen, 
  HandHeart, 
  Heart, 
  Target, 
  Bot, 
  Mail, 
  Volume2, 
  Moon, 
  Gift,
  MessageCircle,
  Video,
  ShoppingBag,
  Users,
  Calendar,
  Star,
  Bell,
  ArrowRight,
  Download,
  Smartphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import VerseModal from "@/components/verse-modal";
import PrayerModal from "@/components/prayer-modal";
import PatrocinadoresExibicao from "@/components/PatrocinadoresExibicao";
import LembreiDeVoceModal from "@/components/lembrei-de-voce-modal";
import type { Devotional, Verse } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

// Sponsor Ad Component
function SponsorAd({ ad }: { ad: any }) {
  return (
    <Card className="mb-4 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-700">Patrocinado</span>
        </div>
        <h4 className="font-semibold text-gray-800 mb-1">{ad.title}</h4>
        <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
        <Button 
          size="sm" 
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
          onClick={() => window.open(ad.url, '_blank')}
        >
          Conhecer
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [showVerseModal, setShowVerseModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showLembreiDeVoceModal, setShowLembreiDeVoceModal] = useState(false);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  // Get current time for greeting
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Fetch sponsor ads
  const { data: sponsorAdsData = [] } = useQuery({
    queryKey: ["/api/sponsor-ads"],
  });

  const sponsorAds = Array.isArray(sponsorAdsData) ? sponsorAdsData : [];

  // Rotate sponsor ads every 5 minutes
  useEffect(() => {
    if (sponsorAds.length > 0) {
      const adInterval = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % sponsorAds.length);
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(adInterval);
    }
  }, [sponsorAds.length]);

  // Buscar versículo do dia com fallback garantido
  const { data: dailyVerse } = useQuery({
    queryKey: ["/api/verses/daily"],
    staleTime: 24 * 60 * 60 * 1000, // Cache por 24 horas
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: {
      text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
      reference: "João 3:16",
      book: "João",
      chapter: 3,
      verse: 16
    }
  });

  const { data: devotional, isLoading: devotionalLoading } = useQuery<any>({
    queryKey: ["/api/devotionals/daily"],
  });

  const { data: recentPrayerRequests = [] } = useQuery<any[]>({
    queryKey: ["/api/prayer-requests/recent"],
  });

  const { data: recentReflections = [] } = useQuery<any[]>({
    queryKey: ["/api/reflections/recent"],
  });

  const randomVerseMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/verses/random");
      if (!response.ok) {
        throw new Error('Failed to fetch verse');
      }
      return response.json();
    },
    onSuccess: (verse: any) => {
      setCurrentVerse(verse);
      setShowVerseModal(true);
    },
    onError: () => {
      toast({
        title: "Versículo Disponível",
        description: "Aqui está um versículo para você.",
        variant: "default",
      });
      // Mesmo com erro, mostrar um versículo de fallback
      setCurrentVerse({
        id: "fallback-verse",
        text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
        reference: "João 3:16",
        book: "João",
        chapter: "3",
        verse: "16"
      });
      setShowVerseModal(true);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
        {/* Welcome Section - Enhanced */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Greeting */}
              <div className="flex flex-col justify-center">
                <div className="animate-pulse">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {getCurrentGreeting()}, {user?.name?.split(' ')[0] || 'Irmão'}! ✨
                  </h1>
                </div>
                <p className="text-gray-600 mb-3">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-blue-700 font-medium">
                  Que Deus abençoe seu dia com paz e alegria! 🙏
                </p>
              </div>
              
              {/* Right Column - App Promotion */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">App 100% Gratuito</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tenha fé e inspiração sempre à mão. Instale em seu celular para acesso offline!
                  </p>
                  
                  {!isInstalled && isInstallable && (
                    <Button 
                      onClick={installApp}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      📲 Instalar no meu celular
                    </Button>
                  )}
                  
                  {isInstalled && (
                    <div className="text-green-600 font-semibold flex items-center justify-center">
                      <Star className="h-4 w-4 mr-2" />
                      App instalado! ✨
                    </div>
                  )}
                  
                  {!isInstallable && !isInstalled && (
                    <p className="text-xs text-gray-500">
                      Abra no Chrome/Safari para instalar
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        


        {/* Daily Verse Card */}
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-blue-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Versículo do Dia</h3>
                  <p className="text-white/80 text-sm">{dailyVerse?.reference || "João 3:16"}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => {
                  const text = `${dailyVerse?.text || "Versículo do dia"} - ${dailyVerse?.reference || ""}`;
                  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                Compartilhar
              </Button>
            </div>
            <p className="text-lg leading-relaxed mb-4">
              {dailyVerse?.text || "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."}
            </p>
            <div className="flex items-center gap-4">
              <Button 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={handleGenerateVerse}
              >
                <Star className="w-4 h-4 mr-2" />
                Gerar Outro
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Beautiful Rotating Sponsors Component */}
        <PatrocinadoresExibicao variant="featured" />

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex gap-3 mb-3">
            <Link href="/verse-of-day" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Versículo do Dia
              </Button>
            </Link>
            <Link href="/emotion-today-improved" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <Heart className="h-4 w-4 mr-2" />
                Como me sinto hoje?
              </Button>
            </Link>
          </div>
          
          {/* Nova linha com Lembrei de Você em destaque */}
          <div className="flex gap-3 mb-3">
            <Button
              onClick={() => setShowLembreiDeVoceModal(true)}
              className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white shadow-lg"
            >
              <Heart className="h-4 w-4 mr-2" />
              💌 Lembrei de Você
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Link href="/youtube-videos-improved" className="flex-1">
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                <Video className="h-4 w-4 mr-2" />
                Vídeos Cristãos
              </Button>
            </Link>
            <Button
              onClick={() => randomVerseMutation.mutate()}
              disabled={randomVerseMutation.isPending}
              variant="outline"
              className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              {randomVerseMutation.isPending ? (
                <>
                  <Sun className="h-4 w-4 mr-2 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  Versículo Aleatório
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* IA Cristo */}
          <Link href="/ai-prayer">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-blue-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold mb-1">IA Cristo</h3>
                <p className="text-xs text-white/80">Conversas espirituais com IA</p>
              </CardContent>
            </Card>
          </Link>

          {/* E-books */}
          <Link href="/library-ebooks">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-green-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold mb-1">E-books</h3>
                <p className="text-xs text-white/80">Biblioteca cristã gratuita</p>
              </CardContent>
            </Card>
          </Link>

          {/* Orações */}
          <Link href="/prayer-requests">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-red-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Orações</h3>
                <p className="text-xs text-white/80">3 pedidos ativos</p>
              </CardContent>
            </Card>
          </Link>

          {/* Colaboradores */}
          <Link href="/pix-contributors">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-orange-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold mb-1">Colaborar</h3>
                <p className="text-xs text-white/80">PIX e contribuições</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Seus Pedidos Recentes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">🗒️ Seus Pedidos Recentes</CardTitle>
                <Link href="/prayer-requests">
                  <Button variant="ghost" size="sm">
                    Ver todos <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium mb-1">Cura para minha mãe</p>
                <p className="text-xs text-gray-600">Estou pedindo oração para o tratamento efetivo. Peço também pela esperança nos momentos difíceis, e que possa ter forças para viver mais.</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">9 minutos atrás</span>
                  <Badge variant="secondary" className="text-xs">Pendente</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full text-purple-600 border-purple-200 hover:bg-purple-50">
                + Nova Reflexão
              </Button>
            </CardContent>
          </Card>

          {/* Suas Reflexões Recentes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">💭 Suas Reflexões Recentes</CardTitle>
                <Link href="/library">
                  <Button variant="ghost" size="sm">
                    Ver todas <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium mb-1">Testamento de Esperança</p>
                <p className="text-xs text-gray-600">Uma nova visão que abre minha vida. Hoje começei o descontínuo, o que antes me limitava hoje me trouxe esperança...</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">2 minutos atrás</span>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium mb-1">Novo emprego</p>
                <p className="text-xs text-gray-600">Estou pedindo pedindo em oração mais pertos amigos do trabalho. Oro para que Deus atira as portas certas...</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">1 minute ago</span>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium mb-1">Restauração familiar</p>
                <p className="text-xs text-gray-600">Nossa família está passando por momentos difíceis. Peço orações pela reconciliação e paz no meio nosso círculo...</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">2 minutes ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* App Slogan */}
        <div className="text-center py-6 mb-16">
          <p className="text-sm text-gray-500 italic">
            Fé em Jesus BR — Inspiração diária para sua vida 💖
          </p>
        </div>
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
      
      <LembreiDeVoceModal 
        isOpen={showLembreiDeVoceModal}
        onClose={() => setShowLembreiDeVoceModal(false)}
      />
    </div>
  );
}
