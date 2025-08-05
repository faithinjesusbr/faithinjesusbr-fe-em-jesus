import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Send, Mail, CheckCircle, Clock } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface PrayerRequest {
  id: string;
  userId: string;
  subject: string;
  content: string;
  status: string;
  aiResponse?: string;
  respondedAt?: string;
  createdAt: string;
}

export default function PrayerRequestsPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["/api/prayer-requests", user?.id],
    enabled: !!user,
  });

  const submitRequestMutation = useMutation({
    mutationFn: async (requestData: { subject: string; content: string }) => {
      return apiRequest("/api/prayer-requests", "POST", {
        userId: user?.id,
        ...requestData,
      });
    },
    onSuccess: () => {
      setSubject("");
      setContent("");
      queryClient.invalidateQueries({
        queryKey: ["/api/prayer-requests", user?.id],
      });
      toast({
        title: "Pedido enviado!",
        description: "Seu pedido de oração foi recebido. Em breve você receberá uma resposta.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o assunto e o conteúdo do pedido.",
        variant: "destructive",
      });
      return;
    }
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para enviar pedidos de oração.",
        variant: "destructive",
      });
      return;
    }
    submitRequestMutation.mutate({ subject: subject.trim(), content: content.trim() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
            Pedidos de Oração
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compartilhe seus pedidos e receba orações personalizadas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Request Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Novo Pedido de Oração
                </CardTitle>
                <CardDescription>
                  Compartilhe sua necessidade de oração. Nossa equipe responderá com uma oração personalizada.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assunto
                    </label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ex: Oração pela minha família, Saúde, Trabalho..."
                      disabled={submitRequestMutation.isPending}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Seu pedido de oração
                    </label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Compartilhe seus detalhes, preocupações ou necessidades. Seja específico para que possamos orar de forma mais direcionada."
                      className="min-h-32 resize-none"
                      disabled={submitRequestMutation.isPending}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!subject.trim() || !content.trim() || submitRequestMutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {submitRequestMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Pedido
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Request History */}
          <div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
                  Seus Pedidos
                </CardTitle>
                <CardDescription>
                  Acompanhe o status dos seus pedidos de oração
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Faça login para ver seus pedidos
                  </p>
                ) : isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  </div>
                ) : !requests || (requests as PrayerRequest[]).length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Você ainda não tem pedidos. Faça seu primeiro pedido!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {(requests as PrayerRequest[]).map((request: PrayerRequest) => (
                      <div
                        key={request.id}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {request.subject}
                          </h4>
                          <Badge
                            variant={request.status === "responded" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {request.status === "responded" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {request.status === "responded" ? "Respondido" : "Pendente"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                          {request.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline" className="text-emerald-600 border-emerald-300 hover:bg-emerald-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>

        {/* Request Detail Modal */}
        <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            {selectedRequest && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {selectedRequest.subject}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Seu pedido:
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {selectedRequest.content}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Enviado em {new Date(selectedRequest.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>

                  {selectedRequest.status === "responded" && selectedRequest.aiResponse ? (
                    <div>
                      <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Resposta de Oração:
                      </h3>
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {selectedRequest.aiResponse}
                        </p>
                      </div>
                      {selectedRequest.respondedAt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Respondido em {new Date(selectedRequest.respondedAt).toLocaleString("pt-BR")}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Seu pedido está sendo processado. Em breve você receberá uma resposta personalizada.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}