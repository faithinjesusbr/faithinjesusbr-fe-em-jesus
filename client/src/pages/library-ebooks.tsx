import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Search, 
  Filter,
  Heart,
  Star,
  Gift,
  AlertCircle,
  CheckCircle2,
  Copy,
  Clock
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import BackButton from "@/components/back-button";
import { useToast } from "@/hooks/use-toast";

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  imageUrl?: string;
  pdfUrl?: string;
  readOnlineUrl?: string;
  isReal: boolean;
  isFree: boolean;
  donationMessage?: string;
  downloads: string;
  createdAt: string;
}

import { gospelBooks } from "@/data/gospel-books";

// E-books reais obtidos da pesquisa
const REAL_EBOOKS: Ebook[] = gospelBooks.map(book => ({
  id: book.id,
  title: book.title,
  author: book.author,
  description: book.description,
  category: book.category,
  imageUrl: book.imageUrl,
  pdfUrl: book.pdfUrl,
  readOnlineUrl: book.readOnlineUrl,
  isReal: book.isReal,
  isFree: book.isFree,
  donationMessage: "Este e-book é gratuito! Se foi uma bênção, considere fazer uma doação para mantermos mais conteúdo gratuito.",
  downloads: book.downloads,
  createdAt: new Date().toISOString()
}));

export default function LibraryEbooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const { toast } = useToast();

  const ebooks = REAL_EBOOKS;

  const filteredEbooks = ebooks.filter((ebook) => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || ebook.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(ebooks.map(book => book.category))];

  const handleDownload = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setShowDonationModal(true);
  };

  const proceedWithDownload = () => {
    if (selectedEbook?.pdfUrl) {
      window.open(selectedEbook.pdfUrl, '_blank');
      toast({
        title: "📚 Download iniciado!",
        description: "Que Deus o abençoe através desta leitura.",
      });
    }
    setShowDonationModal(false);
    setSelectedEbook(null);
  };

  const handleReadOnline = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setShowDonationModal(true);
  };

  const proceedWithReadOnline = () => {
    if (selectedEbook?.readOnlineUrl || selectedEbook?.pdfUrl) {
      window.open(selectedEbook.readOnlineUrl || selectedEbook.pdfUrl, '_blank');
      toast({
        title: "📖 Boa leitura!",
        description: "Que este conteúdo seja uma bênção para sua vida.",
      });
    }
    setShowDonationModal(false);
    setSelectedEbook(null);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("faithinjesuseua@gmail.com");
    toast({
      title: "✅ PIX Copiado!",
      description: "Muito obrigado pelo seu apoio ao ministério.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Biblioteca Digital Cristã
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            E-books cristãos gratuitos e de qualidade para seu crescimento espiritual. 
            Todos os livros são disponibilizados legalmente pelos autores para edificação da Igreja.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título, autor ou assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory("all")}
            >
              <Filter className="h-4 w-4 mr-1" />
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Support Message */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Gift className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              📖 Biblioteca 100% Gratuita
            </h3>
            <p className="text-gray-700 mb-4">
              Todos os e-books são disponibilizados gratuitamente pelos próprios autores e editoras 
              para edificação da Igreja. Sua doação nos ajuda a manter a biblioteca ativa e trazer mais conteúdo!
            </p>
            <Button 
              onClick={copyPixKey}
              className="bg-green-600 hover:bg-green-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar PIX: faithinjesuseua@gmail.com
            </Button>
          </CardContent>
        </Card>

        {/* Ebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEbooks.map((ebook) => (
            <Card key={ebook.id} className="group hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-blue-200">
              <CardHeader className="pb-3">
                <div className="relative mb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
                    {ebook.imageUrl ? (
                      <img 
                        src={ebook.imageUrl} 
                        alt={ebook.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${ebook.title}&background=3b82f6&color=ffffff&size=300&format=svg`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Gratuito
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="bg-white/90">
                      {ebook.category}
                    </Badge>
                  </div>
                </div>
                
                <CardTitle className="text-lg text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {ebook.title}
                </CardTitle>
                <p className="text-sm font-medium text-blue-600">{ebook.author}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {ebook.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{ebook.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Gratuito</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700" 
                    size="sm"
                    onClick={() => handleDownload(ebook)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleReadOnline(ebook)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ler Online
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEbooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum e-book encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar sua busca ou filtro.
            </p>
          </div>
        )}

        {/* Call to Donation */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              💝 Ajude-nos a Crescer
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Nossa biblioteca é mantida inteiramente por doações. Com sua ajuda, podemos:
              • Adicionar mais e-books gratuitos • Manter o servidor funcionando • Desenvolver novos recursos
            </p>
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={copyPixKey}
            >
              <Gift className="h-5 w-5 mr-2" />
              Fazer Doação PIX
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />

      {/* Donation Modal */}
      <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
        <DialogContent className="max-w-md bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto mb-3 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-xl text-gray-800">
              {selectedEbook?.title}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">por {selectedEbook?.author}</p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Conteúdo 100% Gratuito</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Este material é disponibilizado gratuitamente para edificação da Igreja.
                Se desejar, pode contribuir para mantermos mais conteúdo disponível.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Gift className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-800 mb-1">Apoie este ministério</h4>
                  <p className="text-xs text-green-700 mb-2">PIX: faithinjesuseua@gmail.com</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={copyPixKey}
                    className="text-xs border-green-200 text-green-700 hover:bg-green-50 h-8"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar PIX
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                onClick={selectedEbook?.pdfUrl ? proceedWithDownload : proceedWithReadOnline}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Continuar para o Livro
              </Button>
              <button 
                className="text-xs text-gray-400 hover:text-gray-600 mt-3 block mx-auto"
                onClick={() => {
                  setShowDonationModal(false);
                  setSelectedEbook(null);
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}