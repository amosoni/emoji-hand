import { redirect } from 'next/navigation';

export default function RootPage() {
  // 直接重定向到默认语言，避免中间件重定向
  redirect('/en');
} 