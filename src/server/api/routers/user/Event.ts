import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../../trpc";

export const Events = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input,ctx }) => {
        let data = ctx.prisma.events.findFirst({
            where:{
                id:input.id
            },
            include:{
                imagesUrl:true,
                videoUrl:true
            }
        })
      return data
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.events.findMany({
        include:{
            imagesUrl:true,
            videoUrl:true
        }
    })
  }),

});
