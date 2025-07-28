import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Heart, BookOpen, Bot, Gift, Play, Store, 
  TrendingUp, Users, Calendar, Star, Sparkles,
  Brain, DollarSign, Award, Video, ShoppingBag
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DashboardStats {
  totalPrayers: number;
  todayPrayers: number;
  userPoints: number;
  completedChallenges: number;
}

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [timeOfDay, setTimeOfDay] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user-points", user.id],
    enabled: !!user.id,
  });

  const { data: prayerStats } = useQuery({
    queryKey: ["/api/prayer-stats"],
  });

  const { data: todayDevotional } = useQuery({
    queryKey: ["/api/devotionals", { date: new Date().toISOString().split('T')[0] }],
  });

  const featuredCards = [
    {
      title: "Sinto Hoje",
      description: "Orientação espiritual personalizada com IA",
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      link: "/emotion-today",
      gradient: "from-purple-500 to-blue-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "IA Cristo",
      description: "Converse com nosso assistente espiritual",
      icon: <Bot className="h-8 w-8 text-blue-600" />,
      link: "/ai-prayer",
      gradient: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Apoiar Ministério",
      description: "Contribua via PIX e receba certificado",
      icon: <Gift className="h-8 w-8 text-green-600" />,
      link: "/pix-support",
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Cartões de Amor",
      description: "Compartilhe mensagens inspiradoras",
      icon: <Heart className="h-8 w-8 text-red-600" />,
      link: "/love-cards",
      gradient: "from-red-500 to-pink-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  const quickActions = [
    {
      title: "Biblioteca Digital",
      description: "E-books cristãos gratuitos",
      icon: <BookOpen className="h-6 w-6" />,
      link: "/ebooks",
      color: "text-blue-600",
    },
    {
      title: "Loja Faith",
      description: "Produtos cristãos selecionados",
      icon: <ShoppingBag className="h-6 w-6" />,
      link: "/store",
      color: "text-purple-600",
    },
    {
      title: "Vídeos Cristãos",
      description: "Canal @faithinjesusbr",
      icon: <Video className="h-6 w-6" />,
      link: "/videos",
      color: "text-red-600",
    },
    {
      title: "Compartilhar",
      description: "Espalhe a Palavra",
      icon: <Star className="h-6 w-6" />,
      link: "/share",
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {timeOfDay}, {user.name}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Como está sua caminhada com Jesus hoje?
            </p>
          </div>
          
          {stats && (
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.total || 0}</div>
                <div className="text-xs text-gray-500">Pontos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{prayerStats?.today || 0}</div>
                <div className="text-xs text-gray-500">Orações Hoje</div>
              </div>
            </div>
          )}
        </div>

        {/* Daily Devotional Banner */}
        {todayDevotional && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Devocional de Hoje: {todayDevotional.title}
                  </h3>
                  <p className="text-yellow-700 text-sm line-clamp-2">
                    {todayDevotional.content}
                  </p>
                  <Button size="sm" className="mt-3 bg-yellow-600 hover:bg-yellow-700">
                    Ler Completo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Featured Cards - Base44 Style */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Funcionalidades Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCards.map((card, index) => (
            <Link key={index} href={card.link}>
              <Card className={`h-40 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${card.bgColor} ${card.borderColor} border-2`}>
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="text-center">
                    <div className="mb-3">{card.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.link}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`mb-2 ${action.color}`}>{action.icon}</div>
                  <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Crescimento Espiritual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats?.total || 0} pontos
            </div>
            <p className="text-xs text-gray-500">
              Ganhe pontos orando, lendo e contribuindo
            </p>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats?.total || 0) / 100 * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {100 - (stats?.total || 0)} pontos para próximo nível
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Comunidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {prayerStats?.total || 0}
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Orações compartilhadas na comunidade
            </p>
            <Badge variant="secondary" className="text-xs">
              +{prayerStats?.today || 0} hoje
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-600" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              3
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Certificados e conquistas desbloqueadas
            </p>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">🏆</Badge>
              <Badge variant="outline" className="text-xs">⭐</Badge>
              <Badge variant="outline" className="text-xs">💎</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <Gift className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-purple-800 mb-2">
              Apoie Nosso Ministério
            </h3>
            <p className="text-purple-700 max-w-2xl mx-auto">
              Sua contribuição nos ajuda a manter todas essas funcionalidades gratuitas e 
              a levar a Palavra de Deus a mais pessoas através da tecnologia.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white p-3 rounded-lg border">
              <p className="text-sm font-medium text-gray-700 mb-1">PIX</p>
              <p className="font-mono text-sm text-purple-600">faithinjesuseua@gmail.com</p>
            </div>
            <Link href="/pix-support">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Contribuir Agora
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer Quote */}
      <div className="mt-12 text-center">
        <blockquote className="text-lg italic text-gray-600 mb-2">
          "Porque onde estão dois ou três reunidos em meu nome, 
          aí estou eu no meio deles."
        </blockquote>
        <p className="text-sm text-gray-500">Mateus 18:20</p>
      </div>
    </div>
  );
}