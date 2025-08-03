import type { ReactNode } from 'react';
import AppProviders from "../components/AppProviders";
import SeoHead from "../components/SeoHead";

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = params.locale;
  
  console.log('=== LOCALE LAYOUT DEBUG ===');
  console.log('params.locale =', params.locale);
  console.log('final locale =', locale);
  console.log('==========================');
  
  return (
    <html lang={locale}>
      <SeoHead />
      <body>
        <AppProviders locale={locale}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
} 