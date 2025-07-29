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
import Store from "@/pages/store-new";
import Videos from "@/pages/videos-new";
import Library from "@/pages/library-new";
import Sponsors from "@/pages/sponsors";
import PrayerRequests from "@/pages/prayer-requests";
import AIPrayer from "@/pages/ai-prayer";
import SharePage from "@/pages/share";
import AdminDashboard from "@/pages/admin-dashboard";
import DigitalAssistant from "@/components/digital-assistant";
// Import the dynamic components directly
import LibraryEbooks from "@/pages/library-ebooks";
import EmotionTodayImproved from "@/pages/emotion-today-improved";
import AIChatPage from "@/pages/ai-chat";
import EmotionSimple from "@/pages/emotion-simple";
import YoutubeVideosImproved from "@/pages/youtube-videos-improved";
import PixContributors from "@/pages/pix-contributors";
import VerseOfDay from "@/pages/verse-of-day";
import VerseSimple from "@/pages/verse-simple";
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
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/store" component={Store} />
        <Route path="/videos" component={Videos} />
        <Route path="/library" component={Library} />
        <Route path="/library-ebooks" component={LibraryEbooks} />
        <Route path="/emotion-today-improved" component={EmotionTodayImproved} />
        <Route path="/emotion-simple" component={EmotionSimple} />
        <Route path="/youtube-videos-improved" component={YoutubeVideosImproved} />
        <Route path="/pix-contributors" component={PixContributors} />
        <Route path="/verse-of-day" component={VerseSimple} />
        <Route path="/verse-advanced" component={VerseOfDay} />
        <Route path="/sponsors" component={Sponsors} />
        <Route path="/prayer-requests" component={PrayerRequests} />
        <Route path="/ai-prayer" component={AIPrayer} />
        <Route path="/ai-chat" component={AIChatPage} />
        <Route path="/share" component={SharePage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Assistente Digital Flutuante */}
      <DigitalAssistant />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
