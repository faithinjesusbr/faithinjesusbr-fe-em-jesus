import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Home from "@/pages/home";
import DailyDevotional from "@/pages/daily-devotional";
import VerseOfDay from "@/pages/verse-of-day";
import SpiritualPlanner from "@/pages/spiritual-planner";
import MoodToday from "@/pages/mood-today";
import JesusChallenge from "@/pages/jesus-challenge";
import AIPrayerAgent from "@/pages/ai-prayer-agent";
import { useEffect } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={DailyDevotional} />
      <Route path="/daily-devotional" component={DailyDevotional} />
      <Route path="/verse-of-day" component={VerseOfDay} />
      <Route path="/spiritual-planner" component={SpiritualPlanner} />
      <Route path="/mood-today" component={MoodToday} />
      <Route path="/jesus-challenge" component={JesusChallenge} />
      <Route path="/ai-prayer-agent" component={AIPrayerAgent} />
      <Route path="/home" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
