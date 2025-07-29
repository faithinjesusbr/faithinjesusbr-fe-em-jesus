import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ArrowLeft, Send } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

export default function CertificateSimplePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleGenerate = async () => {
    if (!name.trim() || !email.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/contributors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name,
          email: email,
          contributionType: "donation",
          donationAmount: "50"
        }),
      });
      
      const data = await res.json();
      setResult(data);
      console.log("Certificado gerado:", data);
    } catch (error) {
      console.error("Erro:", error);
      setResult({ error: "Erro ao gerar certificado" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20 pb-20">
        <div className="max-w-2xl mx-auto">
          <Button 
            onClick={() => setLocation('/')} 
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Gerar Certificado - Teste Simples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={!name.trim() || !email.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Gerando..." : "Gerar Certificado"}
                </Button>
              </div>
              
              {result && (
                <div className="p-4 bg-green-50 rounded border space-y-2">
                  <h3 className="font-bold text-green-800">Resultado:</h3>
                  {result.error ? (
                    <p className="text-red-600">{result.error}</p>
                  ) : (
                    <div className="text-sm text-gray-700">
                      <p><strong>Nome:</strong> {result.contributor?.name}</p>
                      <p><strong>Certificado:</strong> {result.certificate?.title}</p>
                      <p><strong>Oração:</strong> {result.certificate?.aiGeneratedPrayer}</p>
                      <p><strong>Versículo:</strong> {result.certificate?.aiGeneratedVerse}</p>
                      <p><strong>Referência:</strong> {result.certificate?.verseReference}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}