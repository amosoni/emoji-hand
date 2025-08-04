/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "~/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

function headersToObject(headers: Headers): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

// 类型守卫：判断 req 是否为 Node/NextApiRequest
interface MaybeNodeRequest {
  getHeader?: (...args: unknown[]) => unknown;
  headers?: Record<string, unknown> & { get?: (...args: unknown[]) => unknown };
}
function isNodeRequest(req: unknown): req is MaybeNodeRequest {
  return !!req && (
    typeof (req as MaybeNodeRequest).getHeader === "function" ||
    typeof (req as MaybeNodeRequest).headers === "object" ||
    typeof (req as MaybeNodeRequest).headers?.get === "function"
  );
}

function isNextApiRequest(req: unknown): req is NextApiRequest {
  return !!req && typeof (req as NextApiRequest).headers === "object" && typeof (req as NextApiRequest).method === "string";
}
function isNextApiResponse(res: unknown): res is NextApiResponse {
  return !!res && typeof (res as NextApiResponse).status === "function";
}

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { req?: unknown, res?: unknown }) => {
  let session = null;
  
  // 优先尝试获取真实的NextAuth session
  if (opts.req && opts.res && isNextApiRequest(opts.req) && isNextApiResponse(opts.res)) {
    try {
      session = await getServerSession(opts.req, opts.res, authOptions);
      console.log('NextAuth session from getServerSession:', session);
    } catch (e) {
      console.error('Failed to get server session:', e);
      session = null;
    }
  }
  
  // 从session中提取userId
  let userId: string | undefined;
  if (session && typeof session === 'object') {
    console.log('Processing session object:', session);
    console.log('Session keys:', Object.keys(session));
    
    // 优先从 session.user.id 获取（NextAuth标准格式）
    if ('user' in session && session.user && typeof session.user === 'object' && 'id' in session.user) {
      userId = (session.user as { id?: string }).id;
      console.log('Found userId from session.user.id:', userId);
    }
    // 兼容 session.userId
    if (!userId && 'userId' in session) {
      userId = (session as { userId?: string }).userId;
      console.log('Found userId from session.userId:', userId);
    }
    // 兜底：session.id
    if (!userId && 'id' in session) {
      userId = (session as { id?: string }).id;
      console.log('Found userId from session.id:', userId);
    }
  }
  
  console.log('Final context session:', session);
  console.log('Final context userId:', userId);
  
  // 确保session对象包含userId
  const sessionWithUserId = { 
    ...session, 
    userId,
    user: session?.user ? { ...session.user, id: userId } : undefined
  };
  
  return {
    db,
    session: sessionWithUserId,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  });

// 类型守卫：判断 session 是否有 user.id
function getUserIdFromSession(session: unknown): string | undefined {
  if (
    session && typeof session === 'object'
  ) {
    if ('user' in session && typeof (session as { user?: { id?: unknown } }).user === 'object') {
      const user = (session as { user?: { id?: unknown } }).user;
      if (user && typeof user === 'object' && 'id' in user && typeof (user as { id?: unknown }).id === 'string') {
        return (user as { id: string }).id;
      }
    }
    if ('userId' in session && typeof (session as { userId?: unknown }).userId === 'string') {
      return (session as { userId: string }).userId;
    }
    if ('id' in session && typeof (session as { id?: unknown }).id === 'string') {
      return (session as { id: string }).id;
    }
  }
  return undefined;
}
