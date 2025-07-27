import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Heart, 
  BookOpen, 
  Gift, 
  TrendingUp, 
  Eye, 
  Settings,
  Bell,
  Award,
  BarChart3
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

interface DashboardData {
  totalUsers: number;
  totalPrayers: number;
  totalDevotionals: number;
  activeSponsors: number;
  recentInteractions: Array<{
    id: string;
    userId: string;
    action: string;
    entityType: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/admin/dashboard"],
  });

  const { data: interactionStats } = useQuery({
    queryKey: ["/api/admin/interaction-stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Carregando painel...</h2>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const data = dashboardData as DashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie e acompanhe todas as funcionalidades do aplicativo
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Usuários registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orações</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalPrayers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Orações registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devocionais</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalDevotionals || 0}</div>
              <p className="text-xs text-muted-foreground">
                Conteúdos publicados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patrocinadores</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.activeSponsors || 0}</div>
              <p className="text-xs text-muted-foreground">
                Patrocinadores ativos
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sponsors">Patrocinadores</TabsTrigger>
            <TabsTrigger value="contributors">Colaboradores</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Interações Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.recentInteractions?.slice(0, 5).map((interaction) => (
                      <div key={interaction.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{interaction.action}</p>
                          <p className="text-xs text-gray-500">{interaction.entityType}</p>
                        </div>
                        <Badge variant="outline">
                          {new Date(interaction.createdAt).toLocaleDateString('pt-BR')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Estatísticas de Interação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {interactionStats?.map((stat: any) => (
                      <div key={stat.action} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{stat.action}</span>
                        <Badge>{stat.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sponsors" className="space-y-6">
            <SponsorManagement />
          </TabsContent>

          <TabsContent value="contributors" className="space-y-6">
            <ContributorManagement />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}

function SponsorManagement() {
  const { data: sponsors, isLoading } = useQuery({
    queryKey: ["/api/sponsors"],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Patrocinadores</h2>
        <Button>
          <Gift className="h-4 w-4 mr-2" />
          Adicionar Patrocinador
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors?.map((sponsor: any) => (
          <Card key={sponsor.id} className="relative">
            <CardHeader>
              <div className="flex items-center gap-4">
                {sponsor.logoUrl && (
                  <img 
                    src={sponsor.logoUrl} 
                    alt={sponsor.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-lg">{sponsor.name}</CardTitle>
                  <Badge variant={sponsor.isActive ? "default" : "secondary"}>
                    {sponsor.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{sponsor.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline">
                  <Award className="h-4 w-4 mr-1" />
                  Certificado
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContributorManagement() {
  const { data: contributors, isLoading } = useQuery({
    queryKey: ["/api/contributors"],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Colaboradores</h2>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Adicionar Colaborador
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contributors?.map((contributor: any) => (
          <Card key={contributor.id} className="relative">
            <CardHeader>
              <div className="flex items-center gap-4">
                {contributor.profileImageUrl && (
                  <img 
                    src={contributor.profileImageUrl} 
                    alt={contributor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-lg">{contributor.name}</CardTitle>
                  <Badge variant="outline">{contributor.contribution}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{contributor.description}</p>
              {contributor.amount && (
                <p className="text-sm font-semibold text-green-600 mb-4">
                  Valor: {contributor.amount}
                </p>
              )}
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline">
                  <Award className="h-4 w-4 mr-1" />
                  Certificado
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NotificationManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Notificações</h2>
        <Button>
          <Bell className="h-4 w-4 mr-2" />
          Nova Notificação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistema de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Envie notificações personalizadas para usuários sobre devocionais, 
            orações, desafios e conteúdo de patrocinadores.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configurações do App</h2>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Configure parâmetros globais do aplicativo, como frequência de notificações,
            rotação de anúncios de patrocinadores e outras configurações avançadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}