import type { Metadata } from 'next';
import EmojiPackGenerator from '~/components/EmojiPackGenerator';
import UnifiedNavBar from '~/app/components/UnifiedNavBar';
import Footer from '~/app/components/Footer';


export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: '表情包生成器 - Emoji Hand',
    description: '上传图片，AI自动生成5个不同风格的表情包设计',
    keywords: '表情包生成器,AI表情包,图片转表情包,表情包设计',
  };
}

export default async function EmojiPackPage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600">
      <UnifiedNavBar />
      <div className="pt-20">
        <EmojiPackGenerator />
      </div>
      <Footer />
    </div>
  );
} 