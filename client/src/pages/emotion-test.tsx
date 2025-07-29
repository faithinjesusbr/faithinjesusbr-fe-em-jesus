import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmotionTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEmotion = async (emotion: string) => {
    setLoading(true);
    try {
      console.log("🧪 Testando emoção:", emotion);
      
      const response = await fetch("/api/emotions/generate-devotional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotion, intensity: 5 }),
      });
      
      console.log("📡 Status da resposta:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ Dados recebidos:", data);
      setResult(data);
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de Emoções</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {["ansioso", "triste", "alegre", "cansado", "irritado", "confiante", "solitario", "grato"].map((emotion) => (
            <Button
              key={emotion}
              onClick={() => testEmotion(emotion)}
              disabled={loading}
              className="h-20"
            >
              {emotion}
            </Button>
          ))}
        </div>

        {loading && (
          <Card>
            <CardContent className="p-6">
              <p>Carregando...</p>
            </CardContent>
          </Card>
        )}

        {result && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}