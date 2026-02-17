// Mapeamento de países para códigos e bandeiras
const countryMap: Record<string, { code: string; flag: string }> = {
  'Brasil': { code: 'BR', flag: '🇧🇷' },
  'Brazil': { code: 'BR', flag: '🇧🇷' },
  'Estados Unidos': { code: 'US', flag: '🇺🇸' },
  'United States': { code: 'US', flag: '🇺🇸' },
  'Reino Unido': { code: 'GB', flag: '🇬🇧' },
  'United Kingdom': { code: 'GB', flag: '🇬🇧' },
  'Canadá': { code: 'CA', flag: '🇨🇦' },
  'Canada': { code: 'CA', flag: '🇨🇦' },
  'Alemanha': { code: 'DE', flag: '🇩🇪' },
  'Germany': { code: 'DE', flag: '🇩🇪' },
  'França': { code: 'FR', flag: '🇫🇷' },
  'France': { code: 'FR', flag: '🇫🇷' },
  'Austrália': { code: 'AU', flag: '🇦🇺' },
  'Australia': { code: 'AU', flag: '🇦🇺' },
  'Holanda': { code: 'NL', flag: '🇳🇱' },
  'Netherlands': { code: 'NL', flag: '🇳🇱' },
  'Espanha': { code: 'ES', flag: '🇪🇸' },
  'Spain': { code: 'ES', flag: '🇪🇸' },
  'Itália': { code: 'IT', flag: '🇮🇹' },
  'Italy': { code: 'IT', flag: '🇮🇹' }
};

export function getCountryCode(countryName: string): string {
  const country = countryMap[countryName];
  return country?.code || 'US'; // Default para US se não encontrar
}

export function getCountryFlag(countryName: string): string {
  const country = countryMap[countryName];
  return country?.flag || '🌍'; // Default para globo se não encontrar
}

export function isBrazilian(countryName: string): boolean {
  const code = getCountryCode(countryName);
  return code === 'BR';
}

export const availableCountries = [
  'Brasil',
  'Estados Unidos', 
  'Reino Unido',
  'Canadá',
  'Alemanha',
  'França',
  'Austrália',
  'Holanda',
  'Espanha',
  'Itália'
];