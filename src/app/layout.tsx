import '../styles/globals.css';
import AppProviders from "./components/AppProviders";
import SeoHead from "./components/SeoHead";

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  return (
    <html lang={params.locale}>
      <SeoHead />
      <body>
        <AppProviders locale={params.locale}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
