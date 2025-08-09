import { Link, useLocation } from "wouter";
import { Home, ShoppingBag, Video, BookOpen, Users, MessageCircle, Target, Heart, Star } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/daily-mission", icon: Target, label: "Missão" },
  { path: "/sponsors", icon: Heart, label: "Apoio" },
  { path: "/faith-points", icon: Star, label: "Pontos" },
  { path: "/library", icon: BookOpen, label: "Biblio" },
  { path: "/prayer-requests", icon: MessageCircle, label: "Oração" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-1 py-1 z-50 shadow-lg">
      <div className="flex justify-around items-center max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 px-1 py-1 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-purple-600 bg-purple-50 scale-105' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <IconComponent className={`h-4 w-4 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[9px] font-medium truncate max-w-[50px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}