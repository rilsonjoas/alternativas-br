import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  Shield,
  Plus,
  FileText,
  Star,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, loading } = useAuth();

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

  const adminStats = [
    { title: 'Total de Produtos', value: '156', icon: Package, trend: '+12%' },
    { title: 'Categorias Ativas', value: '24', icon: FolderOpen, trend: '+2' },
    { title: 'Usuários Registrados', value: '1.2k', icon: Users, trend: '+8%' },
    { title: 'Avaliações', value: '890', icon: Star, trend: '+15%' },
  ];

  const quickActions = [
    {
      title: 'Adicionar Produto',
      description: 'Cadastrar nova alternativa brasileira',
      icon: Plus,
      href: '/admin/produtos/novo',
      color: 'bg-green-500'
    },
    {
      title: 'Gerenciar Categorias',
      description: 'Criar e editar categorias',
      icon: FolderOpen,
      href: '/admin/categorias',
      color: 'bg-blue-500'
    },
    {
      title: 'Moderar Avaliações',
      description: 'Revisar e aprovar reviews',
      icon: FileText,
      href: '/admin/avaliacoes',
      color: 'bg-orange-500'
    },
    {
      title: 'Gerenciar Usuários',
      description: 'Administrar usuários e permissões',
      icon: Users,
      href: '/admin/usuarios',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'Relatórios e métricas da plataforma',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-cyan-500'
    },
    {
      title: 'Configurações',
      description: 'Configurações do sistema',
      icon: Settings,
      href: '/admin/configuracoes',
      color: 'bg-gray-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {user.displayName || user.email}
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Administrador
          </Badge>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.trend} desde o mês passado
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Seções de Gerenciamento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Produtos mais visitados</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/analytics">Ver Relatório</Link>
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Dados detalhados de visualizações, buscas e interações dos usuários.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Configurações gerais</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/configuracoes">Configurar</Link>
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Gerencie configurações da plataforma, SEO e integrações.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
