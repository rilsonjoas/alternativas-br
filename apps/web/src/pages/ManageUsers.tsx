import React from "react";

const ManageUsers: React.FC = () => {
  return (
    <section className="py-20 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Gerenciar Usuários</h1>
        <div className="max-w-2xl mx-auto text-center text-muted-foreground">
          <p>Visualize e gerencie os usuários cadastrados.</p>
        </div>
        {/* Implemente aqui a tabela/lista de usuários e ações */}
      </div>
    </section>
  );
};

export default ManageUsers;
