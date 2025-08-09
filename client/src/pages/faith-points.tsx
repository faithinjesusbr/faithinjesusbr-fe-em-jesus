import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Star, Trophy, Award, TrendingUp, Calendar, Users, Crown, Medal, Target } from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import BackButton from "@/components/back-button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FaithPoint {
  id: string;
  userId: string;
  action: string;
  points: string;
  description: string;
  date: string;
  createdAt: string;
}

interface WeeklyRanking {
  id: string;
  userId: string;
  userName: string;
  weekStart: string;
  weekEnd: string;
  totalPoints: string;
  position: string;
}

const actionLabels = {
  complete_mission: "Missão Completada",
  send_support: "Apoio Enviado",
  create_support_request: "Pedido Criado",
  prayer_request: "Oração Solicitada",
  share_verse: "Versículo Compartilhado",
  daily_devotional: "Devocional Lido"
};

const actionIcons = {
  complete_mission: Target,
  send_support: Users,
  create_support_request: Users,
  prayer_request: Star,
  share_verse: Award,
  daily_devotional: Trophy
};

const actionColors = {
  complete_mission: "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200",
  send_support: "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200",
  create_support_request: "text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200",
  prayer_request: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200",
  share_verse: "text-pink-600 bg-pink-100 dark:bg-pink-900 dark:text-pink-200",
  daily_devotional: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200"
};

export default function FaithPoints() {
  const { user } = useAuth();

  // Get user's faith points history
  const { data: faithPoints, isLoading: pointsLoading } = useQuery({
    queryKey: ["/api/faith-points", user?.id],
    enabled: !!user?.id,
  });

  // Get user's total points
  const { data: totalPointsData, isLoading: totalLoading } = useQuery({
    queryKey: ["/api/faith-points/total", user?.id],
    enabled: !!user?.id,
  });

  // Get current week ranking
  const { data: weeklyRanking, isLoading: rankingLoading } = useQuery({
    queryKey: ["/api/faith-points/ranking/current"],
  });

  const totalPoints = totalPointsData?.total || 0;
  const userPosition = weeklyRanking?.find((rank: WeeklyRanking) => rank.userId === user?.id)?.position || "N/A";

  // Calculate points by action type for stats
  const pointsByAction = faithPoints?.reduce((acc: any, point: FaithPoint) => {
    const action = point.action;
    if (!acc[action]) {
      acc[action] = { count: 0, points: 0 };
    }
    acc[action].count += 1;
    acc[action].points += parseInt(point.points);
    return acc;
  }, {}) || {};

  if (pointsLoading || totalLoading || rankingLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-yellow-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-yellow-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Fé em Ação
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sistema de pontos que recompensa suas boas ações e participação na comunidade
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-2xl text-yellow-600 dark:text-yellow-400">
                {totalPoints}
              </CardTitle>
              <CardDescription>Pontos Totais</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">
                #{userPosition}
              </CardTitle>
              <CardDescription>Posição Semanal</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">
                {faithPoints?.length || 0}
              </CardTitle>
              <CardDescription>Ações Realizadas</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history" data-testid="tab-history">Histórico</TabsTrigger>
            <TabsTrigger value="ranking" data-testid="tab-ranking">Ranking</TabsTrigger>
            <TabsTrigger value="stats" data-testid="tab-stats">Estatísticas</TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Histórico de Pontos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {faithPoints && faithPoints.length > 0 ? (
                  <div className="space-y-3">
                    {faithPoints.map((point: FaithPoint) => {
                      const ActionIcon = actionIcons[point.action as keyof typeof actionIcons] || Star;
                      const actionColor = actionColors[point.action as keyof typeof actionColors] || "text-gray-600 bg-gray-100";
                      
                      return (
                        <div 
                          key={point.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          data-testid={`point-entry-${point.id}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${actionColor}`}>
                              <ActionIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {actionLabels[point.action as keyof typeof actionLabels] || point.action}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {point.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(point.createdAt), { 
                                  addSuffix: true, 
                                  locale: ptBR 
                                })}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-lg font-bold">
                            +{point.points}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      Nenhum ponto ainda
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Complete missões e participe da comunidade para ganhar pontos!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ranking Tab */}
          <TabsContent value="ranking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Ranking Semanal</span>
                </CardTitle>
                <CardDescription>
                  Usuários mais ativos desta semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                {weeklyRanking && weeklyRanking.length > 0 ? (
                  <div className="space-y-3">
                    {weeklyRanking.slice(0, 10).map((rank: WeeklyRanking, index: number) => {
                      const isCurrentUser = rank.userId === user?.id;
                      const position = parseInt(rank.position) || index + 1;
                      
                      let PositionIcon = Medal;
                      let iconColor = "text-gray-500";
                      
                      if (position === 1) {
                        PositionIcon = Crown;
                        iconColor = "text-yellow-500";
                      } else if (position === 2) {
                        iconColor = "text-gray-400";
                      } else if (position === 3) {
                        iconColor = "text-orange-500";
                      }
                      
                      return (
                        <div 
                          key={rank.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            isCurrentUser 
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800' 
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                          data-testid={`ranking-${rank.userId}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              position <= 3 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              {position <= 3 ? (
                                <PositionIcon className={`w-5 h-5 ${iconColor}`} />
                              ) : (
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                  {position}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${
                                isCurrentUser 
                                  ? 'text-blue-900 dark:text-blue-100' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {rank.userName} {isCurrentUser && "(Você)"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Posição #{position}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-lg font-bold">
                            {rank.totalPoints} pts
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      Ranking em construção
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Seja ativo na comunidade para aparecer no ranking!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Estatísticas Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(pointsByAction).length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(pointsByAction).map(([action, data]: [string, any]) => {
                      const ActionIcon = actionIcons[action as keyof typeof actionIcons] || Star;
                      const actionColor = actionColors[action as keyof typeof actionColors] || "text-gray-600 bg-gray-100";
                      
                      return (
                        <div 
                          key={action}
                          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          data-testid={`stat-${action}`}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${actionColor}`}>
                              <ActionIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {actionLabels[action as keyof typeof actionLabels] || action}
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-300">Vezes realizadas</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {data.count}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-300">Pontos ganhos</p>
                              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {data.points}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      Nenhuma estatística ainda
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Comece participando da comunidade para ver suas estatísticas!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How it Works */}
        <Card>
          <CardHeader>
            <CardTitle>Como Ganhar Pontos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">Missões Diárias</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Complete desafios espirituais: 10-20 pontos
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">Rede de Apoio</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ajude outros membros: 10 pontos por mensagem
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">Pedidos de Oração</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Compartilhe necessidades: 5 pontos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}