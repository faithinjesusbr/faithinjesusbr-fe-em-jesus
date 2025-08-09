import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Search, Download, Play, Filter, Heart, Gift, Copy } from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import BackButton from "@/components/back-button";
import { useToast } from "@/hooks/use-toast";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const { toast } = useToast();

  // Livros cristãos com capas confiáveis do Pixabay
  const featuredBooks = [
    {
      id: "1",
      title: "As 5 Linguagens do Amor",
      author: "Gary Chapman",
      category: "Relacionamentos",
      status: "Gratuito",
      buttonColor: "purple",
      imageUrl: "https://cdn.pixabay.com/photo/2017/02/14/03/03/heart-2066036_640.jpg"
    },
    {
      id: "2",
      title: "Devocional Pão Diário",
      author: "Vários Autores", 
      category: "Devocional",
      status: "Gratuito",
      buttonColor: "purple",
      imageUrl: "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_640.jpg"
    },
    {
      id: "3",
      title: "O Peregrino",
      author: "John Bunyan",
      category: "Clássicos",
      status: "Gratuito", 
      buttonColor: "purple",
      imageUrl: "https://cdn.pixabay.com/photo/2016/11/29/20/22/bible-1871009_640.jpg"
    },
    {
      id: "4",
      title: "Caminhando na Fé",
      author: "Joyce Meyer",
      category: "Crescimento",
      status: "Gratuito",
      buttonColor: "purple", 
      imageUrl: "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_640.jpg"
    }
  ];

  const additionalBooks = [
    {
      id: "5",
      title: "Ouvindo a Deus",
      author: "Joyce Meyer",
      status: "Gratuito",
      imageUrl: "https://cdn.pixabay.com/photo/2016/11/21/16/21/church-1846667_640.jpg"
    },
    {
      id: "6", 
      title: "Jesus Calling",
      author: "Sarah Young",
      status: "Gratuito",
      imageUrl: "https://cdn.pixabay.com/photo/2017/05/11/11/15/workplace-2303851_640.jpg"
    }
  ];

  const categories = [
    "Todas as Categorias"
  ];

  const handleBookAction = (book: any) => {
    setSelectedBook(book);
    setShowDonationModal(true);
  };

  const proceedWithBook = () => {
    if (selectedBook) {
      // Simula abrir o livro/download
      toast({
        title: "📚 Acesso liberado!",
        description: `Aproveitando "${selectedBook.title}" - que seja uma bênção!`,
      });
    }
    setShowDonationModal(false);
    setSelectedBook(null);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("faithinjesuseua@gmail.com");
    toast({
      title: "✅ PIX Copiado!",
      description: "Muito obrigado pelo seu apoio ao ministério.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Biblioteca Digital</h1>
          <p className="text-gray-600">E-books cristãos gratuitos para fortalecer sua fé e conhecimento</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar livros, autores, temas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '_')}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={book.imageUrl} 
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                  {book.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{book.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                <p className="text-xs text-gray-500 mb-3">{book.category}</p>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-xs py-2"
                    onClick={() => handleBookAction(book)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Ler Online
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-xs py-2"
                    onClick={() => handleBookAction(book)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Books */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {additionalBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={book.imageUrl} 
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                  {book.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleBookAction(book)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Ler Online
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleBookAction(book)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Biblioteca em constante crescimento</h3>
              <p className="text-lg mb-6">
                Novos livros e materiais são adicionados regularmente. 
                Cadastre-se para receber notificações de novos conteúdos.
              </p>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                Receber Notificações
              </Button>
            </CardContent>
          </Card>
        </div>
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
              {selectedBook?.title}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">por {selectedBook?.author}</p>
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
                onClick={proceedWithBook}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Continuar para o Livro
              </Button>
              <button 
                className="text-xs text-gray-400 hover:text-gray-600 mt-3 block mx-auto"
                onClick={() => {
                  setShowDonationModal(false);
                  setSelectedBook(null);
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