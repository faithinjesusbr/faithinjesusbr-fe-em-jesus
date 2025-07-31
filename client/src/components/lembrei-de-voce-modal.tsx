import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Download, MessageCircle, RefreshCw, Share } from "lucide-react";
import html2canvas from "html2canvas";

interface LembreiDeVoceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MessageData {
  recipientName: string;
  senderName: string;
  relationship: string;
  messageType: string;
}

const relationships = [
  { value: "mae", label: "Mãe" },
  { value: "pai", label: "Pai" },
  { value: "amigo", label: "Amigo(a)" },
  { value: "chefe", label: "Chefe" },
  { value: "irmao", label: "Irmão/Irmã" },
  { value: "filho", label: "Filho(a)" },
  { value: "namorado", label: "Namorado(a)" },
  { value: "esposo", label: "Esposo(a)" },
  { value: "pastor", label: "Pastor(a)" },
  { value: "amigo_igreja", label: "Irmão(ã) da Igreja" }
];

const messageTypes = [
  { value: "bom_dia", label: "Bom dia", emoji: "🌞" },
  { value: "boa_tarde", label: "Boa tarde", emoji: "☀️" },
  { value: "boa_noite", label: "Boa noite", emoji: "🌙" }
];

const verses = [
  { text: "O Senhor é a minha força e o meu escudo; nele o meu coração confia.", reference: "Salmos 28:7" },
  { text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
  { text: "O Senhor abençoe-te e te guarde.", reference: "Números 6:24" },
  { text: "Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça.", reference: "Mateus 6:33" },
  { text: "Porque eu sei os planos que tenho para vocês, diz o Senhor.", reference: "Jeremias 29:11" },
  { text: "A paz de Deus, que excede todo o entendimento, guardará os seus corações.", reference: "Filipenses 4:7" },
  { text: "O amor de Deus derramado em nossos corações pelo Espírito Santo.", reference: "Romanos 5:5" },
  { text: "Confie no Senhor de todo o seu coração.", reference: "Provérbios 3:5" }
];

const messageTemplates = {
  bom_dia: {
    mae: [
      "Bom dia, mãe querida! 🌞 Que a paz de Deus esteja com você hoje e sempre. Você é uma bênção na minha vida!",
      "Bom dia, mãe! 🌅 Que este novo dia traga alegria e muitas bênçãos para o seu coração amoroso.",
      "Mãe, bom dia! 🌸 Deus te abençoe hoje com saúde, paz e muito amor. Você é especial demais!"
    ],
    pai: [
      "Bom dia, pai! 🌞 Que Deus te conceda força e sabedoria para mais este dia. Você é meu exemplo!",
      "Pai querido, bom dia! 🌅 Que a proteção divina esteja sobre você hoje e sempre.",
      "Bom dia, papai! 💪 Que Deus te abençoe com saúde e alegria neste novo dia."
    ],
    amigo: [
      "Bom dia, amigo(a) querido(a)! 🌞 Que Deus ilumine seu caminho hoje e sempre.",
      "Oi, amigo(a)! Bom dia! ☀️ Que este dia seja repleto de bênçãos e momentos especiais.",
      "Bom dia! 🌅 Lembrei de você e vim desejar que Deus te abençoe grandemente hoje!"
    ]
  },
  boa_tarde: {
    mae: [
      "Boa tarde, mãe! ☀️ Espero que seu dia esteja sendo maravilhoso. Deus te abençoe sempre!",
      "Mãe querida, boa tarde! 🌻 Que a presença de Deus continue te acompanhando nesta tarde.",
      "Boa tarde, mãe! 💛 Você está no meu coração e nas minhas orações sempre."
    ],
    pai: [
      "Boa tarde, pai! ☀️ Que Deus continue te dando força para enfrentar todos os desafios.",
      "Pai, boa tarde! 🌤️ Espero que esteja tendo um dia abençoado e cheio de paz.",
      "Boa tarde, papai! 💼 Que a sabedoria divina te guie em todas as suas decisões."
    ],
    amigo: [
      "Boa tarde, querido(a)! ☀️ Que sua tarde seja cheia de alegria e bênçãos especiais.",
      "Oi! Boa tarde! 🌞 Lembrei de você e vim enviar um carinho especial da parte de Deus.",
      "Boa tarde! 🌸 Que Deus continue derramando suas bênçãos sobre sua vida."
    ]
  },
  boa_noite: {
    mae: [
      "Boa noite, mãe! 🌙 Que Deus te conceda um descanso reparador e sonhos abençoados.",
      "Mãe querida, boa noite! ✨ Que os anjos do Senhor te protejam durante o sono.",
      "Boa noite, mãe! 🌟 Durma em paz sabendo que você é muito amada por Deus e por mim."
    ],
    pai: [
      "Boa noite, pai! 🌙 Que o Senhor te dê um descanso tranquilo e restaurador.",
      "Papai, boa noite! 🌌 Que a paz de Cristo esteja sobre você nesta noite.",
      "Boa noite, pai querido! ⭐ Descanse nas mãos do Senhor que te ama infinitamente."
    ],
    amigo: [
      "Boa noite, amigo(a)! 🌙 Que Deus te abençoe com uma noite de paz e descanso.",
      "Boa noite! 🌟 Que você tenha sonhos abençoados e acorde renovado(a) amanhã.",
      "Boa noite, querido(a)! 🌌 Que a presença de Deus te acompanhe durante o sono."
    ]
  }
};

export default function LembreiDeVoceModal({ isOpen, onClose }: LembreiDeVoceModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<MessageData>({
    recipientName: "",
    senderName: "",
    relationship: "",
    messageType: ""
  });
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [selectedVerse, setSelectedVerse] = useState(verses[0]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const generateMessage = () => {
    const { recipientName, relationship, messageType, senderName } = formData;
    
    // Get random message template
    const templates = messageTemplates[messageType as keyof typeof messageTemplates]?.[relationship as keyof typeof messageTemplates.bom_dia] || 
                     messageTemplates[messageType as keyof typeof messageTemplates]?.amigo || 
                     messageTemplates.bom_dia.amigo;
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    
    // Replace placeholder with actual name
    const personalizedMessage = randomTemplate.replace(/mãe|pai|amigo\(a\)|querido\(a\)|papai/g, recipientName);
    
    setGeneratedMessage(personalizedMessage);
    setSelectedVerse(randomVerse);
    setStep(2);
  };

  const generateNewMessage = () => {
    generateMessage();
  };

  const generateImage = async () => {
    if (!messageRef.current) return;
    
    setIsGeneratingImage(true);
    
    try {
      const canvas = await html2canvas(messageRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `lembrei-de-voce-${formData.recipientName.toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const shareOnWhatsApp = () => {
    const message = `${generatedMessage}\n\n"${selectedVerse.text}" (${selectedVerse.reference})\n\nCom carinho, ${formData.senderName} ❤️\n\n_Enviado pelo app Fé em Jesus BR_ 🙏`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      recipientName: "",
      senderName: "",
      relationship: "",
      messageType: ""
    });
    setGeneratedMessage("");
  };

  const getGradientByType = (type: string) => {
    switch (type) {
      case 'bom_dia':
        return 'from-orange-300 via-yellow-300 to-orange-400';
      case 'boa_tarde':
        return 'from-blue-300 via-sky-300 to-blue-400';
      case 'boa_noite':
        return 'from-purple-400 via-indigo-400 to-purple-500';
      default:
        return 'from-blue-300 via-sky-300 to-blue-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-6 w-6 text-red-500" />
            💌 Lembrei de Você
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 p-4">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Crie uma mensagem personalizada para alguém especial com versículo bíblico e amor!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Nome do destinatário</Label>
                <Input
                  id="recipientName"
                  placeholder="Ex: Maria, João..."
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderName">Seu nome</Label>
                <Input
                  id="senderName"
                  placeholder="Quem está enviando"
                  value={formData.senderName}
                  onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Relação com a pessoa</Label>
                <Select value={formData.relationship} onValueChange={(value) => setFormData({...formData, relationship: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a relação" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map((rel) => (
                      <SelectItem key={rel.value} value={rel.value}>
                        {rel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de mensagem</Label>
                <Select value={formData.messageType} onValueChange={(value) => setFormData({...formData, messageType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.emoji} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateMessage}
              disabled={!formData.recipientName || !formData.senderName || !formData.relationship || !formData.messageType}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              <Heart className="h-4 w-4 mr-2" />
              Gerar Mensagem de Amor
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 p-4">
            <div 
              ref={messageRef}
              id="dedicatoriaLayout"
              className={`p-8 rounded-2xl bg-gradient-to-br ${getGradientByType(formData.messageType)} text-white shadow-2xl relative overflow-hidden`}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10 text-center space-y-6">
                {/* Message type emoji */}
                <div className="text-4xl mb-4">
                  {messageTypes.find(t => t.value === formData.messageType)?.emoji}
                </div>
                
                {/* Main message */}
                <div className="text-lg leading-relaxed font-medium">
                  {generatedMessage}
                </div>
                
                {/* Bible verse */}
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30">
                  <p className="text-base italic mb-2">"{selectedVerse.text}"</p>
                  <p className="text-sm font-semibold">({selectedVerse.reference})</p>
                </div>
                
                {/* Signature */}
                <div className="text-right">
                  <p className="text-lg font-semibold">Com carinho,</p>
                  <p className="text-xl font-bold">{formData.senderName} ❤️</p>
                </div>
                
                {/* Watermark */}
                <div className="absolute bottom-4 right-4 text-xs opacity-70">
                  Fé em Jesus BR 🙏
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={shareOnWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                📲 Compartilhar no WhatsApp
              </Button>
              
              <Button
                onClick={generateImage}
                disabled={isGeneratingImage}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingImage ? "Gerando..." : "⬇️ Baixar Imagem"}
              </Button>
              
              <Button
                onClick={generateNewMessage}
                variant="outline"
                className="border-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                🔁 Gerar Outra
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={resetForm}
                variant="ghost"
                className="text-gray-600"
              >
                ← Criar Nova Mensagem
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}