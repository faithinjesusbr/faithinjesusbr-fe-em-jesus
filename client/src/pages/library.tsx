import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, BookOpen, Heart, Target, Users, ExternalLink, Gift, Copy } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface LibraryCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface LibraryContent {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  verse?: string;
  reference?: string;
  externalLink?: string;
  contentType: string;
}

const iconMap = {
  Heart: Heart,
  Target: Target,
  Users: Users,
};

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<LibraryCategory | null>(null);
  const [selectedContent, setSelectedContent] = useState<LibraryContent | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const { toast } = useToast();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/library/categories"],
  });

  const { data: categoryContent, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/library/categories", selectedCategory?.id, "content"],
    enabled: !!selectedCategory,
  });

  const copyPixKey = () => {
    navigator.clipboard.writeText("faithinjesuseua@gmail.com");
    toast({
      title: "✅ PIX Copiado!",
      description: "Muito obrigado pelo seu apoio ao ministério.",
    });
  };

  const handleExternalLink = (content: LibraryContent) => {
    setSelectedContent(content);
    setShowDonationModal(true);
  };

  const proceedWithLink = () => {
    if (selectedContent?.externalLink) {
      window.open(selectedContent.externalLink, '_blank');
      toast({
        title: "🔗 Abrindo conteúdo",
        description: "Que este material seja uma bênção para sua vida.",
      });
    }
    setShowDonationModal(false);
    setSelectedContent(null);
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Content detail view
  if (selectedContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-950 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedContent(null)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Badge variant="secondary" className={selectedCategory?.color}>
              {selectedCategory?.name}
            </Badge>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                {selectedContent.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedContent.content}
                </p>
              </div>

              {selectedContent.verse && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border-l-4 border-indigo-500">
                  <p className="text-indigo-800 dark:text-indigo-200 font-medium mb-2">
                    "{selectedContent.verse}"
                  </p>
                  {selectedContent.reference && (
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                      {selectedContent.reference}
                    </p>
                  )}
                </div>
              )}

              {selectedContent.externalLink && (
                <div className="text-center">
                  <Button
                    onClick={() => handleExternalLink(selectedContent)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Acessar Conteúdo Completo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => setSelectedContent(null)}
              variant="outline"
              className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
            >
              Voltar aos Conteúdos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Category content list view
  if (selectedCategory) {
    const IconComponent = iconMap[selectedCategory.icon as keyof typeof iconMap] || BookOpen;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                <IconComponent className="h-6 w-6" />
                {selectedCategory.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedCategory.description}
              </p>
            </div>
          </div>

          {contentLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : !categoryContent || categoryContent.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Em breve teremos conteúdos nesta categoria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryContent.map((content: LibraryContent) => (
                <Card
                  key={content.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                  onClick={() => setSelectedContent(content)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-indigo-800 dark:text-indigo-200">
                        {content.title}
                      </CardTitle>
                      <Badge variant="outline">
                        {content.contentType === "reflection" && "Reflexão"}
                        {content.contentType === "verse" && "Versículo"}
                        {content.contentType === "link" && "Link"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {content.content}
                    </p>
                    {content.verse && (
                      <div className="text-sm text-indigo-600 dark:text-indigo-400 italic">
                        "{content.verse.substring(0, 50)}..."
                      </div>
                    )}
                    {content.externalLink && (
                      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mt-2">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Link externo disponível
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Categories list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8" />
            Mini Biblioteca Cristã
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore conteúdos que fortalecem sua fé e crescimento espiritual
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories?.map((category: LibraryCategory) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || BookOpen;
            
            return (
              <Card
                key={category.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-indigo-300"
                onClick={() => setSelectedCategory(category)}
              >
                <CardHeader className="text-center">
                  <div className={`text-4xl mb-4 ${category.color}`}>
                    <IconComponent className="h-12 w-12 mx-auto" />
                  </div>
                  <CardTitle className="text-xl text-indigo-800 dark:text-indigo-200">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    variant="outline"
                    className="w-full text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                  >
                    Explorar Conteúdos
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="text-indigo-600 border-indigo-300 hover:bg-indigo-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>

      {/* Donation Modal */}
      <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
        <DialogContent className="max-w-md bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto mb-3 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-xl text-gray-800">
              {selectedContent?.title}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Conteúdo cristão gratuito</p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Conteúdo 100% Gratuito</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Este material é disponibilizado gratuitamente para edificação da Igreja.
                Se desejar, pode contribuir para mantermos mais conteúdo disponível.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Gift className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-800 mb-1">Apoie este ministério</h4>
                  <p className="text-xs text-green-700 mb-2">PIX: faithinjesuseua@gmail.com</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={copyPixKey}
                    className="text-xs border-green-200 text-green-700 hover:bg-green-50 h-8"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar PIX
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                onClick={proceedWithLink}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Continuar para o Conteúdo
              </Button>
              <button 
                className="text-xs text-gray-400 hover:text-gray-600 mt-3 block mx-auto"
                onClick={() => {
                  setShowDonationModal(false);
                  setSelectedContent(null);
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}