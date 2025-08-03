"use client";
import { useTranslation } from 'react-i18next';

export default function LovartStyleTest() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Lovart Style 多语言测试
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-white">英文翻译</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Title:</strong> {t('lovartStyle.title')}</p>
              <p><strong>Description:</strong> {t('lovartStyle.description')}</p>
              <p><strong>Upload Title:</strong> {t('lovartStyle.upload.title')}</p>
              <p><strong>Upload Instruction:</strong> {t('lovartStyle.upload.instruction')}</p>
              <p><strong>Prompt Title:</strong> {t('lovartStyle.prompt.title')}</p>
              <p><strong>Design Type Title:</strong> {t('lovartStyle.designType.title')}</p>
              <p><strong>Emoji Pack:</strong> {t('lovartStyle.designType.emoji')}</p>
              <p><strong>Logo Design:</strong> {t('lovartStyle.designType.logo')}</p>
              <p><strong>Audience Title:</strong> {t('lovartStyle.audience.title')}</p>
              <p><strong>Commercial Title:</strong> {t('lovartStyle.commercial.title')}</p>
              <p><strong>Generate:</strong> {t('lovartStyle.generate')}</p>
              <p><strong>Generating:</strong> {t('lovartStyle.generating')}</p>
              <p><strong>Reset:</strong> {t('lovartStyle.reset')}</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-white">错误信息</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Invalid File:</strong> {t('lovartStyle.error.invalidFile')}</p>
              <p><strong>File Too Large:</strong> {t('lovartStyle.error.fileTooLarge')}</p>
              <p><strong>No Input:</strong> {t('lovartStyle.error.noInput')}</p>
              <p><strong>Generation Failed:</strong> {t('lovartStyle.error.generationFailed')}</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-white">结果区域</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Analysis:</strong> {t('lovartStyle.results.analysis')}</p>
              <p><strong>Concepts:</strong> {t('lovartStyle.results.concepts')}</p>
              <p><strong>Business Advice:</strong> {t('lovartStyle.results.businessAdvice')}</p>
              <p><strong>Designs:</strong> {t('lovartStyle.results.designs')}</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-white">目标受众</h2>
            <div className="space-y-2 text-sm">
              <p><strong>General:</strong> {t('lovartStyle.audience.general')}</p>
              <p><strong>Young Adults:</strong> {t('lovartStyle.audience.youngAdults')}</p>
              <p><strong>Professionals:</strong> {t('lovartStyle.audience.professionals')}</p>
              <p><strong>Teenagers:</strong> {t('lovartStyle.audience.teenagers')}</p>
              <p><strong>Business Owners:</strong> {t('lovartStyle.audience.businessOwners')}</p>
              <p><strong>Creative Professionals:</strong> {t('lovartStyle.audience.creativeProfessionals')}</p>
              <p><strong>Students:</strong> {t('lovartStyle.audience.students')}</p>
              <p><strong>Parents:</strong> {t('lovartStyle.audience.parents')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 