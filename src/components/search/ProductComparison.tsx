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
import StarRating from '@/components/ui/star-rating';
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
    { key: 'rating', label: 'Avaliação', icon: '⭐' },
    { key: 'reviewCount', label: 'Número de Avaliações', icon: '👥' },
    { key: 'category', label: 'Categoria', icon: '📁' },
    { key: 'pricing', label: 'Modelo de Preço', icon: '💰' },
    { key: 'foundedYear', label: 'Ano de Fundação', icon: '📅' },
    { key: 'userCount', label: 'Usuários', icon: '👤' },
    { key: 'tags', label: 'Características', icon: '🏷️' }
  ];

  const renderFeatureValue = (product: Product, featureKey: string) => {
    const value = product[featureKey as keyof Product];

    switch (featureKey) {
      case 'rating':
        return (
          <div className="flex items-center space-x-2">
            <StarRating rating={value as number || 0} size="sm" />
            <span className="text-sm font-medium">{(value as number || 0).toFixed(1)}</span>
          </div>
        );
      
      case 'reviewCount':
        return (
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{(value as number) || 0} avaliações</span>
          </div>
        );

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
    if (featureKey === 'rating') {
      return Math.max(...products.map(p => p.rating || 0));
    }
    if (featureKey === 'reviewCount') {
      return Math.max(...products.map(p => p.reviewCount || 0));
    }
    return null;
  };

  const isBestValue = (product: Product, featureKey: string) => {
    const bestValue = getBestValue(featureKey);
    if (bestValue === null) return false;
    
    const productValue = product[featureKey as keyof Product] as number;
    return productValue === bestValue && bestValue > 0;
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

          {/* Resumo da comparação */}
          <div className="p-4 bg-white/50 border-t border-green-100">
            <h4 className="font-medium text-green-800 mb-3 flex items-center">
              📊 Resumo da Comparação
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => {
                const score = (product.rating || 0) * 20; // Score de 0-100
                const pros = [];
                const cons = [];

                if ((product.rating || 0) >= 4.5) pros.push('Muito bem avaliado');
                if ((product.reviewCount || 0) > 100) pros.push('Muitas avaliações');
                if (product.pricing?.[0]?.price === 'Grátis' || product.pricing?.[0]?.price === 'Free') pros.push('Gratuito');
                if (product.tags?.includes('Open Source')) pros.push('Open Source');

                if ((product.rating || 0) < 3) cons.push('Avaliação baixa');
                if ((product.reviewCount || 0) < 10) cons.push('Poucas avaliações');

                return (
                  <Card key={product.id} className="border border-green-200">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm truncate">{product.name}</h5>
                        <Badge 
                          variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {score.toFixed(0)}%
                        </Badge>
                      </div>
                      
                      {pros.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-green-700 font-medium mb-1">Pontos fortes:</div>
                          {pros.slice(0, 2).map((pro, index) => (
                            <div key={index} className="flex items-center text-xs text-green-600">
                              <Check className="w-3 h-3 mr-1" />
                              {pro}
                            </div>
                          ))}
                        </div>
                      )}

                      {cons.length > 0 && (
                        <div>
                          <div className="text-xs text-orange-700 font-medium mb-1">Atenção:</div>
                          {cons.slice(0, 1).map((con, index) => (
                            <div key={index} className="flex items-center text-xs text-orange-600">
                              <Minus className="w-3 h-3 mr-1" />
                              {con}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Dicas da comparação */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-t border-green-100">
            <h4 className="font-medium text-green-800 mb-2 flex items-center">
              💡 Dicas para Escolher
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <h5 className="font-medium text-green-700 mb-1">🎯 Para Iniciantes:</h5>
                <p className="text-muted-foreground">
                  Priorize produtos com boa avaliação, muitas reviews e modelo freemium.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-blue-700 mb-1">🚀 Para Empresas:</h5>
                <p className="text-muted-foreground">
                  Considere produtos com planos enterprise e muitos usuários ativos.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-purple-700 mb-1">🔧 Para Desenvolvedores:</h5>
                <p className="text-muted-foreground">
                  Busque produtos com API, integrações e tags como "Open Source".
                </p>
              </div>
              <div>
                <h5 className="font-medium text-orange-700 mb-1">💰 Para Orçamento:</h5>
                <p className="text-muted-foreground">
                  Compare preços e funcionalidades gratuitas antes de decidir.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductComparison;
