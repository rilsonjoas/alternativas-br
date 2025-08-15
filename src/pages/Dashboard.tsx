import React from "react";

const Dashboard: React.FC = () => {
  return (
    <section className="py-20 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Dashboard de Gerenciamento
        </h1>
        <div className="max-w-2xl mx-auto text-center text-muted-foreground mb-8">
          <p>Bem-vindo ao painel de administração!<br />
            Gerencie produtos, categorias e usuários do sistema.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <a href="/dashboard/produtos" className="block p-8 rounded-xl shadow-card bg-background hover:bg-muted transition-all border border-border text-center">
            <span className="text-2xl font-bold mb-2 block">Produtos Nacionais</span>
            <span className="text-muted-foreground">Gerencie os produtos brasileiros</span>
          </a>
          <a href="/dashboard/foreign-products" className="block p-8 rounded-xl shadow-card bg-background hover:bg-muted transition-all border border-border text-center">
            <span className="text-2xl font-bold mb-2 block">Produtos Estrangeiros</span>
            <span className="text-muted-foreground">Gerencie os produtos estrangeiros</span>
          </a>
          <a href="/dashboard/categorias" className="block p-8 rounded-xl shadow-card bg-background hover:bg-muted transition-all border border-border text-center">
            <span className="text-2xl font-bold mb-2 block">Categorias</span>
            <span className="text-muted-foreground">Gerencie as categorias do sistema</span>
          </a>
          <a href="/dashboard/usuarios" className="block p-8 rounded-xl shadow-card bg-background hover:bg-muted transition-all border border-border text-center">
            <span className="text-2xl font-bold mb-2 block">Usuários</span>
            <span className="text-muted-foreground">Visualize e gerencie os usuários</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
