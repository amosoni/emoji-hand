# 盈利订阅系统设计

## 现有生成器分析

### 成本分级
- **高成本**: Lovart Style (GPT-4 + 多张DALL-E图片)
- **中成本**: Emoji Generator (GPT-4 + DALL-E)
- **低成本**: Realtime Translation (GPT-3.5)
- **无成本**: TikTok Emojis, Gen Z Guide (静态内容)

## 订阅等级设计

### 🆓 免费用户 (Free)
- **每日限制**: 5次总使用
- **功能**: 基础功能 + 广告
- **价格**: $0/月

### 🚀 入门用户 (Starter) - $9.99/月
- **每日限制**: 20次总使用
- **功能**: 无广告 + 高清导出
- **积分**: 每月赠送50积分

### ⭐ 专业用户 (Pro) - $19.99/月
- **每日限制**: 50次总使用
- **功能**: API访问 + 团队协作
- **积分**: 每月赠送150积分

### 🏢 企业用户 (Enterprise) - $49.99/月
- **每日限制**: 200次总使用
- **功能**: 白标 + 定制部署
- **积分**: 每月赠送500积分

## 积分系统

### 获取方式
- 每日签到: +1积分
- 连续7天: +5积分
- 邀请好友: +10积分
- 订阅奖励: 每月赠送

### 消费标准
- Emoji Generator: 2积分
- Lovart Style: 5积分
- Realtime Translation: 1积分

### 积分包
- 100积分: $4.99
- 500积分: $19.99
- 1000积分: $34.99

## 数据库优化

```prisma
model User {
  // 订阅信息
  subscriptionPlan    String   @default("free")
  subscriptionExpireAt DateTime?
  
  // 积分系统
  credits            Int      @default(0)
  totalCreditsEarned Int      @default(0)
  totalCreditsSpent  Int      @default(0)
  
  // 每日使用限制
  dailyUsage         Json     @default("{}")
  lastUsageReset     DateTime @default(now())
  
  // 签到系统
  lastCheckIn        DateTime?
  consecutiveCheckIns Int      @default(0)
}
```

## 盈利策略

### 收入来源
1. **订阅收入** (70%) - 主要收入
2. **积分包销售** (20%) - 补充收入
3. **企业定制** (10%) - 高价值服务

### 成本控制
1. **智能路由**: 根据用户等级选择模型
2. **缓存机制**: 减少重复计算
3. **批量处理**: 提高效率

## 实施计划

### 第一阶段 (1周)
- [ ] 用户等级系统
- [ ] 每日使用限制
- [ ] 基础积分系统

### 第二阶段 (1周)
- [ ] 签到系统
- [ ] 邀请奖励
- [ ] 积分包购买

### 第三阶段 (1周)
- [ ] 高级功能解锁
- [ ] API访问
- [ ] 数据分析

这个系统既能保证盈利能力，又提供良好用户体验。 