import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  image?: string;
  type?: 'website' | 'article';
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonical, 
  jsonLd,
  image = '/placeholder.svg',
  type = 'website'
}) => {
  const siteName = 'Alternativas BR';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  // URL absoluta para canonical
  const getAbsoluteUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    return `${window.location.origin}${path}`;
  };

  const absoluteCanonical = getAbsoluteUrl(canonical);
  const absoluteImage = getAbsoluteUrl(image);

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {absoluteCanonical && <link rel="canonical" href={absoluteCanonical} />}

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:site_name" content={siteName} />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
