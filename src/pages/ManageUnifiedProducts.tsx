import React, { useEffect, useState } from "react";
import { Product, ProductFormData, Category, ProductLocation, CompanyInfo, PricingInfo } from "@/types";
import { adminProductService } from "@/lib/services/adminProductService";
import { useCategories } from "@/hooks/useFirebase";

const ManageUnifiedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [filter, setFilter] = useState<'all' | 'brazilian' | 'foreign'>('all');
  const { data: categories } = useCategories();
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    website: '',
    logo: '',
    category: '',
    categoryId: '',
    location: {
      country: '',
      countryCode: '',
      state: '',
      city: '',
      flag: ''
    },
    companyInfo: {
      name: '',
      foundedYear: undefined,
      headquarters: '',
      size: 'startup'
    },
    pricing: {
      type: 'free',
      currency: 'BRL',
      description: ''
    },
    features: [],
    tags: [],
    screenshots: [],
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    alternativeTo: [],
    socialLinks: {}
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const allProducts = await adminProductService.getAllProductsForAdmin();
      setProducts(allProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
    setLoading(false);
  }

  const filteredProducts = products.filter(product => {
    if (filter === 'brazilian') return product.location?.countryCode === 'BR';
    if (filter === 'foreign') return product.location?.countryCode !== 'BR';
    return true;
  });

  function openEdit(product: Product) {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || '',
      website: product.website,
      logo: product.logo,
      category: product.category,
      categoryId: product.categoryId,
      location: product.location || {
        country: '',
        countryCode: '',
        state: '',
        city: '',
        flag: ''
      },
      companyInfo: product.companyInfo || {
        name: '',
        foundedYear: undefined,
        headquarters: '',
        size: 'startup'
      },
      pricing: product.pricing || {
        type: 'free',
        currency: 'BRL',
        description: ''
      },
      features: product.features || [],
      tags: product.tags || [],
      screenshots: product.screenshots || [],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      alternativeTo: product.alternativeTo || [],
      socialLinks: product.socialLinks || {}
    });
    setAddMode(false);
  }

  function openAdd() {
    setEditProduct(null);
    setForm({
      name: '',
      description: '',
      shortDescription: '',
      website: '',
      logo: '',
      category: '',
      categoryId: '',
      location: {
        country: '',
        countryCode: '',
        state: '',
        city: '',
        flag: ''
      },
      companyInfo: {
        name: '',
        foundedYear: undefined,
        headquarters: '',
        size: 'startup'
      },
      pricing: {
        type: 'free',
        currency: 'BRL',
        description: ''
      },
      features: [],
      tags: [],
      screenshots: [],
      isActive: true,
      isFeatured: false,
      metaTitle: '',
      metaDescription: '',
      alternativeTo: [],
      socialLinks: {}
    });
    setAddMode(true);
  }

  function closeEdit() {
    setEditProduct(null);
    setAddMode(false);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (addMode) {
        await adminProductService.createProduct(form);
        alert("Produto criado com sucesso!");
      } else if (editProduct) {
        await adminProductService.updateProduct(editProduct.id, form);
        alert("Produto atualizado com sucesso!");
      }
      
      closeEdit();
      await fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert("Erro ao salvar produto!");
    }
    
    setSaving(false);
  }

  function openConfirm(id: string) {
    setShowConfirm(id);
  }

  function closeConfirm() {
    setShowConfirm(null);
  }

  async function handleDelete(id: string) {
    try {
      await adminProductService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      closeConfirm();
      alert("Produto deletado com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert("Erro ao deletar produto!");
    }
  }

  async function toggleStatus(id: string, isActive: boolean) {
    try {
      await adminProductService.toggleProductStatus(id, isActive);
      setProducts(products.map(p => 
        p.id === id ? { ...p, isActive } : p
      ));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert("Erro ao alterar status!");
    }
  }

  async function toggleFeatured(id: string, isFeatured: boolean) {
    try {
      await adminProductService.toggleProductFeatured(id, isFeatured);
      setProducts(products.map(p => 
        p.id === id ? { ...p, isFeatured } : p
      ));
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
      alert("Erro ao alterar destaque!");
    }
  }

  return (
    <section className="py-10 min-h-screen">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
            <p className="text-muted-foreground">Produtos nacionais e estrangeiros unificados</p>
          </div>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all" 
            onClick={openAdd}
          >
            Adicionar Produto
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            Todos ({products.length})
          </button>
          <button
            onClick={() => setFilter('brazilian')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'brazilian' 
                ? 'bg-green-600 text-white' 
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            🇧🇷 Brasileiros ({products.filter(p => p.location?.countryCode === 'BR').length})
          </button>
          <button
            onClick={() => setFilter('foreign')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'foreign' 
                ? 'bg-blue-600 text-white' 
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            🌍 Estrangeiros ({products.filter(p => p.location?.countryCode !== 'BR').length})
          </button>
        </div>

        {loading ? (
          <div className="text-center">Carregando...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-muted-foreground">Nenhum produto encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Logo</th>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">Categoria</th>
                  <th className="p-3 text-left">Origem</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Destaque</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        {product.logo ? (
                          product.logo.startsWith('http') ? (
                            <img src={product.logo} alt={product.name} className="w-6 h-6 rounded" />
                          ) : (
                            <span className="text-lg">{product.logo}</span>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.companyInfo?.name || product.name}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{product.category || "-"}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{product.location?.flag || (product.location?.countryCode === 'BR' ? '🇧🇷' : '🌍')}</span>
                        <span className="text-sm">{product.location?.country || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleStatus(product.id, !product.isActive)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {product.isActive ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleFeatured(product.id, !product.isFeatured)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.isFeatured 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {product.isFeatured ? '⭐ Destaque' : 'Normal'}
                      </button>
                    </td>
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
          </div>
        )}

        {/* Modal de edição/cadastro unificado */}
        {(editProduct || addMode) && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-xl shadow-card w-full max-w-2xl border border-border max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <h3 className="text-xl font-bold mb-4 text-center">
                  {addMode ? 'Adicionar Produto' : 'Editar Produto'}
                </h3>
                
                {/* Informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome *</label>
                    <input 
                      type="text" 
                      value={form.name} 
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                      className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Website *</label>
                    <input 
                      type="url" 
                      value={form.website} 
                      onChange={e => setForm(f => ({ ...f, website: e.target.value }))} 
                      className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descrição *</label>
                  <textarea 
                    value={form.description} 
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                    className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                    rows={3}
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descrição Curta</label>
                  <input 
                    type="text" 
                    value={form.shortDescription} 
                    onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} 
                    className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria *</label>
                  <select 
                    value={form.categoryId} 
                    onChange={e => {
                      const category = categories?.find(cat => cat.id === e.target.value);
                      setForm(f => ({ 
                        ...f, 
                        categoryId: e.target.value,
                        category: category?.slug || ''
                      }));
                    }} 
                    className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground"
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {categories?.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name || cat.title || cat.slug}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Localização */}
                <div className="border p-4 rounded-xl bg-muted/20">
                  <h4 className="font-medium mb-3">Localização</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">País *</label>
                      <input 
                        type="text" 
                        value={form.location.country} 
                        onChange={e => setForm(f => ({ 
                          ...f, 
                          location: { ...f.location, country: e.target.value }
                        }))} 
                        className="w-full p-2 border border-border rounded-xl bg-background text-foreground" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Código do País *</label>
                      <select
                        value={form.location.countryCode} 
                        onChange={e => setForm(f => ({ 
                          ...f, 
                          location: { ...f.location, countryCode: e.target.value }
                        }))} 
                        className="w-full p-2 border border-border rounded-xl bg-background text-foreground"
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="BR">🇧🇷 Brasil</option>
                        <option value="US">🇺🇸 Estados Unidos</option>
                        <option value="GB">🇬🇧 Reino Unido</option>
                        <option value="CA">🇨🇦 Canadá</option>
                        <option value="DE">🇩🇪 Alemanha</option>
                        <option value="FR">🇫🇷 França</option>
                        <option value="AU">🇦🇺 Austrália</option>
                        <option value="NL">🇳🇱 Holanda</option>
                        <option value="ES">🇪🇸 Espanha</option>
                        <option value="IT">🇮🇹 Itália</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Informações da empresa */}
                <div className="border p-4 rounded-xl bg-muted/20">
                  <h4 className="font-medium mb-3">Informações da Empresa</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                      <input 
                        type="text" 
                        value={form.companyInfo.name} 
                        onChange={e => setForm(f => ({ 
                          ...f, 
                          companyInfo: { ...f.companyInfo, name: e.target.value }
                        }))} 
                        className="w-full p-2 border border-border rounded-xl bg-background text-foreground" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Ano de Fundação</label>
                      <input 
                        type="number" 
                        value={form.companyInfo.foundedYear || ''} 
                        onChange={e => setForm(f => ({ 
                          ...f, 
                          companyInfo: { ...f.companyInfo, foundedYear: e.target.value ? Number(e.target.value) : undefined }
                        }))} 
                        className="w-full p-2 border border-border rounded-xl bg-background text-foreground" 
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium mb-1">Logo (URL ou Emoji)</label>
                  <input 
                    type="text" 
                    value={form.logo} 
                    onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} 
                    className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                    placeholder="https://... ou 🚀"
                  />
                </div>

                {/* Tags e Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags (separadas por vírgula)</label>
                    <input 
                      type="text" 
                      value={form.tags.join(', ')} 
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      }))} 
                      className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Features (separadas por vírgula)</label>
                    <input 
                      type="text" 
                      value={form.features.join(', ')} 
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        features: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      }))} 
                      className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={form.isActive} 
                      onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} 
                    />
                    Produto Ativo
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={form.isFeatured} 
                      onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} 
                    />
                    Produto em Destaque
                  </label>
                </div>

                <div className="flex gap-2 mt-6 justify-end">
                  <button 
                    type="button" 
                    className="px-4 py-2 rounded-xl bg-muted text-foreground" 
                    onClick={closeEdit} 
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl bg-primary text-white font-semibold" 
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
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

export default ManageUnifiedProducts;