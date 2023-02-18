import { publicProcedure,createTRPCRouter } from "../trpc";
import { z } from "zod";
import fs from 'fs-extra'

const Vacancy = createTRPCRouter({
    getAll:publicProcedure.query(({ctx})=>{
        let data = ctx.prisma.vacancy.findMany({})
        return data
    }),
    getById:publicProcedure
    .input(z.object({
        id:z.string(),
        applicant:z.boolean()
    }))
    .query(async({input,ctx})=>{
        const data = await ctx.prisma.vacancy.findFirst({
            where:{
                id:input.id
            },
            include:{
                applecants:input.applicant
            }
        })
        
        return data 
    }),
    deleteSingle:publicProcedure
    .input(z.object({id:z.string()}))
    .mutation(async ({input,ctx})=>{
        const allApplicants = await ctx.prisma.applicant.findMany({
            where: {
              vacancyId: input.id
            }
        });

        await ctx.prisma.applicant.deleteMany({
            where: {
              vacancyId: input.id
            }
        });

        let data = await ctx.prisma.vacancy.delete({
            where:{
                id: input.id
            }
        });

        if(typeof(data.qrCodePath) == 'string'){
            ctx.sanityClient.delete(data.qrCodePath)
        }

        allApplicants.forEach(element => {
            ctx.sanityClient.delete(element.cvFilePath)
        });

        return data
    }),
    createRecord:publicProcedure
    .input(z.object({
        vacancyName: z.string(),
        vacancyDescription: z.string(),
        jobCount: z.number(),
        salary: z.number(),
        lastSubmissionDate: z.string(),
        interviewDate: z.string(),
        location: z.string(),
        fees: z.number(),
    }))
    .mutation(async ({ctx,input})=>{
        let res = await ctx.prisma.vacancy.create({
            data:input
        })
        return res
    }),
    addQRCode:publicProcedure
    .input(z.object({
        vacancyId:z.string(),
        qrCodePath:z.string(),
        qrCodePathUrl:z.string()
    }))
    .mutation(async ({ctx,input})=>{
        let data = await ctx.prisma.vacancy.update({
            where:{id:input.vacancyId},
            data:{
                qrCodePath:input.qrCodePath,
                qrCodePathUrl:input.qrCodePathUrl
            }
        })
        return data
    }),
    removeQRCode:publicProcedure
    .input(z.object({
        vacancyId:z.string(),
        qrCodePath:z.string()
    }))
    .mutation(async ({ctx,input})=>{
        let data = await ctx.prisma.vacancy.update({
            where:{id:input.vacancyId},
            data:{
                qrCodePath:null,
                qrCodePathUrl:null
            }
        })
        ctx.sanityClient.delete(input.qrCodePath)
        
        return data
    }),
    updateRecord:publicProcedure
    .input(z.object({
        id:z.string(),
        update:z.object({
            vacancyName: z.string(),
            vacancyDescription: z.string(),
            jobCount: z.number(),
            salary: z.number(),
            lastSubmissionDate: z.string(),
            interviewDate: z.string(),
            location: z.string(),
            fees: z.number()
        })
    }))
    .mutation(async({ctx,input})=>{
        let res = await ctx.prisma.vacancy.update({
            where:{
                id:input.id
            },
            data:input.update
        })
        return res
    })

})

export default Vacancy