
import React, { useEffect, useState } from "react";
import { Category } from "@/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useCategories } from "@/hooks/useFirebase";

interface ForeignProduct {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  slug?: string;
  logo?: string;
  pricingModel?: string;
  substitutes?: string[];
  cons?: string[];
  features?: string[];
  pros?: string[];
  rating?: number;
  screenshots?: string[];
  tags?: string[];
  website?: string;
  isFeatured?: boolean;
  downloads?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ManageForeignProducts: React.FC = () => {
  const [products, setProducts] = useState<ForeignProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<ForeignProduct | null>(null);
  const [addMode, setAddMode] = useState(false);
  const { data: categories } = useCategories();
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
type ForeignProductForm = Omit<Partial<ForeignProduct>, "logo"> & { logo?: string };
const [form, setForm] = useState<ForeignProductForm>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const snap = await getDocs(collection(db, "foreign_products"));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ForeignProduct)));
      setLoading(false);
    }
    fetchProducts();
  }, []);

  function openEdit(product: ForeignProduct) {
    setEditProduct(product);
    setForm(product);
    setAddMode(false);
  }

  function openAdd() {
    setEditProduct(null);
    setForm({});
    setAddMode(true);
  }

  function closeEdit() {
    setEditProduct(null);
    setForm({});
    setAddMode(false);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (addMode) {
      // Adicionar novo produto estrangeiro
      const { addDoc } = await import("firebase/firestore");
      const docRef = await addDoc(collection(db, "foreign_products"), {
        ...form,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setProducts([...products, { id: docRef.id, name: form.name ?? "", ...form }]);
    } else if (editProduct) {
      // Editar produto estrangeiro existente
      await updateDoc(doc(db, "foreign_products", editProduct.id), {
        name: form.name,
        description: form.description,
        category: form.category,
        price: form.price,
        slug: form.slug,
        logo: form.logo,
        pricingModel: form.pricingModel,
        substitutes: form.substitutes,
        cons: form.cons,
        features: form.features,
        pros: form.pros,
        rating: form.rating,
        screenshots: form.screenshots,
        tags: form.tags,
        website: form.website,
        isFeatured: form.isFeatured,
        downloads: form.downloads,
        createdAt: form.createdAt,
        updatedAt: new Date()
      });
      setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...form } : p));
    }
    setSaving(false);
    closeEdit();
  }

  function openConfirm(id: string) {
    setShowConfirm(id);
  }

  function closeConfirm() {
    setShowConfirm(null);
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "foreign_products", id));
    setProducts(products.filter(p => p.id !== id));
    closeConfirm();
  }

  return (
    <section className="py-10 min-h-screen">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-center">Produtos Estrangeiros</h2>
          <button className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all" onClick={openAdd}>
            Adicionar Produto
          </button>
        </div>
        {loading ? (
          <div className="text-center">Carregando...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground">Nenhum produto estrangeiro cadastrado.</div>
        ) : (
          <table className="w-full border rounded-xl overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-left">Categoria</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.description || "-"}</td>
                  <td className="p-3">{product.category || "-"}</td>
                  <td className="p-3 flex gap-2">
                    <button className="text-primary hover:underline" onClick={() => openEdit(product)}>
                      Editar
                    </button>
                    <button className="text-destructive hover:underline" onClick={() => openConfirm(product.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal de edição/cadastro melhorado */}
        {(editProduct || addMode) && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-xl shadow-card w-full max-w-lg border border-border max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSaveEdit} className="space-y-3">
                <h3 className="text-xl font-bold mb-2 text-center">Editar Produto Estrangeiro</h3>
                <input type="text" placeholder="Nome" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" required />
                <input type="text" placeholder="Slug" value={form.slug || ""} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" />
                <input type="text" placeholder="Descrição" value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" />
                {/* Select para categoria */}
                <select value={form.category || ""} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground">
                  <option value="">Selecione a categoria</option>
                  {categories?.map((cat: Category) => (
                    <option key={cat.id} value={cat.slug}>{cat.name || cat.title || cat.slug}</option>
                  ))}
                </select>
                {/* Upload para logo */}
                <div>
                  <label htmlFor="logo-url" className="block mb-1">Logo (URL ou upload)</label>
                  <input id="logo-url" type="text" placeholder="URL da logo ou emoji" value={form.logo || ""} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground mb-2" />
                  <input type="file" accept="image/*" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setForm(f => ({ ...f, logo: typeof reader.result === "string" ? reader.result : "" }));
                      reader.readAsDataURL(file);
                    }
                  }} className="w-full" />
                </div>
                {/* Upload para screenshots */}
                <div>
                  <label htmlFor="screenshots-url" className="block mb-1">Screenshots (URLs ou upload múltiplo)</label>
                  <input id="screenshots-url" type="text" placeholder="URLs separadas por vírgula" value={form.screenshots ? form.screenshots.join(", ") : ""} onChange={e => setForm(f => ({ ...f, screenshots: e.target.value.split(",").map(s => s.trim()) }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground mb-2" />
                  <input type="file" accept="image/*" multiple onChange={async e => {
                    const files = Array.from(e.target.files || []);
                    if (files.length) {
                      const readers = files.map(file => new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                      }));
                      const results = await Promise.all(readers);
                      setForm(f => ({ ...f, screenshots: results }));
                    }
                  }} className="w-full" />
                </div>
                <input type="text" placeholder="Modelo de Preço" value={form.pricingModel || ""} onChange={e => setForm(f => ({ ...f, pricingModel: e.target.value }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" />
                <input type="number" placeholder="Preço" value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" min={0} />
                <input type="number" placeholder="Downloads" value={form.downloads || ""} onChange={e => setForm(f => ({ ...f, downloads: Number(e.target.value) }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" min={0} />
                <input type="number" placeholder="Rating" value={form.rating || ""} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" min={0} max={5} step={0.1} />
                <input type="text" placeholder="Website" value={form.website || ""} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" />
                <input type="text" placeholder="Tags (separadas por vírgula)" value={form.tags ? form.tags.join(", ") : ""} onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(",").map(t => t.trim()) }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" />
                <input type="text" placeholder="Substitutos (separados por vírgula)" value={form.substitutes ? form.substitutes.join(", ") : ""} onChange={e => setForm(f => ({ ...f, substitutes: e.target.value.split(",").map(s => s.trim()) }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" />
                <input type="text" placeholder="Prós (separados por vírgula)" value={form.pros ? form.pros.join(", ") : ""} onChange={e => setForm(f => ({ ...f, pros: e.target.value.split(",").map(s => s.trim()) }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" />
                <input type="text" placeholder="Contras (separados por vírgula)" value={form.cons ? form.cons.join(", ") : ""} onChange={e => setForm(f => ({ ...f, cons: e.target.value.split(",").map(s => s.trim()) }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" />
                <input type="text" placeholder="Features (separadas por vírgula)" value={form.features ? form.features.join(", ") : ""} onChange={e => setForm(f => ({ ...f, features: e.target.value.split(",").map(s => s.trim()) }))} className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" />
                <label className="flex items-center gap-2 mb-3">
                  <input type="checkbox" checked={!!form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                  Destaque
                </label>
                <div className="flex gap-2 mt-4 justify-end">
                  <button type="button" className="px-4 py-2 rounded-xl bg-muted text-foreground" onClick={closeEdit} disabled={saving}>
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white font-semibold" disabled={saving}>
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmação de exclusão */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-xl shadow-card w-full max-w-md border border-border text-center">
              <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
              <p className="mb-6">Tem certeza que deseja excluir este produto? Essa ação não pode ser desfeita.</p>
              <div className="flex gap-2 justify-center">
                <button className="px-4 py-2 rounded-xl bg-muted text-foreground" onClick={closeConfirm}>
                  Cancelar
                </button>
                <button className="px-4 py-2 rounded-xl bg-destructive text-white font-semibold" onClick={() => handleDelete(showConfirm!)}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageForeignProducts;
