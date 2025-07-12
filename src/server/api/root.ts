import { createTRPCRouter } from "~/server/api/trpc";
import { emojiRouter } from "~/server/api/routers/emoji";
import { creemRouter } from "~/server/api/creem";
import { captchaRouter } from "~/server/api/captcha";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  emoji: emojiRouter,
  creem: creemRouter,
  captcha: captchaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
