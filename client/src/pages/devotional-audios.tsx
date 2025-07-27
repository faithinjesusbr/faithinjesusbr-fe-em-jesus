import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Play, Pause, Volume2, Clock } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface DevotionalAudio {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  duration?: string;
  createdAt: string;
}

export default function DevotionalAudiosPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const { toast } = useToast();

  const { data: audios, isLoading } = useQuery({
    queryKey: ["/api/devotional-audios"],
  });

  const handlePlayPause = (audio: DevotionalAudio) => {
    // For this demo, we'll show a message since we don't have real audio URLs
    if (audio.audioUrl.includes('example.com')) {
      toast({
        title: "Demo Mode",
        description: "Esta é uma versão demonstrativa. Em produção, os áudios seriam reproduzidos aqui.",
      });
      return;
    }

    let audioElement = audioElements.get(audio.id);
    
    if (!audioElement) {
      audioElement = new Audio(audio.audioUrl);
      audioElement.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
      });
      audioElement.addEventListener('error', () => {
        toast({
          title: "Erro de reprodução",
          description: "Não foi possível reproduzir este áudio. Tente novamente.",
          variant: "destructive",
        });
        setCurrentlyPlaying(null);
      });
      setAudioElements(prev => new Map(prev).set(audio.id, audioElement!));
    }

    if (currentlyPlaying === audio.id) {
      // Pause current audio
      audioElement.pause();
      setCurrentlyPlaying(null);
    } else {
      // Stop any currently playing audio
      if (currentlyPlaying) {
        const currentAudio = audioElements.get(currentlyPlaying);
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }
      
      // Play new audio
      audioElement.play();
      setCurrentlyPlaying(audio.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-200 mb-2 flex items-center justify-center gap-2">
            <Volume2 className="h-8 w-8" />
            Áudios Devocionais
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ouça reflexões e orações para fortalecer sua fé
          </p>
        </div>

        {!audios || audios.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Volume2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Em breve teremos áudios devocionais
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Estamos preparando conteúdos especiais em áudio para você.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {audios.map((audio: DevotionalAudio) => {
              const isPlaying = currentlyPlaying === audio.id;
              
              return (
                <Card
                  key={audio.id}
                  className={`transition-all duration-200 hover:shadow-lg ${
                    isPlaying ? "ring-2 ring-amber-500 shadow-lg" : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-amber-800 dark:text-amber-200 flex items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      {audio.title}
                    </CardTitle>
                    {audio.description && (
                      <CardDescription className="text-base">
                        {audio.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handlePlayPause(audio)}
                          size="lg"
                          className={`${
                            isPlaying 
                              ? "bg-amber-600 hover:bg-amber-700" 
                              : "bg-amber-600 hover:bg-amber-700"
                          } text-white rounded-full w-12 h-12 p-0`}
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6 ml-1" />
                          )}
                        </Button>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {isPlaying ? "Reproduzindo..." : "Clique para ouvir"}
                          </p>
                          {audio.duration && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {audio.duration}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Adicionado em {new Date(audio.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    {/* Audio progress bar placeholder */}
                    {isPlaying && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div className="bg-amber-500 h-1 rounded-full animate-pulse" style={{ width: "30%" }} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>1:23</span>
                          <span>{audio.duration || "0:00"}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="text-amber-600 border-amber-300 hover:bg-amber-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>

        {/* Audio Controls Info */}
        <div className="mt-8 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-center text-gray-800 dark:text-gray-200">
                Como usar os áudios devocionais
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span>Reproduzir</span>
                </div>
                <div className="flex items-center gap-2">
                  <Pause className="h-4 w-4" />
                  <span>Pausar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Duração</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use fones de ouvido para uma experiência mais imersiva de oração e reflexão.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}