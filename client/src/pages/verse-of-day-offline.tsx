import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOfflineCache } from "@/hooks/use-offline-cache";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useAuth } from "@/hooks/use-auth";
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Heart, 
  Share2, 
  Bell,
  BellOff,
  RefreshCw,
  Clock
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

export default function VerseOfDayOffline() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    isOnline, 
    getTodaysVerse, 
    cachedVerses, 
    clearOldCache 
  } = useOfflineCache();
  
  const { 
    isSupported: notificationSupported,
    permission,
    requestPermission,
    sendTestNotification 
  } = usePushNotifications();

  const [verse, setVerse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    loadTodaysVerse();
    // Clear old cache weekly
    clearOldCache(7);
  }, []);

  const loadTodaysVerse = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const todaysVerse = await getTodaysVerse(today);
      
      if (todaysVerse) {
        setVerse(todaysVerse);
        setLastUpdated(todaysVerse.cachedAt);
      } else {
        // Fallback verse if no cache available
        setVerse({
          verseText: "Porque eu sei os planos que tenho para vocês', diz o Senhor, 'planos de fazê-los prosperar e não de causar dano, planos de dar esperança e um futuro.",
          verseReference: "Jeremias 29:11",
          cachedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error loading verse:', error);
      toast({
        title: "Erro ao carregar versículo",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTodaysVerse();
  };

  const handleShare = async () => {
    if (navigator.share && verse) {
      try {
        await navigator.share({
          title: 'Versículo do Dia - Fé em Jesus BR',
          text: `"${verse.verseText}" - ${verse.verseReference}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(`"${verse.verseText}" - ${verse.verseReference}`);
          toast({ title: "Versículo copiado para a área de transferência!" });
        } catch (clipboardError) {
          toast({ 
            title: "Erro ao compartilhar", 
            description: "Não foi possível compartilhar o versículo",
            variant: "destructive" 
          });
        }
      }
    } else if (verse) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`"${verse.verseText}" - ${verse.verseReference}`);
        toast({ title: "Versículo copiado para a área de transferência!" });
      } catch (error) {
        toast({ 
          title: "Erro ao copiar", 
          description: "Não foi possível copiar o versículo",
          variant: "destructive" 
        });
      }
    }
  };

  const handleNotificationRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({ title: "Notificações ativadas!", description: "Você receberá o versículo diário" });
      sendTestNotification();
    } else {
      toast({ 
        title: "Permissão negada", 
        description: "Não foi possível ativar as notificações",
        variant: "destructive" 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-divine-600" />
            <h2 className="text-2xl font-bold mb-4">Carregando versículo do dia...</h2>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Connection Status */}
        <div className="mb-6">
          <Badge 
            variant={isOnline ? "default" : "destructive"} 
            className="flex items-center gap-2 w-fit"
          >
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? "Online" : "Modo Offline"}
          </Badge>
        </div>

        {/* Main Verse Card */}
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-divine-50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-divine-900 mb-2">
              Versículo do Dia
            </CardTitle>
            <div className="flex justify-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lastUpdated ? new Date(lastUpdated).toLocaleDateString('pt-BR') : 'Hoje'}
              </Badge>
              {!isOnline && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  Cache Local
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {verse && (
              <>
                <blockquote className="text-xl md:text-2xl font-medium text-gray-800 italic leading-relaxed px-4">
                  "{verse.verseText}"
                </blockquote>
                <cite className="text-lg font-semibold text-divine-600">
                  {verse.verseReference}
                </cite>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center gap-2"
                disabled={!isOnline}
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>

              <Button 
                onClick={handleShare}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>

              <Button 
                onClick={() => {/* Add to favorites */}}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Favoritar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        {notificationSupported && user && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações Push
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Versículo Diário</p>
                  <p className="text-sm text-gray-600">
                    Receba o versículo do dia todos os dias às 9h
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={permission === 'granted' ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {permission === 'granted' ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
                    {permission === 'granted' ? 'Ativo' : 'Inativo'}
                  </Badge>
                  {permission !== 'granted' && (
                    <Button onClick={handleNotificationRequest} size="sm">
                      Ativar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cache Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Cache Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Versículos em cache:</span>
                <Badge variant="outline">{cachedVerses.length}</Badge>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>• Os versículos são salvos automaticamente para acesso offline</p>
                <p>• Cache é limpo automaticamente após 7 dias</p>
                <p>• Quando offline, você verá o último versículo salvo</p>
              </div>

              {!isOnline && cachedVerses.length === 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Primeira vez offline:</strong> Conecte-se à internet para baixar seu primeiro versículo.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}