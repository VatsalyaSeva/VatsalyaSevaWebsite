import { publicProcedure,createTRPCRouter } from "../trpc";
import { object, z } from "zod";

const Applicants = createTRPCRouter({
    searchByName:publicProcedure
    .input(z.object({
        search:z.string()
    }))
    .query(({ctx,input})=>{
        const data = ctx.prisma.applicant.findMany({
            where:{
                name:{
                    contains:input.search
                }
            }
        })
        return data
    }),
    searchByID:publicProcedure
    .input(z.object({
        id:z.string()
    }))
    .query(({ctx,input})=>{
        const data = ctx.prisma.applicant.findMany({
            where:{
                id:{
                    equals:input.id
                }
            }
        })
        return data
    }),
    getByJobId:publicProcedure
    .input(z.object({id:z.string()}))
    .query(({input,ctx})=>{
        const data = ctx.prisma.applicant.findMany({
            where:{
                vacancyId:input.id
            }
        })
        return data != null ? data:[]
    }),
    getById:publicProcedure
    .input(z.object({id:z.string()}))
    .query(({input,ctx})=>{
        const data = ctx.prisma.applicant.findFirst({
            where:{
                id:input.id
            }
        })
        return data != null ? data:{}
    }),
    deleteSingle:publicProcedure
    .input(z.object({id:z.string()}))
    .mutation(async ({input,ctx})=>{
        const data = await ctx.prisma.applicant.delete({
            where:{
                id:input.id
            }
        })
        return data
    }),
    createRecord:publicProcedure
    .input(z.object({
        vacancyId:z.string(),
        add:z.object({
            name:z.string(),
            phone:z.string(),
            email:z.string().email(),
            cvFilePath:z.string(),
            cvFilePathUrl:z.string(),
            transactionId:z.string(),
            upiId:z.string()
        })
    }))
    .mutation(async ({ctx,input})=>{
        const a = await ctx.prisma.applicant.findMany({
            where:{
                vacancyId:input.vacancyId,
                phone:input.add.phone
            }
        })

        if(a.length == 0){
            const data = await ctx.prisma.applicant.create({
                data:{
                    ...input.add,
                    vacancy: {
                        connect: {
                            id: input.vacancyId
                        }
                    }
                }
            })
            return {
                code:200,
                message:'success',
                data:data
            }
        }else{
            ctx.sanityClient.delete(input.add.cvFilePath)
            return {
                code:400,
                message:'Your Application is already submitted',
                data:a
            }
        }

        
    })
})

export default Applicants