import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search, Star, ExternalLink, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  category: string;
  imageUrl?: string;
  affiliateUrl: string;
  rating?: string;
  featured: boolean;
  isActive: boolean;
}

const categories = [
  { value: "", label: "Todos", icon: "🛍️" },
  { value: "books", label: "Livros", icon: "📚" },
  { value: "devotionals", label: "Devocionais", icon: "🙏" },
  { value: "music", label: "Música", icon: "🎵" },
  { value: "jewelry", label: "Joias", icon: "💍" },
  { value: "home", label: "Casa", icon: "🏠" },
  { value: "clothing", label: "Roupas", icon: "👕" },
  { value: "kids", label: "Infantil", icon: "👶" },
  { value: "gifts", label: "Presentes", icon: "🎁" },
];

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/store-products", selectedCategory],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      return apiRequest(`/api/store-products?${params.toString()}`);
    },
  });

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["/api/store-products", { featured: true }],
    queryFn: () => apiRequest("/api/store-products?featured=true"),
  });

  const filteredProducts = products.filter((product: StoreProduct) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numPrice);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShoppingBag className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Loja Faith in Jesus
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Produtos cristãos cuidadosamente selecionados para sua vida de fé
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar produtos..."
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
                ? "bg-purple-600 text-white" 
                : ""
            }`}
            onClick={() => setSelectedCategory(category.value)}
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>

      {/* Featured Products */}
      {!selectedCategory && featuredProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product: StoreProduct) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-purple-200">
                <div className="relative">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-purple-400" />
                    </div>
                  )}
                  
                  <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
                    ⭐ Destaque
                  </Badge>
                  
                  {product.rating && (
                    <div className="absolute top-2 right-2 bg-white/90 rounded px-2 py-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{product.rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => window.open(product.affiliateUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Comprar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {selectedCategory ? `Categoria: ${categories.find(c => c.value === selectedCategory)?.label}` : 'Todos os Produtos'}
          </h2>
          <span className="text-sm text-gray-600">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-80 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: StoreProduct) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
                      ⭐ Destaque
                    </Badge>
                  )}
                  
                  {product.rating && (
                    <div className="absolute top-2 right-2 bg-white/90 rounded px-2 py-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{product.rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold line-clamp-2 h-10">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-purple-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.value === product.category)?.label || product.category}
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => window.open(product.affiliateUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Comprar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum produto encontrado
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

      {/* Information */}
      <Card className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6 text-center">
          <ShoppingBag className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2 text-purple-800">
            Compras Seguras e Confiáveis
          </h3>
          <p className="text-sm text-purple-700 mb-4">
            Todos os produtos são cuidadosamente selecionados e vendidos por parceiros confiáveis. 
            As compras são processadas diretamente nas lojas oficiais através de links seguros.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-purple-600">
            <div>✓ Produtos de qualidade</div>
            <div>✓ Parceiros verificados</div>
            <div>✓ Suporte ao cliente</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}