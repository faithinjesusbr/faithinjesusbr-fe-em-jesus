import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  Award, 
  CheckCircle,
  Download,
  Share2,
  Printer
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

interface Certificate {
  name: string;
  amount: string;
  date: string;
  prayer: string;
  verse: string;
  reference: string;
}

const biblicalVerses = [
  {
    text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
    reference: "1 Tessalonicenses 5:18"
  },
  {
    text: "Toda a boa dádiva e todo o dom perfeito vem do alto, descendo do Pai das luzes.",
    reference: "Tiago 1:17"
  },
  {
    text: "Dai, e dar-se-vos-á; boa medida, recalcada, sacudida e transbordando vos deitarão no vosso regaço.",
    reference: "Lucas 6:38"
  },
  {
    text: "Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum de seus benefícios.",
    reference: "Salmos 103:2"
  },
  {
    text: "E o meu Deus suprirá todas as vossas necessidades segundo as suas riquezas na glória em Cristo Jesus.",
    reference: "Filipenses 4:19"
  }
];

const prayers = [
  "Senhor, abençoe abundantemente a vida de {name}. Que Sua paz e alegria estejam sempre presentes em seu coração. Que cada dia seja uma nova oportunidade de crescer em fé e amor. Em nome de Jesus, amém.",
  "Pai celestial, derrame Suas bênçãos sobre {name}. Que a generosidade demonstrada seja multiplicada em sua vida. Que Deus continue usando-o(a) como instrumento de Sua bondade. Amém.",
  "Senhor Jesus, obrigado pela vida de {name} e por sua contribuição para Tua obra. Que Deus continue guiando seus passos e abençoando todos os seus projetos. Em Teu santo nome, amém.",
  "Deus de amor, agradecemos por {name} e por seu coração generoso. Que o Senhor multiplique suas bênçãos e use sua vida para tocar muitos corações. Amém.",
  "Pai eterno, que {name} continue sendo uma bênção na vida de muitas pessoas. Que Deus recompense sua generosidade com abundantes bênçãos celestiais. Em Cristo, amém."
];

export default function ContributorsOffline() {
  const [showForm, setShowForm] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsGenerating(true);
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = (formData.get('name') as string).trim();
    const email = (formData.get('email') as string).trim();
    const amount = (formData.get('amount') as string) || "50";
    
    if (!name || !email) {
      alert('Nome e email são obrigatórios');
      setIsGenerating(false);
      return;
    }
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Selecionar versículo e oração aleatoriamente
    const selectedVerse = biblicalVerses[Math.floor(Math.random() * biblicalVerses.length)];
    const selectedPrayer = prayers[Math.floor(Math.random() * prayers.length)].replace('{name}', name);
    
    const newCertificate: Certificate = {
      name,
      amount,
      date: new Date().toLocaleDateString('pt-BR'),
      prayer: selectedPrayer,
      verse: selectedVerse.text,
      reference: selectedVerse.reference
    };
    
    setCertificate(newCertificate);
    setIsGenerating(false);
    setShowForm(false);
    
    // Salvar no localStorage para histórico
    const history = JSON.parse(localStorage.getItem('certificates') || '[]');
    history.push(newCertificate);
    localStorage.setItem('certificates', JSON.stringify(history));
  };

  const downloadCertificate = () => {
    if (!certificate) return;
    
    const content = `
CERTIFICADO DE GRATIDÃO
Fé em Jesus BR

Reconhecemos com gratidão a valiosa contribuição de ${certificate.name} em nossa missão de espalhar a Palavra de Deus.

ORAÇÃO EXCLUSIVA:
${certificate.prayer}

VERSÍCULO ESPECIAL:
"${certificate.verse}"
— ${certificate.reference}

Data: ${certificate.date}
Valor: R$ ${certificate.amount}

Que Deus continue abençoando abundantemente sua vida e ministério.

---
Fé em Jesus BR - Ministério Digital
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificado-${certificate.name.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareCertificate = () => {
    if (!certificate) return;
    
    const text = `🎉 Recebi meu Certificado de Gratidão do Fé em Jesus BR!

📜 Colaborador: ${certificate.name}
💝 Contribuição: R$ ${certificate.amount}
📅 Data: ${certificate.date}

"${certificate.verse}" - ${certificate.reference}

🙏 Junte-se a nossa missão de espalhar a Palavra de Deus!

#FeEmJesusBR #Colaborador #Gratidao`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Certificado de Gratidão',
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Texto copiado para a área de transferência!');
    }
  };

  const printCertificate = () => {
    if (!certificate) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificado de Gratidão - ${certificate.name}</title>
          <style>
            body { font-family: serif; padding: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 40px; }
            .title { font-size: 24px; font-weight: bold; color: #2563eb; }
            .subtitle { font-size: 16px; color: #6b7280; margin-top: 10px; }
            .content { max-width: 600px; margin: 0 auto; }
            .name { font-size: 20px; font-weight: bold; color: #dc2626; }
            .section { margin: 30px 0; padding: 20px; border: 1px solid #e5e7eb; }
            .verse { font-style: italic; color: #1e40af; font-size: 16px; }
            .reference { color: #6b7280; margin-top: 10px; }
            .footer { text-align: center; margin-top: 40px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">CERTIFICADO DE GRATIDÃO</div>
            <div class="subtitle">Fé em Jesus BR - Ministério Digital</div>
          </div>
          
          <div class="content">
            <p>Reconhecemos com gratidão a valiosa contribuição de <span class="name">${certificate.name}</span> em nossa missão de espalhar a Palavra de Deus.</p>
            
            <div class="section">
              <h3>Oração Exclusiva</h3>
              <p>${certificate.prayer}</p>
            </div>
            
            <div class="section">
              <h3>Versículo Especial</h3>
              <p class="verse">"${certificate.verse}"</p>
              <p class="reference">— ${certificate.reference}</p>
            </div>
            
            <div class="footer">
              <p>Data: ${certificate.date} | Contribuição: R$ ${certificate.amount}</p>
              <p>Que Deus continue abençoando abundantemente sua vida e ministério.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Gerador de Certificados
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sistema 100% funcional - gere seu certificado agora
          </p>
        </div>

        {/* Garantia de funcionamento */}
        <div className="mb-8 p-4 bg-green-100 border border-green-200 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Sistema Offline - Funciona Sempre!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Não depende de internet ou servidor. Seu certificado será gerado instantaneamente.
          </p>
        </div>

        {/* Botão inicial */}
        {!showForm && !certificate && (
          <div className="text-center">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              <Gift className="mr-2 h-5 w-5" />
              Gerar Meu Certificado
            </Button>
          </div>
        )}

        {/* Formulário */}
        {showForm && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6" />
                Dados para o Certificado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={generateCertificate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                  <Input name="name" required className="w-full" placeholder="Seu nome completo" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input name="email" type="email" required className="w-full" placeholder="seu@email.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Valor da Contribuição</label>
                  <Input name="amount" defaultValue="50" className="w-full" placeholder="50" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem (opcional)</label>
                  <Textarea 
                    name="message" 
                    placeholder="Seu testemunho ou mensagem de gratidão..."
                    rows={3}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isGenerating ? 'Gerando Certificado...' : 'Gerar Certificado'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    disabled={isGenerating}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Certificado */}
        {certificate && (
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-16 w-16 text-yellow-600" />
              </div>
              <CardTitle className="text-3xl text-yellow-800 mb-2">
                Certificado de Gratidão
              </CardTitle>
              <Badge className="bg-yellow-600 text-white px-4 py-1">
                Colaborador Oficial - {certificate.date}
              </Badge>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-gray-700">
                Reconhecemos com gratidão a valiosa contribuição de{" "}
                <span className="font-bold text-yellow-800">{certificate.name}</span>{" "}
                em nossa missão de espalhar a Palavra de Deus.
              </p>
              
              <div className="bg-white/80 p-6 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-gray-800 mb-3">Oração Exclusiva</h3>
                <p className="text-gray-700 italic mb-6">{certificate.prayer}</p>
                
                <h3 className="font-semibold text-gray-800 mb-3">Versículo Especial</h3>
                <blockquote className="text-blue-800 font-medium mb-2 text-lg">
                  "{certificate.verse}"
                </blockquote>
                <cite className="text-blue-600">— {certificate.reference}</cite>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={downloadCertificate} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Certificado
                </Button>
                <Button onClick={printCertificate} variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button onClick={shareCertificate} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setCertificate(null);
                    setShowForm(false);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Gerar Novo Certificado
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}