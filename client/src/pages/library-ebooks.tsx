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
    isFree: true,
    donationMessage: "Livro gratuito para edificação da Igreja. Considere uma doação para continuarmos este ministério.",
    downloads: "892",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Quero Nascer de Novo",
    author: "Ministério Seara Ágape",
    description: "Guia prático para adolescentes sobre salvação, batismo e vida cristã. Linguagem jovem e contemporânea.",
    category: "Juventude",
    imageUrl: "https://www.searaagape.com.br/images/nascer-novo-teen.jpg",
    pdfUrl: "https://www.searaagape.com.br/downloads/quero-nascer-de-novo.pdf",
    isReal: true,
    isFree: true,
    donationMessage: "Recurso gratuito para jovens. Sua doação nos ajuda a alcançar mais vidas!",
    downloads: "567",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Dicionário Bíblico Baker",
    author: "Tremper Longman III",
    description: "Referência essencial com definições, contextos históricos e explicações teológicas para estudos bíblicos profundos.",
    category: "Estudo Bíblico",
    imageUrl: "https://images.gospelmais.com.br/dicionario-baker.jpg",
    pdfUrl: "https://livros.gospelmais.com/downloads/dicionario-biblico-baker.pdf",
    isReal: true,
    isFree: true,
    donationMessage: "Obra de referência gratuita. Ajude-nos a disponibilizar mais recursos de qualidade!",
    downloads: "2105",
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Jesus para Crianças",
    author: "Ministério Seara Ágape",
    description: "Histórias bíblicas ilustradas e atividades para ensinar as crianças sobre o amor de Jesus de forma lúdica.",
    category: "Infantil",
    imageUrl: "https://www.searaagape.com.br/images/jesus-criancas.jpg",
    pdfUrl: "https://www.searaagape.com.br/downloads/jesus-para-criancas.pdf",
    isReal: true,
    isFree: true,
    donationMessage: "Conteúdo infantil gratuito. Suas doações mantêm estes recursos disponíveis para famílias!",
    downloads: "1834",
    createdAt: new Date().toISOString()
  }
];

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

  const categories = ["Devocional", "Crescimento Espiritual", "Testemunho", "Juventude", "Estudo Bíblico", "Infantil"];

  const handleDownload = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setShowDonationModal(true);
  };

  const proceedWithDownload = () => {
    if (selectedEbook?.pdfUrl) {
      window.open(selectedEbook.pdfUrl, '_blank');
      toast({
        title: "Download Iniciado",
        description: `${selectedEbook.title} está sendo baixado.`,
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
        title: "Abrindo Livro",
        description: `${selectedEbook.title} está sendo aberto.`,
      });
    }
    setShowDonationModal(false);
    setSelectedEbook(null);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("faithinjesuseua@gmail.com");
    toast({
      title: "PIX Copiado!",
      description: "Chave PIX copiada para área de transferência.",
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              📚 {selectedEbook?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-700">
                {selectedEbook?.donationMessage}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <Gift className="h-4 w-4 mr-2" />
                Apoie nosso ministério
              </h4>
              <p className="text-sm text-green-700 mb-3">
                PIX: faithinjesuseua@gmail.com
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={copyPixKey}
                className="w-full border-green-300 text-green-700 hover:bg-green-100"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Chave PIX
              </Button>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowDonationModal(false);
                  setSelectedEbook(null);
                }}
              >
                Fechar
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={selectedEbook?.pdfUrl ? proceedWithDownload : proceedWithReadOnline}
              >
                Continuar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}