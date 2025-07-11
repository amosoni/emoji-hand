import { createTRPCRouter } from '@/server/api/trpc';
import { creemRouter } from '@/server/api/creem';
 
export const appRouter = createTRPCRouter({
  creem: creemRouter,
  // 已移除 points: pointsRouter
}); 