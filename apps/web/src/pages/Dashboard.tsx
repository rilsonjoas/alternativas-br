import React, { useEffect, useState } from "react";
import { adminProductService } from "@/lib/services/adminProductService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Globe, Flag, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Stats {
  total: number;
  brazilian: number;
  foreign: number;
  active: number;
  featured: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const productStats = await adminProductService.getProductStats();
        setStats(productStats);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie todos os produtos da plataforma AlternativasBR de forma unificada
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-8">
          <Link to="/dashboard/produtos">
            <Button size="lg" className="gap-2 text-lg px-8 py-6 rounded-xl">
              <Plus className="w-5 h-5" />
              Gerenciar Produtos
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        {loading ? (
          <div className="text-center mb-8">
            <div className="animate-pulse">Carregando estatísticas...</div>
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Produtos
                </CardTitle>
                <BarChart3 className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Produtos cadastrados
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Brasileiros
                </CardTitle>
                <Flag className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.brazilian}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg">🇧🇷</span>
                  <p className="text-xs text-muted-foreground">Produtos nacionais</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Estrangeiros
                </CardTitle>
                <Globe className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.foreign}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg">🌍</span>
                  <p className="text-xs text-muted-foreground">Produtos internacionais</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ativos
                </CardTitle>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Produtos publicados
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Em Destaque
                </CardTitle>
                <Star className="w-4 h-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.featured}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg">⭐</span>
                  <p className="text-xs text-muted-foreground">Produtos destacados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Action Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    Gerenciamento de Produtos
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Interface unificada para gerenciar todos os produtos da plataforma
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Funcionalidades</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Criar novos produtos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Editar produtos existentes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Gerenciar status e destaques
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Filtrar por origem (BR/Internacional)
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Tipos de Produtos</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          🇧🇷 Brasileiros
                        </Badge>
                      </div>
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        {stats?.brazilian || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          🌍 Internacionais
                        </Badge>
                      </div>
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {stats?.foreign || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link to="/dashboard/produtos">
                  <Button size="lg" className="gap-2 text-lg px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-5 h-5" />
                    Acessar Gerenciamento
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
