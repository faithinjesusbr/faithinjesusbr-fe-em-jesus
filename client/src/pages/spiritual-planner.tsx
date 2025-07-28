import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar, Save, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import BottomNav from "@/components/bottom-nav";

const daysOfWeek = [
  { id: 'segunda', name: 'Segunda-feira', color: 'from-red-500 to-pink-500' },
  { id: 'terca', name: 'Terça-feira', color: 'from-orange-500 to-yellow-500' },
  { id: 'quarta', name: 'Quarta-feira', color: 'from-yellow-500 to-green-500' },
  { id: 'quinta', name: 'Quinta-feira', color: 'from-green-500 to-teal-500' },
  { id: 'sexta', name: 'Sexta-feira', color: 'from-teal-500 to-blue-500' },
  { id: 'sabado', name: 'Sábado', color: 'from-blue-500 to-indigo-500' },
  { id: 'domingo', name: 'Domingo', color: 'from-indigo-500 to-purple-500' },
];

export default function SpiritualPlanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeDay, setActiveDay] = useState('segunda');
  const [entries, setEntries] = useState({});

  const currentWeek = new Date().toISOString().split('T')[0];

  const { data: plannerEntries, isLoading } = useQuery({
    queryKey: ['/api/spiritual-planner', user?.id, currentWeek],
    enabled: !!user?.id,
    onSuccess: (data) => {
      const entriesMap = {};
      data?.forEach(entry => {
        entriesMap[entry.dayOfWeek] = entry;
      });
      setEntries(entriesMap);
    }
  });

  const saveDayMutation = useMutation({
    mutationFn: async (dayData) => {
      await apiRequest("/api/spiritual-planner", "POST", {
        userId: user?.id,
        dayOfWeek: activeDay,
        date: currentWeek,
        ...dayData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spiritual-planner'] });
      toast({
        title: "Salvo com sucesso!",
        description: `Plano espiritual de ${daysOfWeek.find(d => d.id === activeDay)?.name} foi salvo.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field, value) => {
    setEntries(prev => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        [field]: value
      }
    }));
  };

  const handleSaveDay = () => {
    const dayEntry = entries[activeDay] || {};
    saveDayMutation.mutate({
      prayer: dayEntry.prayer || '',
      favoriteVerse: dayEntry.favoriteVerse || '',
      spiritualGoal: dayEntry.spiritualGoal || '',
      gratitude: dayEntry.gratitude || '',
      specialRequest: dayEntry.specialRequest || ''
    });
  };

  const activeDayData = entries[activeDay] || {};
  const activeDayInfo = daysOfWeek.find(d => d.id === activeDay);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Planner Espiritual</h1>
            </div>
            <p className="text-gray-600">Organize sua jornada espiritual semanal</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Semana de {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Days Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-8">
            {daysOfWeek.map((day) => (
              <Button
                key={day.id}
                onClick={() => setActiveDay(day.id)}
                variant={activeDay === day.id ? "default" : "outline"}
                className={`p-4 h-auto flex flex-col gap-1 transition-all ${
                  activeDay === day.id 
                    ? `bg-gradient-to-r ${day.color} text-white border-0 shadow-lg scale-105` 
                    : 'hover:scale-105'
                }`}
              >
                <span className="font-semibold text-xs">{day.name.substring(0, 3)}</span>
                <span className="text-xs opacity-80">{day.name.substring(4)}</span>
                {entries[day.id] && (
                  <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                )}
              </Button>
            ))}
          </div>

          {/* Active Day Form */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <CardTitle className={`text-2xl bg-gradient-to-r ${activeDayInfo.color} bg-clip-text text-transparent`}>
                {activeDayInfo.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div>
                  <Label htmlFor="prayer" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Oração do Dia
                  </Label>
                  <Textarea
                    id="prayer"
                    placeholder="Escreva uma oração ou tema de oração para hoje..."
                    value={activeDayData.prayer || ''}
                    onChange={(e) => handleInputChange('prayer', e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="favoriteVerse" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Versículo Favorito
                  </Label>
                  <Textarea
                    id="favoriteVerse"
                    placeholder="Anote um versículo que está no seu coração hoje..."
                    value={activeDayData.favoriteVerse || ''}
                    onChange={(e) => handleInputChange('favoriteVerse', e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="spiritualGoal" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Meta Espiritual
                  </Label>
                  <Textarea
                    id="spiritualGoal"
                    placeholder="Qual sua meta espiritual para hoje? (ex: ler 1 capítulo, orar 15min...)"
                    value={activeDayData.spiritualGoal || ''}
                    onChange={(e) => handleInputChange('spiritualGoal', e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="gratitude" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Agradecimento
                  </Label>
                  <Textarea
                    id="gratitude"
                    placeholder="Pelo que você é grato a Deus hoje?"
                    value={activeDayData.gratitude || ''}
                    onChange={(e) => handleInputChange('gratitude', e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequest" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Pedido Especial
                  </Label>
                  <Textarea
                    id="specialRequest"
                    placeholder="Algum pedido especial de oração ou necessidade?"
                    value={activeDayData.specialRequest || ''}
                    onChange={(e) => handleInputChange('specialRequest', e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSaveDay}
                  disabled={saveDayMutation.isPending}
                  className={`bg-gradient-to-r ${activeDayInfo.color} hover:opacity-90 text-white px-8 py-3 rounded-full shadow-lg`}
                >
                  {saveDayMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Dia
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}