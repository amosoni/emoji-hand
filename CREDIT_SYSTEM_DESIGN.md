# 基于AI成本的积分系统设计

## 📊 当前积分系统问题分析

### 现有问题
1. **积分定价不合理**: 1积分=1张图，没有考虑不同功能的成本差异
2. **功能覆盖不全**: 只覆盖表情包生成，没有覆盖其他AI功能
3. **定价混乱**: 不同文件中的积分包定价不一致
4. **成本不透明**: 用户不知道积分对应的实际AI成本

## 💰 基于AI成本的积分系统设计

### 1. 积分成本对应表

| 功能 | AI模型 | 实际成本 | 积分消耗 | 说明 |
|------|--------|----------|----------|------|
| **Emoji Translation (免费)** | GPT-3.5-turbo | $0.000275 | 1积分 | 基础翻译 |
| **Emoji Translation (付费)** | GPT-4 | $0.0075 | 3积分 | 高质量翻译 |
| **Emoji Generator** | GPT-4o + DALL-E 3 | $0.044 | 20积分 | 图像分析+生成+描述 |
| **Lovart Style** | GPT-4o + DALL-E 3 | $0.205 | 100积分 | 概念生成+5张图像 |
| **Lovart Enhanced** | GPT-4o + DALL-E 3 | $0.205 | 100积分 | 专业设计代理 |
| **Realtime Translation** | GPT-4o-realtime | $0.001 | 1积分 | 实时流式翻译 |

### 2. 积分包定价策略

#### 基础积分包
```typescript
const creditPackages = {
  starter: {
    credits: 100,        // 100积分
    price: 9.99,         // $9.99
    bonus: 0,            // 无赠送
    costPerCredit: 0.0999, // 每积分成本
    description: "适合轻度使用，约50次基础翻译"
  },
  popular: {
    credits: 500,        // 500积分
    price: 39.99,        // $39.99
    bonus: 50,           // 赠送50积分
    costPerCredit: 0.0727, // 每积分成本
    description: "适合个人用户，约25次表情包生成"
  },
  pro: {
    credits: 1000,       // 1000积分
    price: 69.99,        // $69.99
    bonus: 150,          // 赠送150积分
    costPerCredit: 0.0609, // 每积分成本
    description: "适合专业用户，约10次Lovart设计"
  },
  enterprise: {
    credits: 2500,       // 2500积分
    price: 149.99,       // $149.99
    bonus: 500,          // 赠送500积分
    costPerCredit: 0.0500, // 每积分成本
    description: "适合企业用户，约30次Lovart设计"
  }
};
```

### 3. 积分获取方式

#### 免费获取
```typescript
const freeCreditSources = {
  dailyCheckIn: 1,           // 每日签到: +1积分
  weeklyCheckIn: 5,          // 连续7天签到: +5积分
  registrationBonus: 10,     // 注册奖励: +10积分
  referralBonus: 20,         // 邀请好友: +20积分
  firstPurchaseBonus: 50,    // 首次购买: +50积分
  reviewBonus: 5,            // 评价奖励: +5积分
  socialShareBonus: 3        // 社交分享: +3积分
};
```

#### 付费获取
```typescript
const paidCreditSources = {
  directPurchase: "直接购买积分包",
  subscriptionBonus: "订阅用户每月赠送积分",
  bulkDiscount: "大量购买折扣",
  seasonalPromotion: "季节性促销"
};
```

### 4. 积分消费规则

#### 功能积分消耗
```typescript
const creditConsumption = {
  emojiTranslation: {
    free: 1,    // GPT-3.5-turbo
    premium: 3   // GPT-4
  },
  emojiGenerator: {
    standard: 20,    // 1张图
    batch: 15        // 批量生成优惠
  },
  lovartStyle: {
    standard: 100,   // 5张图
    enhanced: 120    // 增强版
  },
  realtimeTranslation: {
    standard: 1      // 实时翻译
  }
};
```

#### 批量优惠
```typescript
const batchDiscounts = {
  emojiGenerator: {
    1: 20,    // 1张: 20积分
    3: 50,    // 3张: 50积分 (优惠10积分)
    5: 80,    // 5张: 80积分 (优惠20积分)
    10: 150   // 10张: 150积分 (优惠50积分)
  },
  lovartStyle: {
    1: 100,   // 1次: 100积分
    3: 280,   // 3次: 280积分 (优惠20积分)
    5: 450,   // 5次: 450积分 (优惠50积分)
    10: 850   // 10次: 850积分 (优惠150积分)
  }
};
```

### 5. 用户等级与积分

#### 等级特权
```typescript
const userTiers = {
  free: {
    dailyFreeCredits: 5,     // 每日免费积分
    maxCredits: 100,         // 最大积分上限
    features: ['emojiTranslation', 'realtimeTranslation']
  },
  starter: {
    dailyFreeCredits: 10,    // 每日免费积分
    maxCredits: 500,         // 最大积分上限
    features: ['emojiTranslation', 'emojiGenerator', 'realtimeTranslation'],
    discount: 0.05           // 5%折扣
  },
  pro: {
    dailyFreeCredits: 20,    // 每日免费积分
    maxCredits: 2000,        // 最大积分上限
    features: ['all'],
    discount: 0.10,          // 10%折扣
    monthlyBonus: 100        // 每月赠送100积分
  },
  enterprise: {
    dailyFreeCredits: 50,    // 每日免费积分
    maxCredits: 10000,       // 最大积分上限
    features: ['all', 'api', 'whiteLabel'],
    discount: 0.15,          // 15%折扣
    monthlyBonus: 300        // 每月赠送300积分
  }
};
```

### 6. 积分系统优势

#### 对用户的好处
1. **透明定价**: 清楚知道每个功能的积分消耗
2. **灵活使用**: 可以自由选择使用哪些功能
3. **批量优惠**: 大量使用有折扣
4. **免费获取**: 多种免费获取积分的方式

#### 对平台的好处
1. **成本控制**: 精确控制AI成本
2. **用户留存**: 签到和邀请机制提高留存
3. **收入多样化**: 积分包销售 + 订阅收入
4. **数据洞察**: 了解用户使用偏好

### 7. 实施计划

#### 第一阶段 (1-2周)
- [ ] 更新数据库模型
- [ ] 实现积分系统API
- [ ] 更新前端积分显示

#### 第二阶段 (2-3周)
- [ ] 实现签到系统
- [ ] 实现邀请奖励
- [ ] 实现批量优惠

#### 第三阶段 (3-4周)
- [ ] 积分包购买系统
- [ ] 用户等级特权
- [ ] 数据分析面板

这个积分系统设计既考虑了AI的实际成本，又提供了灵活的使用方式，能够有效平衡用户体验和平台盈利。 