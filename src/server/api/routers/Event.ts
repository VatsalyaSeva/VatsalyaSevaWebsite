import { z } from "zod";
import { publicProcedure,createTRPCRouter } from "../trpc";
import fs from 'fs-extra'

const Event = createTRPCRouter({
    getAll:publicProcedure
    .query(({ctx})=>{
        let data = ctx.prisma.events.findMany({
            include:{
                additionalImages:true,
                additionalVideos:true,
                specialGuests:true,
                organizers:true,
                performers:true
            }
        })
        return data
    }),
    getById:publicProcedure
    .input(z.object({id:z.string()}))
    .query(({input,ctx})=>{
        let data = ctx.prisma.events.findFirst({
            where:{
                id:input.id
            },
            include:{
                additionalImages:true,
                additionalVideos:true,
                specialGuests:true,
                organizers:true,
                performers:true
            }
        })
        return data
    }),
    deleteEventById:publicProcedure
    .input(z.object({id:z.string()}))
    .query(({input,ctx})=>{
        let data = ctx.prisma.events.delete({
            where:{
                id:input.id
            },
            include:{
                additionalImages:true,
                additionalVideos:true,
                specialGuests:true,
                organizers:true,
                performers:true
            }
        })
        return data
    }),
    saveEvent:publicProcedure
    .input(z.object({
        name:z.string(),
        description:z.string(),
        location:z.string(),
        dateTime:z.string()
    }))
    .mutation(async ({input,ctx})=>{
        let data = await ctx.prisma.events.create({
            data:{
                name:input.name,
                description:input.description,
                location:input.location,
                dateTime:input.dateTime
            }
        })
        return data
    }),
    updateEvent:publicProcedure
    .input(z.object({
        id:z.string(),
        name:z.string().optional(),
        description:z.string().optional(),
        location:z.string().optional(),
        dateTime:z.string().optional()
    }))
    .mutation(async ({input,ctx})=>{
        let event = await ctx.prisma.events.findFirst({where:{id:input.id}})
        let data = await ctx.prisma.events.update({
            where:{
                id:input.id
            },
            data:{
                name:input.name ? input.name:event?.name,
                description:input.description ? input.description:event?.description,
                location:input.location ? input.location:event?.location,
                dateTime:input.dateTime? input.dateTime:event?.dateTime
            }
        })
        return data
    }),
    addOrganizer:publicProcedure
    .input(z.object({
        eventId:z.string(),
        organizers:z.array(z.object({
            memberId:z.string(),
            role:z.string(),
            name:z.string()
        }))}))
    .mutation(async({input,ctx})=>{
        let data = await ctx.prisma.events.update({
            where:{
                id:input.eventId
            },
            data:{
                organizers:{
                    createMany:{
                        data:input.organizers
                    }
                }
            },
            include:{
                organizers:true
            }

        })
        return data
    }),
    removeOrganizer:publicProcedure
    .input(z.object({id:z.string()}))
    .mutation(async({input,ctx})=>{
        let data = await ctx.prisma.organizers.delete({
            where:{id:input.id}
        })
        return data
    }),
    removeEventImage:publicProcedure
    .input(z.object({imageId:z.string()}))
    .mutation(async ({input,ctx})=>{
        let additionalImage = await ctx.prisma.additionalImages.findFirst({
            where:{
                id:input.imageId
            }
        })
        
        let data = await ctx.prisma.additionalImages.delete({
            where:{
                id:input.imageId
            }
        })

        if(additionalImage){
            fs.remove(`./public/${additionalImage.image}`)
        }

        return data
    }),
    removeEventVideo:publicProcedure
    .input(z.object({videoId:z.string()}))
    .mutation(async ({input,ctx})=>{
        let additionalVideos = await ctx.prisma.additionalVideos.findFirst({
            where:{
                id:input.videoId
            }
        })
        
       let data = await ctx.prisma.additionalVideos.delete({
            where:{
                id:input.videoId
            }
        })
        if(additionalVideos){
            fs.remove(`./public/${additionalVideos.video}`)
        }

        return data
    }),
    removeSpecialGuest:publicProcedure
    .input(z.object({id:z.string()}))
    .mutation(async ({input,ctx})=>{
        let guest = await ctx.prisma.specialGuest.findFirst({
            where:{
                id:input.id
            }
        })

        await ctx.prisma.specialGuest.delete({
            where:{
                id:input.id
            }
        })

        if(guest && typeof(guest.profilePic) == 'string'){
            guest.profilePic.length>0 && fs.remove(`./public/${guest.profilePic}`)
        }

        return []
    }),
    removePerformer:publicProcedure
    .input(z.object({id:z.string()}))
    .mutation(async ({input,ctx})=>{
        let performer = await ctx.prisma.performer.findFirst({
            where:{
                id:input.id
            }
        })

        await ctx.prisma.performer.delete({
            where:{
                id:input.id
            }
        })

        if(performer && typeof(performer.profilePic) == 'string'){
            performer.profilePic.length>0 && fs.remove(`./public/${performer.profilePic}`)
        }

        return []
    }),
    removeCoverImage:publicProcedure
    .input(z.object({id:z.string()}))
    .mutation(async({input,ctx})=>{
        let image = await ctx.prisma.events.findFirst({
            where:{
                id:input.id
            },
            select:{
                coverImage:true
            }
        })
        
        let data =  await ctx.prisma.events.update({
            where:{
                id:input.id
            },
            data:{
                coverImage:null
            }
        })
        
        fs.remove(`./public/${image?.coverImage}`, err => {
            if (err) return console.error(err)
            console.log('success!')
        })

        return data
    }),
    addSpecialGuest:publicProcedure
    .input(z.object({
        eventId:z.string(),
        guestName:z.string(),
        guestBio:z.string()
    }))
    .mutation(async ({input,ctx})=>{
        let data = await ctx.prisma.events.update({
            where:{
                id:input.eventId
            },
            data:{
                specialGuests:{
                    create:{
                        name:input.guestName,
                        bio:input.guestBio
                    }
                }
            }
        })

        return data

    }),
    updateSpecialGuest:publicProcedure
    .input(z.object({
        guestId:z.string(),
        guestName:z.string(),
        guestBio:z.string()
    }))
    .mutation(async ({input,ctx})=>{
        let data = await ctx.prisma.specialGuest.update({
            where:{
                id:input.guestId
            },
            data:{
                name:input.guestName,
                bio:input.guestBio
            }
        })

        return data

    }),
    addPerformer:publicProcedure
    .input(z.object({
        eventId:z.string(),
        performerName:z.string(),
        performerBio:z.string()
    }))
    .mutation(async ({input,ctx})=>{
        let data = await ctx.prisma.events.update({
            where:{
                id:input.eventId
            },
            data:{
                performers:{
                    create:{
                        name:input.performerName,
                        bio:input.performerBio
                    }
                }
            }
        })
        return data
    }),
    updatePerformer:publicProcedure
    .input(z.object({
        performerId:z.string(),
        performerName:z.string(),
        performerBio:z.string()
    }))
    .mutation(async ({input,ctx})=>{
        let data = await ctx.prisma.performer.update({
            where:{
                id:input.performerId
            },
            data:{
                name:input.performerName,
                bio:input.performerBio
            }
        })
        return data
    }),
    
})


export default Event