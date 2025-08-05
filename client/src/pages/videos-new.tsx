import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Video, Search, Play, Clock, Filter, Eye, ExternalLink } from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { faithVideos, videoCategories } from "@/data/faith-videos";

export default function Videos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleWatchVideo = (video: any) => {
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

  const categories = videoCategories;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vídeos Cristãos</h1>
          <p className="text-gray-600">Assista sermões, testemunhos e ensinamentos que edificam sua fé</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar vídeos, pastores, temas..."
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

        {/* Featured Videos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button className="bg-white text-black hover:bg-gray-200">
                    <Play className="w-5 h-5 mr-2" />
                    Assistir
                  </Button>
                </div>
                <Badge className={`absolute top-3 left-3 ${video.isNew ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
                  {video.status}
                </Badge>
                {video.isNew && (
                  <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                    NOVO
                  </Badge>
                )}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{video.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{video.description}</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-xs py-2">
                  <Play className="w-3 h-3 mr-1" />
                  Assistir Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Other Videos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button className="bg-white text-black hover:bg-gray-200">
                    <Play className="w-5 h-5 mr-2" />
                    Assistir
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{video.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{video.description}</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-xs py-2">
                  <Play className="w-3 h-3 mr-1" />
                  Assistir Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-red-500 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Novos vídeos toda semana</h3>
              <p className="text-lg mb-6">
                Inscreva-se para receber notificações quando novos sermões e 
                ensinamentos forem publicados.
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