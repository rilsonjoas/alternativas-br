import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  Settings,
  Globe,
  Shield,
  Mail,
  Database,
  Search,
  Bell,
  FileText,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    contactEmail: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    requireEmailVerification: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage: string;
    googleAnalyticsId: string;
    googleSearchConsole: string;
    enableSitemap: boolean;
    enableRobotsTxt: boolean;
  };
  content: {
    welcomeMessage: string;
    termsOfService: string;
    privacyPolicy: string;
    aboutPage: string;
    contactInfo: string;
    enableBlog: boolean;
    enableNews: boolean;
  };
  features: {
    enableReviews: boolean;
    enableComparisons: boolean;
    enableRecommendations: boolean;
    enableUserProfiles: boolean;
    enableSocialLogin: boolean;
    enableNewsletter: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
  };
  moderation: {
    autoModerateReviews: boolean;
    requireReviewApproval: boolean;
    spamFilterEnabled: boolean;
    bannedWords: string[];
    maxReviewLength: number;
    minReviewLength: number;
  };
  performance: {
    cacheEnabled: boolean;
    cacheDuration: number;
    imageOptimization: boolean;
    lazyLoading: boolean;
    compressionEnabled: boolean;
  };
}

const AdminSettings: React.FC = () => {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock data - substituir por service real
  const mockSettings: SystemSettings = {
    general: {
      siteName: 'Alternativas BR',
      siteDescription: 'Descubra as melhores alternativas brasileiras para serviços internacionais',
      siteUrl: 'https://alternativas-br.com',
      contactEmail: 'contato@alternativas-br.com',
      supportEmail: 'suporte@alternativas-br.com',
      maintenanceMode: false,
      allowRegistrations: true,
      requireEmailVerification: true
    },
    seo: {
      metaTitle: 'Alternativas BR - Soluções Brasileiras para Serviços Globais',
      metaDescription: 'Encontre as melhores alternativas brasileiras para PayPal, Stripe, Shopify e muito mais. Compare preços, recursos e avaliações.',
      metaKeywords: 'alternativas brasileiras, fintech brasil, e-commerce brasil, soluções nacionais',
      ogImage: '/images/og-image.jpg',
      googleAnalyticsId: 'G-XXXXXXXXXX',
      googleSearchConsole: 'google-site-verification=XXXXXXXXXX',
      enableSitemap: true,
      enableRobotsTxt: true
    },
    content: {
      welcomeMessage: 'Bem-vindo ao Alternativas BR! Descubra as melhores soluções brasileiras.',
      termsOfService: 'Termos de serviço...',
      privacyPolicy: 'Política de privacidade...',
      aboutPage: 'Sobre o Alternativas BR...',
      contactInfo: 'Entre em contato conosco...',
      enableBlog: true,
      enableNews: true
    },
    features: {
      enableReviews: true,
      enableComparisons: true,
      enableRecommendations: true,
      enableUserProfiles: true,
      enableSocialLogin: true,
      enableNewsletter: true,
      enableNotifications: true,
      enableAnalytics: true
    },
    moderation: {
      autoModerateReviews: true,
      requireReviewApproval: false,
      spamFilterEnabled: true,
      bannedWords: ['spam', 'lixo', 'ruim'],
      maxReviewLength: 2000,
      minReviewLength: 50
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      imageOptimization: true,
      lazyLoading: true,
      compressionEnabled: true
    }
  };

  // Query para buscar configurações
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      // Simular busca no Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockSettings;
    },
    enabled: user?.role === 'admin'
  });

  // Mutation para salvar configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: SystemSettings) => {
      // Simular salvamento no Firebase
      await new Promise(resolve => setTimeout(resolve, 1500));
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setHasUnsavedChanges(false);
      toast({
        title: "Configurações atualizadas",
        description: "As configurações do sistema foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Houve um problema ao salvar as configurações.",
        variant: "destructive",
      });
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  const updateSetting = (section: keyof SystemSettings, key: string, value: string | number | boolean | string[]) => {
    if (settings) {
      const updatedSettings = {
        ...settings,
        [section]: {
          ...settings[section],
          [key]: value
        }
      };
      queryClient.setQueryData(['admin-settings'], updatedSettings);
      setHasUnsavedChanges(true);
    }
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'content', label: 'Conteúdo', icon: FileText },
    { id: 'features', label: 'Recursos', icon: Globe },
    { id: 'moderation', label: 'Moderação', icon: Shield },
    { id: 'performance', label: 'Performance', icon: Database }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="siteName">Nome do Site</Label>
          <Input
            id="siteName"
            value={settings.general.siteName}
            onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="siteUrl">URL do Site</Label>
          <Input
            id="siteUrl"
            value={settings.general.siteUrl}
            onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="siteDescription">Descrição do Site</Label>
        <Textarea
          id="siteDescription"
          value={settings.general.siteDescription}
          onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">E-mail de Contato</Label>
          <Input
            id="contactEmail"
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supportEmail">E-mail de Suporte</Label>
          <Input
            id="supportEmail"
            type="email"
            value={settings.general.supportEmail}
            onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configurações de Acesso</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Modo Manutenção</Label>
            <p className="text-sm text-gray-600">
              Desabilitar o site temporariamente para manutenção
            </p>
          </div>
          <Switch
            checked={settings.general.maintenanceMode}
            onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Permitir Cadastros</Label>
            <p className="text-sm text-gray-600">
              Permitir que novos usuários se cadastrem
            </p>
          </div>
          <Switch
            checked={settings.general.allowRegistrations}
            onCheckedChange={(checked) => updateSetting('general', 'allowRegistrations', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Verificação de E-mail</Label>
            <p className="text-sm text-gray-600">
              Exigir verificação de e-mail para novos usuários
            </p>
          </div>
          <Switch
            checked={settings.general.requireEmailVerification}
            onCheckedChange={(checked) => updateSetting('general', 'requireEmailVerification', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Título Meta</Label>
        <Input
          id="metaTitle"
          value={settings.seo.metaTitle}
          onChange={(e) => updateSetting('seo', 'metaTitle', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Descrição Meta</Label>
        <Textarea
          id="metaDescription"
          value={settings.seo.metaDescription}
          onChange={(e) => updateSetting('seo', 'metaDescription', e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Palavras-chave</Label>
        <Input
          id="metaKeywords"
          value={settings.seo.metaKeywords}
          onChange={(e) => updateSetting('seo', 'metaKeywords', e.target.value)}
          placeholder="palavra1, palavra2, palavra3"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ogImage">Imagem Open Graph</Label>
        <Input
          id="ogImage"
          value={settings.seo.ogImage}
          onChange={(e) => updateSetting('seo', 'ogImage', e.target.value)}
          placeholder="/images/og-image.jpg"
        />
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
          <Input
            id="googleAnalyticsId"
            value={settings.seo.googleAnalyticsId}
            onChange={(e) => updateSetting('seo', 'googleAnalyticsId', e.target.value)}
            placeholder="G-XXXXXXXXXX"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="googleSearchConsole">Google Search Console</Label>
          <Input
            id="googleSearchConsole"
            value={settings.seo.googleSearchConsole}
            onChange={(e) => updateSetting('seo', 'googleSearchConsole', e.target.value)}
            placeholder="google-site-verification=XXXXXXXXXX"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Gerar Sitemap</Label>
            <p className="text-sm text-gray-600">
              Gerar sitemap.xml automaticamente
            </p>
          </div>
          <Switch
            checked={settings.seo.enableSitemap}
            onCheckedChange={(checked) => updateSetting('seo', 'enableSitemap', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Gerar robots.txt</Label>
            <p className="text-sm text-gray-600">
              Gerar robots.txt automaticamente
            </p>
          </div>
          <Switch
            checked={settings.seo.enableRobotsTxt}
            onCheckedChange={(checked) => updateSetting('seo', 'enableRobotsTxt', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderFeatureSettings = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(settings.features).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
            </div>
            <Switch
              checked={value as boolean}
              onCheckedChange={(checked) => updateSetting('features', key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderModerationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Moderação Automática</Label>
            <p className="text-sm text-gray-600">
              Moderar avaliações automaticamente usando filtros
            </p>
          </div>
          <Switch
            checked={settings.moderation.autoModerateReviews}
            onCheckedChange={(checked) => updateSetting('moderation', 'autoModerateReviews', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Aprovação Manual</Label>
            <p className="text-sm text-gray-600">
              Exigir aprovação manual para todas as avaliações
            </p>
          </div>
          <Switch
            checked={settings.moderation.requireReviewApproval}
            onCheckedChange={(checked) => updateSetting('moderation', 'requireReviewApproval', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Filtro de Spam</Label>
            <p className="text-sm text-gray-600">
              Detectar e filtrar conteúdo de spam automaticamente
            </p>
          </div>
          <Switch
            checked={settings.moderation.spamFilterEnabled}
            onCheckedChange={(checked) => updateSetting('moderation', 'spamFilterEnabled', checked)}
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="minReviewLength">Comprimento Mínimo (caracteres)</Label>
          <Input
            id="minReviewLength"
            type="number"
            value={settings.moderation.minReviewLength}
            onChange={(e) => updateSetting('moderation', 'minReviewLength', parseInt(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxReviewLength">Comprimento Máximo (caracteres)</Label>
          <Input
            id="maxReviewLength"
            type="number"
            value={settings.moderation.maxReviewLength}
            onChange={(e) => updateSetting('moderation', 'maxReviewLength', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bannedWords">Palavras Proibidas</Label>
        <Textarea
          id="bannedWords"
          value={settings.moderation.bannedWords.join(', ')}
          onChange={(e) => updateSetting('moderation', 'bannedWords', e.target.value.split(', ').filter(w => w.trim()))}
          placeholder="palavra1, palavra2, palavra3"
          rows={3}
        />
        <p className="text-sm text-gray-600">
          Separe as palavras com vírgula
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'seo':
        return renderSEOSettings();
      case 'features':
        return renderFeatureSettings();
      case 'moderation':
        return renderModerationSettings();
      default:
        return <div>Tab em desenvolvimento...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Painel
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Configurações do Sistema
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie as configurações globais da plataforma
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <Alert className="w-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Você tem alterações não salvas
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleSave}
              disabled={updateSettingsMutation.isPending || !hasUnsavedChanges}
              className="min-w-[120px]"
            >
              {updateSettingsMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {updateSettingsMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const currentTab = tabs.find(tab => tab.id === activeTab);
                    if (currentTab?.icon) {
                      const Icon = currentTab.icon;
                      return <Icon className="w-5 h-5" />;
                    }
                    return null;
                  })()}
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </CardTitle>
                <CardDescription>
                  Configurações relacionadas a {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderTabContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
