import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, Download, Play, Filter } from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import BackButton from "@/components/back-button";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Livros reais da biblioteca cristã
  const featuredBooks = [
    {
      id: "1",
      title: "As 5 Linguagens do Amor",
      author: "Gary Chapman",
      category: "Relacionamentos",
      status: "Gratuito",
      buttonColor: "purple",
      imageUrl: "https://images-na.ssl-images-amazon.com/images/I/51QQ4KPFK3L._SX331_BO1,204,203,200_.jpg"
    },
    {
      id: "2",
      title: "Devocional Pão Diário",
      author: "Vários Autores", 
      category: "Devocional",
      status: "Gratuito",
      buttonColor: "purple",
      imageUrl: "https://www.paoembrasa.com.br/wp-content/uploads/2020/01/pao-diario-2020-1.jpg"
    },
    {
      id: "3",
      title: "O Peregrino",
      author: "John Bunyan",
      category: "Clássicos",
      status: "Gratuito", 
      buttonColor: "purple",
      imageUrl: "https://m.media-amazon.com/images/I/51yXTvSJWOL._SY445_SX342_.jpg"
    },
    {
      id: "4",
      title: "Caminhando na Fé",
      author: "Joyce Meyer",
      category: "Crescimento",
      status: "Gratuito",
      buttonColor: "purple", 
      imageUrl: "https://images-na.ssl-images-amazon.com/images/I/41YTGX7WYPL._SX331_BO1,204,203,200_.jpg"
    }
  ];

  const additionalBooks = [
    {
      id: "5",
      title: "Ouvindo a Deus",
      author: "Joyce Meyer",
      status: "Gratuito",
      imageUrl: "https://images-na.ssl-images-amazon.com/images/I/41zs4yPZhML._SX331_BO1,204,203,200_.jpg"
    },
    {
      id: "6", 
      title: "Jesus Calling",
      author: "Sarah Young",
      status: "Gratuito",
      imageUrl: "https://images-na.ssl-images-amazon.com/images/I/51DT8W+kCkL._SX331_BO1,204,203,200_.jpg"
    }
  ];

  const categories = [
    "Todas as Categorias"
  ];

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
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-xs py-2">
                    <Play className="w-3 h-3 mr-1" />
                    Ler Online
                  </Button>
                  <Button variant="outline" className="w-full text-xs py-2">
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
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Play className="w-4 h-4 mr-2" />
                    Ler Online
                  </Button>
                  <Button variant="outline" className="w-full">
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
    </div>
  );
}