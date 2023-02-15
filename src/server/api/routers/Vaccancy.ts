import { publicProcedure,createTRPCRouter } from "../trpc";
import { z } from "zod";
import fs from 'fs-extra'

const Vacancy = createTRPCRouter({
    getAll:publicProcedure.query(({ctx})=>{
        let data = ctx.prisma.vacancy.findMany({})
        return data
    }),
    getById:publicProcedure
    .input(z.object({id:z.string()}))
    .query(async({input,ctx})=>{
        const data = await ctx.prisma.vacancy.findFirst({
            where:{
                id:input.id
            }
        })
        
        return data 
    }),
    deleteSingle:publicProcedure
    .input(z.object({id:z.string()}))
    .mutation(async ({input,ctx})=>{
        const allApplicants = await ctx.prisma.applecants.findMany({
            where: {
              vacancyId: input.id
            }
        });

        await ctx.prisma.applecants.deleteMany({
            where: {
              vacancyId: input.id
            }
        });

        await ctx.prisma.vacancy.delete({
            where:{
                id: input.id
            }
        });

        allApplicants.forEach(element => {
            fs.remove(`./public/${element.cvFilePath}`, err => {
                if (err) return console.error(err)
                console.log('success!')
            })
        });

        return []
    })
})

export default Vacancy