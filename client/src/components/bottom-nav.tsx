import { Home, BookOpen, HandHeart, User, Gift, Users, ShoppingBag, Youtube } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/store", icon: ShoppingBag, label: "Loja" },
  { href: "/videos", icon: Youtube, label: "Vídeos" },
  { href: "/library", icon: BookOpen, label: "Biblioteca" },
  { href: "/sponsors", icon: Gift, label: "Parceiros" },
  { href: "/prayer-requests", icon: HandHeart, label: "Oração" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream-100 border-t border-lilac-200 md:hidden z-40">
      <div className="grid grid-cols-6 h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          
          return (
            <Link key={href} href={href}>
              <button className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors",
                isActive 
                  ? "text-lilac-600" 
                  : "text-lilac-400 hover:text-lilac-600"
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
