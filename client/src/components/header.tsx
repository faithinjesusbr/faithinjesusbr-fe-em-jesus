import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Cross, MessageSquare, Bell, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Fé em Jesus BR" 
              className="w-10 h-10 rounded-full object-cover shadow-md"
              onError={(e) => {
                // Fallback para o ícone da cruz se a logo não carregar
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-10 h-10 bg-gradient-to-br from-divine-500 to-divine-600 rounded-full flex items-center justify-center hidden">
              <Cross className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-divine-600 to-purple-600 bg-clip-text text-transparent">Fé em Jesus BR</h1>
              <p className="text-xs text-gray-500 italic">Inspiração diária com amor e fé ✨</p>
            </div>
          </Link>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative p-2 text-gray-400 hover:text-gray-600"
            >
              <User className="w-6 h-6" />
            </Button>
            
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/contributions">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contribuições
                    </button>
                  </Link>
                  <Link href="/notifications">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Notificações
                    </button>
                  </Link>
                  {user?.isAdmin && (
                    <Link href="/admin-complete">
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Painel Admin
                      </button>
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            )}
            
            {showUserMenu && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowUserMenu(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
