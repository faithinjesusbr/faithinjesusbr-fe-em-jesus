import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  MessageSquare, 
  Lightbulb, 
  Heart, 
  Plus,
  Clock,
  CheckCircle,
  MessageCircle,
  Archive
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

export default function UserContributions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get user contributions
  const { data: contributions, isLoading } = useQuery({
    queryKey: ["/api/contributions", user?.id],
    enabled: !!user?.id
  });

  // Create contribution mutation
  const createMutation = useMutation({
    mutationFn: async (data: { userId: string; type: string; title: string; content: string }) => {
      const response = await apiRequest("POST", "/api/contributions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributions", user?.id] });
      toast({ title: "Contribuição enviada com sucesso!" });
      setIsDialogOpen(false);
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contribuições dos Usuários
          </h1>
          <p className="text-gray-600">
            Compartilhe seu feedback, sugestões e depoimentos conosco
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">
                Compartilhe suas experiências e opiniões sobre o aplicativo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Sugestões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">
                Propose novas funcionalidades e melhorias
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Depoimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">
                Conte como o app impactou sua vida espiritual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add New Contribution Button */}
        <div className="mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto">
                <Plus className="h-5 w-5 mr-2" />
                Nova Contribuição
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Contribuição</DialogTitle>
              </DialogHeader>
              <ContributionForm 
                userId={user.id} 
                onSubmit={createMutation.mutate}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Contributions List */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Contribuições</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Carregando suas contribuições...</p>
              </div>
            ) : contributions?.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Você ainda não fez nenhuma contribuição</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Fazer minha primeira contribuição
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {contributions?.map((contribution: any) => (
                  <div key={contribution.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{contribution.title}</h3>
                        <div className="flex gap-2 mb-2">
                          <Badge 
                            variant={contribution.type === 'feedback' ? 'default' : 
                                   contribution.type === 'suggestion' ? 'secondary' : 'outline'}
                            className="flex items-center gap-1"
                          >
                            {contribution.type === 'feedback' && <MessageSquare className="h-3 w-3" />}
                            {contribution.type === 'suggestion' && <Lightbulb className="h-3 w-3" />}
                            {contribution.type === 'testimony' && <Heart className="h-3 w-3" />}
                            {contribution.type === 'feedback' ? 'Feedback' :
                             contribution.type === 'suggestion' ? 'Sugestão' : 'Depoimento'}
                          </Badge>
                        </div>
                      </div>
                      <StatusBadge status={contribution.status} />
                    </div>
                    
                    <p className="text-gray-700 mb-4">{contribution.content}</p>
                    
                    {contribution.adminResponse && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-900">Resposta da Equipe:</span>
                        </div>
                        <p className="text-blue-800">{contribution.adminResponse}</p>
                        {contribution.respondedAt && (
                          <p className="text-xs text-blue-600 mt-2">
                            Respondido em {new Date(contribution.respondedAt).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                      <span>
                        Enviado em {new Date(contribution.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          variant: 'destructive' as const, 
          icon: Clock, 
          text: 'Pendente' 
        };
      case 'reviewed':
        return { 
          variant: 'default' as const, 
          icon: CheckCircle, 
          text: 'Revisado' 
        };
      case 'responded':
        return { 
          variant: 'default' as const, 
          icon: MessageCircle, 
          text: 'Respondido' 
        };
      case 'archived':
        return { 
          variant: 'secondary' as const, 
          icon: Archive, 
          text: 'Arquivado' 
        };
      default:
        return { 
          variant: 'outline' as const, 
          icon: Clock, 
          text: 'Pendente' 
        };
    }
  };

  const { variant, icon: Icon, text } = getStatusConfig(status);

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {text}
    </Badge>
  );
}

// Contribution Form Component
function ContributionForm({ 
  userId, 
  onSubmit, 
  isLoading 
}: { 
  userId: string; 
  onSubmit: (data: { userId: string; type: string; title: string; content: string }) => void;
  isLoading: boolean;
}) {
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !title.trim() || !content.trim()) {
      return;
    }
    onSubmit({ userId, type, title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Tipo de Contribuição</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feedback">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Feedback
              </div>
            </SelectItem>
            <SelectItem value="suggestion">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Sugestão
              </div>
            </SelectItem>
            <SelectItem value="testimony">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Depoimento
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Título</label>
        <Input
          placeholder="Título da sua contribuição"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Conteúdo</label>
        <Textarea
          placeholder="Descreva sua contribuição em detalhes..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !type || !title.trim() || !content.trim()}
      >
        {isLoading ? "Enviando..." : "Enviar Contribuição"}
      </Button>
    </form>
  );
}