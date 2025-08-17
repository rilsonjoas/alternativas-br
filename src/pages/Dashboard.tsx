import React, { useEffect, useState } from "react";
import { adminProductService } from "@/lib/services/adminProductService";

interface Stats {
  total: number;
  brazilian: number;
  foreign: number;
  active: number;
  featured: number;
  byCategory: { [key: string]: number };
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
    <section className="py-10 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Dashboard de Gerenciamento
        </h1>
        <div className="max-w-2xl mx-auto text-center text-muted-foreground mb-8">
          <p>Bem-vindo ao painel de administração unificado!<br />
            Gerencie produtos nacionais e estrangeiros, categorias e usuários.
          </p>
        </div>

        {/* Estatísticas */}
        {loading ? (
          <div className="text-center mb-8">Carregando estatísticas...</div>
        ) : stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-background p-4 rounded-xl shadow-card border border-border text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total de Produtos</div>
            </div>
            
            <div className="bg-background p-4 rounded-xl shadow-card border border-border text-center">
              <div className="text-2xl font-bold text-green-600">{stats.brazilian}</div>
              <div className="text-sm text-muted-foreground">🇧🇷 Brasileiros</div>
            </div>
            
            <div className="bg-background p-4 rounded-xl shadow-card border border-border text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.foreign}</div>
              <div className="text-sm text-muted-foreground">🌍 Estrangeiros</div>
            </div>
            
            <div className="bg-background p-4 rounded-xl shadow-card border border-border text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Ativos</div>
            </div>
            
            <div className="bg-background p-4 rounded-xl shadow-card border border-border text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.featured}</div>
              <div className="text-sm text-muted-foreground">Em Destaque</div>
            </div>
          </div>
        )}

        {/* Menu de navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <a href="/dashboard/produtos" className="block p-8 rounded-xl shadow-card bg-background hover:bg-muted transition-all border border-border text-center group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💻</div>
            <span className="text-xl font-bold mb-2 block">Produtos</span>
            <span className="text-muted-foreground">Gerencie produtos nacionais e estrangeiros</span>
          </a>
          
          <a href="/dashboard/categorias" className="block p-8 rounded-xl shadow-card bg-background hover:bg-muted transition-all border border-border text-center group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
            <span className="text-xl font-bold mb-2 block">Categorias</span>
            <span className="text-muted-foreground">Gerencie as categorias do sistema</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
