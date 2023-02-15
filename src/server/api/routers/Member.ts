import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const Member = createTRPCRouter({
  getAll:publicProcedure
  .query(async ({ctx})=>{
    let data = await ctx.prisma.member.findMany({})
    return data
  })
});
