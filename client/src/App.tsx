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
import AIChatSimple from "@/pages/ai-chat-simple";
import ContributorsOffline from "@/pages/contributors-offline";

import EmotionSimple from "@/pages/emotion-simple";
import AISimple from "@/pages/ai-simple";
import CertificateSimple from "@/pages/certificate-simple";
import YoutubeVideosImproved from "@/pages/youtube-videos-improved";
import PixContributors from "@/pages/pix-contributors";
import VerseOfDay from "@/pages/verse-of-day";
import VerseSimple from "@/pages/verse-simple";
import AdminLogin from "@/pages/admin-login";
import AdminPanel from "@/pages/admin-panel";
import LibraryEbooksFixed from "@/pages/library-ebooks-fixed";
import VideosNewFixed from "@/pages/videos-new-fixed";

// New comprehensive admin and contribution components
import AdminPanelComplete from "@/pages/admin-panel-complete";
import UserContributions from "@/pages/user-contributions";
import VerseOfDayOffline from "@/pages/verse-of-day-offline";
import NotificationSettings from "@/pages/notification-settings";
import DailyMission from "@/pages/daily-mission";
import SupportNetwork from "@/pages/support-network";
import FaithPoints from "@/pages/faith-points";
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



  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-divine-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-divine-600 mx-auto"></div>
          <p className="text-divine-700 font-medium">Carregando...</p>
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
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/store" component={Store} />
        <Route path="/videos" component={VideosNewFixed} />
        <Route path="/library" component={Library} />
        <Route path="/library-ebooks" component={LibraryEbooksFixed} />
        <Route path="/emotion-today-improved" component={EmotionTodayImproved} />
        <Route path="/emotion-simple" component={EmotionSimple} />
        <Route path="/youtube-videos-improved" component={YoutubeVideosImproved} />
        <Route path="/pix-contributors" component={PixContributors} />
        <Route path="/verse-of-day" component={VerseSimple} />
        <Route path="/verse-advanced" component={VerseOfDay} />
        <Route path="/sponsors" component={Sponsors} />
        <Route path="/apoio" component={Sponsors} />
        <Route path="/prayer-requests" component={PrayerRequests} />
        <Route path="/ai-prayer" component={AIPrayer} />
        <Route path="/ai-simple" component={AISimple} />
        <Route path="/certificate-simple" component={CertificateSimple} />
        <Route path="/ai-chat" component={AIChatSimple} />
        <Route path="/contributors" component={ContributorsOffline} />

        <Route path="/share" component={SharePage} />
        
        {/* Admin Routes */}
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin-panel" component={AdminPanel} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/admin-complete" component={AdminPanelComplete} />
        
        {/* User Features */}
        <Route path="/contributions" component={UserContributions} />
        <Route path="/verse-offline" component={VerseOfDayOffline} />
        <Route path="/notifications" component={NotificationSettings} />
        
        {/* New Spiritual Features */}
        <Route path="/daily-mission" component={DailyMission} />
        <Route path="/faith-points" component={FaithPoints} />
        
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
