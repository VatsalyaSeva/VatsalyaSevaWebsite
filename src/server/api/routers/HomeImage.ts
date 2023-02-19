import { publicProcedure ,createTRPCRouter} from './../trpc';
import { z } from 'zod'

export const HomeImage = createTRPCRouter({
    addRecords:publicProcedure
    .input(z.object({
        data:z.array(z.object({
            imageSource:z.string(),
            imageSourceUrl:z.string(),
            imageDescription:z.string()
        }))
    }))
    .mutation(async ({input,ctx})=>{
        const response = await ctx.prisma.homeImages.createMany({
            data:input.data
        })
        return response
    }),
    addRecord:publicProcedure
    .input(z.object({
        imageSource:z.string(),
        imageSourceUrl:z.string(),
        imageDescription:z.string()
    }))
    .mutation(async ({input,ctx})=>{
        const response = await ctx.prisma.homeImages.create({
            data:input
        })
        return response
    }),
    getAllRecord:publicProcedure
    .query(({ctx})=>{
        const response = ctx.prisma.homeImages.findMany({})
        return response
    }),
    deleteSingleRecord:publicProcedure
    .input(z.object({id:z.string()}))
    .mutation(async({ctx, input})=>{
        const response = await ctx.prisma.homeImages.delete({where:{id:input.id}})
        await ctx.sanityClient.delete(response.imageSource)
        return response
    })
})