"use client";
import { useTranslation } from 'react-i18next';

export default function LayoutTest() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          两列布局测试
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold mb-4 text-white">左侧输入区域</h2>
              <p className="text-gray-300">这里是所有的输入控件和表单元素</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-white">设计类型</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border-2 border-white/20 bg-white/5">
                  <div className="text-2xl mb-2">😊</div>
                  <div className="font-medium text-sm text-white">表情包设计</div>
                  <div className="text-xs text-gray-400 mt-1">创建富有表现力的表情包</div>
                </div>
                <div className="p-4 rounded-xl border-2 border-white/20 bg-white/5">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-medium text-sm text-white">Logo设计</div>
                  <div className="text-xs text-gray-400 mt-1">创建专业的品牌标志</div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl">
              生成设计
            </button>
          </div>
          
          {/* 右侧：结果区域 */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-full flex items-center justify-center">
              <div className="text-center text-gray-300">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">等待生成结果</h3>
                <p className="text-sm">填写左侧表单并点击生成按钮开始创建您的设计</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 