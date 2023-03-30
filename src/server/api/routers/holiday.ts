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
    console.log("holidays from prisma", holidays.map(({id, holidayStartDay, holidayEndDay, reason}) => ({id, holidayStartDay, holidayEndDay, reason})));
    return [
      {
        id: "1",
        holidayStartDay: "01-06-2023",
        holidayEndDay: "01-07-2023",
        reason: "Annual holiday",
      },
      {
        id: "2",
        holidayStartDay: "02-07-2023",
        holidayEndDay: "01-08-2023",
        reason: "I'm lazy",
      }
    ];
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
