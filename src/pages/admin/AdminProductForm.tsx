import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { adminProductService, ProductFormData } from '@/lib/services/adminProductService';
import { adminCategoryService } from '@/lib/services/adminCategoryService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Save,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const AdminProductForm: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    website: '',
    logoUrl: '',
    category: '',
    categoryId: '',
    pricing: {
      type: 'freemium',
      currency: 'BRL',
      description: ''
    },
    features: [''],
    tags: [''],
    isActive: true,
    isFeatured: false,
    alternativeTo: [''],
    targetAudience: [''],
    companyInfo: {
      name: '',
      headquarters: 'Brasil',
      website: ''
    },
    socialLinks: {}
  });

  // Query para buscar produto (se editando)
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => adminProductService.getProductById(id!),
    enabled: isEditing && Boolean(id) && user?.role === 'admin'
  });

  // Query para buscar categorias
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-for-form'],
    queryFn: () => adminCategoryService.getAllCategoriesForAdmin(),
    enabled: user?.role === 'admin'
  });

  // Carregar dados do produto se editando
  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        website: product.website,
        logoUrl: product.logo || '',
        category: product.category,
        categoryId: product.categoryId || '',
        pricing: {
          type: product.pricing?.[0]?.name?.toLowerCase().includes('grátis') ? 'free' :
                product.pricing?.[0]?.name?.toLowerCase().includes('freemium') ? 'freemium' :
                product.pricing?.[0]?.name?.toLowerCase().includes('enterprise') ? 'enterprise' : 'paid',
          startingPrice: undefined,
          currency: 'BRL',
          description: product.pricing?.[0]?.description || ''
        },
        features: product.features || [''],
        tags: product.tags || [''],
        isActive: product.isActive !== false,
        isFeatured: product.isFeatured || false,
        alternativeTo: product.alternatives || [''],
        targetAudience: [''],
        companyInfo: {
          name: '',
          headquarters: product.location || 'Brasil',
          foundedYear: product.foundedYear ? parseInt(product.foundedYear) : undefined,
          website: product.website
        },
        socialLinks: {}
      });
    }
  }, [product, isEditing]);

  // Mutation para criar produto
  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => adminProductService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Produto criado!",
        description: "O novo produto foi criado com sucesso.",
      });
      navigate('/admin/produtos');
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar produto",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation para atualizar produto
  const updateMutation = useMutation({
    mutationFn: (data: Partial<ProductFormData>) =>
      adminProductService.updateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
      toast({
        title: "Produto atualizado!",
        description: "O produto foi atualizado com sucesso.",
      });
      navigate('/admin/produtos');
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (loading || (isEditing && isLoadingProduct)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name || !formData.categoryId) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e categoria são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Limpar arrays vazios
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      tags: formData.tags.filter(t => t.trim()),
      alternativeTo: formData.alternativeTo?.filter(a => a.trim()),
      targetAudience: formData.targetAudience?.filter(t => t.trim())
    };

    if (isEditing) {
      updateMutation.mutate(cleanedData);
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  const addArrayItem = (field: keyof Pick<ProductFormData, 'features' | 'tags' | 'alternativeTo' | 'targetAudience'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (field: keyof Pick<ProductFormData, 'features' | 'tags' | 'alternativeTo' | 'targetAudience'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: keyof Pick<ProductFormData, 'features' | 'tags' | 'alternativeTo' | 'targetAudience'>, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => i === index ? value : item)
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    setFormData(prev => ({
      ...prev,
      categoryId,
      category: category?.name || ''
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/produtos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Produtos
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Atualize as informações do produto' : 'Preencha os dados para criar um novo produto'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Dados fundamentais do produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descrição Curta</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Resumo em uma linha do que o produto faz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Completa</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Descrição detalhada do produto, suas funcionalidades e diferenciais"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://exemplo.com.br"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">URL do Logo</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funcionalidades */}
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades</CardTitle>
              <CardDescription>
                Liste as principais funcionalidades do produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateArrayItem('features', index, e.target.value)}
                      placeholder="Funcionalidade do produto"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('features', index)}
                      disabled={formData.features.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('features')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Funcionalidade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Palavras-chave que descrevem o produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                      placeholder="Tag ou palavra-chave"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('tags', index)}
                      disabled={formData.tags.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('tags')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Tag
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preço */}
          <Card>
            <CardHeader>
              <CardTitle>Modelo de Preços</CardTitle>
              <CardDescription>
                Informações sobre o modelo de negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pricingType">Tipo de Preço</Label>
                <Select 
                  value={formData.pricing.type} 
                  onValueChange={(value: 'free' | 'freemium' | 'paid' | 'enterprise') => 
                    setFormData(prev => ({ ...prev, pricing: { ...prev.pricing, type: value } }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuito</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.pricing.type !== 'free' && (
                <div className="space-y-2">
                  <Label htmlFor="startingPrice">Preço Inicial (R$)</Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    value={formData.pricing.startingPrice || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      pricing: { ...prev.pricing, startingPrice: Number(e.target.value) }
                    }))}
                    placeholder="99.90"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="pricingDescription">Descrição do Preço</Label>
                <Textarea
                  id="pricingDescription"
                  value={formData.pricing.description}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    pricing: { ...prev.pricing, description: e.target.value }
                  }))}
                  rows={2}
                  placeholder="Detalhes sobre o modelo de preços"
                />
              </div>
            </CardContent>
          </Card>

          {/* Empresa */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Dados sobre a empresa desenvolvedora
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={formData.companyInfo.name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      companyInfo: { ...prev.companyInfo, name: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Ano de Fundação</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={formData.companyInfo.foundedYear || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      companyInfo: { ...prev.companyInfo, foundedYear: Number(e.target.value) }
                    }))}
                    placeholder="2020"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headquarters">Sede</Label>
                <Input
                  id="headquarters"
                  value={formData.companyInfo.headquarters}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    companyInfo: { ...prev.companyInfo, headquarters: e.target.value }
                  }))}
                  placeholder="São Paulo, SP"
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Configurações de visibilidade e destaque
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Produto Ativo</Label>
                  <p className="text-sm text-gray-500">
                    Produto visível para os usuários
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isFeatured">Produto em Destaque</Label>
                  <p className="text-sm text-gray-500">
                    Aparece na seção de destaques
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/produtos')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Atualizar Produto' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
