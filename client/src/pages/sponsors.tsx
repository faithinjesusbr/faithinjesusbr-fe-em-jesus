import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Globe, 
  Instagram, 
  Facebook, 
  MessageCircle,
  Heart,
  Gift,
  Award,
  ExternalLink
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import PatrocinadoresRotativos from "@/components/PatrocinadoresRotativos";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Sponsor {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  isActive: boolean;
  createdAt: string;
}

export default function SponsorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const { data: sponsors, isLoading } = useQuery({
    queryKey: ["/api/sponsors"],
  });

  const filteredSponsors = sponsors?.filter((sponsor: Sponsor) =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nossos Patrocinadores
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empresas e organizações que apoiam nossa missão de espalhar a Palavra de Deus
            e manter este aplicativo gratuito para todos.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar patrocinadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Gratitude Message */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Agradecimento Especial
            </h3>
            <p className="text-gray-700">
              Graças ao apoio destes patrocinadores, conseguimos manter nosso aplicativo 
              100% gratuito e continuar espalhando a mensagem de amor e esperança de Jesus Cristo.
            </p>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-divine-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando patrocinadores...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSponsors.map((sponsor: Sponsor) => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        )}

        {(filteredSponsors.length === 0 || !sponsors || sponsors.length === 0) && !isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Patrocinadores em Destaque
              </h2>
              <p className="text-gray-600 mb-6">
                Conheça nossos parceiros que apoiam esta missão
              </p>
            </div>
            <PatrocinadoresRotativos />
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-divine-50 to-blue-50 border-divine-200">
          <CardContent className="p-8 text-center">
            <Gift className="h-12 w-12 text-divine-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Seja Nosso Parceiro
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Sua empresa também pode fazer parte desta missão de evangelização digital. 
              Entre em contato conosco e descubra como ser um patrocinador.
            </p>
            <Button size="lg" className="bg-divine-600 hover:bg-divine-700">
              <MessageCircle className="h-5 w-5 mr-2" />
              Fale Conosco
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <Card className="group hover:shadow-xl transition-shadow duration-300 border-2 hover:border-divine-200">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-white shadow-lg border-4 border-divine-100">
            <img 
              src={sponsor.logoUrl} 
              alt={sponsor.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${sponsor.name}&background=f3f4f6&color=374151&size=96`;
              }}
            />
          </div>
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-yellow-500 text-white">
              <Gift className="h-3 w-3 mr-1" />
              Patrocinador
            </Badge>
          </div>
        </div>
        <CardTitle className="text-xl text-gray-800 group-hover:text-divine-700 transition-colors">
          {sponsor.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-center leading-relaxed">
          {sponsor.description}
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-3">
          {sponsor.website && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(sponsor.website, '_blank')}
              className="hover:bg-blue-50"
            >
              <Globe className="h-4 w-4" />
            </Button>
          )}
          {sponsor.instagram && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(sponsor.instagram, '_blank')}
              className="hover:bg-pink-50"
            >
              <Instagram className="h-4 w-4" />
            </Button>
          )}
          {sponsor.facebook && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(sponsor.facebook, '_blank')}
              className="hover:bg-blue-50"
            >
              <Facebook className="h-4 w-4" />
            </Button>
          )}
          {sponsor.whatsapp && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(sponsor.whatsapp, '_blank')}
              className="hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            className="flex-1 bg-divine-600 hover:bg-divine-700"
            onClick={() => window.open(sponsor.website || '#', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visitar
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Award className="h-4 w-4 mr-2" />
                Certificado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Certificado de Gratidão
                </DialogTitle>
              </DialogHeader>
              <SponsorCertificate sponsor={sponsor} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function SponsorCertificate({ sponsor }: { sponsor: Sponsor }) {
  const { data: certificate, isLoading } = useQuery({
    queryKey: [`/api/sponsors/${sponsor.id}/certificate`],
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-divine-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Gerando certificado...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-lg border-2 border-yellow-200">
      <div className="text-center space-y-6">
        <div className="border-b-2 border-yellow-300 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Certificado de Gratidão
          </h2>
          <p className="text-lg text-gray-600">
            Em reconhecimento ao apoio à evangelização digital
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-divine-700">
            {sponsor.name}
          </h3>
          
          {certificate?.description && (
            <p className="text-gray-700 leading-relaxed max-w-lg mx-auto">
              {certificate.description}
            </p>
          )}

          {certificate?.aiGeneratedVerse && (
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <p className="text-lg italic text-gray-800 mb-2">
                "{certificate.aiGeneratedVerse}"
              </p>
              {certificate?.verseReference && (
                <p className="text-sm font-semibold text-divine-600">
                  {certificate.verseReference}
                </p>
              )}
            </div>
          )}

          {certificate?.aiGeneratedPrayer && (
            <div className="bg-divine-50 p-4 rounded-lg border border-divine-200">
              <h4 className="font-semibold text-divine-700 mb-2">Oração de Bênção:</h4>
              <p className="text-gray-700 leading-relaxed">
                {certificate.aiGeneratedPrayer}
              </p>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 pt-4 border-t border-yellow-200">
          <p>Fé em Jesus BR - Aplicativo Cristão</p>
          <p>{new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}