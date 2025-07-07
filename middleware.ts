import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // 保护所有页面和 API 路由，但排除 sign-in、sign-up、_next、favicon.ico、api/webhooks 等
    "/((?!_next|favicon.ico|sign-in|sign-up|api/webhooks).*)",
  ],
}; 