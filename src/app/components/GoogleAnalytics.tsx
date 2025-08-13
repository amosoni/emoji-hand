'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID?: string;
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.gtag && GA_MEASUREMENT_ID) {
      console.log('Google Analytics: Configuring page view for:', pathname);
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      });
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics: GA_MEASUREMENT_ID not provided');
    return null;
  }

  console.log('Google Analytics: Initializing with ID:', GA_MEASUREMENT_ID);

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          console.log('Google Analytics: Script loaded successfully');
        }}
        onError={(e) => {
          console.error('Google Analytics: Script failed to load:', e);
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
            console.log('Google Analytics: Initialized with ID: ${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
} 