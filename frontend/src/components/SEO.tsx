import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  xHandle?: string; // Updated from twitterHandle
  jsonLd?: object;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/logo.png', // Fallback to logo
  xHandle = '@TharqiyaCourse', // Updated from twitterHandle
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

  // Ensure absolute image URL
  const absoluteOgImage = ogImage.startsWith('http') 
    ? ogImage 
    : ogImage.startsWith('/') 
      ? `${siteUrl}${ogImage}` 
      : `${siteUrl}/${ogImage}`;

  // Base branding schema
  const defaultSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "alternateName": "DHEV",
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
      "name": "Darussalam Edu Village",
      "alternateName": "Tharqiya",
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/search?q={search_term_string}`
        },
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
      <meta property="og:image" content={absoluteOgImage} />

      {/* X (formerly Twitter) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={absoluteOgImage} />
      {xHandle && <meta name="twitter:site" content={xHandle} />}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(processedJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
