import { SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../utils/api";
import { holidayInput } from "../types";
import type { Holiday } from "../types";

export default function CreateHoliday() {
  const [newHolidayStartDay, setNewHolidayStartDay] = useState("");
  const [newHolidayEndDay, setNewHolidayEndDay] = useState("");
  const [newReason, setNewReason] = useState("");

  const trpc = api.useContext();

  const { mutate } = api.holiday.create.useMutation({
    onMutate: async (
      newHolidayStartDay: any,
      newHolidayEndDay: any,
      newReason: any
    ) => {
      // cancel any outgoing re-fetches as this don't overwrite our optimistic update
      await trpc.holiday.getAll.cancel();

      // snapshot the previous value
      const previousHolidays = trpc.holiday.getAll.getData();

      // optimistically update to the new value
      trpc.holiday.getAll.setData(undefined, (prev) => {
        const optimisticHoliday: Holiday = {
          id: "optimistic-holiday-id",
          holidayStartDay: newHolidayStartDay,
          holidayEndDay: newHolidayEndDay,
          reason: newReason,
        };
        if (!prev) return [optimisticHoliday];
        return [...prev, optimisticHoliday];
      });
      // clear input
      setNewHolidayStartDay("");
      setNewHolidayEndDay("");
      setNewReason("");

      // return a context object with the snapshot value
      return { previousHolidays };
    },
    // if the mutation fails, use the context returned from onMutate to roll back
    onError: (
      _err: unknown,
      newHolidayStartDay: SetStateAction<Date>,
      newHolidayEndDay: SetStateAction<Date>,
      newReason: SetStateAction<string>,
      context: {
        previousHolidays:
          | {
              id: string;
              holidayStartDay: Date;
              holidayEndDay: Date;
              reason: string | null;
            }[]
          | undefined;
      }
    ) => {
      toast.error("An error occurred when creating todo");

      // clear the input
      setNewHolidayStartDay(newHolidayStartDay);
      setNewHolidayEndDay(newHolidayEndDay);
      setNewReason(newReason);
      if (!context) return;
      trpc.holiday.getAll.setData(undefined, () => context.previousHolidays);
    },

    // always re-fetch after error or success
    onSettled: async () => {
      console.log("SETTLED");
      await trpc.holiday.getAll.invalidate();
    },
  });
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const startDateResult = holidayInput.safeParse(newHolidayStartDay);
          const endDateResult = holidayInput.safeParse(newHolidayEndDay);
          const reasonResult = holidayInput.safeParse(newReason);

          if (!startDateResult) {
            toast.error(startDateResult.error.format()._errors.join("\n"));
            return;
          }
          if (!endDateResult) {
            toast.error(endDateResult.error.format()._errors.join("\n"));
            return;
          }
          if (!reasonResult) {
            toast.error(reasonResult.error.format()._errors.join("\n"));
            return;
          }
          mutate(newHolidayStartDay);
          mutate(newHolidayEndDay);
          mutate(newReason);
        }}
        className="flex gap-2"
      >
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Start day"
          value={newHolidayStartDay}
          onChange={(e) => {
            setNewHolidayStartDay(e.target.value);
          }}
        />
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="End day"
          value={newHolidayEndDay}
          onChange={(e) => {
            setNewHolidayEndDay(e.target.value);
          }}
        />
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Reason"
          value={newReason}
          onChange={(e) => {
            setNewReason(e.target.value);
          }}
        />
        <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
          Create
        </button>
      </form>
    </div>
  );
}
