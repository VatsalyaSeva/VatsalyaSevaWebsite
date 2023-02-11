import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { Events } from './routers/user/Event';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  event: Events,
});

// export type definition of API
export type AppRouter = typeof appRouter;
