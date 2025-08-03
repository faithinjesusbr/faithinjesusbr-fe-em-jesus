import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Star, Heart, Crown, Award, Clock, CheckCircle2 } from "lucide-react";

interface DailyMission {
  id: string;
  title: string;
  description: string;
  type: string;
  reward: string;
  points: string;
  verse?: string;
  reference?: string;
  date: string;
}

interface MissionProgress {
  id: string;
  userId: string;
  missionId: string;
  completed: boolean;
  completedAt?: Date;
  pointsEarned: string;
  rewardEarned?: string;
}

const rewardIcons = {
  star: Star,
  heart: Heart,
  crown: Crown,
  blessing: Award
};

const rewardColors = {
  star: "text-yellow-500",
  heart: "text-red-500", 
  crown: "text-purple-500",
  blessing: "text-blue-500"
};

export default function DailyMission() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get today's mission
  const { data: mission, isLoading: missionLoading } = useQuery({
    queryKey: ["/api/daily-mission/today"],
  });

  // Get user's progress for today's mission
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/daily-mission/progress", user?.id],
    enabled: !!user?.id,
  });

  // Get user's completed missions
  const { data: completedMissions } = useQuery({
    queryKey: ["/api/daily-mission/completed", user?.id],
    enabled: !!user?.id,
  });

  // Complete mission mutation
  const completeMissionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/daily-mission/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          missionId: mission?.id
        })
      });
      if (!response.ok) throw new Error("Falha ao completar missão");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Missão Completada! 🎉",
        description: `Você ganhou ${mission?.points} pontos de fé!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/daily-mission/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/daily-mission/completed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/faith-points/total"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível completar a missão",
        variant: "destructive",
      });
    }
  });

  const isCompleted = progressData?.progress?.completed;
  const RewardIcon = mission?.reward ? rewardIcons[mission.reward as keyof typeof rewardIcons] : Star;
  const rewardColor = mission?.reward ? rewardColors[mission.reward as keyof typeof rewardColors] : "text-yellow-500";

  if (missionLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Missão do Dia
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete desafios espirituais diários e ganhe recompensas
          </p>
        </div>

        {/* Today's Mission */}
        {mission && (
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <RewardIcon className={`w-8 h-8 ${rewardColor}`} />
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  {mission.title}
                </CardTitle>
              </div>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                {mission.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Mission Details */}
              <div className="flex justify-center space-x-4">
                <Badge variant="secondary" className="text-sm">
                  <Award className="w-4 h-4 mr-1" />
                  {mission.points} pontos
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  Hoje
                </Badge>
              </div>

              {/* Bible Verse */}
              {mission.verse && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-800 dark:text-gray-200 italic mb-2">
                    "{mission.verse}"
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {mission.reference}
                  </p>
                </div>
              )}

              {/* Complete Button */}
              <div className="text-center">
                {isCompleted ? (
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-lg font-medium">Missão Completada!</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => completeMissionMutation.mutate()}
                    disabled={completeMissionMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    data-testid="button-complete-mission"
                  >
                    {completeMissionMutation.isPending ? "Completando..." : "Completar Missão"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Missions History */}
        {completedMissions && completedMissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Missões Completadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {completedMissions.slice(0, 5).map((progress: MissionProgress) => (
                  <div 
                    key={progress.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Missão completada
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {progress.completedAt ? new Date(progress.completedAt).toLocaleDateString('pt-BR') : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      +{progress.pointsEarned} pontos
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Como Funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">Receba a Missão</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Todo dia uma nova missão espiritual te espera
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">Complete o Desafio</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pratique atos de fé e amor ao próximo
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">Ganhe Recompensas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Acumule pontos e selos espirituais
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}