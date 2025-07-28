import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Heart, 
  Users,
  Award,
  Gift,
  HandHeart,
  DollarSign,
  Code,
  Heart as PrayingHands
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const { data: contributors, isLoading } = useQuery({
    queryKey: ["/api/contributors"],
  });

  const filteredContributors = (contributors || []).filter((contributor: Contributor) => {
    const matchesSearch = contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.contribution.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || contributor.contribution === filterType;
    
    return matchesSearch && matchesFilter;
  });

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
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar colaboradores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              Todos
            </Button>
            {contributionTypes.map((type) => (
              <Button
                key={type.value}
                variant={filterType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type.value)}
              >
                <type.icon className="h-4 w-4 mr-1" />
                {type.label}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <DollarSign className="h-5 w-5 mr-2" />
                Fazer Doação
              </Button>
              <Button size="lg" variant="outline" className="border-divine-600 text-divine-600">
                <HandHeart className="h-5 w-5 mr-2" />
                Ser Voluntário
              </Button>
            </div>
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
    <Card className="group hover:shadow-xl transition-shadow duration-300 border-2 hover:border-divine-200">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-white shadow-lg border-4 border-divine-100">
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
                <Users className="h-8 w-8 text-divine-600" />
              </div>
            )}
          </div>
          <div className="absolute -top-2 -right-2">
            <Badge className={contributionType.color}>
              <contributionType.icon className="h-3 w-3 mr-1" />
              {contributionType.label}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg text-gray-800 group-hover:text-divine-700 transition-colors">
          {contributor.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {contributor.description && (
          <p className="text-gray-600 text-center leading-relaxed text-sm">
            {contributor.description}
          </p>
        )}

        {contributor.amount && (
          <div className="text-center">
            <Badge variant="outline" className="text-green-700 border-green-300">
              <DollarSign className="h-3 w-3 mr-1" />
              {contributor.amount}
            </Badge>
          </div>
        )}

        {/* Exclusive Content Preview */}
        {(contributor.exclusivePrayer || contributor.exclusiveVerse) && (
          <div className="bg-divine-50 p-3 rounded-lg border border-divine-200">
            <p className="text-xs text-divine-700 font-semibold mb-1">Conteúdo Exclusivo:</p>
            {contributor.exclusiveVerse && (
              <p className="text-xs italic text-gray-700">
                "{contributor.exclusiveVerse.substring(0, 80)}..."
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-divine-600 hover:bg-divine-700" size="sm">
                <Award className="h-4 w-4 mr-2" />
                Ver Certificado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Certificado de Agradecimento
                </DialogTitle>
              </DialogHeader>
              <ContributorCertificate contributor={contributor} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-xs text-center text-gray-500 pt-2">
          Colaborador desde {new Date(contributor.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
}

function ContributorCertificate({ contributor }: { contributor: Contributor }) {
  const { data: certificate, isLoading } = useQuery({
    queryKey: [`/api/contributors/${contributor.id}/certificate`],
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-divine-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Gerando certificado personalizado...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-lg border-2 border-purple-200">
      <div className="text-center space-y-6">
        <div className="border-b-2 border-purple-300 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Certificado de Gratidão
          </h2>
          <p className="text-lg text-gray-600">
            Em reconhecimento à sua valiosa contribuição
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-divine-700">
            {contributor.name}
          </h3>
          
          <Badge className="px-4 py-2 text-sm">
            Contribuição: {contributor.contribution}
          </Badge>

          {certificate && certificate.description && (
            <p className="text-gray-700 leading-relaxed max-w-lg mx-auto">
              {certificate.description}
            </p>
          )}

          {certificate && certificate.aiGeneratedVerse && (
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="text-lg italic text-gray-800 mb-2">
                "{certificate.aiGeneratedVerse}"
              </p>
              {certificate.verseReference && (
                <p className="text-sm font-semibold text-divine-600">
                  {certificate.verseReference}
                </p>
              )}
            </div>
          )}

          {certificate && certificate.aiGeneratedPrayer && (
            <div className="bg-divine-50 p-4 rounded-lg border border-divine-200">
              <h4 className="font-semibold text-divine-700 mb-2">Oração de Bênção:</h4>
              <p className="text-gray-700 leading-relaxed">
                {certificate.aiGeneratedPrayer}
              </p>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 pt-4 border-t border-purple-200">
          <p>Fé em Jesus BR - Aplicativo Cristão</p>
          <p>{new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}