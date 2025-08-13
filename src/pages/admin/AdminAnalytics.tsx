import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  Users,
  Search,
  Calendar,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalUsers: number;
    totalSearches: number;
    totalReviews: number;
    viewsChange: number;
    usersChange: number;
    searchesChange: number;
    reviewsChange: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    category: string;
    views: number;
    viewsChange: number;
    rating: number;
    reviewCount: number;
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    productCount: number;
    views: number;
    viewsChange: number;
  }>;
  topSearches: Array<{
    query: string;
    count: number;
    change: number;
  }>;
  userActivity: Array<{
    date: string;
    newUsers: number;
    activeUsers: number;
    pageViews: number;
  }>;
  conversionMetrics: {
    searchToView: number;
    viewToReview: number;
    signupRate: number;
  };
}

const AdminAnalytics: React.FC = () => {
  const { user, loading } = useAuth();
  const [timeRange, setTimeRange] = useState('30days');

  // Mock data - substituir por service real
  const mockAnalytics: AnalyticsData = {
    overview: {
      totalViews: 15420,
      totalUsers: 1284,
      totalSearches: 3267,
      totalReviews: 892,
      viewsChange: 12.5,
      usersChange: 8.3,
      searchesChange: -2.1,
      reviewsChange: 15.7
    },
    topProducts: [
      {
        id: 'hotmart',
        name: 'Hotmart',
        category: 'E-commerce',
        views: 2341,
        viewsChange: 23.5,
        rating: 4.8,
        reviewCount: 156
      },
      {
        id: 'nubank',
        name: 'Nubank',
        category: 'Fintech',
        views: 1987,
        viewsChange: 18.2,
        rating: 4.6,
        reviewCount: 203
      },
      {
        id: 'stone',
        name: 'Stone',
        category: 'Fintech',
        views: 1456,
        viewsChange: -5.3,
        rating: 4.4,
        reviewCount: 89
      }
    ],
    topCategories: [
      {
        id: 'fintech',
        name: 'Fintech',
        productCount: 12,
        views: 5632,
        viewsChange: 15.2
      },
      {
        id: 'ecommerce',
        name: 'E-commerce',
        productCount: 8,
        views: 4321,
        viewsChange: 8.7
      },
      {
        id: 'educacao',
        name: 'Educação',
        productCount: 6,
        views: 3456,
        viewsChange: 22.1
      }
    ],
    topSearches: [
      { query: 'alternativa paypal', count: 234, change: 45.2 },
      { query: 'banco digital brasil', count: 189, change: 12.3 },
      { query: 'plataforma ecommerce', count: 156, change: -8.5 },
      { query: 'gestão financeira', count: 134, change: 28.7 },
      { query: 'marketing digital', count: 112, change: 5.9 }
    ],
    userActivity: [
      { date: '2024-01-01', newUsers: 45, activeUsers: 156, pageViews: 1234 },
      { date: '2024-01-02', newUsers: 52, activeUsers: 189, pageViews: 1456 },
      { date: '2024-01-03', newUsers: 38, activeUsers: 145, pageViews: 1123 }
    ],
    conversionMetrics: {
      searchToView: 68.5,
      viewToReview: 12.3,
      signupRate: 8.7
    }
  };

  // Query para buscar analytics
  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['admin-analytics', timeRange],
    queryFn: async () => {
      // Simular busca no Firebase
      await new Promise(resolve => setTimeout(resolve, 1200));
      return mockAnalytics;
    },
    enabled: user?.role === 'admin'
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

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                Analytics e Relatórios
              </h1>
              <p className="text-gray-600 mt-1">
                Métricas e insights da plataforma
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 dias</SelectItem>
                <SelectItem value="30days">30 dias</SelectItem>
                <SelectItem value="90days">90 dias</SelectItem>
                <SelectItem value="1year">1 ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Visualizações Totais</p>
                  <p className="text-3xl font-bold">{formatNumber(analytics.overview.totalViews)}</p>
                  <div className={`flex items-center mt-2 ${getChangeColor(analytics.overview.viewsChange)}`}>
                    {getChangeIcon(analytics.overview.viewsChange)}
                    <span className="text-sm ml-1">
                      {Math.abs(analytics.overview.viewsChange)}% vs período anterior
                    </span>
                  </div>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                  <p className="text-3xl font-bold">{formatNumber(analytics.overview.totalUsers)}</p>
                  <div className={`flex items-center mt-2 ${getChangeColor(analytics.overview.usersChange)}`}>
                    {getChangeIcon(analytics.overview.usersChange)}
                    <span className="text-sm ml-1">
                      {Math.abs(analytics.overview.usersChange)}% vs período anterior
                    </span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Buscas Realizadas</p>
                  <p className="text-3xl font-bold">{formatNumber(analytics.overview.totalSearches)}</p>
                  <div className={`flex items-center mt-2 ${getChangeColor(analytics.overview.searchesChange)}`}>
                    {getChangeIcon(analytics.overview.searchesChange)}
                    <span className="text-sm ml-1">
                      {Math.abs(analytics.overview.searchesChange)}% vs período anterior
                    </span>
                  </div>
                </div>
                <Search className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avaliações</p>
                  <p className="text-3xl font-bold">{formatNumber(analytics.overview.totalReviews)}</p>
                  <div className={`flex items-center mt-2 ${getChangeColor(analytics.overview.reviewsChange)}`}>
                    {getChangeIcon(analytics.overview.reviewsChange)}
                    <span className="text-sm ml-1">
                      {Math.abs(analytics.overview.reviewsChange)}% vs período anterior
                    </span>
                  </div>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Conversão */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Métricas de Conversão
            </CardTitle>
            <CardDescription>
              Taxas de conversão em diferentes etapas do funil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Busca → Visualização</span>
                  <span className="text-sm text-gray-600">{analytics.conversionMetrics.searchToView}%</span>
                </div>
                <Progress value={analytics.conversionMetrics.searchToView} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Visualização → Avaliação</span>
                  <span className="text-sm text-gray-600">{analytics.conversionMetrics.viewToReview}%</span>
                </div>
                <Progress value={analytics.conversionMetrics.viewToReview} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Taxa de Cadastro</span>
                  <span className="text-sm text-gray-600">{analytics.conversionMetrics.signupRate}%</span>
                </div>
                <Progress value={analytics.conversionMetrics.signupRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Visualizados</CardTitle>
              <CardDescription>
                Produtos com melhor performance no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Variação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topProducts.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {product.category}
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {product.rating} ({product.reviewCount})
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatNumber(product.views)}</span>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center ${getChangeColor(product.viewsChange)}`}>
                          {getChangeIcon(product.viewsChange)}
                          <span className="ml-1">{Math.abs(product.viewsChange)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Categorias */}
          <Card>
            <CardHeader>
              <CardTitle>Categorias Mais Populares</CardTitle>
              <CardDescription>
                Categorias com maior engajamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Variação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topCategories.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category.productCount} produtos
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatNumber(category.views)}</span>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center ${getChangeColor(category.viewsChange)}`}>
                          {getChangeIcon(category.viewsChange)}
                          <span className="ml-1">{Math.abs(category.viewsChange)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Buscas Mais Populares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Termos de Busca Mais Populares
            </CardTitle>
            <CardDescription>
              Palavras-chave mais buscadas pelos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.topSearches.map((search, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                    <div className={`flex items-center ${getChangeColor(search.change)}`}>
                      {getChangeIcon(search.change)}
                      <span className="text-sm ml-1">{Math.abs(search.change)}%</span>
                    </div>
                  </div>
                  <p className="font-medium mb-1">"{search.query}"</p>
                  <p className="text-sm text-gray-600">{search.count} buscas</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
