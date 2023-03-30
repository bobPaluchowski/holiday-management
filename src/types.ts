import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "./server/api/root";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type allHolidaysOutput = RouterOutputs["holiday"]["getAll"];

export type Holiday = allHolidaysOutput[number];

export const holidayInput = z.object({
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string(),
});