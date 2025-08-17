import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  X,
  Star,
  ExternalLink,
  Check,
  Minus,
  AlertCircle,
  Info,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react';
import { Product } from '@/types';
import { ProductTags } from './ProductTags';

interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onClose: () => void;
  className?: string;
}

interface ComparisonRow {
  category: string;
  icon: React.ReactNode;
  key: string;
  renderValue: (product: Product) => React.ReactNode;
  important?: boolean;
}

const formatCurrency = (value: number | undefined, currency = 'BRL') => {
  if (!value) return 'Não informado';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(value);
};

const renderPricing = (product: Product) => {
  const pricingPlans = product.pricing;
  if (!pricingPlans || pricingPlans.length === 0) {
    return <span className="text-gray-500">Não informado</span>;
  }
  
  return (
    <div className="space-y-1">
      {pricingPlans.map((plan, index) => (
        <div key={plan.id || index} className="text-sm">
          <span className="font-medium">{plan.name}</span>
          {plan.price && (
            <span className="block text-green-600">{plan.price}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const renderFeatures = (features: string[]) => (
  <div className="space-y-1 max-h-32 overflow-y-auto">
    {features.slice(0, 5).map((feature, index) => (
      <div key={index} className="flex items-center gap-2 text-sm">
        <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
        <span>{feature}</span>
      </div>
    ))}
    {features.length > 5 && (
      <div className="text-xs text-gray-500">
        +{features.length - 5} recursos adicionais
      </div>
    )}
  </div>
);

const renderCompanyInfo = (product: Product) => (
  <div className="space-y-1 text-sm">
    {product.name && <div className="font-medium">{product.name}</div>}
    <div className="flex items-center gap-1 text-gray-500">
      <Calendar className="w-3 h-3" />
      Fundada em {product.foundedYear || 'Não informado'}
    </div>
    <div className="flex items-center gap-1 text-gray-500">
      <MapPin className="w-3 h-3" />
      {product.location || 'Não informado'}
    </div>
  </div>
);

const renderTechnicalSpecs = (product: Product) => {
  // Como Product não tem technicalSpecs, vamos retornar informações básicas
  return (
    <div className="space-y-1 text-sm">
      <div className="flex items-center justify-between">
        <span>Website:</span>
        <a href={product.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs">
          Visitar
        </a>
      </div>
      <div className="flex items-center justify-between">
        <span>Categoria:</span>
        <span className="text-xs">{product.category}</span>
      </div>
    </div>
  );
};

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onRemoveProduct,
  onClose,
  className = ""
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['basic']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const comparisonRows: ComparisonRow[] = [
    {
      category: 'Informações Básicas',
      icon: <Info className="w-4 h-4" />, 
      key: 'basic',
      renderValue: () => null, // Header only
      important: true
    },
    {
      category: '',
      icon: null,
      key: 'rating',
      renderValue: () => null, // Corrigido: renderValue obrigatório
    },
    {
      category: '',
      icon: null,
      key: 'views',
      renderValue: (product) => (
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-blue-500" />
          <span className="text-sm">{(product.views || 0).toLocaleString()} visualizações</span>
        </div>
      )
    },
    {
      category: '',
      icon: null,
      key: 'tags',
      renderValue: (product) => (
        <div className="flex flex-wrap gap-1">
          {(product.tags || []).slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    {
      category: 'Preços',
      icon: <DollarSign className="w-4 h-4" />,
      key: 'pricing',
      renderValue: () => null,
      important: true
    },
    {
      category: '',
      icon: null,
      key: 'pricing-details',
      renderValue: renderPricing
    },
    {
      category: 'Recursos',
      icon: <Zap className="w-4 h-4" />,
      key: 'features',
      renderValue: () => null,
      important: true
    },
    {
      category: '',
      icon: null,
      key: 'features-list',
      renderValue: (product) => renderFeatures(product.features || [])
    },
    {
      category: 'Empresa',
      icon: <Users className="w-4 h-4" />,
      key: 'company',
      renderValue: () => null,
      important: true
    },
    {
      category: '',
      icon: null,
      key: 'company-info',
      renderValue: renderCompanyInfo
    },
    {
      category: 'Especificações Técnicas',
      icon: <Shield className="w-4 h-4" />,
      key: 'technical',
      renderValue: () => null,
      important: true
    },
    {
      category: '',
      icon: null,
      key: 'technical-specs',
      renderValue: renderTechnicalSpecs
    }
  ];

  if (products.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto selecionado para comparação
          </h3>
          <p className="text-gray-500">
            Adicione produtos para ver uma comparação detalhada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Comparação de Produtos
            <Badge variant="secondary">{products.length}</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Característica</TableHead>
                {products.map(product => (
                  <TableHead key={product.id} className="min-w-64">
                    <div className="space-y-3">
                      {/* Header do produto */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={product.logo} alt={product.name} />
                            <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveProduct(product.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Ações */}
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <a href={product.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Visitar
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <a href={`/produto/${product.slug}`}>
                            Ver Detalhes
                          </a>
                        </Button>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {comparisonRows.map(row => {
                const isCategory = row.important;
                const isExpanded = expandedCategories.includes(row.key);
                
                if (isCategory) {
                  return (
                    <TableRow key={row.key} className="bg-gray-50">
                      <TableCell className="font-medium">
                        <button
                          onClick={() => toggleCategory(row.key)}
                          className="flex items-center gap-2 w-full text-left hover:text-blue-600"
                        >
                          {row.icon}
                          {row.category}
                        </button>
                      </TableCell>
                      {products.map(product => (
                        <TableCell key={product.id}>
                          {/* Categoria header - vazia */}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                }
                
                // Só mostra linhas de dados se a categoria estiver expandida
                const categoryKey = comparisonRows
                  .slice(0, comparisonRows.findIndex(r => r.key === row.key))
                  .reverse()
                  .find(r => r.important)?.key;
                
                if (categoryKey && !expandedCategories.includes(categoryKey)) {
                  return null;
                }

                return (
                  <TableRow key={row.key}>
                    <TableCell className="font-medium text-sm text-gray-600">
                      {/* Nome da característica específica pode ser adicionado aqui */}
                    </TableCell>
                    {products.map(product => (
                      <TableCell key={product.id} className="align-top">
                        {row.renderValue(product)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Resumo da comparação */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Resumo da Comparação</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          
            <div>
              <span className="font-medium">Mais recursos:</span>{' '}
              {products.reduce((best, current) => 
                (current.features || []).length > (best.features || []).length ? current : best
              )?.name}
            </div>
            <div>
              <span className="font-medium">Mais popular:</span>{' '}
              {products.reduce((best, current) => 
                (current.views || 0) > (best.views || 0) ? current : best
              ).name}
            </div>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductComparison;
