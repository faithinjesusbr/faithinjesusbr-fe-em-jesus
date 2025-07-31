import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  Heart, 
  BookOpen, 
  Gift, 
  Settings,
  Bell,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Send
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

interface AdminStats {
  totalUsers: number;
  totalPrayers: number;
  totalDevotionals: number;
  activeSponsors: number;
}

export default function AdminPanelComplete() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is admin
  const isAdmin = user?.isAdmin;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </Card>
      </div>
    );
  }

  // Admin Stats Query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/dashboard"],
    meta: { headers: { 'x-user-admin': 'true' } }
  });

  // Devotionals CRUD
  const { data: devotionals, isLoading: devotionalsLoading } = useQuery({
    queryKey: ["/api/admin/devotionals"],
    meta: { headers: { 'x-user-admin': 'true' } }
  });

  // Verses CRUD
  const { data: verses, isLoading: versesLoading } = useQuery({
    queryKey: ["/api/admin/verses"],
    meta: { headers: { 'x-user-admin': 'true' } }
  });

  // Users Management
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    meta: { headers: { 'x-user-admin': 'true' } }
  });

  // Sponsors Management
  const { data: sponsors, isLoading: sponsorsLoading } = useQuery({
    queryKey: ["/api/admin/sponsors"],
    meta: { headers: { 'x-user-admin': 'true' } }
  });

  // User Contributions
  const { data: contributions, isLoading: contributionsLoading } = useQuery({
    queryKey: ["/api/admin/contributions"],
    meta: { headers: { 'x-user-admin': 'true' } }
  });

  // Mutations for CRUD operations
  const deleteMutation = useMutation({
    mutationFn: async ({ endpoint, id }: { endpoint: string; id: string }) => {
      const response = await apiRequest("DELETE", `${endpoint}/${id}`, undefined, {
        'x-user-admin': 'true'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({ title: "Item excluído com sucesso!" });
    }
  });

  const updateContributionMutation = useMutation({
    mutationFn: async ({ id, status, adminResponse }: { id: string; status: string; adminResponse?: string }) => {
      const response = await apiRequest("PUT", `/api/admin/contributions/${id}`, 
        { status, adminResponse }, 
        { 'x-user-admin': 'true' }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contributions"] });
      toast({ title: "Contribuição atualizada!" });
    }
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async ({ title, message, userId }: { title: string; message: string; userId: string }) => {
      const response = await apiRequest("POST", "/api/admin/send-notification", 
        { title, message, userId }, 
        { 'x-user-admin': 'true' }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Notificação enviada!" });
    }
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Carregando painel administrativo...</h2>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo Completo
          </h1>
          <p className="text-gray-600">
            Gerencie todos os aspectos do aplicativo
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orações</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPrayers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devocionais</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalDevotionals || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patrocinadores</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeSponsors || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="devotionals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="devotionals">Devocionais</TabsTrigger>
            <TabsTrigger value="verses">Versículos</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="sponsors">Patrocinadores</TabsTrigger>
            <TabsTrigger value="contributions">Contribuições</TabsTrigger>
          </TabsList>

          {/* Devotionals Management */}
          <TabsContent value="devotionals">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gerenciar Devocionais</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Devocional
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {devotionalsLoading ? (
                  <p>Carregando devocionais...</p>
                ) : (
                  <div className="space-y-4">
                    {devotionals?.map((devotional: any) => (
                      <div key={devotional.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{devotional.title}</h3>
                          <p className="text-sm text-gray-600">{devotional.reference}</p>
                          <p className="text-xs text-gray-400">{devotional.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteMutation.mutate({ endpoint: '/api/admin/devotionals', id: devotional.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verses Management */}
          <TabsContent value="verses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gerenciar Versículos</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Versículo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {versesLoading ? (
                  <p>Carregando versículos...</p>
                ) : (
                  <div className="space-y-4">
                    {verses?.slice(0, 10).map((verse: any) => (
                      <div key={verse.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="text-sm">{verse.text}</p>
                          <p className="text-xs text-gray-600">{verse.reference}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteMutation.mutate({ endpoint: '/api/admin/verses', id: verse.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <p>Carregando usuários...</p>
                ) : (
                  <div className="space-y-4">
                    {users?.map((user: any) => (
                      <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex gap-2 mt-2">
                            {user.isAdmin && <Badge variant="secondary">Admin</Badge>}
                            <Badge variant="outline">{user.points} pontos</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Bell className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Enviar Notificação</DialogTitle>
                              </DialogHeader>
                              <NotificationForm userId={user.id} onSend={sendNotificationMutation.mutate} />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteMutation.mutate({ endpoint: '/api/admin/users', id: user.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsors Management */}
          <TabsContent value="sponsors">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gerenciar Patrocinadores</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Patrocinador
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {sponsorsLoading ? (
                  <p>Carregando patrocinadores...</p>
                ) : (
                  <div className="space-y-4">
                    {sponsors?.map((sponsor: any) => (
                      <div key={sponsor.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{sponsor.name}</h3>
                          <p className="text-sm text-gray-600">{sponsor.description}</p>
                          {sponsor.website && (
                            <a href={sponsor.website} className="text-xs text-blue-600 hover:underline">
                              {sponsor.website}
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteMutation.mutate({ endpoint: '/api/admin/sponsors', id: sponsor.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Contributions Management */}
          <TabsContent value="contributions">
            <Card>
              <CardHeader>
                <CardTitle>Contribuições dos Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                {contributionsLoading ? (
                  <p>Carregando contribuições...</p>
                ) : (
                  <div className="space-y-4">
                    {contributions?.map((contribution: any) => (
                      <div key={contribution.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">{contribution.title}</h3>
                            <Badge 
                              variant={contribution.type === 'feedback' ? 'default' : 
                                     contribution.type === 'suggestion' ? 'secondary' : 'outline'}
                            >
                              {contribution.type}
                            </Badge>
                          </div>
                          <Badge 
                            variant={contribution.status === 'pending' ? 'destructive' : 
                                   contribution.status === 'reviewed' ? 'default' : 'secondary'}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {contribution.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{contribution.content}</p>
                        
                        {contribution.adminResponse && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <p className="text-sm"><strong>Resposta do Admin:</strong> {contribution.adminResponse}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateContributionMutation.mutate({ 
                              id: contribution.id, 
                              status: 'reviewed' 
                            })}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Marcar como Revisado
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateContributionMutation.mutate({ 
                              id: contribution.id, 
                              status: 'archived' 
                            })}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Arquivar
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Responder
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Responder Contribuição</DialogTitle>
                              </DialogHeader>
                              <ResponseForm 
                                contributionId={contribution.id} 
                                onRespond={updateContributionMutation.mutate} 
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}

// Notification Form Component
function NotificationForm({ 
  userId, 
  onSend 
}: { 
  userId: string; 
  onSend: (data: { title: string; message: string; userId: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend({ title, message, userId });
    setTitle("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Título da notificação"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Mensagem da notificação"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        <Send className="h-4 w-4 mr-2" />
        Enviar Notificação
      </Button>
    </form>
  );
}

// Response Form Component
function ResponseForm({ 
  contributionId, 
  onRespond 
}: { 
  contributionId: string; 
  onRespond: (data: { id: string; status: string; adminResponse: string }) => void;
}) {
  const [response, setResponse] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRespond({ 
      id: contributionId, 
      status: 'responded', 
      adminResponse: response 
    });
    setResponse("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Sua resposta à contribuição"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        <Send className="h-4 w-4 mr-2" />
        Enviar Resposta
      </Button>
    </form>
  );
}