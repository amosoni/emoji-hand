import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'zh', 'zh-CN', 'de', 'it', 'fr', 'es', 'pt', 'ru', 'ja', 'ko'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  // 检查路径是否已经包含语言代码
  const pathname = request.nextUrl.pathname;
  
  // 跳过静态文件路径
  if (pathname.startsWith('/images/') || 
      pathname.startsWith('/logo.svg') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/')) {
    return;
  }
  
  // 如果路径是根路径，重定向到默认语言
  if (pathname === '/') {
    const response = NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    response.headers.set('X-Robots-Tag', 'index, follow');
    return response;
  }
  
  // 检查路径是否以语言代码开头
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // 为所有页面添加X-Robots-Tag头
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'index, follow');
    return response;
  }

  // 重定向到默认语言
  const response = NextResponse.redirect(
    new URL(`/${defaultLocale}${pathname}`, request.url)
  );
  response.headers.set('X-Robots-Tag', 'index, follow');
  return response;
}

export const config = {
  matcher: [
    // 跳过所有内部路径 (_next)、API、静态文件和图标
    '/((?!_next|api|favicon.ico|images|logo.svg).*)',
  ],
}; 