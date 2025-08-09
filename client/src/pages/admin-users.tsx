import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Search, Users, Calendar, Phone, Mail, MessageCircle } from "lucide-react";
import Header from "@/components/header";
import BackButton from "@/components/back-button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  id: string;
  email: string;
  name?: string;
  whatsapp?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Verificar se é o usuário admin autorizado
  if (user?.email !== "daviddkoog@gmail.com") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
            <p className="text-gray-600">Esta área é restrita ao administrador.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const filteredUsers = (users as User[])?.filter((u: User) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((u: User) => u.isActive)?.length || 0;
  const usersWithWhatsApp = users?.filter((u: User) => u.whatsapp)?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            👨‍💼 Painel de Usuários
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Área exclusiva para acompanhar usuários cadastrados no app Fé em Jesus BR
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{totalUsers}</div>
              <div className="text-sm opacity-90">Total de Usuários</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{activeUsers}</div>
              <div className="text-sm opacity-90">Usuários Ativos</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{usersWithWhatsApp}</div>
              <div className="text-sm opacity-90">Com WhatsApp</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{Math.round((usersWithWhatsApp / totalUsers) * 100) || 0}%</div>
              <div className="text-sm opacity-90">Taxa WhatsApp</div>
            </CardContent>
          </Card>
        </div>

        {/* Busca */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de Usuários */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando usuários...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredUsers.map((user: User) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.name || "Nome não informado"}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {user.whatsapp ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.whatsapp}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Sem WhatsApp
                          </Badge>
                        )}
                        
                        <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {user.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        
                        <Badge variant="outline" className="text-gray-600">
                          Cadastro: {formatDistanceToNow(new Date(user.createdAt), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {user.whatsapp && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => window.open(`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`, '_blank')}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredUsers.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhum usuário encontrado
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? "Tente uma busca diferente" : "Ainda não há usuários cadastrados"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}