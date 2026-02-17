import { Product } from "@/types";

/**
 * Filtra produtos com base em uma query de busca.
 * A busca é feita em: nome, descrição, features e tags.
 * É case-insensitive.
 */
export function filterProducts(products: Product[], query: string): Product[] {
  if (!query || !query.trim()) {
    return products;
  }

  const lowerQuery = query.toLowerCase().trim();

  return products.filter((product) => {
    const searchableText = [
      product.name,
      product.description,
      ...(product.features || []),
      ...(product.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(lowerQuery);
  });
}
