import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/ui/star-rating';
import { useAuth } from '@/hooks/useAuth';
import { reviewService } from '@/lib/services/reviewService';
import { CreateReviewData } from '@/types/review';

interface WriteReviewFormProps {
  productId: string;
  productName: string;
  onReviewSubmitted: () => void;
  className?: string;
}

const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  productId,
  productName,
  onReviewSubmitted,
  className
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    pros: [] as string[],
    cons: [] as string[]
  });
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Faça login para avaliar este produto
          </p>
          <Button variant="outline">
            Fazer Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      alert('Por favor, selecione uma classificação');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Por favor, preencha o título e o comentário');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: CreateReviewData = {
        productId,
        rating: formData.rating,
        title: formData.title.trim(),
        content: formData.content.trim(),
        pros: formData.pros,
        cons: formData.cons
      };

      await reviewService.createReview(
        user.id,
        user.displayName || 'Usuário',
        reviewData
      );

      // Reset form
      setFormData({
        rating: 0,
        title: '',
        content: '',
        pros: [],
        cons: []
      });

      onReviewSubmitted();
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPro = () => {
    if (newPro.trim() && !formData.pros.includes(newPro.trim())) {
      setFormData(prev => ({
        ...prev,
        pros: [...prev.pros, newPro.trim()]
      }));
      setNewPro('');
    }
  };

  const addCon = () => {
    if (newCon.trim() && !formData.cons.includes(newCon.trim())) {
      setFormData(prev => ({
        ...prev,
        cons: [...prev.cons, newCon.trim()]
      }));
      setNewCon('');
    }
  };

  const removePro = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pros: prev.pros.filter((_, i) => i !== index)
    }));
  };

  const removeCon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cons: prev.cons.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className={className}>
      <CardHeader className="bg-gradient-to-r from-green-50 via-yellow-50 to-blue-50 border-b border-green-200">
        <CardTitle className="flex items-center text-foreground">
          ✍️ Avaliar {productName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Classificação *</Label>
            <div className="flex items-center space-x-2">
              <StarRating
                rating={formData.rating}
                interactive
                onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                size="lg"
              />
              <span className="text-sm text-muted-foreground ml-2">
                {formData.rating > 0 && `${formData.rating} estrela${formData.rating > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título da avaliação *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Excelente alternativa brasileira!"
              maxLength={100}
            />
          </div>

          {/* Comentário */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Seu comentário *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Compartilhe sua experiência com este produto brasileiro..."
              rows={4}
              maxLength={1000}
            />
            <div className="text-right text-xs text-muted-foreground">
              {formData.content.length}/1000 caracteres
            </div>
          </div>

          {/* Pontos Positivos */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-green-700">
              Pontos Positivos 👍
            </Label>
            <div className="flex space-x-2">
              <Input
                value={newPro}
                onChange={(e) => setNewPro(e.target.value)}
                placeholder="Ex: Interface intuitiva"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
              />
              <Button type="button" onClick={addPro} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.pros.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.pros.map((pro, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {pro}
                    <button
                      type="button"
                      onClick={() => removePro(index)}
                      className="ml-1 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Pontos Negativos */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-red-700">
              Pontos Negativos 👎
            </Label>
            <div className="flex space-x-2">
              <Input
                value={newCon}
                onChange={(e) => setNewCon(e.target.value)}
                placeholder="Ex: Poderia ter mais integrações"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
              />
              <Button type="button" onClick={addCon} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.cons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.cons.map((con, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                    {con}
                    <button
                      type="button"
                      onClick={() => removeCon(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Botão de envio */}
          <div className="pt-4 border-t">
            <Button 
              type="submit" 
              disabled={isSubmitting || formData.rating === 0}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isSubmitting ? 'Enviando...' : 'Publicar Avaliação 🇧🇷'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WriteReviewForm;
