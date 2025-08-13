import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  Eye,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  positivePoints: string[];
  negativePoints: string[];
  status: 'pending' | 'approved' | 'rejected';
  moderationReason?: string;
  createdAt: Date;
  moderatedAt?: Date;
  moderatedBy?: string;
  reportCount: number;
  helpfulVotes: number;
}

const AdminReviews: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [moderationReason, setModerationReason] = useState<string>('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Mock data - substituir por service real
  const mockReviews: Review[] = [
    {
      id: '1',
      productId: 'hotmart',
      productName: 'Hotmart',
      userId: 'user1',
      userName: 'João Silva',
      userEmail: 'joao@email.com',
      rating: 5,
      title: 'Excelente plataforma brasileira!',
      comment: 'Uso há 2 anos e é realmente muito boa. Interface intuitiva e suporte excelente.',
      positivePoints: ['Interface moderna', 'Suporte rápido', 'Recursos avançados'],
      negativePoints: ['Preço um pouco alto'],
      status: 'pending',
      createdAt: new Date('2024-01-15'),
      reportCount: 0,
      helpfulVotes: 12
    },
    {
      id: '2',
      productId: 'nubank',
      productName: 'Nubank',
      userId: 'user2',
      userName: 'Maria Santos',
      userEmail: 'maria@email.com',
      rating: 2,
      title: 'Experiência ruim',
      comment: 'Tive vários problemas com o app e o atendimento foi péssimo. Não recomendo.',
      positivePoints: [],
      negativePoints: ['App lento', 'Atendimento ruim', 'Muitos bugs'],
      status: 'pending',
      createdAt: new Date('2024-01-14'),
      reportCount: 3,
      helpfulVotes: 1
    }
  ];

  // Query para buscar avaliações
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews', selectedStatus, selectedProduct],
    queryFn: async () => {
      // Simular busca no Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredReviews = mockReviews;
      
      if (selectedStatus !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.status === selectedStatus);
      }
      
      if (selectedProduct !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.productId === selectedProduct);
      }
      
      return filteredReviews;
    },
    enabled: user?.role === 'admin'
  });

  // Mutation para moderar avaliação
  const moderateMutation = useMutation({
    mutationFn: async ({ reviewId, status, reason }: { 
      reviewId: string; 
      status: 'approved' | 'rejected'; 
      reason?: string 
    }) => {
      // Simular moderação
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Moderando avaliação:', { reviewId, status, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast({
        title: "Avaliação moderada!",
        description: "A decisão foi salva com sucesso.",
      });
      setModerationReason('');
      setSelectedReview(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao moderar",
        description: error.message,
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

  const handleModeration = (reviewId: string, status: 'approved' | 'rejected') => {
    moderateMutation.mutate({ 
      reviewId, 
      status, 
      reason: moderationReason || undefined 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aprovada</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejeitada</Badge>;
      default:
        return null;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const pendingCount = mockReviews.filter(r => r.status === 'pending').length;
  const reportedCount = mockReviews.filter(r => r.reportCount > 0).length;

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
                Moderar Avaliações
              </h1>
              <p className="text-gray-600 mt-1">
                {reviews.length} avaliações encontradas
              </p>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {pendingCount > 0 && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{pendingCount} avaliações</strong> aguardando moderação. 
              {reportedCount > 0 && (
                <> <strong>{reportedCount} avaliações</strong> foram reportadas por usuários.</>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="approved">Aprovadas</SelectItem>
                    <SelectItem value="rejected">Rejeitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Produto</label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os produtos</SelectItem>
                    <SelectItem value="hotmart">Hotmart</SelectItem>
                    <SelectItem value="nubank">Nubank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aprovadas</p>
                  <p className="text-2xl font-bold text-green-600">24</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejeitadas</p>
                  <p className="text-2xl font-bold text-red-600">3</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reportadas</p>
                  <p className="text-2xl font-bold text-orange-600">{reportedCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Avaliações */}
        <Card>
          <CardHeader>
            <CardTitle>Avaliações para Moderação</CardTitle>
            <CardDescription>
              Revise e modere as avaliações dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma avaliação encontrada com os filtros selecionados.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            {getRatingStars(review.rating)}
                          </div>
                          <span className="font-medium">{review.rating}/5</span>
                          {getStatusBadge(review.status)}
                          {review.reportCount > 0 && (
                            <Badge variant="outline" className="text-orange-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {review.reportCount} reports
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <strong>Produto:</strong> {review.productName}
                          </div>
                          <div>
                            <strong>Usuário:</strong> {review.userName} ({review.userEmail})
                          </div>
                          <div>
                            <strong>Data:</strong> {review.createdAt.toLocaleDateString()}
                          </div>
                          <div>
                            <strong>Votos úteis:</strong> {review.helpfulVotes}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          
                          {review.positivePoints.length > 0 && (
                            <div className="mb-2">
                              <strong className="text-green-600">Pontos positivos:</strong>
                              <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                                {review.positivePoints.map((point, index) => (
                                  <li key={index}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {review.negativePoints.length > 0 && (
                            <div>
                              <strong className="text-red-600">Pontos negativos:</strong>
                              <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                                {review.negativePoints.map((point, index) => (
                                  <li key={index}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {review.status === 'pending' && (
                          <div className="space-y-3">
                            <Textarea
                              placeholder="Motivo da moderação (opcional)"
                              value={moderationReason}
                              onChange={(e) => setModerationReason(e.target.value)}
                              rows={2}
                            />
                            
                            <div className="flex gap-3">
                              <Button
                                size="sm"
                                onClick={() => handleModeration(review.id, 'approved')}
                                disabled={moderateMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Aprovar
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleModeration(review.id, 'rejected')}
                                disabled={moderateMutation.isPending}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeitar
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                              >
                                <Link to={`/produto/${review.productId}`} target="_blank">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Produto
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReviews;
