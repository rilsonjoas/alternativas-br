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
    if (editId) {
      await updateCategory.mutateAsync({ id: editId, updates: form });
    } else {
      await createCategory.mutateAsync(form as Omit<Category, "id" | "createdAt" | "updatedAt">);
    }
    setForm(emptyForm);
    setEditId(null);
  }

  return (
    <section className="py-10 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Gerenciar Categorias</h2>
        <form onSubmit={handleSubmit} className="mb-8 space-y-3 max-w-lg">
          <input type="text" placeholder="Nome" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full p-2 border rounded-xl" required />
          <input type="text" placeholder="Slug" value={form.slug || ""} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full p-2 border rounded-xl" required />
          <input type="text" placeholder="Descrição" value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full p-2 border rounded-xl" />
          <input type="text" placeholder="Cor (hex)" value={form.color || ""} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full p-2 border rounded-xl" />
          <input type="text" placeholder="Ícone" value={form.icon || ""} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="w-full p-2 border rounded-xl" />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white font-semibold" disabled={createCategory.isPending || updateCategory.isPending}>
              {editId ? "Salvar edição" : "Adicionar"}
            </button>
            {editId && (
              <button type="button" className="px-4 py-2 rounded-xl bg-muted" onClick={handleCancel}>Cancelar</button>
            )}
          </div>
        </form>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div>Carregando...</div>
          ) : (
            <table className="w-full border rounded-xl">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">Slug</th>
                  <th className="p-3 text-left">Descrição</th>
                  <th className="p-3 text-left">Cor</th>
                  <th className="p-3 text-left">Ícone</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat: Category) => (
                  <tr key={cat.id} className="border-b">
                    <td className="p-3">{cat.name}</td>
                    <td className="p-3">{cat.slug}</td>
                    <td className="p-3">{cat.description}</td>
                    <td className="p-3"><span style={{ background: cat.color, padding: "2px 8px", borderRadius: "6px", color: "#fff" }}>{cat.color}</span></td>
                    <td className="p-3">{cat.icon}</td>
                    <td className="p-3 flex gap-2">
                      <button className="text-primary hover:underline" onClick={() => handleEdit(cat)}>Editar</button>
                      <button className="text-destructive hover:underline" onClick={() => deleteCategory.mutate(cat.id)} disabled={deleteCategory.isPending}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageCategories;
