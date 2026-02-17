import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import { adminProductService } from "@/lib/services/adminProductService";
import { getCountryCode, getCountryFlag, availableCountries } from "@/lib/utils/countryUtils";

// Tipo específico para formulário que aceita strings para números
interface FormCompanyInfo {
  foundedYear?: string | number;
  headquarters: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
}

interface FormProductData {
  name: string;
  description: string;
  website: string;
  logo: string;
  location: {
    country: string;
    state: string;
    city: string;
    flag: string;
  };
  companyInfo: FormCompanyInfo;
  pricing: {
    type: 'free' | 'freemium' | 'paid' | 'enterprise';
    currency: string;
    description: string;
  };
  features: string[];
  tags: string[];
  screenshots: string[];
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  alternativeTo: string[];
  socialLinks: Record<string, string>;
}

const ManageUnifiedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [filter, setFilter] = useState<'all' | 'brazilian' | 'foreign'>('all');
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<FormProductData>({
    name: '',
    description: '',
    website: '',
    logo: '',
    location: {
      country: '',
      state: '',
      city: '',
      flag: ''
    },
    companyInfo: {
      foundedYear: '',
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
    if (filter === 'brazilian') return getCountryCode(product.location?.country || '') === 'BR';
    if (filter === 'foreign') return getCountryCode(product.location?.country || '') !== 'BR';
    return true;
  });

  function openEdit(product: Product) {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      website: product.website,
      logo: product.logo,
      location: {
        country: product.location?.country || '',
        state: product.location?.state || '',
        city: product.location?.city || '',
        flag: product.location?.flag || ''
      },
      companyInfo: {
        foundedYear: product.companyInfo?.foundedYear ? String(product.companyInfo.foundedYear) : '',
        headquarters: product.companyInfo?.headquarters || '',
        size: product.companyInfo?.size || 'startup'
      },
      pricing: product.pricing || {
        type: 'free',
        currency: 'BRL',
        description: ''
      },
      features: product.features || [],
      tags: product.tags || [],
      screenshots: product.screenshots || [],
      isFeatured: product.isFeatured,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      alternativeTo: product.alternativeTo || [],
      socialLinks: (product.socialLinks as Record<string, string>) || {}
    });
    setAddMode(false);
  }

  function openAdd() {
    setEditProduct(null);
    setForm({
      name: '',
      description: '',
      website: '',
      logo: '',
      location: {
        country: '',
        state: '',
        city: '',
        flag: ''
      },
      companyInfo: {
        foundedYear: '',
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
      // Preparar dados do formulário removendo undefined e convertendo tipos
      const cleanForm = prepareFormData(form) as Record<string, unknown>;
      
      if (addMode) {
        await adminProductService.createProduct(cleanForm as Partial<Product>);
        alert("Produto criado com sucesso!");
      } else if (editProduct) {
        await adminProductService.updateProduct(editProduct.id, cleanForm as Partial<Product>);
        alert("Produto atualizado com sucesso!");
      }
      
      closeEdit();
      await fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert("Erro ao salvar produto: " + ((error as Error)?.message || error));
    }
    
    setSaving(false);
  }

  // Função para remover campos undefined e converter tipos
  function prepareFormData(formData: FormProductData): unknown {
    const prepared: FormProductData & { location: FormProductData['location'] & { countryCode: string; flag: string }, isActive: boolean } = {
      ...formData,
      location: {
        ...formData.location,
        countryCode: getCountryCode(formData.location.country),
        flag: getCountryFlag(formData.location.country)
      },
      isActive: true
    };

    // Converter foundedYear para number se for string
    if (prepared.companyInfo.foundedYear) {
      const year = typeof prepared.companyInfo.foundedYear === 'string'
        ? parseInt(prepared.companyInfo.foundedYear, 10)
        : prepared.companyInfo.foundedYear;

      if (!isNaN(year) && year > 0) {
        prepared.companyInfo.foundedYear = year;
      } else {
        delete prepared.companyInfo.foundedYear;
      }
    } else {
      delete prepared.companyInfo.foundedYear;
    }

    return removeUndefinedFields(prepared);
  }

  // Função para remover campos undefined recursivamente
  function removeUndefinedFields(obj: unknown): unknown {
    if (obj === null || obj === undefined) {
      return null;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(removeUndefinedFields).filter(item => item !== undefined);
    }
    
    if (typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        if (value !== undefined) {
          const cleanValue = removeUndefinedFields(value);
          if (cleanValue !== undefined) {
            result[key] = cleanValue;
          }
        }
      }
      return result;
    }
    
    return obj;
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
            🇧🇷 Brasileiros ({products.filter(p => getCountryCode(p.location?.country || '') === 'BR').length})
          </button>
          <button
            onClick={() => setFilter('foreign')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'foreign' 
                ? 'bg-blue-600 text-white' 
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            🌍 Estrangeiros ({products.filter(p => getCountryCode(p.location?.country || '') !== 'BR').length})
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
                  <th className="p-3 text-left">Tags</th>
                  <th className="p-3 text-left">Alternativa a</th>
                  <th className="p-3 text-left">Origem</th>
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
                          {product.companyInfo?.foundedYear && `Fundada em ${product.companyInfo.foundedYear}`}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {product.tags?.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {product.tags && product.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{product.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {product.alternativeTo?.slice(0, 2).map((alt, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {alt}
                          </span>
                        ))}
                        {product.alternativeTo && product.alternativeTo.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{product.alternativeTo.length - 2}
                          </span>
                        )}
                        {(!product.alternativeTo || product.alternativeTo.length === 0) && (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{product.location?.flag || getCountryFlag(product.location?.country || '')}</span>
                        <span className="text-sm">{product.location?.country || 'N/A'}</span>
                      </div>
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


                {/* Localização */}
                <div className="border p-4 rounded-xl bg-muted/20">
                  <h4 className="font-medium mb-3">Localização</h4>
                  <div>
                    <label className="block text-sm font-medium mb-1">País *</label>
                    <select
                      value={form.location.country} 
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        location: { ...f.location, country: e.target.value }
                      }))} 
                      className="w-full p-2 border border-border rounded-xl bg-background text-foreground"
                      required
                    >
                      <option value="">Selecione o país</option>
                      {availableCountries.map(country => (
                        <option key={country} value={country}>
                          {getCountryFlag(country)} {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Informações da empresa */}
                <div className="border p-4 rounded-xl bg-muted/20">
                  <h4 className="font-medium mb-3">Informações da Empresa</h4>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ano de Fundação</label>
                    <input 
                      type="number" 
                      value={form.companyInfo.foundedYear || ''} 
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        companyInfo: { ...f.companyInfo, foundedYear: e.target.value }
                      }))} 
                      className="w-full p-2 border border-border rounded-xl bg-background text-foreground" 
                      min="1800"
                      max={new Date().getFullYear()}
                      placeholder="Ex: 2020"
                    />
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
                    <label className="block text-sm font-medium mb-1">Features (separadas por vírgula) *</label>
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

                {/* Alternativa a */}
                <div>
                  <label className="block text-sm font-medium mb-1">Alternativa a (produtos internacionais, separados por vírgula) *</label>
                  <input 
                    type="text" 
                    value={form.alternativeTo.join(', ')} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      alternativeTo: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    }))} 
                    placeholder="Ex: HubSpot, Salesforce, Mailchimp"
                    className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Liste os produtos/serviços internacionais que este produto brasileiro substitui ou concorre diretamente.
                  </p>
                </div>

                {/* Informações de Preço */}
                <div>
                  <h4 className="font-medium mb-3">Informações de Preço</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Preço *</label>
                      <select
                        value={form.pricing.type}
                        onChange={e => setForm(f => ({
                          ...f,
                          pricing: { ...f.pricing, type: e.target.value as 'free' | 'freemium' | 'paid' | 'enterprise' }
                        }))}
                        className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground"
                      >
                        <option value="free">Gratuito</option>
                        <option value="freemium">Freemium</option>
                        <option value="paid">Pago</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Moeda</label>
                      <select
                        value={form.pricing.currency}
                        onChange={e => setForm(f => ({
                          ...f,
                          pricing: { ...f.pricing, currency: e.target.value }
                        }))}
                        className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground"
                      >
                        <option value="BRL">BRL (Real)</option>
                        <option value="USD">USD (Dólar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Descrição dos Preços *</label>
                    <textarea
                      value={form.pricing.description}
                      onChange={e => setForm(f => ({
                        ...f,
                        pricing: { ...f.pricing, description: e.target.value }
                      }))}
                      placeholder="Ex: Plano gratuito com limitações, assinatura mensal a partir de R$ 50"
                      className="w-full p-2 border border-border rounded-xl bg-muted/50 text-foreground"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex gap-4">
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