import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { StructuredData } from './StructuredData';

export function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    ...paths.map((path, index) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      path: '/' + paths.slice(0, index + 1).join('/'),
    })),
  ];

  // Generate structured data
  const structuredData = {
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://habeshacommunity.com${item.path}`,
    })),
  };

  if (breadcrumbItems.length <= 1) return null;

  return (
    <>
      <StructuredData type="BreadcrumbList" data={structuredData} />
      
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              
              {index === breadcrumbItems.length - 1 ? (
                <span className="font-medium text-foreground">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-foreground transition-colors"
                >
                  {index === 0 ? <Home className="w-4 h-4" /> : item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
