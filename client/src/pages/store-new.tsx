import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Search, Star, ExternalLink, Filter } from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

export default function Store() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data similar to Base44 images
  const featuredProducts = [
    {
      id: "1",
      name: "Camiseta Faith in Jesus",
      price: "R$ 39,90",
      imageUrl: "/api/placeholder/300/200",
      category: "clothing",
      featured: true
    },
    {
      id: "2", 
      name: "E-book: Plano de Leitura Bíblica",
      price: "R$ 19,90",
      imageUrl: "/api/placeholder/300/200",
      category: "digital",
      featured: true
    }
  ];

  const allProducts = [
    {
      id: "3",
      name: "Camiseta Fé",
      price: "R$ 59,90",
      imageUrl: "/api/placeholder/300/200",
      category: "clothing",
      status: "Versátil"
    },
    {
      id: "4",
      name: "Caneca Versículo",
      price: "R$ 34,90", 
      imageUrl: "/api/placeholder/300/200",
      category: "accessories",
      status: "Caneca"
    },
    {
      id: "5",
      name: "Curso de Teologia Básica",
      price: "R$ 99,90",
      imageUrl: "/api/placeholder/300/200",
      category: "courses",
      status: "Curso"
    }
  ];

  const categories = [
    "Todas as Categorias",
    "Todos os Tipos"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loja Faith in Jesus</h1>
          <p className="text-gray-600">Produtos cristãos que edificam sua fé e abençoam sua vida</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar produtos..."
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

        {/* Featured Products */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                    Destaque
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">{product.price}</span>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Comprar Agora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-blue-500 text-white">
                  {product.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">{product.price}</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                    Comprar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Não encontrou o que procurava?</h3>
              <p className="text-lg mb-6">
                Entre em contato conosco e ajudaremos você a encontrar o produto perfeito para sua jornada de fé.
              </p>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                Falar Conosco
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}