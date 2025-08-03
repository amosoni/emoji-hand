import '../styles/globals.css';
import AppProviders from "./components/AppProviders";
import SeoHead from "./components/SeoHead";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale?: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  // Root layout only handles non-locale pages
  // Locale-specific pages are handled by [locale]/layout.tsx
  const locale = 'en'; // Default for non-locale pages
  
  console.log('=== ROOT LAYOUT DEBUG ===');
  console.log('params.locale =', params.locale);
  console.log('final locale =', locale);
  console.log('========================');
  
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
