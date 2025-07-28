import { Link, useLocation } from "wouter";
import { BookOpen, Calendar, Heart, Trophy, MessageCircle, Home } from "lucide-react";

const navItems = [
  { path: "/daily-devotional", icon: BookOpen, label: "Devocional" },
  { path: "/verse-of-day", icon: Home, label: "Versículo" },
  { path: "/mood-today", icon: Heart, label: "Humor" },
  { path: "/spiritual-planner", icon: Calendar, label: "Planner" },
  { path: "/jesus-challenge", icon: Trophy, label: "Desafio" },
  { path: "/ai-prayer-agent", icon: MessageCircle, label: "Oração IA" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200 px-2 py-2">
      <div className="flex justify-around items-center max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <IconComponent className={`h-5 w-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}