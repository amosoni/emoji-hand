import { logSecurityEvent, SecurityEventType } from '@/server/api/monitoring';

// 内存存储（生产环境建议用 Redis）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const ipBlacklist = new Set<string>();
const suspiciousUsers = new Set<string>();
const deviceFingerprints = new Map<string, Set<string>>();

// IP 速率限制 - 更严格
export const checkIPRateLimit = async (ip: string, limit = 30, windowMs = 15 * 60 * 1000) => {
  const key = `ip:${ip}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    // 记录速率限制事件
    await logSecurityEvent({
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      ip,
      userAgent: null,
      details: { limit, currentCount: record.count, windowMs },
    });
    return false;
  }
  
  record.count++;
  return true;
};

// 用户速率限制 - 更严格
export const checkUserRateLimit = async (userId: string, limit = 5, windowMs = 15 * 60 * 1000) => {
  const key = `user:${userId}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    await logSecurityEvent({
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      userId,
      ip: null,
      userAgent: null,
      details: { limit, currentCount: record.count, windowMs },
    });
    return false;
  }
  
  record.count++;
  return true;
};

// 设备指纹检查 - 防止多账号
export const checkDeviceFingerprint = async (userId: string, deviceInfo: { ip: string; userAgent: string; timestamp: string }) => {
  const fingerprint = `${deviceInfo.ip}-${deviceInfo.userAgent}`;
  const userDevices = deviceFingerprints.get(userId) ?? new Set();
  
  // 检查是否有其他用户使用相同设备
  for (const [otherUserId, devices] of deviceFingerprints.entries()) {
    if (otherUserId !== userId && devices.has(fingerprint)) {
      await logSecurityEvent({
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        userId,
        ip: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        details: { reason: 'Multiple accounts using same device', otherUserId },
      });
      return false;
    }
  }
  
  userDevices.add(fingerprint);
  deviceFingerprints.set(userId, userDevices);
  return true;
};

// 异常使用模式检测 - 更严格
export const checkAbnormalUsage = async (userId: string) => {
  // 检查1分钟内的使用频率
  const key = `usage:${userId}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60 * 1000 });
    return true;
  }
  
  // 1分钟内最多3次请求
  if (record.count >= 3) {
    await logSecurityEvent({
      type: SecurityEventType.ABNORMAL_USAGE,
      userId,
      ip: null,
      userAgent: null,
      details: { recentUsageCount: record.count, timeWindow: '1 minute' },
    });
    return false;
  }
  
  record.count++;
  return true;
};

// IP 黑名单检查
export const checkIPBlacklist = (ip: string) => {
  return !ipBlacklist.has(ip);
};

// 添加到IP黑名单
export const addToIPBlacklist = (ip: string) => {
  ipBlacklist.add(ip);
  console.log(`IP ${ip} added to blacklist`);
};

// 检查可疑用户
export const checkSuspiciousUser = (userId: string) => {
  return !suspiciousUsers.has(userId);
};

// 综合安全检查 - 更严格
export const performSecurityCheck = async (userId: string, ip: string, userAgent: string) => {
  // 1. 检查 IP 黑名单
  if (!checkIPBlacklist(ip)) {
    await logSecurityEvent({
      type: SecurityEventType.IP_BLACKLISTED,
      userId,
      ip,
      userAgent,
      details: { reason: 'IP is blacklisted' },
    });
    throw new Error('IP is blacklisted');
  }
  
  // 2. 检查 IP 速率限制 - 更严格
  if (!(await checkIPRateLimit(ip, 20, 15 * 60 * 1000))) {
    await addToIPBlacklist(ip);
    throw new Error('IP rate limit exceeded');
  }
  
  // 3. 检查用户速率限制 - 更严格
  if (!(await checkUserRateLimit(userId, 3, 15 * 60 * 1000))) {
    suspiciousUsers.add(userId);
    throw new Error('User rate limit exceeded');
  }
  
  // 4. 检查设备指纹
  const deviceInfo = { ip, userAgent, timestamp: new Date().toISOString() };
  if (!(await checkDeviceFingerprint(userId, deviceInfo))) {
    throw new Error('Suspicious device activity detected');
  }
  
  // 5. 检查异常使用模式 - 更严格
  if (!(await checkAbnormalUsage(userId))) {
    suspiciousUsers.add(userId);
    throw new Error('Abnormal usage pattern detected');
  }
  
  // 6. 检查可疑用户
  if (!checkSuspiciousUser(userId)) {
    await logSecurityEvent({
      type: SecurityEventType.SUSPICIOUS_ACTIVITY,
      userId,
      ip,
      userAgent,
      details: { reason: 'User account flagged for suspicious activity' },
    });
    throw new Error('User account flagged for suspicious activity');
  }
  
  return true;
}; 