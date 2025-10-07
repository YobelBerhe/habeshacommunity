import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Product' | 'LocalBusiness' | 'Person' | 'BreadcrumbList';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);

  return null;
}

// Predefined schemas
export function OrganizationSchema() {
  return (
    <StructuredData
      type="Organization"
      data={{
        name: 'HabeshaCommunity',
        url: 'https://habeshacommunity.com',
        logo: 'https://habeshacommunity.com/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png',
        description: 'Connect with the Habesha community worldwide',
        sameAs: [
          'https://facebook.com/habeshacommunity',
          'https://twitter.com/habeshacommunity',
          'https://instagram.com/habeshacommunity',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          email: 'support@habeshacommunity.com',
        },
      }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <StructuredData
      type="WebSite"
      data={{
        name: 'HabeshaCommunity',
        url: 'https://habeshacommunity.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://habeshacommunity.com/browse?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}
