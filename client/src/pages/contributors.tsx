import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Heart, 
  Users,
  Award,
  Gift,
  HandHeart,
  DollarSign,
  Code,
  HandHeart as PrayingHands,
  Sparkles,
  Download,
  Share2
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Contributor {
  id: string;
  name: string;
  email: string;
  description?: string;
  profileImageUrl?: string;
  contribution: string;
  amount?: string;
  isActive: boolean;
  certificate?: string;
  exclusivePrayer?: string;
  exclusiveVerse?: string;
  verseReference?: string;
  createdAt: string;
}

export default function ContributorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "50,00",
    description: "amem deus abençoe"
  });
  const { toast } = useToast();

  const { data: contributors, isLoading } = useQuery({
    queryKey: ["/api/contributors"],
  });

  const submitContributorMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/contributors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributors"] });
      toast({
        title: "Cadastro Realizado!",
        description: "Seu certificado personalizado foi gerado com IA.",
      });
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        amount: "50,00",
        description: "amem deus abençoe"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível processar seu cadastro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Dados Incompletos",
        description: "Por favor, preencha pelo menos nome e email.",
        variant: "destructive",
      });
      return;
    }
    submitContributorMutation.mutate(formData);
  };

  const filteredContributors = Array.isArray(contributors) ? contributors.filter((contributor: Contributor) => {
    const matchesSearch = contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.contribution.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || contributor.contribution === filterType;
    
    return matchesSearch && matchesFilter;
  }) : [];

  const contributionTypes = [
    { value: "donation", label: "Doação", icon: DollarSign, color: "bg-green-100 text-green-800" },
    { value: "volunteer", label: "Voluntário", icon: HandHeart, color: "bg-blue-100 text-blue-800" },
    { value: "prayer", label: "Oração", icon: Heart, color: "bg-purple-100 text-purple-800" },
    { value: "tech", label: "Técnico", icon: Code, color: "bg-orange-100 text-orange-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nossos Colaboradores
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pessoas especiais que contribuem com seu tempo, recursos e orações para 
            manter nossa missão de evangelização digital ativa e gratuita.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar colaboradores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 sm:h-11"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              Todos
            </Button>
            {contributionTypes.map((type) => (
              <Button
                key={type.value}
                variant={filterType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type.value)}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <type.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Gratitude Message */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <HandHeart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Gratidão Infinita
            </h3>
            <p className="text-gray-700">
              Cada colaborador é uma bênção especial em nossa jornada. Através de doações, 
              trabalho voluntário, orações e suporte técnico, vocês tornam possível espalhar 
              a Palavra de Deus digitalmente e impactar vidas ao redor do mundo.
            </p>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-divine-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando colaboradores...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredContributors.map((contributor: Contributor) => (
              <ContributorCard key={contributor.id} contributor={contributor} />
            ))}
          </div>
        )}

        {filteredContributors.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum colaborador encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar sua busca ou filtro.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-divine-50 to-blue-50 border-divine-200">
          <CardContent className="p-8 text-center">
            <HandHeart className="h-12 w-12 text-divine-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Faça Parte da Nossa Missão
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Você também pode contribuir para espalhar a Palavra de Deus e manter 
              este aplicativo gratuito. Seja através de doações, trabalho voluntário, 
              orações ou suporte técnico - toda ajuda é uma bênção!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowForm(true)}
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Cadastrar e Gerar Certificado
              </Button>
            </div>
            
            {/* Registration Form Modal */}
            {showForm && (
              <Card className="mt-6 sm:mt-8 max-w-2xl mx-auto shadow-2xl border-2 border-divine-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-center text-xl sm:text-2xl text-divine-700">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" />
                    Cadastro de Colaborador
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Seu nome completo"
                          required
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="seu@email.com"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor da Doação (opcional)
                      </label>
                      <Input
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="50,00"
                        className="h-11"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem ou Testemunho (opcional)
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Compartilhe como Deus tocou seu coração..."
                        className="min-h-[100px] resize-none"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                      <Button
                        type="submit"
                        disabled={submitContributorMutation.isPending}
                        className="flex-1 bg-divine-600 hover:bg-divine-700 h-11 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {submitContributorMutation.isPending ? (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                            Gerando Certificado...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            <span className="hidden xs:inline">Cadastrar e </span>Gerar Certificado
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        className="sm:w-auto h-11"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

function ContributorCard({ contributor }: { contributor: Contributor }) {
  const contributionTypes = {
    donation: { label: "Doação", icon: DollarSign, color: "bg-green-100 text-green-800" },
    volunteer: { label: "Voluntário", icon: HandHeart, color: "bg-blue-100 text-blue-800" },
    prayer: { label: "Oração", icon: PrayingHands, color: "bg-purple-100 text-purple-800" },
    tech: { label: "Técnico", icon: Code, color: "bg-orange-100 text-orange-800" },
  };

  const contributionType = contributionTypes[contributor.contribution as keyof typeof contributionTypes] || 
    { label: contributor.contribution, icon: Gift, color: "bg-gray-100 text-gray-800" };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-divine-200 h-fit">
      <CardHeader className="text-center pb-3 sm:pb-4">
        <div className="relative mx-auto mb-3 sm:mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full overflow-hidden bg-white shadow-lg border-4 border-divine-100 group-hover:border-divine-200 transition-colors">
            {contributor.profileImageUrl ? (
              <img 
                src={contributor.profileImageUrl} 
                alt={contributor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${contributor.name}&background=f3f4f6&color=374151&size=80`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-divine-100 to-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-divine-600" />
              </div>
            )}
          </div>
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
            <Badge className={`${contributionType.color} text-xs px-1.5 py-0.5 sm:px-2 sm:py-1`}>
              <contributionType.icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
              <span className="hidden xs:inline text-xs">{contributionType.label}</span>
            </Badge>
          </div>
        </div>
        <CardTitle className="text-base sm:text-lg text-gray-800 group-hover:text-divine-700 transition-colors leading-tight">
          {contributor.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-4 sm:pb-6">
        {contributor.description && (
          <p className="text-gray-600 text-center leading-relaxed text-xs sm:text-sm line-clamp-3">
            {contributor.description}
          </p>
        )}

        {contributor.amount && (
          <div className="text-center">
            <Badge variant="outline" className="text-green-700 border-green-300 text-xs px-2 py-1">
              <DollarSign className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
              R$ {contributor.amount}
            </Badge>
          </div>
        )}

        {/* Exclusive Content Preview */}
        {(contributor.exclusivePrayer || contributor.exclusiveVerse) && (
          <div className="bg-divine-50 p-2 sm:p-3 rounded-lg border border-divine-200">
            <p className="text-xs text-divine-700 font-semibold mb-1">Conteúdo Exclusivo:</p>
            {contributor.exclusiveVerse && (
              <p className="text-xs italic text-gray-700 line-clamp-2">
                "{contributor.exclusiveVerse.substring(0, 60)}..."
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-divine-600 hover:bg-divine-700 text-xs sm:text-sm h-8 sm:h-9 shadow-md hover:shadow-lg transition-all">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Ver </span>Certificado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-base sm:text-lg">
                  Certificado de Agradecimento
                </DialogTitle>
              </DialogHeader>
              <ContributorCertificate contributor={contributor} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-xs text-center text-gray-500 pt-1 sm:pt-2">
          Desde {new Date(contributor.createdAt).toLocaleDateString('pt-BR', { 
            month: 'short', 
            year: 'numeric' 
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ContributorCertificate({ contributor }: { contributor: Contributor }) {
  const { data: certificate, isLoading } = useQuery({
    queryKey: [`/api/contributors/${contributor.id}/certificate`],
  });

  const certificateData = certificate || {};

  const handleDownload = async () => {
    try {
      const element = document.getElementById('certificate-content');
      if (!element) return;
      
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `certificado-${contributor.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erro ao baixar certificado:', error);
    }
  };

  const handleShare = async () => {
    try {
      const element = document.getElementById('certificate-content');
      if (!element) return;
      
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        if (navigator.share) {
          const file = new File([blob], `certificado-${contributor.name}.png`, { type: 'image/png' });
          try {
            await navigator.share({
              title: 'Meu Certificado - Fé em Jesus BR',
              text: `Orgulhoso de contribuir com a evangelização digital! 🙏`,
              files: [file]
            });
          } catch (error) {
            // Fallback para WhatsApp se Web Share falhar
            const dataUrl = canvas.toDataURL();
            const text = `Orgulhoso de contribuir com a evangelização digital no app Fé em Jesus BR! 🙏`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(whatsappUrl, '_blank');
          }
        } else {
          // Fallback para WhatsApp em navegadores que não suportam Web Share
          const text = `Orgulhoso de contribuir com a evangelização digital no app Fé em Jesus BR! 🙏`;
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
          window.open(whatsappUrl, '_blank');
        }
      });
    } catch (error) {
      console.error('Erro ao compartilhar certificado:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-divine-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Gerando certificado personalizado...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div 
        id="certificate-content"
        className="bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 sm:p-6 md:p-8 rounded-lg border-2 border-purple-200 shadow-xl relative overflow-hidden"
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-purple-300 rounded-full"></div>
          <div className="absolute top-8 right-8 w-12 h-12 border-2 border-blue-300 rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-10 h-10 border-2 border-purple-300 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-14 h-14 border-2 border-blue-300 rounded-full"></div>
        </div>

        <div className="text-center space-y-4 sm:space-y-6 relative z-10">
          {/* Header with logo placeholder */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-divine-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="border-b-2 border-purple-300 pb-3 mb-4 w-full max-w-md">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                Certificado de Gratidão
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Em reconhecimento à sua valiosa contribuição
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-divine-700">
              {contributor.name}
            </h3>
            
            <Badge className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-300">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Contribuição: {contributor.contribution}
            </Badge>

            {contributor.amount && (
              <Badge className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Valor: R$ {contributor.amount}
              </Badge>
            )}

            {(certificateData as any)?.description && (
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed max-w-sm sm:max-w-md md:max-w-lg mx-auto px-2">
                {(certificateData as any).description}
              </p>
            )}

            {(certificateData as any)?.aiGeneratedVerse && (
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-purple-200 shadow-md mx-2 sm:mx-4">
                <p className="text-sm sm:text-base md:text-lg italic text-gray-800 mb-2 leading-relaxed">
                  "{(certificateData as any).aiGeneratedVerse}"
                </p>
                {(certificateData as any)?.verseReference && (
                  <p className="text-xs sm:text-sm font-semibold text-divine-600">
                    — {(certificateData as any).verseReference}
                  </p>
                )}
              </div>
            )}

            {(certificateData as any)?.aiGeneratedPrayer && (
              <div className="bg-gradient-to-r from-divine-50 to-purple-50 p-3 sm:p-4 rounded-lg border border-divine-200 shadow-md mx-2 sm:mx-4">
                <h4 className="text-xs sm:text-sm font-semibold text-divine-700 mb-2 flex items-center justify-center">
                  <PrayingHands className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Oração de Bênção
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {(certificateData as any).aiGeneratedPrayer}
                </p>
              </div>
            )}
          </div>

          <div className="text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t border-purple-200 space-y-1">
            <p className="font-semibold">Fé em Jesus BR - Aplicativo Cristão</p>
            <p>Certificado emitido em {new Date().toLocaleDateString('pt-BR')}</p>
            <p className="text-xs italic">"Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles." - Mateus 18:20</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
        <Button 
          onClick={handleDownload}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar Certificado
        </Button>
        <Button 
          onClick={handleShare}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
}