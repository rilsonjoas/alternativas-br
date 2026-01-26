import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

// Mock das dependências
const mockVoteProduct = vi.fn();
const mockInvalidateQueries = vi.fn();
const mockToast = vi.fn();

// Mock do hook useFirebase
vi.mock('@/hooks/useFirebase', () => ({
  voteProduct: (...args: any[]) => mockVoteProduct(...args),
  useHasVoted: (productId: string) => ({
    // Simula que para o produto "voted-id" o usuário já votou
    data: productId === 'voted-id',
    isLoading: false
  })
}));

// Mock do React Query
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries
  })
}));

// Mock do hook useToast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

// Mock do IntersectionObserver (usado por algumas libs de UI se houver lazy loading)
const intersectionObserverMock = () => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = vi.fn().mockImplementation(intersectionObserverMock);

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: 'prod-123',
    name: 'Software BR',
    slug: 'software-br',
    description: 'Um software brasileiro incrível',
    website: 'https://softwarebr.com.br',
    tags: ['SaaS', 'B2B'],
    upvotes: 10,
    createdAt: { toMillis: () => Date.now() } as any,
    isFeatured: false,
    logo: 'https://example.com/logo.png',
    status: 'published'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar as informações do produto corretamente', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Software BR')).toBeInTheDocument();
    expect(screen.getByText('Um software brasileiro incrível')).toBeInTheDocument();
    expect(screen.getByText('SaaS')).toBeInTheDocument();
    expect(screen.getByText('B2B')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Número de votos
  });

  it('deve chamar voteProduct ao clicar no botão de curtir quando não votou', async () => {
    mockVoteProduct.mockResolvedValueOnce({ success: true });
    
    render(<ProductCard product={mockProduct} />);
    
    // O botão de curtir geralmente tem o ícone de coração ou o texto com o número
    const likeButton = screen.getByRole('button', { name: /10/i }); // Busca pelo texto '10' (votos)
    
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockVoteProduct).toHaveBeenCalledWith('prod-123');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Curtida registrada!"
      }));
      expect(mockInvalidateQueries).toHaveBeenCalled();
    });
  });

  it('NÃO deve chamar voteProduct se o usuário já votou', async () => {
    // Usamos o ID que o mock retorna true para useHasVoted
    const votedProduct = { ...mockProduct, id: 'voted-id' };
    
    render(<ProductCard product={votedProduct} />);
    
    const likeButton = screen.getByRole('button', { name: /10/i });
    
    fireEvent.click(likeButton);

    expect(mockVoteProduct).not.toHaveBeenCalled();
  });

  it('deve exibir toast de erro se a votação falhar', async () => {
    const errorMsg = 'Erro de rede';
    mockVoteProduct.mockRejectedValueOnce(new Error(errorMsg));
    
    render(<ProductCard product={mockProduct} />);
    
    const likeButton = screen.getByRole('button', { name: /10/i });
    
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockVoteProduct).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Erro ao votar",
        description: errorMsg,
        variant: "destructive"
      }));
    });
  });

  it('deve ter o link correto para o site', () => {
    render(<ProductCard product={mockProduct} />);
    
    const links = screen.getAllByRole('link');
    const websiteLink = links.find(link => link.getAttribute('href') === 'https://softwarebr.com.br');
    
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveTextContent('Visitar site');
  });
});
