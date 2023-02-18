import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from 'zod'


export const Donator = createTRPCRouter({
    getAllRecord:publicProcedure
    .query(async ({ctx})=>{
        let data = await ctx.prisma.donator.findMany({
            include:{
                donations:true
            }
        })
        return data
    }),
    getTopDonators:publicProcedure
    .query(({ctx})=>{
        let data = ctx.prisma.donator.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                donations: true,
            },
            orderBy: {
                totalDonation: 'desc',
            },
            take: 10,
        })
        return data
    }),
    createRecord:publicProcedure
    .input(z.object({
        name:z.string(),
        countryCode:z.string(),
        phone:z.string(),
        email:z.string(),
        passwordHash:z.string()
    }))
    .mutation(async ({input,ctx})=>{
        let res = await ctx.prisma.donator.create({
            data:{
                name:input.name,
                countryCode:input.countryCode,
                phone:input.phone,
                email:input.email,
                passwordHash:input.passwordHash,
                totalDonation:0
            }
        })

        return res
    }),
    addDonation:publicProcedure
    .input(z.object({
        donatorId:z.string(),
        amount:z.number(),
        transactionId:z.string(),
        status:z.boolean()
    }))
    .mutation(async ({ctx,input})=>{
        let res = await ctx.prisma.donator.update({
            where:{
                id:input.donatorId
            },
            include:{
                donations:true
            },
            data:{
                totalDonation:{
                    increment:input.amount
                },
                donations:{
                    create:{
                        amount:input.amount,
                        transactionId:input.transactionId,
                        status:input.status
                    }
                }
            }
        })
        return res
    })
})