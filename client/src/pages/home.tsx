import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sun, BookOpen, HandHeart, GraduationCap, Heart, Target, Bot, Mail, Volume2, Moon, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import VerseModal from "@/components/verse-modal";
import PrayerModal from "@/components/prayer-modal";
import type { Devotional, Verse } from "@shared/schema";

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
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isNightMode, setIsNightMode] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if it's night mode (after 21h)
  useEffect(() => {
    const checkNightMode = () => {
      const hour = new Date().getHours();
      setIsNightMode(hour >= 21 || hour <= 5);
    };
    
    checkNightMode();
    const interval = setInterval(checkNightMode, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

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

  const { data: devotional, isLoading: devotionalLoading } = useQuery<any>({
    queryKey: isNightMode ? ["/api/night-devotional"] : ["/api/devotionals/daily"],
  });

  const { data: recentVerses = [], isLoading: versesLoading } = useQuery<Verse[]>({
    queryKey: ["/api/verses"],
    select: (data) => data.slice(0, 3),
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
    <div className={`min-h-screen ${isNightMode ? 'bg-gradient-to-br from-slate-900 to-indigo-900' : 'bg-gradient-to-br from-divine-50 to-blue-50'}`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className={`text-2xl font-bold mb-2 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>
            {isNightMode ? (
              <>
                <Moon className="inline h-6 w-6 mr-2" />
                Boa noite! Que Deus lhe dê paz
              </>
            ) : (
              'Bem-vindo de volta!'
            )}
          </h2>
          <p className={isNightMode ? 'text-gray-300' : 'text-gray-600'}>
            {isNightMode ? 'Momento perfeito para oração e reflexão' : 'Que a paz de Cristo esteja com você hoje'}
          </p>
        </div>

        {/* Sponsor Ad */}
        {Array.isArray(sponsorAds) && sponsorAds.length > 0 && (
          <SponsorAd ad={sponsorAds[currentAdIndex % sponsorAds.length]} />
        )}

        {/* Daily/Night Devotional Card */}
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
          <Card className={`mb-8 border ${isNightMode ? 'border-slate-600 bg-slate-800' : 'border-divine-100'}`}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  isNightMode 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                    : 'bg-gradient-to-br from-golden-400 to-golden-500'
                }`}>
                  {isNightMode ? <Moon className="text-white w-6 h-6" /> : <Sun className="text-white w-6 h-6" />}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isNightMode ? 'text-white' : 'text-gray-900'}`}>
                    {isNightMode ? 'Reflexão Noturna' : 'Devoção Diária'}
                  </h3>
                  <p className={`text-sm ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(new Date())}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className={`text-xl font-semibold ${isNightMode ? 'text-indigo-200' : 'text-divine-700'}`}>
                  {devotional.title}
                </h4>
                <p className={`leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {devotional.content}
                </p>
                
                <div className={`rounded-lg p-4 border-l-4 ${
                  isNightMode 
                    ? 'bg-indigo-900/30 border-indigo-400' 
                    : 'bg-divine-50 border-divine-500'
                }`}>
                  <p className={`font-serif italic ${isNightMode ? 'text-indigo-200' : 'text-divine-700'}`}>
                    "{devotional.verse}"
                  </p>
                  <p className={`text-sm mt-2 ${isNightMode ? 'text-indigo-300' : 'text-divine-600'}`}>
                    {devotional.reference}
                  </p>
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

        {/* Rotating Sponsor Ad */}
        {sponsorAds.length > 0 && sponsorAds[currentAdIndex] && (
          <SponsorAd ad={sponsorAds[currentAdIndex]} />
        )}

        {/* Main Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {/* Emotions */}
          <Link href="/emotions">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Sinto Hoje</h3>
                <p className="text-xs text-gray-600">Devocionais por emoção</p>
              </CardContent>
            </Card>
          </Link>

          {/* Challenges */}
          <Link href="/challenges">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Desafios</h3>
                <p className="text-xs text-gray-600">7 e 21 dias</p>
              </CardContent>
            </Card>
          </Link>

          {/* AI Prayer */}
          <Link href="/ai-prayer">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Agente IA</h3>
                <p className="text-xs text-gray-600">Oração personalizada</p>
              </CardContent>
            </Card>
          </Link>

          {/* Love Cards */}
          <Link href="/love-cards">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Jesus te Ama</h3>
                <p className="text-xs text-gray-600">Cartões de amor</p>
              </CardContent>
            </Card>
          </Link>

          {/* Prayer Requests */}
          <Link href="/prayer-requests">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Pedidos</h3>
                <p className="text-xs text-gray-600">Solicite orações</p>
              </CardContent>
            </Card>
          </Link>

          {/* Library */}
          <Link href="/library">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Biblioteca</h3>
                <p className="text-xs text-gray-600">Conteúdos cristãos</p>
              </CardContent>
            </Card>
          </Link>

          {/* Audio Devotionals */}
          <Link href="/devotional-audios">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Volume2 className="text-white w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Áudios</h3>
                <p className="text-xs text-gray-600">Devocionais falados</p>
              </CardContent>
            </Card>
          </Link>

          {/* Verse Generator */}
          <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer" onClick={handleGenerateVerse}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Versículo</h3>
              <p className="text-xs text-gray-600">Palavra de Deus</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Prayer Action */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <h3 className={`text-lg font-semibold mb-4 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>
              Momento de Oração
            </h3>
            <Button 
              onClick={handleStartPrayer}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
            >
              <HandHeart className="w-5 h-5 mr-2" />
              Orar Agora
            </Button>
          </CardContent>
        </Card>

        {/* Recent Verses Section */}
        <Card className={isNightMode ? 'bg-slate-800 border-slate-600' : ''}>
          <CardContent className="p-6">
            <h3 className={`text-xl font-semibold mb-6 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>
              Versículos Recentes
            </h3>
            
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
                  <div key={verse.id} className={`border-l-4 pl-4 py-2 ${
                    isNightMode ? 'border-indigo-400' : 'border-divine-500'
                  }`}>
                    <p className={`font-serif italic mb-2 ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      "{verse.text}"
                    </p>
                    <p className={`text-sm ${isNightMode ? 'text-indigo-300' : 'text-divine-600'}`}>
                      {verse.reference}
                    </p>
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
