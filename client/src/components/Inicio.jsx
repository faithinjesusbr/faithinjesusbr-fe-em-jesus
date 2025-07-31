import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Smartphone, Star } from "lucide-react";

// Hook for PWA installation
function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator.standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error installing app:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp
  };
}

export default function Inicio() {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  // Get current greeting based on time
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* Header with Logo and App Name */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.png" 
                alt="Fé em Jesus BR" 
                className="w-12 h-12 rounded-full object-cover shadow-lg ring-2 ring-white"
              />
              <div className="text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Fé em Jesus BR
                </h1>
                <p className="text-sm text-gray-600 italic">
                  Inspiração diária com amor e fé ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Greeting Card */}
        <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 border-0 text-white shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                {getCurrentGreeting()}! 🌟
              </h2>
              <p className="text-xl leading-relaxed text-white/90">
                Que Deus abençoe seu dia com paz, saúde e alegria.
                <br />
                Volte sempre para receber uma nova mensagem de fé! 🙏
              </p>
              <div className="w-16 h-1 bg-white/30 rounded-full mx-auto"></div>
            </div>
          </CardContent>
        </Card>

        {/* PWA Installation Card */}
        {!isInstalled && (
          <Card className="bg-white/80 backdrop-blur-md shadow-xl border border-white/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Instale nosso App
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tenha acesso rápido e funcione até mesmo offline! 
                    App 100% gratuito para sua jornada de fé.
                  </p>
                </div>

                {isInstallable ? (
                  <Button 
                    onClick={installApp}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    📲 Instalar App
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Abra no Chrome ou Safari para instalar o app
                    </p>
                    <Button 
                      disabled
                      variant="outline"
                      className="px-8 py-3 rounded-full"
                    >
                      <Smartphone className="h-5 w-5 mr-2" />
                      Instalação não disponível
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installed Confirmation */}
        {isInstalled && (
          <Card className="bg-gradient-to-r from-green-400 to-emerald-500 border-0 text-white shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">
                  App Instalado com Sucesso! ✨
                </h3>
                <p className="text-white/90">
                  Agora você pode acessar Fé em Jesus BR diretamente da sua tela inicial!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/60 backdrop-blur-md shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Versículos Diários
              </h3>
              <p className="text-gray-600 text-sm">
                Receba uma nova palavra de Deus todos os dias para fortalecer sua fé
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-md shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🙏</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Orações Personalizadas
              </h3>
              <p className="text-gray-600 text-sm">
                IA cristã que ajuda você com orações e orientação espiritual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 italic">
            Fé em Jesus BR — Inspiração diária para sua vida 💖
          </p>
        </div>
      </div>
    </div>
  );
}