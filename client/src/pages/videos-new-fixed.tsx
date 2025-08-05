import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Video, Search, Play, Clock, Eye, ExternalLink, ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { faithVideos, videoCategories } from "@/data/faith-videos";
import { Link } from "wouter";

interface VideoProps {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
  category: string;
  views: string;
  uploadDate: string;
}

export default function Videos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleWatchVideo = (video: VideoProps) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    window.open(youtubeUrl, '_blank');
  };

  // Filtrar vídeos do canal @faithinjesusbr
  const filteredVideos = faithVideos
    .filter(video => selectedCategory ? video.category === selectedCategory : true)
    .filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Vídeos Cristãos
            </h1>
          </div>
          <p className="text-gray-600 text-lg mb-2">
            Conteúdo exclusivo do canal @faithinjesusbr
          </p>
          <Badge className="bg-red-100 text-red-800 border-red-200">
            📺 Canal Oficial • @faithinjesusbr
          </Badge>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {videoCategories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              className={`${
                selectedCategory === category.value 
                  ? "bg-red-600 text-white" 
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
            {filteredVideos.length} vídeo{filteredVideos.length !== 1 ? 's' : ''} encontrado{filteredVideos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Videos Grid */}
        <div className="mb-8">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum vídeo encontrado com os filtros selecionados.</p>
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
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <div 
                    className="relative group"
                    onClick={() => handleWatchVideo(video)}
                  >
                    <img 
                      src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        // Fallback para thumbnail padrão se a maxres não existir
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                      }}
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-black/80 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration}
                      </Badge>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-100 text-red-800">
                        {video.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold line-clamp-2 h-10">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center gap-2">
                      <Eye className="w-3 h-3" />
                      {video.views} visualizações
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {video.description}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        onClick={() => handleWatchVideo(video)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Assistir
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const shareUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
                          const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${video.title} - ${shareUrl}`)}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Compartilhar
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500">
                      Publicado em {new Date(video.uploadDate).toLocaleDateString('pt-BR')}
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
            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>

        {/* Canal Info */}
        <Card className="mt-12 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="pt-6 text-center">
            <Video className="h-8 w-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-red-800">
              Canal Oficial @faithinjesusbr
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Todos os vídeos são do nosso canal oficial no YouTube. Inscreva-se para receber 
              as últimas mensagens, ensinamentos e conteúdo cristão inspirador!
            </p>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => window.open('https://www.youtube.com/@faithinjesusbr', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visitar Canal no YouTube
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
}