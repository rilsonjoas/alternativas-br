import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Star, 
  Users, 
  Calendar, 
  ExternalLink,
  Check,
  Minus,
  ArrowRight,
  Scale,
  Shield,
  Zap
} from 'lucide-react';
import { Product } from '@/types';

interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onClose: () => void;
  className?: string;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onRemoveProduct,
  onClose,
  className
}) => {
  if (products.length === 0) {
    return null;
  }

  const comparisonFeatures = [
    // Removido: rating, reviewCount
    { key: 'category', label: 'Categoria', icon: '📁' },
    { key: 'pricing', label: 'Modelo de Preço', icon: '💰' },
    { key: 'foundedYear', label: 'Ano de Fundação', icon: '📅' },
    { key: 'userCount', label: 'Usuários', icon: '👤' },
    { key: 'tags', label: 'Características', icon: '🏷️' }
  ];

  const renderFeatureValue = (product: Product, featureKey: string) => {
    const value = product[featureKey as keyof Product];

    switch (featureKey) {
      // Removido: rating, reviewCount

      case 'pricing': {
        const pricingLabels = {
          'free': 'Gratuito',
          'freemium': 'Freemium',
          'paid': 'Pago',
          'enterprise': 'Enterprise'
        };
        return (
          <Badge variant="secondary">
            {pricingLabels[value as keyof typeof pricingLabels] || (value as string) || 'N/A'}
          </Badge>
        );
      }

      case 'tags': {
        const tags = (value as string[]) || [];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        );
      }

      case 'userCount':
        return (
          <div className="flex items-center space-x-1">
            <span>{value ? `${value}+` : 'N/A'}</span>
          </div>
        );

      case 'foundedYear':
        return (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{(value as string) || 'N/A'}</span>
          </div>
        );

      default:
        return <span>{(value as string) || 'N/A'}</span>;
    }
  };

  const getBestValue = (featureKey: string) => {
    // Não há mais destaque de melhor valor
    return null;
  };

  const isBestValue = (product: Product, featureKey: string) => {
    // Não há mais destaque de melhor valor
    return false;
  };

  return (
    <div className={className}>
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 via-yellow-50 to-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Scale className="w-6 h-6 mr-2 text-green-600" />
              Comparação de Produtos 🇧🇷
              <Badge variant="outline" className="ml-3 bg-white">
                {products.length} produto{products.length > 1 ? 's' : ''}
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-white/50">
                  <th className="p-4 text-left font-medium w-48">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-600" />
                      Características
                    </div>
                  </th>
                  {products.map((product) => (
                    <th key={product.id} className="p-4 text-center min-w-[280px]">
                      <div className="space-y-3">
                        {/* Header do produto */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-xl">
                              {product.logo || '📦'}
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-green-800 text-sm truncate max-w-[150px]">
                                {product.name}
                              </h3>
                              <Badge variant="outline" className="text-xs mt-1">
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveProduct(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Descrição breve */}
                        <p className="text-xs text-muted-foreground text-left line-clamp-2">
                          {product.description}
                        </p>

                        {/* CTA */}
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" asChild>
                          <Link to={`/produto/${product.slug}`}>
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Ver Detalhes
                          </Link>
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={feature.key} className={index % 2 === 0 ? 'bg-white/30' : 'bg-white/10'}>
                    <td className="p-4 font-medium border-r border-green-100">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{feature.icon}</span>
                        <span className="text-sm">{feature.label}</span>
                      </div>
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center border-r border-green-100">
                        <div className="flex items-center justify-center min-h-[40px]">
                          <div className={`flex items-center space-x-2 ${
                            isBestValue(product, feature.key) 
                              ? 'bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium' 
                              : ''
                          }`}>
                            {isBestValue(product, feature.key) && (
                              <Zap className="w-4 h-4 text-green-600" />
                            )}
                            {renderFeatureValue(product, feature.key)}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumo removido: não há mais score, pros ou cons */}

          {/* Dicas removidas: não mencionar avaliações/reviews */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductComparison;
