import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterHandle?: string;
  jsonLd?: object;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/logo.png', // Fallback to logo
  twitterHandle = '@TharqiyaCourse',
  jsonLd,
  noindex = false,
}) => {
  const siteName = 'Darussalam Edu Village';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Tharqiya: Kerala\'s premier Post-Hifz destination. Nurturing excellence in Quranic memory and modern academic scholarship.';
  const metaDescription = description || defaultDescription;
  const siteUrl = 'https://darussalameduvillage.com';
  const logoUrl = `${siteUrl}/logo.png`;
  const url = typeof window !== 'undefined' ? window.location.href : siteUrl;

  // Base branding schema
  const defaultSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": siteUrl,
      "logo": logoUrl,
      "sameAs": [
        "https://www.facebook.com/darussalameduvillage",
        "https://www.instagram.com/darussalameduvillage"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Tharqiya",
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ];

  const processedJsonLd = jsonLd 
    ? (Array.isArray(jsonLd) ? [...defaultSchema, ...jsonLd] : [...defaultSchema, jsonLd])
    : defaultSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={ogImage} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(processedJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
