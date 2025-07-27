import { Home, BookOpen, HandHeart, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/verses", icon: BookOpen, label: "Versículos" },
  { href: "/prayer", icon: HandHeart, label: "Oração" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          
          return (
            <Link key={href} href={href}>
              <button className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors",
                isActive 
                  ? "text-divine-500" 
                  : "text-gray-400 hover:text-divine-500"
              )}>
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
