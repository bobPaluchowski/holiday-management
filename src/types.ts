import { z } from "zod";

export const holidayInput = z.object({
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string(),
});