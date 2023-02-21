import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod'

const Admin = createTRPCRouter({
    login:publicProcedure
    .input(z.object({
        email:z.string().email(),
        password:z.string()
    }))
    .mutation(async({ctx,input})=>{
        let res = await ctx.prisma.adminUser.findFirst({
            where:{
                email:input.email,
                password:input.password
            }
        })
        if(res){
            const user = {
                isLoggedIn:true
            }
    
            ctx.session.user = user;
            await ctx.session.save();
            return {
                message:"Login Success"
            }
        }
        else{
            return {
                message:'Wrong Details'
            }
        }
    }),
    logout:publicProcedure
    .mutation(({ctx})=>{
        ctx.session.destroy();
    })
}) 

export default Admin
