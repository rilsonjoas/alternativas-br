import React, { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string; // can be absolute or path (e.g., "/categorias")
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const ensureTag = (selector: string, create: () => HTMLElement) => {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
};

const toAbsolute = (canonical?: string) => {
  if (!canonical) return undefined;
  if (canonical.startsWith("http")) return canonical;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${canonical}`;
  }
  return canonical;
};

const SEO: React.FC<SEOProps> = ({ title, description, canonical, jsonLd }) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    if (description) {
      const desc = ensureTag('meta[name="description"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        return m;
      }) as HTMLMetaElement;
      desc.setAttribute("content", description);

      // Open Graph
      const ogTitle = ensureTag('meta[property="og:title"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:title");
        return m;
      }) as HTMLMetaElement;
      ogTitle.setAttribute("content", title);

      const ogDesc = ensureTag('meta[property="og:description"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:description");
        return m;
      }) as HTMLMetaElement;
      ogDesc.setAttribute("content", description);

      // Twitter
      const twCard = ensureTag('meta[name="twitter:card"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:card");
        return m;
      }) as HTMLMetaElement;
      twCard.setAttribute("content", "summary_large_image");

      const twTitle = ensureTag('meta[name="twitter:title"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:title");
        return m;
      }) as HTMLMetaElement;
      twTitle.setAttribute("content", title);

      const twDesc = ensureTag('meta[name="twitter:description"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:description");
        return m;
      }) as HTMLMetaElement;
      twDesc.setAttribute("content", description);
    }

    // Canonical
    const absoluteCanonical = toAbsolute(canonical);
    if (absoluteCanonical) {
      const linkEl = ensureTag('link[rel="canonical"]', () => {
        const l = document.createElement("link");
        l.setAttribute("rel", "canonical");
        return l;
      }) as HTMLLinkElement;
      linkEl.setAttribute("href", absoluteCanonical);
    }

    // JSON-LD
    const existing = document.getElementById("seo-json-ld");
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "seo-json-ld";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, jsonLd]);

  return null;
};

export default SEO;
