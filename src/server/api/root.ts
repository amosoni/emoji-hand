import { createTRPCRouter } from "~/server/api/trpc";
import { emojiRouter } from "~/server/api/routers/emoji";
import { creemRouter } from "~/server/api/creem";
import { captchaRouter } from "~/server/api/captcha";
import { lovartEnhancedRouter } from "~/server/api/routers/lovart-enhanced";
import { emojiPackRouter } from "~/server/api/routers/emoji-pack";
import { emojiPackCreditsRouter } from "~/server/api/routers/emoji-pack-credits";
import { emojiPackLovartStyleRouter } from "~/server/api/routers/emoji-pack-lovart-style";
import { emojiPackSubscriptionRouter } from "~/server/api/routers/emoji-pack-subscription";
import { emojiPackTiersRouter } from "~/server/api/routers/emoji-pack-tiers";
import { usageLimitsRouter } from "~/server/api/routers/usage-limits";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  emoji: emojiRouter,
  creem: creemRouter,
  captcha: captchaRouter,
  lovart: lovartEnhancedRouter,
  emojiPack: emojiPackRouter,
  emojiPackCredits: emojiPackCreditsRouter,
  emojiPackLovartStyle: emojiPackLovartStyleRouter,
  emojiPackSubscription: emojiPackSubscriptionRouter,
  emojiPackTiers: emojiPackTiersRouter,
  usageLimits: usageLimitsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
