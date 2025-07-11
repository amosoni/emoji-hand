import "server-only";

import { appRouter, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createQueryClient } from "@/trpc/query-client";
import { cache } from "react";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  // next/headers 返回的是 Headers 实例，直接传递给 req
  const heads = await import("next/headers").then(m => m.headers());
  return createTRPCContext({ req: { headers: heads } });
});

export const createCaller = async () => appRouter.createCaller(await createContext());

export { createQueryClient };
