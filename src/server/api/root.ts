import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import Vacancy from "./routers/Vaccancy";
import Applicants from "./routers/Applicants"
import Event from './routers/Event'
import { Member } from "./routers/Member";

export const appRouter = createTRPCRouter({
  event:Event,
  vacancy:Vacancy,
  applicants:Applicants,
  member:Member
});


export type AppRouter = typeof appRouter;
