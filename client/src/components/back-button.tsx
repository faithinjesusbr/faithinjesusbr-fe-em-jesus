import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
}

export default function BackButton({ fallbackPath = "/", className = "" }: BackButtonProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    // Try to go back in history, fallback to specified path
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation(fallbackPath);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`text-gray-600 hover:text-gray-800 ${className}`}
      data-testid="button-back"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Voltar
    </Button>
  );
}