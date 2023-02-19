import { createTRPCRouter } from "./trpc";
import Vacancy from "./routers/Vaccancy";
import Applicants from "./routers/Applicants"
import Event from './routers/Event'
import { Member } from "./routers/Member";
import { HomeImage } from './routers/HomeImage';

export const appRouter = createTRPCRouter({
  event:Event,
  vacancy:Vacancy,
  applicants:Applicants,
  member:Member,
  homeImage:HomeImage
});


export type AppRouter = typeof appRouter;
