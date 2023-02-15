import { publicProcedure,createTRPCRouter } from "../trpc";
import { z } from "zod";

const Applicants = createTRPCRouter({
    getAll:publicProcedure.query(({ctx})=>{
        let data = ctx.prisma.applecants.findMany({})
        return data
    }),
    getByJobId:publicProcedure
    .input(z.object({id:z.string()}))
    .query(({input,ctx})=>{
        let data = ctx.prisma.applecants.findMany({
            where:{
                vacancyId:input.id
            }
        })
        return data != null ? data:[]
    }),
    getById:publicProcedure
    .input(z.object({id:z.string()}))
    .query(({input,ctx})=>{
        const data = ctx.prisma.applecants.findFirst({
            where:{
                id:input.id
            }
        })
        return data != null ? data:{}
    }),
    deleteSingle:publicProcedure
    .input(z.object({id:z.string()}))
    .mutation(({input,ctx})=>{
        let data = ctx.prisma.applecants.delete({
            where:{
                id:input.id
            }
        })
        return data
    })
})

export default Applicants