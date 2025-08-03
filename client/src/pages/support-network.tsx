import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Plus, Send, Users, Calendar, User, UserX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SupportRequest {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: string;
  isAnonymous: boolean;
  status: string;
  replies: string;
  createdAt: string;
}

interface SupportReply {
  id: string;
  supportId: string;
  userId: string;
  message: string;
  isAnonymous: boolean;
  verse?: string;
  reference?: string;
  createdAt: string;
}

const categoryLabels = {
  prayer_request: "Pedido de Oração",
  encouragement: "Encorajamento",
  testimony: "Testemunho",
  help: "Preciso de Ajuda"
};

const categoryColors = {
  prayer_request: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  encouragement: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  testimony: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  help: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

export default function SupportNetwork() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  
  // Form states
  const [newRequest, setNewRequest] = useState({
    title: "",
    message: "",
    category: "",
    isAnonymous: false
  });
  
  const [newReply, setNewReply] = useState({
    message: "",
    isAnonymous: false,
    verse: "",
    reference: ""
  });

  // Get all support requests
  const { data: supportRequests, isLoading } = useQuery({
    queryKey: ["/api/support-network"],
  });

  // Get selected request details with replies
  const { data: requestDetails } = useQuery({
    queryKey: ["/api/support-network", selectedRequest?.id],
    enabled: !!selectedRequest?.id,
  });

  // Create support request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/support-network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: user?.id })
      });
      if (!response.ok) throw new Error("Falha ao criar pedido");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Pedido Criado! 💙",
        description: "Sua mensagem foi compartilhada com a comunidade",
      });
      setShowCreateDialog(false);
      setNewRequest({ title: "", message: "", category: "", isAnonymous: false });
      queryClient.invalidateQueries({ queryKey: ["/api/support-network"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o pedido",
        variant: "destructive",
      });
    }
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async ({ requestId, data }: { requestId: string, data: any }) => {
      const response = await fetch(`/api/support-network/${requestId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: user?.id })
      });
      if (!response.ok) throw new Error("Falha ao enviar resposta");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mensagem Enviada! 🙏",
        description: "Sua mensagem de apoio foi enviada",
      });
      setShowReplyDialog(false);
      setNewReply({ message: "", isAnonymous: false, verse: "", reference: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/support-network", selectedRequest?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/support-network"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    }
  });

  const handleCreateRequest = () => {
    if (!newRequest.title || !newRequest.message || !newRequest.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    createRequestMutation.mutate(newRequest);
  };

  const handleSendReply = () => {
    if (!newReply.message || !selectedRequest) {
      toast({
        title: "Mensagem obrigatória",
        description: "Digite uma mensagem de apoio",
        variant: "destructive",
      });
      return;
    }
    createReplyMutation.mutate({ 
      requestId: selectedRequest.id, 
      data: newReply 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid gap-4">
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Rede de Apoio
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Compartilhe suas necessidades e ofereça apoio à comunidade cristã
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Users className="w-5 h-5" />
            <span>{supportRequests?.length || 0} pedidos ativos</span>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white" data-testid="button-create-support">
                <Plus className="w-4 h-4 mr-1" />
                Fazer Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Pedido de Apoio</DialogTitle>
                <DialogDescription>
                  Compartilhe sua necessidade com a comunidade
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Resumo do seu pedido..."
                    data-testid="input-request-title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={newRequest.category}
                    onValueChange={(value) => setNewRequest(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger data-testid="select-request-category">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prayer_request">Pedido de Oração</SelectItem>
                      <SelectItem value="encouragement">Encorajamento</SelectItem>
                      <SelectItem value="testimony">Testemunho</SelectItem>
                      <SelectItem value="help">Preciso de Ajuda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={newRequest.message}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Descreva sua necessidade..."
                    rows={4}
                    data-testid="textarea-request-message"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymous"
                    checked={newRequest.isAnonymous}
                    onCheckedChange={(checked) => setNewRequest(prev => ({ ...prev, isAnonymous: checked }))}
                    data-testid="switch-anonymous-request"
                  />
                  <Label htmlFor="anonymous">Postar anonimamente</Label>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleCreateRequest}
                    disabled={createRequestMutation.isPending}
                    className="flex-1"
                    data-testid="button-submit-request"
                  >
                    {createRequestMutation.isPending ? "Enviando..." : "Enviar Pedido"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Support Requests Grid */}
        <div className="grid gap-4">
          {supportRequests?.map((request: SupportRequest) => (
            <Card 
              key={request.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedRequest(request)}
              data-testid={`card-support-${request.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={categoryColors[request.category as keyof typeof categoryColors]}>
                        {categoryLabels[request.category as keyof typeof categoryLabels]}
                      </Badge>
                      {request.isAnonymous && (
                        <Badge variant="outline" className="text-xs">
                          <UserX className="w-3 h-3 mr-1" />
                          Anônimo
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(request.createdAt), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{request.replies} respostas</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                  {request.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Request Details Dialog */}
        {selectedRequest && (
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={categoryColors[selectedRequest.category as keyof typeof categoryColors]}>
                    {categoryLabels[selectedRequest.category as keyof typeof categoryLabels]}
                  </Badge>
                  {selectedRequest.isAnonymous && (
                    <Badge variant="outline" className="text-xs">
                      <UserX className="w-3 h-3 mr-1" />
                      Anônimo
                    </Badge>
                  )}
                </div>
                <DialogTitle>{selectedRequest.title}</DialogTitle>
                <DialogDescription>
                  {formatDistanceToNow(new Date(selectedRequest.createdAt), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Original Message */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-800 dark:text-gray-200">
                    {selectedRequest.message}
                  </p>
                </div>

                {/* Replies */}
                {requestDetails?.replies && requestDetails.replies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      Mensagens de Apoio
                    </h4>
                    {requestDetails.replies.map((reply: SupportReply) => (
                      <div key={reply.id} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {reply.isAnonymous ? (
                              <UserX className="w-4 h-4 text-gray-500" />
                            ) : (
                              <User className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {reply.isAnonymous ? "Anônimo" : "Membro da comunidade"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(reply.createdAt), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mb-2">
                          {reply.message}
                        </p>
                        {reply.verse && (
                          <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                            <p className="text-sm italic text-blue-700 dark:text-blue-300">
                              "{reply.verse}"
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {reply.reference}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Button */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => setShowReplyDialog(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid="button-reply-support"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Enviar Mensagem de Apoio
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Reply Dialog */}
        {showReplyDialog && (
          <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enviar Apoio</DialogTitle>
                <DialogDescription>
                  Ofereça palavras de encorajamento e fé
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reply-message">Mensagem de Apoio</Label>
                  <Textarea
                    id="reply-message"
                    value={newReply.message}
                    onChange={(e) => setNewReply(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Escreva sua mensagem de apoio..."
                    rows={4}
                    data-testid="textarea-reply-message"
                  />
                </div>
                
                <div>
                  <Label htmlFor="verse">Versículo (opcional)</Label>
                  <Input
                    id="verse"
                    value={newReply.verse}
                    onChange={(e) => setNewReply(prev => ({ ...prev, verse: e.target.value }))}
                    placeholder="Compartilhe um versículo..."
                    data-testid="input-reply-verse"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reference">Referência (opcional)</Label>
                  <Input
                    id="reference"
                    value={newReply.reference}
                    onChange={(e) => setNewReply(prev => ({ ...prev, reference: e.target.value }))}
                    placeholder="Ex: João 3:16"
                    data-testid="input-reply-reference"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reply-anonymous"
                    checked={newReply.isAnonymous}
                    onCheckedChange={(checked) => setNewReply(prev => ({ ...prev, isAnonymous: checked }))}
                    data-testid="switch-anonymous-reply"
                  />
                  <Label htmlFor="reply-anonymous">Enviar anonimamente</Label>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSendReply}
                    disabled={createReplyMutation.isPending}
                    className="flex-1"
                    data-testid="button-submit-reply"
                  >
                    {createReplyMutation.isPending ? "Enviando..." : "Enviar Apoio"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Empty State */}
        {supportRequests?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Nenhum pedido ainda
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Seja o primeiro a compartilhar uma necessidade ou testemunho
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                Fazer Primeiro Pedido
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}