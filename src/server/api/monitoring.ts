import { clerkClient } from '@clerk/clerk-sdk-node';

// 安全事件类型
export enum SecurityEventType {
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  IP_BLACKLISTED = 'ip_blacklisted',
  DEVICE_FINGERPRINT_ALERT = 'device_fingerprint_alert',
  ABNORMAL_USAGE = 'abnormal_usage',
  CAPTCHA_REQUIRED = 'captcha_required',
  CAPTCHA_FAILED = 'captcha_failed',
  CAPTCHA_SUCCESS = 'captcha_success',
}

// 安全事件接口
export interface SecurityEvent {
  type: SecurityEventType;
  userId?: string;
  ip: string | null;
  userAgent: string | null;
  timestamp: string;
  details: Record<string, any>;
}

// 内存存储（生产环境建议用数据库或日志系统）
const securityEvents: SecurityEvent[] = [];

// 记录安全事件
export const logSecurityEvent = async (event: Omit<SecurityEvent, 'timestamp'>) => {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  
  securityEvents.push(securityEvent);
  
  // 限制存储的事件数量
  if (securityEvents.length > 1000) {
    securityEvents.splice(0, securityEvents.length - 1000);
  }
  
  // 记录到控制台（生产环境应该记录到日志系统）
  console.log(`[SECURITY] ${event.type}:`, {
    userId: event.userId,
    ip: event.ip,
    userAgent: event.userAgent,
    details: event.details,
  });
  
  // 如果是严重事件，更新用户元数据
  if (event.userId && (
    event.type === SecurityEventType.SUSPICIOUS_ACTIVITY ||
    event.type === SecurityEventType.ABNORMAL_USAGE ||
    event.type === SecurityEventType.DEVICE_FINGERPRINT_ALERT
  )) {
    try {
      const user = await clerkClient.users.getUser(event.userId);
      await clerkClient.users.updateUser(event.userId, {
        publicMetadata: {
          ...user.publicMetadata,
          securityEvents: [
            ...(user.publicMetadata.securityEvents as any[] || []),
            securityEvent,
          ].slice(-10), // 只保留最近10个安全事件
        },
      });
    } catch (error) {
      console.error('Failed to update user security metadata:', error);
    }
  }
};

// 获取安全事件统计
export const getSecurityStats = () => {
  const now = Date.now();
  const oneHourAgo = new Date(now - 60 * 60 * 1000);
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  
  const recentEvents = securityEvents.filter(
    event => new Date(event.timestamp) > oneHourAgo
  );
  
  const dailyEvents = securityEvents.filter(
    event => new Date(event.timestamp) > oneDayAgo
  );
  
  const stats = {
    totalEvents: securityEvents.length,
    recentEvents: recentEvents.length,
    dailyEvents: dailyEvents.length,
    eventTypes: {} as Record<SecurityEventType, number>,
  };
  
  // 统计各类型事件数量
  dailyEvents.forEach(event => {
    stats.eventTypes[event.type] = (stats.eventTypes[event.type] || 0) + 1;
  });
  
  return stats;
};

// 检查是否需要触发警报
export const checkSecurityAlerts = () => {
  const stats = getSecurityStats();
  const alerts = [];
  
  // 如果1小时内事件超过50个，触发警报
  if (stats.recentEvents > 50) {
    alerts.push({
      level: 'high',
      message: `High security event rate: ${stats.recentEvents} events in the last hour`,
    });
  }
  
  // 如果特定类型事件过多，触发警报
  Object.entries(stats.eventTypes).forEach(([type, count]) => {
    if (count > 10) {
      alerts.push({
        level: 'medium',
        message: `High ${type} events: ${count} in the last 24 hours`,
      });
    }
  });
  
  return alerts;
};

// 清理旧的安全事件
export const cleanupOldEvents = () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const initialLength = securityEvents.length;
  
  // 移除一周前的事件
  const filteredEvents = securityEvents.filter(
    event => new Date(event.timestamp) > oneWeekAgo
  );
  
  securityEvents.length = 0;
  securityEvents.push(...filteredEvents);
  
  console.log(`Cleaned up ${initialLength - securityEvents.length} old security events`);
};

// 定期清理（每小时执行一次）
setInterval(cleanupOldEvents, 60 * 60 * 1000); 