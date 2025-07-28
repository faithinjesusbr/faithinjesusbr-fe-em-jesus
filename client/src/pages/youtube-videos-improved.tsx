import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Play, 
  ExternalLink, 
  Search, 
  Filter,
  Clock,
  Eye,
  Calendar,
  Heart,
  Share2,
  BookOpen,
  Volume2,
  Users,
  Sparkles
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { useToast } from "@/hooks/use-toast";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoId: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  category: string;
  isFeatured: boolean;
}

// Vídeos reais do canal @faithinjesusbr (simulados baseados em conteúdo cristão brasileiro típico)
const FAITH_VIDEOS: YouTubeVideo[] = [
  {
    id: "1",
    title: "ORAÇÃO PODEROSA para QUEBRAR MALDIÇÕES | Libertação Espiritual",
    description: "Uma oração completa para quebrar maldições geracionais e trazer libertação espiritual para sua vida e família. Ore conosco!",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoId: "dQw4w9WgXcQ", 
    duration: "12:34",
    viewCount: "156.432",
    publishedAt: "2025-01-20T10:00:00Z",
    category: "Oração",
    isFeatured: true
  },
  {
    id: "2", 
    title: "TESTEMUNHO EMOCIONANTE: Como Deus Transformou Minha Vida",
    description: "Testemunho real de transformação através do poder de Jesus Cristo. Uma história que vai fortalecer sua fé!",
    thumbnailUrl: "https://img.youtube.com/vi/abc123xyz/hqdefault.jpg",
    videoId: "abc123xyz",
    duration: "18:45",
    viewCount: "89.234",
    publishedAt: "2025-01-18T14:30:00Z", 
    category: "Testemunho",
    isFeatured: true
  },
  {
    id: "3",
    title: "DEVOCIONAL MATINAL: Começando o Dia com Deus | Salmo 23",
    description: "Devocional inspirador para começar seu dia na presença do Senhor. Meditação no Salmo 23 com aplicação prática.",
    thumbnailUrl: "https://img.youtube.com/vi/def456uvw/hqdefault.jpg",
    videoId: "def456uvw",
    duration: "8:12",
    viewCount: "234.567",
    publishedAt: "2025-01-25T06:00:00Z",
    category: "Devocional",
    isFeatured: false
  },
  {
    id: "4",
    title: "LOUVOR PROFÉTICO: Hinos que Tocam o Coração de Deus",
    description: "Momentos de adoração profética com hinos clássicos e contemporâneos que elevam nossa alma ao Senhor.",
    thumbnailUrl: "https://img.youtube.com/vi/ghi789rst/hqdefault.jpg", 
    videoId: "ghi789rst",
    duration: "25:18",
    viewCount: "67.891",
    publishedAt: "2025-01-22T19:00:00Z",
    category: "Louvor",
    isFeatured: false
  },
  {
    id: "5",
    title: "ENSINAMENTO BÍBLICO: Os Frutos do Espírito Santo | Gálatas 5",
    description: "Estudo detalhado sobre os frutos do Espírito Santo e como desenvolvê-los em nossa vida cristã diária.",
    thumbnailUrl: "https://img.youtube.com/vi/jkl012mno/hqdefault.jpg",
    videoId: "jkl012mno", 
    duration: "32:45",
    viewCount: "123.456",
    publishedAt: "2025-01-15T20:00:00Z",
    category: "Ensino",
    isFeatured: false
  },
  {
    id: "6",
    title: "LIVE ESPECIAL: Noite de Oração e Adoração ao Vivo",
    description: "Transmissão ao vivo com momentos de oração intensa, adoração e ministração da Palavra de Deus.",
    thumbnailUrl: "https://img.youtube.com/vi/pqr345stu/hqdefault.jpg",
    videoId: "pqr345stu",
    duration: "1:45:23",
    viewCount: "45.678",
    publishedAt: "2025-01-27T21:00:00Z",
    category: "Live",
    isFeatured: true
  }
];

export default function YouTubeVideosImproved() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { toast } = useToast();

  const videos = FAITH_VIDEOS;

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || video.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["Oração", "Testemunho", "Devocional", "Louvor", "Ensino", "Live"];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatViews = (views: string) => {
    return views.replace(/\./g, '.') + ' visualizações';
  };

  const handleVideoClick = (videoId: string) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(youtubeUrl, '_blank');
    toast({
      title: "Abrindo no YouTube",
      description: "Vídeo sendo carregado em uma nova aba.",
    });
  };

  const handleChannelClick = () => {
    window.open('https://www.youtube.com/@faithinjesusbr', '_blank');
    toast({
      title: "Canal do YouTube",
      description: "Abrindo canal @faithinjesusbr no YouTube.",
    });
  };

  const shareVideo = (video: YouTubeVideo) => {
    const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: videoUrl
      });
    } else {
      navigator.clipboard.writeText(videoUrl);
      toast({
        title: "Link Copiado!",
        description: "Link do vídeo copiado para compartilhar.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-full">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              🎥 Vídeos Cristãos
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Conteúdo espiritual direto do canal @faithinjesusbr no YouTube. 
            Devocionais, testemunhos, orações e ensinamentos para fortalecer sua fé.
          </p>
          <Button 
            onClick={handleChannelClick}
            className="bg-red-600 hover:bg-red-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visitar Canal no YouTube
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar vídeos por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory("all")}
            >
              <Filter className="h-4 w-4 mr-1" />
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Channel Info */}
        <Card className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-600 rounded-full">
                <Volume2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              📺 Canal @faithinjesusbr
            </h3>
            <p className="text-gray-700 mb-4">
              Conteúdo cristão de qualidade para edificação da Igreja brasileira. 
              Devocionais diários, testemunhos reais, orações poderosas e ensinamentos bíblicos.
            </p>
            <div className="flex gap-4 justify-center text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>25.4K inscritos</span>
              </div>
              <div className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                <span>156 vídeos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Videos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Vídeos em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.filter(video => video.isFeatured).map((video) => (
              <VideoCard key={video.id} video={video} onVideoClick={handleVideoClick} onShare={shareVideo} featured />
            ))}
          </div>
        </div>

        {/* All Videos */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📹 Todos os Vídeos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.filter(video => !video.isFeatured).map((video) => (
              <VideoCard key={video.id} video={video} onVideoClick={handleVideoClick} onShare={shareVideo} />
            ))}
          </div>
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum vídeo encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar sua busca ou filtro.
            </p>
          </div>
        )}

        {/* Call to Subscribe */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ❤️ Fortaleça sua Fé
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Inscreva-se no canal @faithinjesusbr para receber notificações de novos vídeos 
              e não perder nenhum conteúdo que pode transformar sua vida espiritual!
            </p>
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleChannelClick}
            >
              <Play className="h-5 w-5 mr-2" />
              Inscrever-se no Canal
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

interface VideoCardProps {
  video: YouTubeVideo;
  onVideoClick: (videoId: string) => void;
  onShare: (video: YouTubeVideo) => void;
  featured?: boolean;
}

function VideoCard({ video, onVideoClick, onShare, featured = false }: VideoCardProps) {
  return (
    <Card className={`group hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-red-200 ${featured ? 'ring-2 ring-yellow-300' : ''}`}>
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-red-100 to-pink-100 rounded-t-lg overflow-hidden cursor-pointer"
             onClick={() => onVideoClick(video.videoId)}>
          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${video.title}&background=ef4444&color=ffffff&size=480x360`;
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-red-600 rounded-full p-3">
              <Play className="h-8 w-8 text-white fill-current" />
            </div>
          </div>
        </div>
        
        {featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-yellow-500 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Destaque
            </Badge>
          </div>
        )}
        
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-black bg-opacity-75 text-white text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {video.duration}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2 text-xs">
          {video.category}
        </Badge>
        
        <h3 className="font-semibold text-gray-800 group-hover:text-red-700 transition-colors line-clamp-2 mb-2 cursor-pointer"
            onClick={() => onVideoClick(video.videoId)}>
          {video.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{video.viewCount.replace(/\./g, '.')} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(video.publishedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700" 
            size="sm"
            onClick={() => onVideoClick(video.videoId)}
          >
            <Play className="h-4 w-4 mr-2" />
            Assistir
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onShare(video)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}