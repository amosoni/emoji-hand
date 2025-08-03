# 盈利订阅系统设计

## 项目现状分析

### 现有生成器系统
1. **Emoji Generator** - 表情包生成器
2. **Lovart Style** - AI设计代理
3. **Realtime Translation** - 实时翻译
4. **TikTok Emojis** - TikTok表情包
5. **Gen Z Guide** - 内容展示页面

### 成本分析
- **Emoji Generator**: 中等成本 (GPT-4 + DALL-E)
- **Lovart Style**: 高成本 (GPT-4 + 多张DALL-E图片)
- **Realtime Translation**: 低成本 (GPT-3.5)
- **TikTok Emojis**: 无成本 (静态内容)

## 完善的盈利订阅系统设计

### 1. 用户等级系统

#### 🆓 **免费用户 (Free)**
- **每日免费次数**: 5次
- **功能限制**:
  - Emoji Generator: 2次/天
  - Lovart Style: 1次/天
  - Realtime Translation: 2次/天
- **广告**: 有
- **导出质量**: 标准
- **客服支持**: 社区支持

#### 🚀 **入门用户 (Starter) - $9.99/月**
- **每日免费次数**: 20次
- **功能限制**:
  - Emoji Generator: 10次/天
  - Lovart Style: 5次/天
  - Realtime Translation: 5次/天
- **广告**: 无
- **导出质量**: 高清
- **客服支持**: 邮件支持
- **额外功能**:
  - 批量生成
  - 自定义样式
  - 历史记录

#### ⭐ **专业用户 (Pro) - $19.99/月**
- **每日免费次数**: 50次
- **功能限制**:
  - Emoji Generator: 25次/天
  - Lovart Style: 15次/天
  - Realtime Translation: 10次/天
- **广告**: 无
- **导出质量**: 超高清
- **客服支持**: 优先支持
- **额外功能**:
  - 所有Starter功能
  - API访问
  - 团队协作
  - 高级模板
  - 商业使用授权

#### 🏢 **企业用户 (Enterprise) - $49.99/月**
- **每日免费次数**: 200次
- **功能限制**:
  - Emoji Generator: 100次/天
  - Lovart Style: 50次/天
  - Realtime Translation: 50次/天
- **广告**: 无
- **导出质量**: 最高质量
- **客服支持**: 专属客服
- **额外功能**:
  - 所有Pro功能
  - 白标解决方案
  - 自定义部署
  - 数据导出
  - 培训支持

### 2. 积分系统设计

#### 积分获取方式
1. **每日签到**: +1积分
2. **连续签到**: 第7天 +5积分
3. **邀请好友**: +10积分/人
4. **购买积分包**: 直接购买
5. **订阅奖励**: 每月赠送积分

#### 积分消费标准
- **Emoji Generator**: 2积分/次
- **Lovart Style**: 5积分/次
- **Realtime Translation**: 1积分/次

#### 积分包定价
- **小包**: 100积分 = $4.99
- **中包**: 500积分 = $19.99
- **大包**: 1000积分 = $34.99
- **超大包**: 2500积分 = $79.99

### 3. 数据库架构优化

```prisma
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String?  @unique
  username      String?  @unique
  passwordHash  String?
  
  // 订阅信息
  subscriptionPlan    String   @default("free") // free, starter, pro, enterprise
  subscriptionExpireAt DateTime?
  subscriptionStatus   String   @default("active") // active, cancelled, expired
  
  // 积分系统
  credits            Int      @default(0)
  totalCreditsEarned Int      @default(0)
  totalCreditsSpent  Int      @default(0)
  
  // 每日使用限制
  dailyUsage         Json     @default("{}") // {emojiGenerator: 0, lovartStyle: 0, realtimeTranslation: 0}
  lastUsageReset     DateTime @default(now())
  
  // 签到系统
  lastCheckIn        DateTime?
  consecutiveCheckIns Int      @default(0)
  
  // 邀请系统
  referralCode       String?  @unique
  referredBy         String?
  referralCount      Int      @default(0)
  
  // 支付信息
  creemCustomerId    String?
  points             Int      @default(0)
  
  // 时间戳
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  // 关联
  accounts           Account[]
  sessions           Session[]
  posts              Post[]
  usageRecords       UsageRecord[]
  creditTransactions CreditTransaction[]
  checkIns           CheckIn[]
}

model UsageRecord {
  id          String   @id @default(cuid())
  userId      String
  serviceType String   // emojiGenerator, lovartStyle, realtimeTranslation
  creditsUsed Int
  cost        Float
  inputData   Json?    // 存储输入数据
  outputData  Json?    // 存储输出数据
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CreditTransaction {
  id          String   @id @default(cuid())
  userId      String
  type        String   // purchase, reward, bonus, refund
  amount      Int
  description String
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CheckIn {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime @default(now())
  creditsEarned Int  @default(1)
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 4. 盈利策略

#### 收入来源
1. **订阅收入**: 主要收入来源
2. **积分包销售**: 补充收入
3. **企业定制**: 高价值服务
4. **API服务**: 开发者收入

#### 成本控制
1. **智能路由**: 根据用户等级选择不同模型
2. **缓存机制**: 减少重复计算
3. **批量处理**: 提高效率
4. **CDN优化**: 减少带宽成本

#### 定价策略
- **免费用户**: 吸引用户，建立习惯
- **入门用户**: 低门槛，高转化
- **专业用户**: 核心用户，主要利润
- **企业用户**: 高价值，定制服务

### 5. 功能实现优先级

#### 第一阶段 (1-2周)
- [ ] 用户等级系统
- [ ] 每日使用限制
- [ ] 积分系统基础功能
- [ ] 订阅状态检查

#### 第二阶段 (2-3周)
- [ ] 签到系统
- [ ] 邀请奖励
- [ ] 积分包购买
- [ ] 使用记录

#### 第三阶段 (3-4周)
- [ ] 高级功能解锁
- [ ] API访问
- [ ] 团队协作
- [ ] 数据分析

### 6. 用户体验优化

#### 引导流程
1. **免费试用**: 新用户立即体验
2. **功能对比**: 清晰展示各等级差异
3. **渐进升级**: 在限制时提示升级
4. **价值展示**: 突出付费功能价值

#### 留存策略
1. **每日签到**: 建立使用习惯
2. **成就系统**: 游戏化体验
3. **社区功能**: 用户互动
4. **定期活动**: 促销和奖励

### 7. 技术实现要点

#### 中间件检查
```typescript
// 检查用户权限和限制
export async function checkUserLimits(userId: string, serviceType: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  // 检查订阅状态
  if (user.subscriptionExpireAt < new Date()) {
    return { allowed: false, reason: 'subscription_expired' };
  }
  
  // 检查每日限制
  const dailyUsage = user.dailyUsage as Record<string, number>;
  const limit = getDailyLimit(user.subscriptionPlan, serviceType);
  
  if (dailyUsage[serviceType] >= limit) {
    return { allowed: false, reason: 'daily_limit_reached' };
  }
  
  return { allowed: true };
}
```

#### 积分系统
```typescript
// 消费积分
export async function spendCredits(userId: string, amount: number, reason: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (user.credits < amount) {
    throw new Error('Insufficient credits');
  }
  
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { 
        credits: { decrement: amount },
        totalCreditsSpent: { increment: amount }
      }
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        type: 'spend',
        amount: -amount,
        description: reason
      }
    })
  ]);
}
```

这个系统设计既保证了盈利能力，又提供了良好的用户体验，能够有效吸引和留存用户。 