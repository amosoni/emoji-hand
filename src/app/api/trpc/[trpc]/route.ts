import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  // 兼容 next-auth: 将 NextRequest 转为 next-auth 需要的 req/res
  const reqLike = {
    headers: Object.fromEntries(req.headers.entries()),
    cookies: Object.fromEntries(
      Array.from(req.cookies.getAll()).map(c => [c.name, c.value])
    ),
    method: req.method,
    url: req.url,
    query: {},
    body: undefined,
  } as unknown as NextApiRequest;
  const resLike = {} as NextApiResponse;
  return createTRPCContext({ req: reqLike, res: resLike });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
