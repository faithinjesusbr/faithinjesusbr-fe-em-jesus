import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Book, Download, Search, Star, Gift, ExternalLink, ArrowLeft } from "lucide-react";
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
  donationMessage?: string;
  downloads: string;
}

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

export default function EbooksPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleDownload = (ebook: Ebook) => {
    if (ebook.pdfUrl) {
      window.open(ebook.pdfUrl, '_blank');
      toast({
        title: "Download iniciado!",
        description: `"${ebook.title}" está sendo baixado.`,
      });
    } else {
      toast({
        title: "Arquivo não disponível",
        description: "Este e-book ainda não possui arquivo para download.",
        variant: "destructive",
      });
    }
  };

  const handleReadOnline = (ebook: Ebook) => {
    if (ebook.readOnlineUrl) {
      window.open(ebook.readOnlineUrl, '_blank');
    } else {
      toast({
        title: "Leitura online não disponível",
        description: "Este e-book não possui versão online.",
        variant: "destructive",
      });
    }
  };

  // Filtrar e aplicar categoria aos livros
  const filteredEbooks = gospelBooks
    .filter(book => selectedCategory ? book.category === selectedCategory : true)
    .filter((ebook: Ebook) =>
      ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Book className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Biblioteca Digital
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          E-books cristãos gratuitos para seu crescimento espiritual
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
            <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum e-book encontrado com os filtros selecionados.</p>
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
                    <Book className="h-16 w-16 text-blue-400" />
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
                      Real
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
                <CardDescription className="text-xs">
                  por {ebook.author}
                </CardDescription>
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

                {ebook.donationMessage && (
                  <div className="text-xs text-gray-500 italic bg-yellow-50 p-2 rounded">
                    💝 {ebook.donationMessage}
                  </div>
                )}
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

      {filteredEbooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum e-book encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Tente ajustar sua busca ou categoria
          </p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
            }}
            variant="outline"
          >
            Limpar Filtros
          </Button>
        </div>
      )}

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

      {/* Instructions */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Book className="h-4 w-4 text-blue-600" />
            Como usar a Biblioteca
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Todos os e-books são gratuitos e podem ser baixados em PDF</li>
            <li>• Use a busca para encontrar temas específicos</li>
            <li>• Filtre por categoria para navegar por assuntos</li>
            <li>• Alguns livros têm versão online para leitura imediata</li>
            <li>• Compartilhe os links com amigos que possam se beneficiar</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}