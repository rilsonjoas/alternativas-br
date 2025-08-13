import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Trash2, 
  Save,
  AlertTriangle,
  Camera,
  Key
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserSettings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Available categories (em um projeto real, viria da API)
  const availableCategories = [
    "Desenvolvimento", "Design", "Marketing", "Produtividade",
    "Comunicação", "Análise de Dados", "Segurança", "E-commerce"
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email);
      setNotifications(user.preferences?.notifications ?? true);
      setSelectedCategories(user.preferences?.categories || []);
      setIsLoading(false);
    }
  }, [user, loading, navigate]);

  const getUserInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Aqui você salvaria as configurações no Firebase
      // Simulando delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas!",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    // Implementar confirmação e exclusão de conta
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de conta estará disponível em breve.",
      variant: "destructive",
    });
  };

  if (loading || isLoading) {
    return (
      <>
        <SEO 
          title="Configurações"
          description="Gerencie suas configurações no Alternativas BR"
        />
        
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-2xl mx-auto">
                <div className="animate-pulse space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO 
        title="Configurações da Conta"
        description="Gerencie suas configurações e preferências no Alternativas BR"
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto space-y-8">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
                <p className="text-muted-foreground mt-2">
                  Gerencie suas informações pessoais e preferências
                </p>
              </div>

              {/* Perfil */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    Informações do Perfil
                  </CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-green-500 to-blue-500 text-white">
                        {getUserInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" disabled>
                        <Camera className="w-4 h-4 mr-2" />
                        Alterar foto
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Em breve: Upload de imagem personalizada
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Form */}
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Nome completo</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        O email não pode ser alterado por questões de segurança
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferências */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-primary" />
                    Preferências
                  </CardTitle>
                  <CardDescription>
                    Configure suas preferências de categorias e notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Notificações */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Notificações por email</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba atualizações sobre novos produtos e funcionalidades
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>

                  <Separator />

                  {/* Categorias de Interesse */}
                  <div className="space-y-3">
                    <Label>Categorias de interesse</Label>
                    <p className="text-sm text-muted-foreground">
                      Selecione as categorias que mais interessam você
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {availableCategories.map((category) => (
                        <div
                          key={category}
                          className={`
                            p-3 border rounded-lg cursor-pointer transition-all
                            ${selectedCategories.includes(category)
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                          onClick={() => handleCategoryToggle(category)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{category}</span>
                            {selectedCategories.includes(category) && (
                              <Badge variant="secondary" className="text-xs">
                                ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Segurança */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Segurança
                  </CardTitle>
                  <CardDescription>
                    Gerencie a segurança da sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Alterar senha</p>
                      <p className="text-xs text-muted-foreground">
                        Mantenha sua conta segura com uma senha forte
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      <Key className="w-4 h-4 mr-2" />
                      Em breve
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Autenticação de dois fatores</p>
                      <p className="text-xs text-muted-foreground">
                        Adicione uma camada extra de segurança
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      <Shield className="w-4 h-4 mr-2" />
                      Em breve
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Zona de Perigo */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-destructive">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Zona de Perigo
                  </CardTitle>
                  <CardDescription>
                    Ações irreversíveis da conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Excluir conta:</strong> Esta ação é irreversível. 
                      Todos os seus dados serão permanentemente removidos.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="mt-4"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir conta
                  </Button>
                </CardContent>
              </Card>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" onClick={() => navigate("/perfil")}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default UserSettings;
