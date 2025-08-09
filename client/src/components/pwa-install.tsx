import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Smartphone, Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir o prompt padrão do browser
      e.preventDefault();
      
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      
      // Mostrar o dialog de instalação após 3 segundos
      setTimeout(() => {
        if (!localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallDialog(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Mostrar o prompt de instalação
      await deferredPrompt.prompt();
      
      // Aguardar a escolha do usuário
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA instalado com sucesso!');
      }
      
      // Limpar o prompt
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowInstallDialog(false);
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallDialog(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!isInstallable) return null;

  return (
    <>
      {/* Botão flutuante para instalação */}
      <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
        <Button
          onClick={() => setShowInstallDialog(true)}
          className="rounded-full w-14 h-14 bg-divine-600 hover:bg-divine-700 shadow-lg"
          size="sm"
        >
          <Download className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Dialog de instalação */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              📱 Instalar Fé em Jesus
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-divine-500 to-divine-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Smartphone className="h-10 w-10 text-white" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instale nosso app!
            </h3>
            
            <p className="text-gray-600 mb-6 text-sm">
              Tenha acesso rápido ao app Fé em Jesus direto na tela inicial do seu celular. 
              Funciona offline e receba notificações de versículos diários!
            </p>

            <div className="space-y-3">
              <Button 
                onClick={handleInstallClick}
                className="w-full bg-divine-600 hover:bg-divine-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Instalar Agora
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDismiss}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Agora Não
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}