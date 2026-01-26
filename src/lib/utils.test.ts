import { describe, it, expect } from 'vitest';
import { cn } from './utils';

// Estrutura de um teste:
// describe() = agrupa testes relacionados
// it() = um teste específico
// expect() = verifica se algo é verdadeiro

describe('cn (className merger)', () => {
  it('deve mesclar classes normalmente', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('deve remover classes conflitantes do Tailwind', () => {
    // twMerge remove conflitos (última classe ganha)
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });

  it('deve lidar com classes condicionais', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('deve ignorar valores falsy', () => {
    const result = cn('text-red-500', false, null, undefined, 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });
});
