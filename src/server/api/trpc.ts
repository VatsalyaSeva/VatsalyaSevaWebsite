
import type { IronSessionOptions } from "iron-session";
import * as trpcNext from "@trpc/server/adapters/next";
import { getIronSession } from "iron-session";
import { prisma } from "../db";
import { sanityClient } from "../storage";

type CreateContextOptions = Record<string, never>;

export type User = {
  isLoggedIn: boolean;
};

export const sessionOptions: IronSessionOptions = {
  password: '12345678901234567890123456789032',
  cookieName: "user",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}


const createInnerTRPCContext = async (opts: trpcNext.CreateNextContextOptions) => {
  const session = await getIronSession(opts.req, opts.res, sessionOptions);
  return {
    prisma,
    sanityClient,
    session
  };
};

/**
 * This is the actual context you will use in your router. It will be used to
 * process every request that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (opts: trpcNext.CreateNextContextOptions) => {
  return createInnerTRPCContext(opts);
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and
 * transformer.
 */
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in.
 */
export const publicProcedure = t.procedure;
