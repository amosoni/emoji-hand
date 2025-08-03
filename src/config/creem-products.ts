// Creem商品ID配置
// 已配置的实际商品ID

export const CREEM_PRODUCT_IDS = {
  // 订阅套餐
  subscription: {
    starter: {
      monthly: 'prod_3XZIVCKHwECgkcQyo3vNSr', // Starter Plan - Monthly
      yearly: 'prod_5XCmcuccQ2Yis2xLrqsruP'    // Starter Plan - Yearly
    },
    pro: {
      monthly: 'prod_2cRx74dzyqotNZBpj9NPYd',     // Professional Plan - Monthly
      yearly: 'prod_6mQDjqkigXSKDoQYiMmW3Z'        // Professional Plan - Yearly
    },
    enterprise: {
      monthly: 'prod_5F6mdoKOElM5pu7xmWAvRW', // Enterprise Plan - Monthly
      yearly: 'prod_6YRdQjbYJp9MJhCc93NvaQ'    // Enterprise Plan - Yearly
    }
  }
} as const;

// 获取订阅商品ID
export const getSubscriptionProductId = (planId: string, cycle: 'monthly' | 'yearly') => {
  return CREEM_PRODUCT_IDS.subscription[planId as keyof typeof CREEM_PRODUCT_IDS.subscription]?.[cycle];
}; 