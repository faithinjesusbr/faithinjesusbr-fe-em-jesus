import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Search, 
  Gift,
  ArrowLeft,
  Heart,
  Copy
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { gospelBooks } from "@/data/gospel-books";
import { Link } from "wouter";

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
  downloads: string;
}

export default function LibraryEbooksPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const { toast } = useToast();

  const categories = [
    { value: "", label: "Todos", icon: "📚" },
    { value: "devotional", label: "Devocionais", icon: "🙏" },
    { value: "theology", label: "Teologia", icon: "⛪" },
    { value: "biography", label: "Biografias", icon: "👤" },
    { value: "family", label: "Família", icon: "👨‍👩‍👧‍👦" },
    { value: "youth", label: "Jovens", icon: "🧑‍🎓" },
    { value: "women", label: "Mulheres", icon: "👩" },
    { value: "men", label: "Homens", icon: "👨" },
    { value: "children", label: "Infantil", icon: "👶" },
  ];

  const handleDownload = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setShowDonationModal(true);
  };

  const handleReadOnline = (ebook: Ebook) => {
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

  // Filtrar e aplicar categoria aos livros
  const filteredEbooks = gospelBooks
    .filter(book => selectedCategory ? book.category === selectedCategory : true)
    .filter((ebook) =>
      ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Biblioteca Digital
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            E-books cristãos autênticos para seu crescimento espiritual
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título, autor ou assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              className={`${
                selectedCategory === category.value 
                  ? "bg-blue-600 text-white" 
                  : ""
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600">
            {filteredEbooks.length} e-book{filteredEbooks.length !== 1 ? 's' : ''} encontrado{filteredEbooks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Ebooks Grid */}
        <div className="mb-8">
          {filteredEbooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum e-book encontrado com os filtros selecionados.</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                variant="outline"
                className="mt-4"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEbooks.map((ebook) => (
                <Card key={ebook.id} className="h-auto overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {ebook.imageUrl ? (
                      <img 
                        src={ebook.imageUrl} 
                        alt={ebook.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-blue-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2 flex gap-1">
                      {ebook.isFree && (
                        <Badge className="bg-green-500 text-white">
                          <Gift className="w-3 h-3 mr-1" />
                          Grátis
                        </Badge>
                      )}
                      {ebook.isReal && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Autêntico
                        </Badge>
                      )}
                    </div>
                    
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-white/90">
                        {ebook.downloads} downloads
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold line-clamp-2 h-10">
                      {ebook.title}
                    </CardTitle>
                    <p className="text-xs text-gray-600">
                      por {ebook.author}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {ebook.description}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleDownload(ebook)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      
                      {ebook.readOnlineUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReadOnline(ebook)}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Ler
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Voltar */}
        <div className="text-center mb-8">
          <Link href="/">
            <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>

        {/* Donation Message */}
        <Card className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="pt-6 text-center">
            <Gift className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-yellow-800">
              Todos os E-books são Gratuitos!
            </h3>
            <p className="text-sm text-yellow-700 mb-4">
              Nossa biblioteca digital é mantida através de doações. Se estes recursos têm abençoado sua vida, 
              considere contribuir para que possamos continuar disponibilizando conteúdo de qualidade gratuitamente.
            </p>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <p className="text-xs text-yellow-800 font-mono">
                <strong>PIX:</strong> faithinjesuseua@gmail.com
              </p>
            </div>
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