import '../styles/globals.css';
import AppProviders from "./components/AppProviders";

export default function RootLayout({ children, params }: { children: React.ReactNode, params: { locale: string } }) {
  return (
    <html lang={params.locale}>
      <body>
        <AppProviders locale={params.locale}>
              {children}
        </AppProviders>
      </body>
    </html>
  );
}
