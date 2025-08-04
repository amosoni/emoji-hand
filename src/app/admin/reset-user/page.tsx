"use client";

import { useState } from 'react';
import { api } from '~/utils/api';

export default function ResetUserPage() {
  const [message, setMessage] = useState('');

  const resetUserMutation = api.admin.resetUserUsage.useMutation({
    onSuccess: (data) => {
      setMessage(`✅ 成功重置用户使用次数！\n${JSON.stringify(data.user, null, 2)}`);
    },
    onError: (error) => {
      setMessage(`❌ 错误: ${error.message}`);
    }
  });

  const handleReset = () => {
    // 直接重置 erfgerygt@qq.com 用户的使用次数
    resetUserMutation.mutate({
      email: 'erfgerygt@qq.com',
      translationUsesToday: 0,  // 重置翻译次数
      imageGenerationUsesToday: 0  // 重置图片生成次数
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">重置用户使用次数</h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              <strong>用户邮箱:</strong> erfgerygt@qq.com
            </p>
            <p className="text-blue-800">
              <strong>重置内容:</strong> 翻译次数和图片生成次数都设为 0
            </p>
          </div>

          <button
            onClick={handleReset}
            disabled={resetUserMutation.isPending}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold"
          >
            {resetUserMutation.isPending ? '重置中...' : '重置用户使用次数'}
          </button>

          {message && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{message}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 