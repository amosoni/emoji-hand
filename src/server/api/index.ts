import { createTRPCRouter } from './trpc';
import { creemRouter } from './creem';
 
export const appRouter = createTRPCRouter({
  creem: creemRouter,
  // 已移除 points: pointsRouter
}); 