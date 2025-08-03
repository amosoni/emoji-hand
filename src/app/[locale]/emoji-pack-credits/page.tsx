import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import EmojiPackCredits from '~/components/EmojiPackCredits';
import UnifiedNavBar from '~/app/components/UnifiedNavBar';
import Footer from '~/app/components/Footer';
import LanguageSwitcher from '~/components/LanguageSwitcher';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: '表情包积分系统 - Emoji Hand',
    description: '购买表情包积分，享受专业表情包生成服务',
    keywords: '表情包,积分,购买,AI生成,emoji,设计',
  };
}

export default async function EmojiPackCreditsPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <UnifiedNavBar />
      <LanguageSwitcher />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              表情包积分系统
            </h1>
            <p className="text-xl text-gray-300">
              购买积分，享受专业表情包生成服务
            </p>
          </div>
          
          <EmojiPackCredits />
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 