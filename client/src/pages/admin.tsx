import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Book, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import AuthGuard from "@/components/auth-guard";
import Header from "@/components/header";

interface AdminStats {
  totalUsers: number;
  totalPrayers: number;
  versesGenerated: number;
  dailyActive: number;
  totalDevotionals: number;
  totalVerses: number;
}

export default function Admin() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/stats"],
  });

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Painel Administrativo</h2>
                <p className="text-gray-600">Gerencie conteúdo e usuários do aplicativo</p>
              </div>
              <Link href="/">
                <Button variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Devotionals Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-golden-500 rounded-lg flex items-center justify-center mr-3">
                    <Edit className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Devocionais</h3>
                    <p className="text-sm text-gray-600">Gerenciar mensagens diárias</p>
                  </div>
                </div>
                <Button className="w-full bg-golden-500 hover:bg-golden-600">
                  Gerenciar
                </Button>
              </CardContent>
            </Card>

            {/* Verses Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Book className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Versículos</h3>
                    <p className="text-sm text-gray-600">Base de versículos</p>
                  </div>
                </div>
                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  Gerenciar
                </Button>
              </CardContent>
            </Card>

            {/* Users Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <Users className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Usuários</h3>
                    <p className="text-sm text-gray-600">Gerenciar usuários</p>
                  </div>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Gerenciar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Estatísticas</h3>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center animate-pulse">
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-divine-600">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-600">Usuários Registrados</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.totalPrayers}</div>
                    <div className="text-sm text-gray-600">Orações Realizadas</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{stats.totalVerses}</div>
                    <div className="text-sm text-gray-600">Versículos Disponíveis</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-golden-600">{stats.dailyActive}</div>
                    <div className="text-sm text-gray-600">Usuários Ativos Hoje</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Erro ao carregar estatísticas
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
