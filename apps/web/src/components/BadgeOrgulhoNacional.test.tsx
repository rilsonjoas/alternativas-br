import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BadgeOrgulhoNacional from './BadgeOrgulhoNacional';

describe('BadgeOrgulhoNacional Component', () => {
  it('deve renderizar o título e a descrição do selo', () => {
    render(<BadgeOrgulhoNacional />);
    
    expect(screen.getByText('Selo Orgulho Nacional')).toBeInTheDocument();
    expect(
      screen.getByText(/Mostre ao mundo que sua tecnologia é feita no Brasil/i)
    ).toBeInTheDocument();
  });

  it('deve copiar o código para o clipboard ao clicar no botão', async () => {
    // Mock navigator.clipboard.writeText
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<BadgeOrgulhoNacional />);
    
    const copyButton = screen.getByRole('button', { name: /Copiar Código/i });
    expect(copyButton).toBeInTheDocument();

    fireEvent.click(copyButton);

    expect(writeTextMock).toHaveBeenCalledWith(
      expect.stringContaining('https://alternativasbr.com.br')
    );
    expect(screen.getByText('Copiado!')).toBeInTheDocument();
  });
});
