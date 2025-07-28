import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Share, MessageCircle, Send, Copy, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

export default function SharePage() {
  const [shareUrl, setShareUrl] = useState("https://preview--faith-in-jesus-br-6dbf93ab.base44.app");
  const [customMessage, setCustomMessage] = useState("Conectar com Deus de uma forma mais fácil e app Faith in Jesus BR é fantástico! Entre e seja bem-vindo!");
  const { toast } = useToast();

  const socialPlatforms = [
    {
      name: "WhatsApp",
      color: "bg-green-500 hover:bg-green-600",
      icon: "💬",
      action: () => {
        const text = encodeURIComponent(`${customMessage}\n\n${shareUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    },
    {
      name: "Facebook", 
      color: "bg-blue-600 hover:bg-blue-700",
      icon: "📘",
      action: () => {
        const text = encodeURIComponent(customMessage);
        const url = encodeURIComponent(shareUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
      }
    },
    {
      name: "Instagram",
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      icon: "📷",
      action: () => {
        toast({
          title: "Instagram",
          description: "Link copiado! Cole na sua story ou biografia.",
        });
        navigator.clipboard.writeText(shareUrl);
      }
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para sua área de transferência.",
    });
  };

  const copyMessage = () => {
    const fullMessage = `${customMessage}\n\n${shareUrl}`;
    navigator.clipboard.writeText(fullMessage);
    toast({
      title: "Mensagem copiada!",
      description: "A mensagem completa foi copiada para sua área de transferência.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Espalhe a Fé</h1>
          <p className="text-gray-600">Ajude mais pessoas a se conectarem com Deus!</p>
        </div>

        {/* Share URL Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              URL do Site
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Ou clique em uma das opções abaixo:
            </p>
          </CardContent>
        </Card>

        {/* Social Media Sharing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Compartilhe nas Redes Sociais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.name}
                  onClick={platform.action}
                  className={`${platform.color} text-white border-0 py-6 text-lg font-semibold`}
                >
                  <span className="mr-3 text-2xl">{platform.icon}</span>
                  {platform.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Message */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mensagem Sugerida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={copyMessage} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copiar Mensagem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Como ajudar a espalhar a fé:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Compartilhe o link em suas redes sociais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Convide amigos e familiares via WhatsApp</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Publique uma story no Instagram com o link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Compartilhe em grupos da igreja ou comunidades cristãs</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Cada compartilhamento conta!</h3>
              <p className="text-lg mb-6">
                "Ide por todo o mundo, pregai o evangelho a toda criatura." - Marcos 16:15
              </p>
              <p className="text-base">
                Sua ajuda é fundamental para levarmos a palavra de Deus a mais pessoas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}