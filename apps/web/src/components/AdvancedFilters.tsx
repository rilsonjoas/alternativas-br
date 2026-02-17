import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  DollarSign,
  Calendar,
  Leaf,
  Shield,
  Zap
} from 'lucide-react';
import { ProductTag, TAG_CATEGORIES } from '@/types/tags';

export interface FilterOptions {
  search: string;
  categories: string[];
  tags: string[];
  countries: string[];
  pricing: string[];
  rating: {
    min: number;
    max: number;
  };
  yearFounded: {
    min?: number;
    max?: number;
  };
  features: string[];
  certifications: string[];
  sustainability: string[];
  sortBy: 'name' | 'rating' | 'reviews' | 'newest' | 'popular';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: Array<{ id: string; name: string; count: number }>;
  availableTags: ProductTag[];
  availableCountries: Array<{ code: string; name: string; flag: string; count: number }>;
  className?: string;
}

const PRICING_OPTIONS = [
  { id: 'free', label: 'Gratuito', icon: '🆓' },
  { id: 'freemium', label: 'Freemium', icon: '🎁' },
  { id: 'paid', label: 'Pago', icon: '💰' },
  { id: 'enterprise', label: 'Enterprise', icon: '🏢' },
];

const SUSTAINABILITY_OPTIONS = [
  { id: 'carbon-neutral', label: 'Carbono Neutro', icon: '🌱' },
  { id: 'renewable-energy', label: 'Energia Renovável', icon: '⚡' },
  { id: 'b-corp', label: 'B Corp', icon: '🏆' },
  { id: 'social-impact', label: 'Impacto Social', icon: '🤝' },
];

const CERTIFICATION_OPTIONS = [
  { id: 'lgpd', label: 'LGPD', icon: '🛡️' },
  { id: 'iso27001', label: 'ISO 27001', icon: '📋' },
  { id: 'pci', label: 'PCI DSS', icon: '💳' },
  { id: 'soc2', label: 'SOC 2', icon: '🔒' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Nome A-Z' },
  { value: 'rating', label: 'Melhor Avaliada' },
  { value: 'reviews', label: 'Mais Avaliada' },
  { value: 'newest', label: 'Mais Recente' },
  { value: 'popular', label: 'Mais Popular' },
];

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  availableCountries,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    origin: false,
    sustainability: false,
    compliance: false,
    advanced: false
  });

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      categories: [],
      tags: [],
      countries: [],
      pricing: [],
      rating: { min: 0, max: 5 },
      yearFounded: {},
      features: [],
      certifications: [],
      sustainability: [],
      sortBy: 'popular',
      sortOrder: 'desc'
    });
  };

  const getActiveFiltersCount = () => {
    return [
      filters.categories.length,
      filters.tags.length,
      filters.countries.length,
      filters.pricing.length,
      filters.features.length,
      filters.certifications.length,
      filters.sustainability.length,
      filters.search ? 1 : 0,
      filters.rating.min > 0 || filters.rating.max < 5 ? 1 : 0,
      filters.yearFounded.min || filters.yearFounded.max ? 1 : 0
    ].reduce((sum, count) => sum + count, 0);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Busca e Ordenação - sempre visível */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Nome, descrição, tags..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sort">Ordenar por</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value as FilterOptions['sortBy'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isExpanded && (
          <>
            <Separator />
            
            {/* Categorias */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Categorias</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableCategories.map(category => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilters({ categories: [...filters.categories, category.id] });
                        } else {
                          updateFilters({ categories: filters.categories.filter(c => c !== category.id) });
                        }
                      }}
                    />
                    <span className="text-sm flex items-center justify-between w-full">
                      {category.name}
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Origem */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('origin')}
                className="flex items-center justify-between w-full text-sm font-medium hover:text-blue-600"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Origem
                </span>
                {expandedSections.origin ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.origin && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-6">
                  {availableCountries.map(country => (
                    <label key={country.code} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.countries.includes(country.code)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ countries: [...filters.countries, country.code] });
                          } else {
                            updateFilters({ countries: filters.countries.filter(c => c !== country.code) });
                          }
                        }}
                      />
                      <span className="text-sm flex items-center gap-1">
                        {country.flag} {country.name}
                        <Badge variant="outline" className="text-xs ml-auto">
                          {country.count}
                        </Badge>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Preços */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Modelo de Preços
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {PRICING_OPTIONS.map(option => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={filters.pricing.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilters({ pricing: [...filters.pricing, option.id] });
                        } else {
                          updateFilters({ pricing: filters.pricing.filter(p => p !== option.id) });
                        }
                      }}
                    />
                    <span className="text-sm flex items-center gap-1">
                      {option.icon} {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sustentabilidade */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('sustainability')}
                className="flex items-center justify-between w-full text-sm font-medium hover:text-green-600"
              >
                <span className="flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Sustentabilidade
                </span>
                {expandedSections.sustainability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.sustainability && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                  {SUSTAINABILITY_OPTIONS.map(option => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.sustainability.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ sustainability: [...filters.sustainability, option.id] });
                          } else {
                            updateFilters({ sustainability: filters.sustainability.filter(s => s !== option.id) });
                          }
                        }}
                      />
                      <span className="text-sm flex items-center gap-1">
                        {option.icon} {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Conformidade */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('compliance')}
                className="flex items-center justify-between w-full text-sm font-medium hover:text-orange-600"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Conformidade
                </span>
                {expandedSections.compliance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.compliance && (
                <div className="grid grid-cols-2 gap-2 ml-6">
                  {CERTIFICATION_OPTIONS.map(option => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.certifications.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ certifications: [...filters.certifications, option.id] });
                          } else {
                            updateFilters({ certifications: filters.certifications.filter(c => c !== option.id) });
                          }
                        }}
                      />
                      <span className="text-sm flex items-center gap-1">
                        {option.icon} {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Avançado */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('advanced')}
                className="flex items-center justify-between w-full text-sm font-medium hover:text-purple-600"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Filtros Avançados
                </span>
                {expandedSections.advanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.advanced && (
                <div className="space-y-4 ml-6">
                  {/* Rating */}
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      Avaliação Mínima
                    </Label>
                    <Select 
                      value={filters.rating.min.toString()} 
                      onValueChange={(value) => updateFilters({ 
                        rating: { ...filters.rating, min: parseInt(value) } 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5].map(rating => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating === 0 ? 'Qualquer' : `${rating}+ estrelas`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ano de Fundação */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Fundada após
                      </Label>
                      <Input
                        type="number"
                        placeholder="2000"
                        value={filters.yearFounded.min || ''}
                        onChange={(e) => updateFilters({
                          yearFounded: { 
                            ...filters.yearFounded, 
                            min: e.target.value ? parseInt(e.target.value) : undefined 
                          }
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Fundada antes</Label>
                      <Input
                        type="number"
                        placeholder="2024"
                        value={filters.yearFounded.max || ''}
                        onChange={(e) => updateFilters({
                          yearFounded: { 
                            ...filters.yearFounded, 
                            max: e.target.value ? parseInt(e.target.value) : undefined 
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
