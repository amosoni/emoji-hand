import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'zh', 'zh-CN', 'de', 'it', 'fr', 'es', 'pt', 'ru', 'ja', 'ko'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 跳过静态文件和API路径
  if (pathname.startsWith('/images/') || 
      pathname.startsWith('/logo.svg') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/robots.txt') ||
      pathname.startsWith('/sitemap.xml')) {
    return;
  }
  
  // 检查路径是否已经包含语言代码
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果路径已经有语言代码，直接通过
  if (pathnameHasLocale) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'index, follow');
    return response;
  }

  // 对于根路径，默认重定向到英文
  if (pathname === '/') {
    const response = NextResponse.redirect(
      new URL('/en', request.url)
    );
    response.headers.set('X-Robots-Tag', 'index, follow');
    return response;
  }

  // 对于其他没有语言代码的路径，也重定向到英文
  const response = NextResponse.redirect(
    new URL(`/en${pathname}`, request.url)
  );
  response.headers.set('X-Robots-Tag', 'index, follow');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|images|logo.svg|robots.txt|sitemap.xml).*)',
  ],
}; 