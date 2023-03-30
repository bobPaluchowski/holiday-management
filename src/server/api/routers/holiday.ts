import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
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
});
