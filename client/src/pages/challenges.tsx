import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, Calendar, CheckCircle, Award, Download } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  imageUrl?: string;
  createdAt: string;
}

interface ChallengeDay {
  id: string;
  challengeId: string;
  day: string;
  title: string;
  content: string;
  verse: string;
  reference: string;
  reflection: string;
}

interface UserProgress {
  id: string;
  userId: string;
  challengeId: string;
  dayId: string;
  completed: boolean;
  completedAt?: string;
}

export default function ChallengesPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedDay, setSelectedDay] = useState<ChallengeDay | null>(null);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/challenges"],
  });

  const { data: challengeDays, isLoading: daysLoading } = useQuery({
    queryKey: ["/api/challenges", selectedChallenge?.id, "days"],
    enabled: !!selectedChallenge,
  });

  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/challenges", selectedChallenge?.id, "progress", user?.id],
    enabled: !!selectedChallenge && !!user,
  });

  const markCompletedMutation = useMutation({
    mutationFn: async ({ dayId, completed }: { dayId: string; completed: boolean }) => {
      return apiRequest("/api/challenges/progress", {
        method: "POST",
        body: {
          userId: user?.id,
          challengeId: selectedChallenge?.id,
          dayId,
          completed,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/challenges", selectedChallenge?.id, "progress"],
      });
      toast({
        title: "Progresso atualizado!",
        description: "Parabéns por completar mais um dia!",
      });
    },
  });

  const generateCertificateMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/challenges/${selectedChallenge?.id}/certificate`, {
        method: "POST",
        body: { userName: user?.name },
      });
    },
    onSuccess: (certificate) => {
      toast({
        title: "Certificado gerado!",
        description: "Parabéns por completar o desafio!",
      });
      // Here you would typically show a modal with the certificate
      console.log("Certificate:", certificate);
    },
  });

  const completedDays = userProgress?.filter((p: UserProgress) => p.completed) || [];
  const totalDays = parseInt(selectedChallenge?.duration || "0");
  const progressPercentage = totalDays > 0 ? (completedDays.length / totalDays) * 100 : 0;
  const isCompleted = completedDays.length === totalDays;

  if (challengesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Day detail view
  if (selectedDay) {
    const dayProgress = userProgress?.find((p: UserProgress) => p.dayId === selectedDay.id);
    const isCompleted = dayProgress?.completed || false;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDay(null)}
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Badge variant={isCompleted ? "default" : "secondary"}>
              Dia {selectedDay.day}
            </Badge>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800 dark:text-purple-200">
                {selectedDay.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">
                  Conteúdo do Dia
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedDay.content}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-500">
                <p className="text-purple-800 dark:text-purple-200 font-medium mb-2">
                  "{selectedDay.verse}"
                </p>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                  {selectedDay.reference}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">
                  Reflexão
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedDay.reflection}
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => markCompletedMutation.mutate({ 
                    dayId: selectedDay.id, 
                    completed: !isCompleted 
                  })}
                  disabled={markCompletedMutation.isPending}
                  className={`${
                    isCompleted 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white`}
                >
                  {markCompletedMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {isCompleted ? "Concluído" : "Marcar como Concluído"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Challenge detail view
  if (selectedChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChallenge(null)}
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                {selectedChallenge.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedChallenge.description}
              </p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Seu Progresso</span>
                {isCompleted && (
                  <Button
                    onClick={() => generateCertificateMutation.mutate()}
                    disabled={generateCertificateMutation.isPending}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    {generateCertificateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Award className="h-4 w-4 mr-2" />
                    )}
                    Gerar Certificado
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {completedDays.length} de {totalDays} dias concluídos
                  </span>
                  <span className="text-sm font-medium text-purple-600">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challengeDays?.map((day: ChallengeDay) => {
              const dayProgress = userProgress?.find((p: UserProgress) => p.dayId === day.id);
              const isDayCompleted = dayProgress?.completed || false;

              return (
                <Card
                  key={day.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isDayCompleted ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Dia {day.day}</CardTitle>
                      {isDayCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <CardDescription className="font-medium">
                      {day.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {day.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Challenges list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-2">
            Desafios com Jesus
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fortaleça sua fé com nossos desafios espirituais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {challenges?.map((challenge: Challenge) => (
            <Card
              key={challenge.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              onClick={() => setSelectedChallenge(challenge)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-purple-800 dark:text-purple-200">
                    {challenge.title}
                  </CardTitle>
                  <Badge variant="secondary">
                    {challenge.duration} dias
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  Duração: {challenge.duration} dias
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}