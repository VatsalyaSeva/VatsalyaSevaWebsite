import { z } from "zod";
import fs from "fs-extra";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const Member = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    
    // if (!user || user.isLoggedIn === false) {
    //   return {
    //     code:401,
    //   }
    // }
    const data = await ctx.prisma.member.findMany({});
    
    return data
    
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.member.findFirst({
        where: {
          id: input.id,
        },
      });
      return data;
    }),
  createMember: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        phoneNumber: z.string(),
        address: z.string(),
        role: z.string(),
        profilePic: z.string(),
        profilePicUrl: z.string(),
        membership: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const data = ctx.prisma.member.create({
        data: {
          name: input.name,
          email: input.email,
          phoneNumber: input.phoneNumber,
          address: input.address,
          role: input.role,
          profilePic: input.profilePic,
          profilePicUrl: input.profilePicUrl,
          membership: input.membership,
        },
      });
      return data;
    }),
  updateMember: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phoneNumber: z.string(),
        address: z.string(),
        role: z.string(),
        membership: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.prisma.member.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          phoneNumber: input.phoneNumber,
          address: input.address,
          role: input.role,
          membership: input.membership,
        },
      });

      return data;
    }),
  updateProfilePic: publicProcedure
    .input(
      z.object({
        id: z.string(),
        profilePic: z.string(),
        profilePicUrl: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const data = ctx.prisma.member.update({
        where: {
          id: input.id,
        },
        data: {
          profilePic: input.profilePic,
          profilePicUrl: input.profilePicUrl,
        },
      });
      return data;
    }),
  deleteById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.member.delete({
        where: { id: input.id },
      });
      if (data) {
        const { profilePic } = data;
        if (typeof profilePic == "string") {
          ctx.sanityClient.delete(profilePic);
        }
      }
      return data;
    }),
  deleteProfilePic: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.prisma.member.findFirst({
        where: { id: input.id },
      });
      if (member) {
        const data = await ctx.prisma.member.update({
          where: { id: input.id },
          data: {
            profilePic: null,
            profilePicUrl: null,
          },
        });
        const { profilePic } = member;
        if (typeof profilePic == "string") {
          ctx.sanityClient.delete(profilePic);
        }
        return data;
      } else {
        return [];
      }
    }),
});
