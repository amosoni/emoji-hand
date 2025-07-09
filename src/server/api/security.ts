import { logSecurityEvent, SecurityEventType } from './monitoring';

// 内存存储（生产环境建议用 Redis）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const ipBlacklist = new Set<string>();
const suspiciousUsers = new Set<string>();

// IP 速率限制
export const checkIPRateLimit = async (ip: string, limit: number = 50, windowMs: number = 15 * 60 * 1000) => {
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

// 用户速率限制
export const checkUserRateLimit = async (userId: string, limit: number = 10, windowMs: number = 15 * 60 * 1000) => {
  const key = `user:${userId}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    // 记录用户速率限制事件
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

// 设备指纹检测
export const checkDeviceFingerprint = async (userId: string, deviceInfo: {
  ip: string;
  userAgent: string;
  timestamp: string;
}) => {
  // 用户相关逻辑用占位符或注释替换
  // const user = await clerkClient.users.getUser(userId);
  // const deviceHistory = (user.publicMetadata.deviceHistory as any[]) || [];
  
  // 添加新设备记录
  // deviceHistory.push(deviceInfo);
  
  // 只保留最近10条记录
  // if (deviceHistory.length > 10) {
  //   deviceHistory.splice(0, deviceHistory.length - 10);
  // }
  
  // 检查短时间内设备变化
  // const recentDevices = deviceHistory.filter(
  //   device => Date.now() - new Date(device.timestamp).getTime() < 24 * 60 * 60 * 1000 // 24小时内
  // );
  
  // const uniqueIPs = new Set(recentDevices.map(d => d.ip));
  // const uniqueUserAgents = new Set(recentDevices.map(d => d.userAgent));
  
  // 如果24小时内IP或User-Agent变化过多，标记为可疑
  // if (uniqueIPs.size > 3 || uniqueUserAgents.size > 3) {
  //   await clerkClient.users.updateUser(userId, {
  //     publicMetadata: {
  //       ...user.publicMetadata,
  //       deviceHistory,
  //       suspiciousActivity: true,
  //       suspiciousReason: 'Multiple devices detected',
  //     },
  //   });
    
  //   // 记录设备指纹警报
  //   await logSecurityEvent({
  //     type: SecurityEventType.DEVICE_FINGERPRINT_ALERT,
  //     userId,
  //     ip: deviceInfo.ip,
  //     userAgent: deviceInfo.userAgent,
  //     details: { uniqueIPs: uniqueIPs.size, uniqueUserAgents: uniqueUserAgents.size },
  //   });
    
  //   return false;
  // }
  
  // await clerkClient.users.updateUser(userId, {
  //   publicMetadata: {
  //     ...user.publicMetadata,
  //     deviceHistory,
  //   },
  // });
  
  return true;
};

// 异常使用模式检测
export const checkAbnormalUsage = async (userId: string) => {
  // 用户相关逻辑用占位符或注释替换
  // const user = await clerkClient.users.getUser(userId);
  // const usageHistory = (user.publicMetadata.usageHistory as any[]) || [];
  
  // 添加当前使用记录
  // usageHistory.push({
  //   timestamp: new Date().toISOString(),
  // });
  
  // 只保留最近100条记录
  // if (usageHistory.length > 100) {
  //   usageHistory.splice(0, usageHistory.length - 100);
  // }
  
  // 检查1分钟内的使用频率
  // const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  // const recentUsage = usageHistory.filter(
  //   usage => new Date(usage.timestamp) > oneMinuteAgo
  // );
  
  // if (recentUsage.length > 5) {
  //   await clerkClient.users.updateUser(userId, {
  //     publicMetadata: {
  //       ...user.publicMetadata,
  //       usageHistory,
  //       suspiciousActivity: true,
  //       suspiciousReason: 'High frequency usage',
  //     },
  //   });
    
  //   // 记录异常使用事件
  //   await logSecurityEvent({
  //     type: SecurityEventType.ABNORMAL_USAGE,
  //     userId,
  //     ip: null,
  //     userAgent: null,
  //     details: { recentUsageCount: recentUsage.length, timeWindow: '1 minute' },
  //   });
    
  //   return false;
  // }
  
  // await clerkClient.users.updateUser(userId, {
  //   publicMetadata: {
  //     ...user.publicMetadata,
  //     usageHistory,
  //   },
  // });
  
  return true;
};

// IP 黑名单检查
export const checkIPBlacklist = (ip: string) => {
  return !ipBlacklist.has(ip);
};

// 添加 IP 到黑名单
export const addToIPBlacklist = async (ip: string) => {
  ipBlacklist.add(ip);
  
  // 记录IP黑名单事件
  await logSecurityEvent({
    type: SecurityEventType.IP_BLACKLISTED,
    ip,
    userAgent: null,
    details: { reason: 'Rate limit exceeded' },
  });
  
  console.log(`IP ${ip} added to blacklist`);
};

// 检查可疑用户
export const checkSuspiciousUser = async (userId: string) => {
  // 用户相关逻辑用占位符或注释替换
  // const user = await clerkClient.users.getUser(userId);
  // return !user.publicMetadata.suspiciousActivity;
  return false; // Placeholder
};

// 综合安全检查
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
  
  // 2. 检查 IP 速率限制
  if (!(await checkIPRateLimit(ip))) {
    await addToIPBlacklist(ip);
    throw new Error('IP rate limit exceeded');
  }
  
  // 3. 检查用户速率限制
  if (!(await checkUserRateLimit(userId))) {
    throw new Error('User rate limit exceeded');
  }
  
  // 4. 检查设备指纹
  const deviceInfo = { ip, userAgent, timestamp: new Date().toISOString() };
  if (!(await checkDeviceFingerprint(userId, deviceInfo))) {
    throw new Error('Suspicious device activity detected');
  }
  
  // 5. 检查异常使用模式
  if (!(await checkAbnormalUsage(userId))) {
    throw new Error('Abnormal usage pattern detected');
  }
  
  // 6. 检查可疑用户
  if (!(await checkSuspiciousUser(userId))) {
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