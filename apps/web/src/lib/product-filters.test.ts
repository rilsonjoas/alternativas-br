import { describe, it, expect } from 'vitest';
import { filterProducts } from './product-filters';
import { Product } from '@/types';

describe('filterProducts', () => {
  // Dados de teste (Fixtures)
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'ContaAzul',
      description: 'Gestão financeira para PMEs',
      tags: ['Finanças', 'B2B', 'SaaS'],
      features: ['Emissão de boletos', 'Conciliação bancária'],
      isFeatured: false,
      logo: 'logo.png',
      website: '',
      slug: 'contaazul',
      upvotes: 0,
      createdAt: undefined,
      location: { country: 'Brasil' },
      companyInfo: {},
      pricing: { type: 'paid', currency: 'BRL', description: 'Pago' },
      foundedYear: 2011
    },
    {
      id: '2',
      name: 'Nuvemshop',
      description: 'Plataforma de e-commerce líder na América Latina',
      tags: ['E-commerce', 'B2C', 'Vendas'],
      features: ['Loja virtual', 'Integração Correios'],
      isFeatured: true,
      logo: '',
      website: '',
      slug: 'nuvemshop',
      upvotes: 0,
      createdAt: undefined,
      location: { country: 'Brasil' },
      companyInfo: {},
      pricing: { type: 'paid', currency: 'BRL', description: 'Pago' },
      foundedYear: 2011
    },
    {
      id: '3',
      name: 'RD Station',
      description: 'Automação de Marketing Digital',
      tags: ['Marketing', 'B2B', 'Automação'],
      features: ['Email marketing', 'Landing pages'],
      isFeatured: true,
      logo: '',
      website: '',
      slug: 'rd-station',
      upvotes: 0,
      createdAt: undefined,
      location: { country: 'Brasil' },
      companyInfo: {},
      pricing: { type: 'paid', currency: 'BRL', description: 'Pago' },
      foundedYear: 2012
    }
  ];

  it('deve retornar todos os produtos se a query for vazia', () => {
    const result = filterProducts(mockProducts, '');
    expect(result).toHaveLength(3);
  });

  it('deve retornar produtos filtrados por nome (busca exata)', () => {
    const result = filterProducts(mockProducts, 'Nuvemshop');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Nuvemshop');
  });

  it('deve ser case-insensitive (ignorar maiúsculas/minúsculas)', () => {
    const result = filterProducts(mockProducts, 'nuvemshop');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Nuvemshop');
  });

  it('deve filtrar por termo parcial (substring)', () => {
    const result = filterProducts(mockProducts, 'azul');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('ContaAzul');
  });

  it('deve filtrar pela descrição', () => {
    const result = filterProducts(mockProducts, 'financeira');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('ContaAzul');
  });

  it('deve filtrar por tags', () => {
    const result = filterProducts(mockProducts, 'E-commerce');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Nuvemshop');
  });

  it('deve filtrar por features', () => {
    const result = filterProducts(mockProducts, 'Email marketing');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('RD Station');
  });

  it('deve retornar array vazio se nada for encontrado', () => {
    const result = filterProducts(mockProducts, 'SoftwareInexistenteXyz');
    expect(result).toHaveLength(0);
  });

  it('deve ignorar espaços em branco extras na query', () => {
    const result = filterProducts(mockProducts, '  contaazul  ');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('ContaAzul');
  });
});
