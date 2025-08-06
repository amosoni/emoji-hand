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

  // 获取用户偏好的语言
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const preferredLanguage = acceptLanguage.split(',')[0]?.split('-')[0] ?? 'en';
  
  // 检查首选语言是否支持
  const supportedLanguage = locales.includes(preferredLanguage) ? preferredLanguage : 'en';
  
  // 对于没有语言代码的路径，重定向到用户偏好的语言
  const response = NextResponse.redirect(
    new URL(`/${supportedLanguage}${pathname}`, request.url)
  );
  response.headers.set('X-Robots-Tag', 'index, follow');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|images|logo.svg|robots.txt|sitemap.xml).*)',
  ],
}; 