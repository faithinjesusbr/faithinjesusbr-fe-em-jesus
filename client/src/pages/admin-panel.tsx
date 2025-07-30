import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BookOpen, 
  Video, 
  ShoppingBag, 
  Award, 
  LogOut, 
  Plus,
  Users,
  Settings,
  Upload,
  Save
} from 'lucide-react';
import Header from '@/components/header';
import { useToast } from '@/hooks/use-toast';

interface AdminData {
  ebooks: any[];
  videos: any[];
  products: any[];
  certificates: any[];
  sponsors: any[];
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [adminData, setAdminData] = useState<AdminData>({
    ebooks: [],
    videos: [],
    products: [],
    certificates: [],
    sponsors: []
  });
  const { toast } = useToast();

  // Form states
  const [ebookForm, setEbookForm] = useState({ title: '', author: '', description: '', url: '' });
  const [videoForm, setVideoForm] = useState({ title: '', description: '', url: '', category: '' });
  const [productForm, setProductForm] = useState({ name: '', price: '', description: '', category: '' });
  const [certificateForm, setCertificateForm] = useState({ recipientName: '', type: '', description: '' });
  const [sponsorForm, setSponsorForm] = useState({ name: '', description: '', logoUrl: '', instagram: '', website: '' });

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    const loginTime = localStorage.getItem('admin_login_time');
    
    if (!isAuthenticated || !loginTime) {
      setLocation('/admin');
      return;
    }

    // Check if session expired (24 hours)
    const now = Date.now();
    const sessionAge = now - parseInt(loginTime);
    if (sessionAge > 24 * 60 * 60 * 1000) {
      handleLogout();
      return;
    }

    // Load existing data
    const savedData = localStorage.getItem('admin_data');
    if (savedData) {
      setAdminData(JSON.parse(savedData));
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    setLocation('/admin');
  };

  const saveData = (newData: AdminData) => {
    localStorage.setItem('admin_data', JSON.stringify(newData));
    setAdminData(newData);
  };

  const handleAddEbook = () => {
    if (!ebookForm.title || !ebookForm.author) {
      toast({
        title: "Erro",
        description: "Título e autor são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newEbook = {
      id: Date.now().toString(),
      ...ebookForm,
      createdAt: new Date().toISOString()
    };

    const newData = {
      ...adminData,
      ebooks: [...adminData.ebooks, newEbook]
    };

    saveData(newData);
    setEbookForm({ title: '', author: '', description: '', url: '' });
    setActiveModal(null);
    
    toast({
      title: "E-book adicionado",
      description: "E-book cadastrado com sucesso",
    });
  };

  const handleAddVideo = () => {
    if (!videoForm.title || !videoForm.url) {
      toast({
        title: "Erro",
        description: "Título e URL são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newVideo = {
      id: Date.now().toString(),
      ...videoForm,
      createdAt: new Date().toISOString()
    };

    const newData = {
      ...adminData,
      videos: [...adminData.videos, newVideo]
    };

    saveData(newData);
    setVideoForm({ title: '', description: '', url: '', category: '' });
    setActiveModal(null);
    
    toast({
      title: "Vídeo adicionado",
      description: "Vídeo cadastrado com sucesso",
    });
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price) {
      toast({
        title: "Erro",
        description: "Nome e preço são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      ...productForm,
      createdAt: new Date().toISOString()
    };

    const newData = {
      ...adminData,
      products: [...adminData.products, newProduct]
    };

    saveData(newData);
    setProductForm({ name: '', price: '', description: '', category: '' });
    setActiveModal(null);
    
    toast({
      title: "Produto adicionado",
      description: "Produto cadastrado com sucesso",
    });
  };

  const handleAddSponsor = () => {
    if (!sponsorForm.name || !sponsorForm.description) {
      toast({
        title: "Erro",
        description: "Nome e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newSponsor = {
      id: Date.now().toString(),
      ...sponsorForm,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const newData = {
      ...adminData,
      sponsors: [...adminData.sponsors, newSponsor]
    };

    saveData(newData);
    setSponsorForm({ name: '', description: '', logoUrl: '', instagram: '', website: '' });
    setActiveModal(null);
    
    toast({
      title: "Patrocinador adicionado",
      description: "Patrocinador cadastrado com sucesso",
    });
  };

  const handleGenerateCertificate = () => {
    if (!certificateForm.recipientName || !certificateForm.type) {
      toast({
        title: "Erro",
        description: "Nome e tipo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newCertificate = {
      id: Date.now().toString(),
      ...certificateForm,
      generatedAt: new Date().toISOString()
    };

    const newData = {
      ...adminData,
      certificates: [...adminData.certificates, newCertificate]
    };

    saveData(newData);
    setCertificateForm({ recipientName: '', type: '', description: '' });
    setActiveModal(null);
    
    toast({
      title: "Certificado gerado",
      description: "Certificado criado com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-600">Gerencie o conteúdo do aplicativo</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">E-books</p>
                  <p className="text-2xl font-bold text-gray-900">{adminData.ebooks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Video className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Vídeos</p>
                  <p className="text-2xl font-bold text-gray-900">{adminData.videos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Produtos</p>
                  <p className="text-2xl font-bold text-gray-900">{adminData.products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Patrocinadores</p>
                  <p className="text-2xl font-bold text-gray-900">{adminData.sponsors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Certificados</p>
                  <p className="text-2xl font-bold text-gray-900">{adminData.certificates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Dialog open={activeModal === 'ebook'} onOpenChange={(open) => setActiveModal(open ? 'ebook' : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-2">Enviar E-book</h3>
                  <p className="text-sm text-gray-600">Adicionar novo livro digital</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar E-book</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ebook-title">Título</Label>
                  <Input
                    id="ebook-title"
                    value={ebookForm.title}
                    onChange={(e) => setEbookForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título do e-book"
                  />
                </div>
                <div>
                  <Label htmlFor="ebook-author">Autor</Label>
                  <Input
                    id="ebook-author"
                    value={ebookForm.author}
                    onChange={(e) => setEbookForm(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Nome do autor"
                  />
                </div>
                <div>
                  <Label htmlFor="ebook-description">Descrição</Label>
                  <Textarea
                    id="ebook-description"
                    value={ebookForm.description}
                    onChange={(e) => setEbookForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Breve descrição do conteúdo"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="ebook-url">URL do arquivo</Label>
                  <Input
                    id="ebook-url"
                    value={ebookForm.url}
                    onChange={(e) => setEbookForm(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="Link para download do e-book"
                  />
                </div>
                <Button onClick={handleAddEbook} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar E-book
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={activeModal === 'video'} onOpenChange={(open) => setActiveModal(open ? 'video' : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
                <CardContent className="p-6 text-center">
                  <Video className="h-12 w-12 text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-2">Adicionar Vídeo</h3>
                  <p className="text-sm text-gray-600">Novo conteúdo em vídeo</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Vídeo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-title">Título</Label>
                  <Input
                    id="video-title"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título do vídeo"
                  />
                </div>
                <div>
                  <Label htmlFor="video-url">URL do vídeo</Label>
                  <Input
                    id="video-url"
                    value={videoForm.url}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="Link do YouTube ou outro"
                  />
                </div>
                <div>
                  <Label htmlFor="video-category">Categoria</Label>
                  <Input
                    id="video-category"
                    value={videoForm.category}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: Devocional, Louvor, Testemunho"
                  />
                </div>
                <div>
                  <Label htmlFor="video-description">Descrição</Label>
                  <Textarea
                    id="video-description"
                    value={videoForm.description}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do vídeo"
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddVideo} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Vídeo
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={activeModal === 'product'} onOpenChange={(open) => setActiveModal(open ? 'product' : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-2">Cadastrar Produto</h3>
                  <p className="text-sm text-gray-600">Item para a loja virtual</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Produto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-name">Nome do produto</Label>
                  <Input
                    id="product-name"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do produto"
                  />
                </div>
                <div>
                  <Label htmlFor="product-price">Preço</Label>
                  <Input
                    id="product-price"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Ex: R$ 29,90"
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">Categoria</Label>
                  <Input
                    id="product-category"
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: Livros, Acessórios, Decoração"
                  />
                </div>
                <div>
                  <Label htmlFor="product-description">Descrição</Label>
                  <Textarea
                    id="product-description"
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição detalhada do produto"
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddProduct} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Produto
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={activeModal === 'sponsor'} onOpenChange={(open) => setActiveModal(open ? 'sponsor' : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-2">Adicionar Patrocinador</h3>
                  <p className="text-sm text-gray-600">Novo parceiro do ministério</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Patrocinador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sponsor-name">Nome</Label>
                  <Input
                    id="sponsor-name"
                    value={sponsorForm.name}
                    onChange={(e) => setSponsorForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do patrocinador"
                  />
                </div>
                <div>
                  <Label htmlFor="sponsor-description">Descrição</Label>
                  <Textarea
                    id="sponsor-description"
                    value={sponsorForm.description}
                    onChange={(e) => setSponsorForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do patrocinador"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="sponsor-logo">URL da Logo</Label>
                  <Input
                    id="sponsor-logo"
                    value={sponsorForm.logoUrl}
                    onChange={(e) => setSponsorForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="Link da imagem da logo"
                  />
                </div>
                <div>
                  <Label htmlFor="sponsor-instagram">Instagram</Label>
                  <Input
                    id="sponsor-instagram"
                    value={sponsorForm.instagram}
                    onChange={(e) => setSponsorForm(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="Link do Instagram"
                  />
                </div>
                <div>
                  <Label htmlFor="sponsor-website">Website</Label>
                  <Input
                    id="sponsor-website"
                    value={sponsorForm.website}
                    onChange={(e) => setSponsorForm(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="Site oficial"
                  />
                </div>
                <Button onClick={handleAddSponsor} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Patrocinador
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={activeModal === 'certificate'} onOpenChange={(open) => setActiveModal(open ? 'certificate' : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-2">Gerar Certificado</h3>
                  <p className="text-sm text-gray-600">Certificado personalizado</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerar Certificado</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cert-name">Nome do destinatário</Label>
                  <Input
                    id="cert-name"
                    value={certificateForm.recipientName}
                    onChange={(e) => setCertificateForm(prev => ({ ...prev, recipientName: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="cert-type">Tipo de certificado</Label>
                  <Input
                    id="cert-type"
                    value={certificateForm.type}
                    onChange={(e) => setCertificateForm(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="Ex: Participação, Conclusão, Reconhecimento"
                  />
                </div>
                <div>
                  <Label htmlFor="cert-description">Descrição</Label>
                  <Textarea
                    id="cert-description"
                    value={certificateForm.description}
                    onChange={(e) => setCertificateForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Motivo ou descrição do certificado"
                    rows={3}
                  />
                </div>
                <Button onClick={handleGenerateCertificate} className="w-full">
                  <Award className="h-4 w-4 mr-2" />
                  Gerar Certificado
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}