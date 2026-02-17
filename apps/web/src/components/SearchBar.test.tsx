import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchBar from './SearchBar';

// Mock do hook useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper para prover o Router necessário para o useNavigate e Links
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SearchBar Component', () => {
  it('deve renderizar corretamente com o placeholder padrão', () => {
    renderWithRouter(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/buscar produtos/i);
    expect(input).toBeInTheDocument();
  });

  it('deve atualizar o valor do input ao digitar', () => {
    renderWithRouter(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/buscar produtos/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'gestão' } });
    
    expect(input.value).toBe('gestão');
  });

  it('deve navegar para a página de busca ao pressionar Enter', () => {
    renderWithRouter(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/buscar produtos/i);
    fireEvent.change(input, { target: { value: 'financeiro' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockNavigate).toHaveBeenCalledWith('/buscar?q=financeiro');
  });

  it('deve navegar ao clicar no botão de busca', () => {
    renderWithRouter(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/buscar produtos/i);
    fireEvent.change(input, { target: { value: 'marketing' } });
    
    // Quando há texto, aparecem dois botões: Limpar (X) e Buscar (Lupa)
    // O botão de Buscar é o último no DOM segundo a ordem do código
    const buttons = screen.getAllByRole('button');
    const searchBtn = buttons[buttons.length - 1];
    
    fireEvent.click(searchBtn);
    
    expect(mockNavigate).toHaveBeenCalledWith('/buscar?q=marketing');
  });
});
