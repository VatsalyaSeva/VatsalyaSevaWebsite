import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from 'zod'
import Razorpay from "razorpay";

export const Donator = createTRPCRouter({
    getAllRecord:publicProcedure
    .query(async ({ctx})=>{
        const data = await ctx.prisma.donator.findMany({
            include:{
                donations:true
            }
        })
        return data
    }),
    getTopDonators:publicProcedure
    .query(({ctx})=>{
        const data = ctx.prisma.donator.findMany({
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
        const res = await ctx.prisma.donator.create({
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
        const res = await ctx.prisma.donator.update({
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
    }),
    createRazerPayOrder:publicProcedure
    .input(z.object({
        amount:z.string(),
        currency:z.string()
    }))
    .mutation(async ({input,ctx})=>{

        let pay = new Razorpay({
            key_id: 'rzp_test_8UPUyLkgsd2CFB',
            key_secret: '1EA3emmgWvygHHmeFb8u1b05'
        }) 

        let res = await pay.orders.create({
            amount: input.amount,
            currency: input.currency,
        })

        return res
    })
})