import { z } from "zod";
import { holidayInput } from "~/types";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const holidayRouter = createTRPCRouter({
  
  getAll: protectedProcedure.query(async({ctx}) => {
    const holidays = await ctx.prisma.holiday.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return holidays.map(({id, holidayStartDay, holidayEndDay, reason}) => ({id, holidayStartDay, holidayEndDay, reason}));
   
  }),
  createHoliday: protectedProcedure.input(holidayInput).mutation(async ({ctx, input}) => {
    return ctx.prisma.holiday.create({
      data: {
        holidayStartDay: input.startDate,
        holidayEndDay: input.endDate,
        reason: input.reason,
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
  deleteHoliday: protectedProcedure.input(z.string()).mutation(async ({ctx, input}) => {
    return ctx.prisma.holiday.delete({
      where: {
        id: input,
      },
    });
  }),
  // TODO: create updateHoliday
  // FIXME: fix it 
  // updateHoliday: protectedProcedure.input(z.object({
  //   id: z.string(),
  // })).mutation(async ({ctx, input: {id}}) => {
  //   return ctx.prisma.holiday.update({
  //     where: {
  //       id,
  //     },
  //     data: {
        
  //     }
  //   })
  // })
});
