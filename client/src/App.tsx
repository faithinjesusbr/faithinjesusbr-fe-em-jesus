import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import AdminDashboard from "@/pages/admin-dashboard";
import Sponsors from "@/pages/sponsors";
import Contributors from "@/pages/contributors";
import Emotions from "@/pages/emotions";
import Challenges from "@/pages/challenges";
import AIPrayer from "@/pages/ai-prayer";
import LoveCards from "@/pages/love-cards";
import PrayerRequests from "@/pages/prayer-requests";
import Library from "@/pages/library";
import DevotionalAudios from "@/pages/devotional-audios";
import { useEffect } from "react";

function Router() {
  const { isAuthenticated } = useAuth();

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
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/sponsors" component={Sponsors} />
      <Route path="/contributors" component={Contributors} />
      <Route path="/emotions" component={Emotions} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/ai-prayer" component={AIPrayer} />
      <Route path="/love-cards" component={LoveCards} />
      <Route path="/prayer-requests" component={PrayerRequests} />
      <Route path="/library" component={Library} />
      <Route path="/devotional-audios" component={DevotionalAudios} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
