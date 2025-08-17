import React, { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory } from "@/hooks/useFirebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/lib/services/categoryService";
import { Category } from "@/types";

const emptyForm: Partial<Category> = {
  name: "",
  slug: "",
  description: "",
  color: "#F59E0B",
  icon: "",
};

const ManageCategories: React.FC = () => {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const [form, setForm] = useState<Partial<Category>>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => await categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  function handleEdit(cat: Category) {
    setForm(cat);
    setEditId(cat.id);
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) return;
    
    try {
      if (editId) {
        await updateCategory.mutateAsync({ id: editId, updates: form });
      } else {
        await createCategory.mutateAsync(form as Omit<Category, "id" | "createdAt" | "updatedAt">);
      }
      setForm(emptyForm);
      setEditId(null);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  }

  return (
    <section className="py-10 min-h-screen">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
            <p className="text-muted-foreground">Organize os produtos em categorias</p>
          </div>
        </div>
        
        {/* Formulário de Categoria */}
        <div className="bg-background p-6 rounded-xl shadow-card border border-border mb-8">
          <h3 className="text-lg font-semibold mb-4">{editId ? 'Editar Categoria' : 'Nova Categoria'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input 
                  type="text" 
                  placeholder="Nome da categoria" 
                  value={form.name || ""} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input 
                  type="text" 
                  placeholder="url-amigavel" 
                  value={form.slug || ""} 
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} 
                  className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea 
                placeholder="Descrição da categoria" 
                value={form.description || ""} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cor (hex)</label>
                <input 
                  type="text" 
                  placeholder="#F59E0B" 
                  value={form.color || ""} 
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))} 
                  className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ícone (emoji ou nome)</label>
                <input 
                  type="text" 
                  placeholder="💻 ou Code" 
                  value={form.icon || ""} 
                  onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} 
                  className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <button 
                type="submit" 
                className="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all" 
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                {createCategory.isPending || updateCategory.isPending ? 'Salvando...' : (editId ? "Salvar Alterações" : "Criar Categoria")}
              </button>
              {editId && (
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-all" 
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Categorias */}
        <div className="bg-background rounded-xl shadow-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Categorias Existentes</h3>
            <p className="text-sm text-muted-foreground">Total: {categories.length} categorias</p>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">Carregando categorias...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhuma categoria encontrada.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left font-medium">Ícone</th>
                    <th className="p-4 text-left font-medium">Nome</th>
                    <th className="p-4 text-left font-medium">Slug</th>
                    <th className="p-4 text-left font-medium">Descrição</th>
                    <th className="p-4 text-left font-medium">Produtos</th>
                    <th className="p-4 text-left font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map(category => (
                    <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: category.color || '#F59E0B' }}>
                          <span className="text-sm">{category.icon || '📁'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{category.name}</div>
                      </td>
                      <td className="p-4">
                        <code className="px-2 py-1 bg-muted rounded text-sm">{category.slug}</code>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {category.description || 'Sem descrição'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {category.productCount || 0} produtos
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            className="text-primary hover:text-primary/80 text-sm font-medium" 
                            onClick={() => handleEdit(category)}
                          >
                            Editar
                          </button>
                          <button 
                            className="text-destructive hover:text-destructive/80 text-sm font-medium" 
                            onClick={() => deleteCategory.mutate(category.id)}
                            disabled={deleteCategory.isPending}
                          >
                            {deleteCategory.isPending ? 'Excluindo...' : 'Excluir'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageCategories;