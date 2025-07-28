import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Star, Heart, ShoppingBag, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/bottom-nav";

export default function Store() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/store/products"],
  });

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["/api/store/products/featured"],
  });

  const categories = [
    { value: "all", label: "Todos os Produtos" },
    { value: "books", label: "Livros Cristãos" },
    { value: "devotionals", label: "Devocionais" },
    { value: "worship", label: "Música e Adoração" },
    { value: "jewelry", label: "Joias e Acessórios" },
    { value: "home", label: "Decoração Cristã" },
    { value: "kids", label: "Infantil" },
    { value: "gifts", label: "Presentes Especiais" }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.isActive;
  });

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const ProductCard = ({ product, featured = false }) => (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 bg-white border-lilac-200",
      featured && "ring-2 ring-gold-300 shadow-lg"
    )}>
      <CardHeader className="pb-3">
        <div className="relative">
          <img 
            src={product.imageUrl || "/api/placeholder/300/200"} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
          {featured && (
            <Badge className="absolute top-2 left-2 bg-gold-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              Destaque
            </Badge>
          )}
          {product.discount && product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-sky-500 text-white">
              -{product.discount}%
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart className={cn(
              "w-4 h-4",
              favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
            )} />
          </Button>
        </div>
        <CardTitle className="font-display text-lg text-lilac-800 group-hover:text-lilac-600 transition-colors">
          {product.name}
        </CardTitle>
        <Badge variant="outline" className="w-fit text-xs">
          {categories.find(cat => cat.value === product.category)?.label || product.category}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <p className="text-lilac-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-baseline gap-2 mb-3">
          {product.originalPrice && product.originalPrice !== product.price && (
            <span className="text-gray-400 line-through text-sm">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-gold-600 font-bold text-xl">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(product.rating) 
                    ? "fill-gold-400 text-gold-400" 
                    : "text-gray-300"
                )}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-lilac-600 hover:bg-lilac-700 text-white"
          onClick={() => window.open(product.affiliateUrl, '_blank')}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Comprar Agora
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 p-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-lilac-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 space-y-4">
                  <div className="h-48 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-lilac-600 to-sky-500 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-2">
            Loja Cristã
          </h1>
          <p className="text-lilac-100">
            Produtos cristãos selecionados especialmente para fortalecer sua fé
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos cristãos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-lilac-200 focus:border-lilac-400"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] border-lilac-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-lilac-800 mb-6">
              Produtos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-lilac-800 mb-1">
            Todos os Produtos
          </h2>
          <p className="text-lilac-600 mb-6">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-600 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros ou termos de busca
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-gold-100 to-cream-200 rounded-lg p-6 border border-gold-200">
          <div className="text-center">
            <h3 className="font-display text-xl font-bold text-gold-800 mb-2">
              Comprando com Propósito
            </h3>
            <p className="text-gold-700">
              Cada compra através da nossa loja ajuda a manter o ministério Fé em Jesus BR. 
              Obrigado por apoiar nossa missão de levar esperança e fé a mais pessoas!
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}