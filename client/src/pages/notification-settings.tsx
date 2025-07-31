import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  Bell, 
  BellOff,
  Clock,
  Heart,
  Gift,
  CheckCircle,
  Smartphone
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

export default function NotificationSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    isSupported,
    permission,
    requestPermission,
    sendTestNotification 
  } = usePushNotifications();

  // Get current notification settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/notification-settings", user?.id],
    enabled: !!user?.id
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await apiRequest("POST", "/api/notification-settings", {
        userId: user?.id,
        ...newSettings
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notification-settings", user?.id] });
      toast({ title: "Configurações salvas com sucesso!" });
    }
  });

  const [localSettings, setLocalSettings] = useState({
    dailyVerse: true,
    prayerReminders: true,
    challengeUpdates: true,
    sponsorMessages: false,
    preferredTime: "09:00"
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateMutation.mutate(newSettings);
  };

  const handleTestNotification = () => {
    if (permission === 'granted') {
      sendTestNotification();
      toast({ title: "Notificação de teste enviada!" });
    } else {
      toast({ 
        title: "Permissão necessária", 
        description: "Ative as notificações primeiro",
        variant: "destructive" 
      });
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({ title: "Notificações ativadas com sucesso!" });
    } else {
      toast({ 
        title: "Permissão negada", 
        description: "Você pode ativar nas configurações do navegador",
        variant: "destructive" 
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configurações de Notificação
          </h1>
          <p className="text-gray-600">
            Personalize quando e como você quer receber notificações
          </p>
        </div>

        {/* Browser Support Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Status das Notificações Push
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Suporte do Navegador:</span>
                <Badge variant={isSupported ? "default" : "destructive"}>
                  {isSupported ? "Suportado" : "Não Suportado"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Permissão:</span>
                <div className="flex items-center gap-2">
                  <Badge variant={permission === 'granted' ? "default" : "destructive"}>
                    {permission === 'granted' ? 'Concedida' : 
                     permission === 'denied' ? 'Negada' : 'Pendente'}
                  </Badge>
                  {permission !== 'granted' && isSupported && (
                    <Button onClick={handleRequestPermission} size="sm">
                      Ativar
                    </Button>
                  )}
                </div>
              </div>

              {permission === 'granted' && (
                <Button onClick={handleTestNotification} variant="outline" className="w-full">
                  Enviar Notificação de Teste
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <div className="space-y-6">
          {/* Daily Verse */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Versículo Diário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">Receber versículo diário</p>
                  <p className="text-sm text-gray-600">
                    Versículo bíblico inspirador todos os dias
                  </p>
                </div>
                <Switch
                  checked={localSettings.dailyVerse}
                  onCheckedChange={(checked) => handleSettingChange('dailyVerse', checked)}
                  disabled={permission !== 'granted'}
                />
              </div>
              
              {localSettings.dailyVerse && (
                <div className="flex items-center gap-4">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Horário:</span>
                  <Select 
                    value={localSettings.preferredTime} 
                    onValueChange={(value) => handleSettingChange('preferredTime', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">06:00</SelectItem>
                      <SelectItem value="07:00">07:00</SelectItem>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                      <SelectItem value="21:00">21:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prayer Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Lembretes de Oração
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Lembretes para orar</p>
                  <p className="text-sm text-gray-600">
                    Lembretes gentis para momentos de oração
                  </p>
                </div>
                <Switch
                  checked={localSettings.prayerReminders}
                  onCheckedChange={(checked) => handleSettingChange('prayerReminders', checked)}
                  disabled={permission !== 'granted'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Challenge Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Atualizações de Desafios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Novos desafios espirituais</p>
                  <p className="text-sm text-gray-600">
                    Seja notificado sobre novos desafios e conquistas
                  </p>
                </div>
                <Switch
                  checked={localSettings.challengeUpdates}
                  onCheckedChange={(checked) => handleSettingChange('challengeUpdates', checked)}
                  disabled={permission !== 'granted'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sponsor Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-600" />
                Mensagens de Patrocinadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Ofertas e promoções</p>
                  <p className="text-sm text-gray-600">
                    Receba ofertas especiais de nossos parceiros cristãos
                  </p>
                </div>
                <Switch
                  checked={localSettings.sponsorMessages}
                  onCheckedChange={(checked) => handleSettingChange('sponsorMessages', checked)}
                  disabled={permission !== 'granted'}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Precisa de Ajuda?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <div>
              <p><strong>Não recebo notificações:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Verifique se as notificações estão ativadas nas configurações do navegador</li>
                <li>Certifique-se de que o modo "Não Perturbe" está desativado</li>
                <li>Em dispositivos móveis, adicione o app à tela inicial</li>
              </ul>
            </div>
            
            <div>
              <p><strong>Horário das notificações:</strong></p>
              <p className="ml-4">
                As notificações são enviadas no horário do seu dispositivo. 
                Certifique-se de que a hora esteja correta.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}