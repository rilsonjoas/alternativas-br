import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProductTag, ProductLocation, ProductCertification, TagCategory } from '@/types/tags';
import { 
  Shield, 
  Leaf, 
  Zap, 
  MapPin, 
  Award, 
  Globe, 
  CheckCircle,
  Info
} from 'lucide-react';

interface ProductTagsProps {
  tags: ProductTag[];
  location: ProductLocation;
  certifications?: ProductCertification[];
  className?: string;
  maxVisible?: number;
  showTooltips?: boolean;
}

interface TagBadgeProps {
  tag: ProductTag;
  showTooltip?: boolean;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, showTooltip = true }) => {
  const badgeContent = (
    <Badge 
      variant="outline" 
      className={`${tag.color || tag.category.color} border-0 font-medium text-xs flex items-center gap-1`}
    >
      {tag.icon && <span className="text-xs">{tag.icon}</span>}
      {tag.label}
      {tag.isVerified && <CheckCircle className="w-3 h-3 ml-1" />}
    </Badge>
  );

  if (!showTooltip || !tag.category.description) {
    return badgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{tag.category.name}</p>
            <p className="text-xs text-gray-600">{tag.category.description}</p>
            {tag.isVerified && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verificado pela equipe
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const LocationBadge: React.FC<{ location: ProductLocation }> = ({ location }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {location.flag || '🌍'} {location.country}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1">
            <p className="font-semibold text-sm">Localização</p>
            <p className="text-xs">
              {location.city && `${location.city}, `}
              {location.state && `${location.state}, `}
              {location.country}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const CertificationBadge: React.FC<{ certification: ProductCertification }> = ({ certification }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <Award className="w-3 h-3" />
            {certification.icon && <span className="text-xs">{certification.icon}</span>}
            {certification.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{certification.name}</p>
            <p className="text-xs text-gray-600">{certification.description}</p>
            <p className="text-xs text-gray-500">Emitido por: {certification.issuer}</p>
            {certification.validUntil && (
              <p className="text-xs text-gray-500">
                Válido até: {certification.validUntil.toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ProductTags: React.FC<ProductTagsProps> = ({ 
  tags, 
  location, 
  certifications = [], 
  className = "",
  maxVisible = 8,
  showTooltips = true 
}) => {
  const visibleTags = tags.slice(0, maxVisible);
  const hiddenTagsCount = Math.max(0, tags.length - maxVisible);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Localização sempre primeiro */}
      <LocationBadge location={location} />
      
      {/* Tags de sustentabilidade em destaque */}
      {visibleTags
        .filter(tag => tag.category.id === 'sustainability')
        .map(tag => (
          <TagBadge key={tag.id} tag={tag} showTooltip={showTooltips} />
        ))}
      
      {/* Outras tags */}
      {visibleTags
        .filter(tag => tag.category.id !== 'sustainability')
        .map(tag => (
          <TagBadge key={tag.id} tag={tag} showTooltip={showTooltips} />
        ))}
      
      {/* Certificações */}
      {certifications.slice(0, 2).map(cert => (
        <CertificationBadge key={cert.id} certification={cert} />
      ))}
      
      {/* Indicador de tags ocultas */}
      {hiddenTagsCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 cursor-help">
                +{hiddenTagsCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">
                {hiddenTagsCount} tag{hiddenTagsCount > 1 ? 's' : ''} adicional{hiddenTagsCount > 1 ? 'is' : ''}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

// Componente para filtros de tags
export interface TagFilterProps {
  availableTags: ProductTag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  className?: string;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTags,
  onTagToggle,
  className = ""
}) => {
  const tagsByCategory = availableTags.reduce((acc, tag) => {
    const categoryId = tag.category.id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: tag.category,
        tags: []
      };
    }
    acc[categoryId].tags.push(tag);
    return acc;
  }, {} as Record<string, { category: TagCategory; tags: ProductTag[] }>);

  return (
    <div className={`space-y-4 ${className}`}>
      {Object.values(tagsByCategory).map(({ category, tags }) => (
        <div key={category.id} className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
            {category.icon && <span>{category.icon}</span>}
            {category.name}
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => onTagToggle(tag.id)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tag.icon && <span className="mr-1">{tag.icon}</span>}
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductTags;
