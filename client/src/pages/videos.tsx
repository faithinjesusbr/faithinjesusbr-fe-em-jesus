import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, Search, Calendar, Clock, ExternalLink, Youtube, Filter, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/bottom-nav";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Videos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["/api/youtube/videos"],
  });

  const { data: featuredVideos = [] } = useQuery({
    queryKey: ["/api/youtube/videos/featured"],
  });

  const categories = [
    { value: "all", label: "Todos os Vídeos" },
    { value: "devotional", label: "Devocionais" },
    { value: "prayer", label: "Oração" },
    { value: "worship", label: "Adoração" },
    { value: "testimony", label: "Testemunhos" },
    { value: "teaching", label: "Ensinamentos" },
    { value: "live", label: "Ao Vivo" },
    { value: "music", label: "Música Cristã" }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDuration = (duration: string) => {
    if (!duration) return "";
    
    // Convert ISO 8601 duration to readable format
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "";
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M visualizações`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K visualizações`;
    }
    return `${count} visualizações`;
  };

  const VideoCard = ({ video, featured = false }) => (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 bg-white border-lilac-200 overflow-hidden",
      featured && "ring-2 ring-gold-300 shadow-lg"
    )}>
      <div className="relative">
        <img 
          src={video.thumbnailUrl || `/api/placeholder/480/270`} 
          alt={video.title}
          className="w-full h-48 md:h-56 object-cover"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
        </div>
        
        {/* Duration Badge */}
        {video.duration && (
          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(video.duration)}
          </Badge>
        )}
        
        {/* Featured Badge */}
        {featured && (
          <Badge className="absolute top-2 left-2 bg-gold-500 text-white">
            <Youtube className="w-3 h-3 mr-1" />
            Destaque
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg text-lilac-800 group-hover:text-lilac-600 transition-colors line-clamp-2">
          {video.title}
        </CardTitle>
        <Badge variant="outline" className="w-fit text-xs">
          {categories.find(cat => cat.value === video.category)?.label || video.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-lilac-600 text-sm mb-4 line-clamp-3">
          {video.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-600">
          {video.viewCount && (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{formatViewCount(video.viewCount)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(video.publishedAt), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white"
          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
        >
          <Youtube className="w-4 h-4 mr-2" />
          Assistir no YouTube
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
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
      <div className="bg-gradient-to-r from-sky-600 to-lilac-500 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Youtube className="w-8 h-8" />
            <h1 className="font-display text-3xl font-bold">
              Canal Faith in Jesus BR
            </h1>
          </div>
          <p className="text-sky-100">
            Vídeos inspiradores, devocionais e ensinamentos para fortalecer sua fé
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
                placeholder="Buscar vídeos..."
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

        {/* Featured Videos */}
        {featuredVideos.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-lilac-800 mb-6">
              Vídeos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map(video => (
                <VideoCard key={video.id} video={video} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Videos */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-lilac-800 mb-1">
            Todos os Vídeos
          </h2>
          <p className="text-lilac-600 mb-6">
            {filteredVideos.length} vídeo{filteredVideos.length !== 1 ? 's' : ''} encontrado{filteredVideos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredVideos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-display text-xl text-gray-600 mb-2">
                Nenhum vídeo encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros ou termos de busca
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

        {/* YouTube Channel Banner */}
        <div className="mt-12 bg-gradient-to-r from-sky-100 to-lilac-100 rounded-lg p-6 border border-sky-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Youtube className="w-8 h-8 text-sky-600" />
              <h3 className="font-display text-xl font-bold text-sky-800">
                Inscreva-se no Nosso Canal
              </h3>
            </div>
            <p className="text-sky-700 mb-4">
              Receba notificações de novos vídeos e seja parte da nossa comunidade de fé!
            </p>
            <Button 
              className="bg-sky-600 hover:bg-sky-700 text-white"
              onClick={() => window.open('https://www.youtube.com/@faithinjesusbr', '_blank')}
            >
              <Youtube className="w-4 h-4 mr-2" />
              Visitar Canal no YouTube
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}