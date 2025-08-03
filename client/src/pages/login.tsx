import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { authApi } from "@/lib/auth";
import { loginSchema, type LoginUser } from "@shared/schema";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user);
      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso.",
      });
      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        setLocation("/");
        window.location.reload(); // Force refresh for mobile compatibility
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginUser) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fundo com gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/20 via-transparent to-blue-500/20"></div>
      
      {/* Efeitos de partículas flutuantes */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-white/20" />
          </div>
        ))}
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header com logo */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 mb-6 relative group">
            <img 
              src="/logo.png" 
              alt="Fé em Jesus BR" 
              className="w-full h-full rounded-full object-cover shadow-2xl border-4 border-white/30 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 backdrop-blur-sm hidden">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fé em Jesus BR</h1>
          <p className="text-white/80 text-sm">Entre na sua conta espiritual</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-20"></div>
          <CardHeader className="relative">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-gray-600 text-sm">Faça login para continuar sua jornada espiritual</p>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 pt-0 relative">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">E-mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="seu@email.com"
                            className="pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 transition-all duration-200"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input 
                            {...field} 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-12 transition-all duration-200"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl py-3 h-12 font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loginMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Entrando...
                      </>
                    ) : (
                      <>
                        Entrar
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>

                <div className="text-center text-sm space-y-3">
                  <Link href="/register">
                    <Button variant="link" className="text-purple-600 hover:text-purple-700 font-medium p-0 h-auto">
                      Não tem uma conta? Cadastre-se aqui
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-white/70 backdrop-blur-sm bg-white/10 rounded-lg p-3">
          <p className="italic">"Entregue o seu caminho ao Senhor; confie nele, e ele agirá." - Salmos 37:5</p>
        </div>
      </div>
    </div>
  );
}
