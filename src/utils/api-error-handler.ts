// 统一API错误处理工具

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * 统一错误处理函数
 * @param error 错误对象
 * @returns 格式化的错误信息
 */
export function handleApiError(error: any): string {
  // 检查是否是tRPC错误
  if (error?.data?.code) {
    switch (error.data.code) {
      case 'UNAUTHORIZED':
        return '请先登录';
      case 'FORBIDDEN':
        return '权限不足';
      case 'NOT_FOUND':
        return '资源不存在';
      case 'BAD_REQUEST':
        return error.data.message || '请求参数错误';
      case 'INTERNAL_SERVER_ERROR':
        return '服务器内部错误，请稍后重试';
      default:
        return error.data.message || '操作失败，请重试';
    }
  }

  // 检查是否是网络错误
  if (error?.message?.includes('fetch')) {
    return '网络连接失败，请检查网络设置';
  }

  // 检查是否是配额相关错误
  if (error?.message?.includes('quota') || error?.message?.includes('额度')) {
    return '使用配额已用完，请升级套餐或稍后重试';
  }

  // 检查是否是频率限制错误
  if (error?.message?.includes('rate limit') || error?.message?.includes('频繁')) {
    return '请求过于频繁，请稍后重试';
  }

  // 检查是否是安全检查错误
  if (error?.message?.includes('suspicious') || error?.message?.includes('安全')) {
    return '检测到异常行为，请稍后重试';
  }

  // 检查是否是模型相关错误
  if (error?.message?.includes('model') || error?.message?.includes('模型')) {
    return 'AI模型暂时不可用，请稍后重试';
  }

  // 默认错误处理
  return error?.message || '操作失败，请重试';
}

/**
 * 检查错误是否需要显示验证码
 * @param error 错误对象
 * @returns 是否需要显示验证码
 */
export function shouldShowCaptcha(error: any): boolean {
  const errorMessage = error?.message || '';
  return errorMessage.includes('rate limit') || 
         errorMessage.includes('suspicious') || 
         errorMessage.includes('blacklisted');
}

/**
 * 检查错误是否是配额相关
 * @param error 错误对象
 * @returns 是否是配额错误
 */
export function isQuotaError(error: any): boolean {
  const errorMessage = error?.message || '';
  return errorMessage.includes('quota') || 
         errorMessage.includes('额度') || 
         errorMessage.includes('配额');
}

/**
 * 检查错误是否是认证相关
 * @param error 错误对象
 * @returns 是否是认证错误
 */
export function isAuthError(error: any): boolean {
  const errorMessage = error?.message || '';
  return errorMessage.includes('login') || 
         errorMessage.includes('登录') || 
         errorMessage.includes('unauthorized') ||
         errorMessage.includes('权限');
}

/**
 * 格式化错误信息用于显示
 * @param error 错误对象
 * @param context 上下文信息
 * @returns 格式化的错误信息
 */
export function formatErrorForDisplay(error: any, context?: string): string {
  const baseMessage = handleApiError(error);
  
  if (context) {
    return `${context}: ${baseMessage}`;
  }
  
  return baseMessage;
}

/**
 * 记录错误日志
 * @param error 错误对象
 * @param context 上下文信息
 */
export function logApiError(error: any, context?: string): void {
  console.error('API Error:', {
    message: error?.message,
    code: error?.data?.code,
    context,
    timestamp: new Date().toISOString(),
    stack: error?.stack
  });
} 