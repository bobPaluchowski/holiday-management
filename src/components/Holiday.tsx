import type { Holiday } from "../types";
import toast from "react-hot-toast";
import { api } from "../utils/api";

type HolidayProps = {
  holiday: Holiday;
};

export default function Holiday({ holiday }: HolidayProps) {
  const { id, holidayStartDay, holidayEndDay, reason } = holiday;
  const trpc = api.useContext();

  // TODO: create mutation

  const { mutate: deleteMutation } = api.holiday.deleteHoliday.useMutation({
    onMutate: async (deleteId) => {
      // cancel any outgoing re-fetches so they don't overwrite our optimistic update
      await trpc.holiday.getAll.cancel();

      //snapshot previous value
      const previousHolidays = trpc.holiday.getAll.getData();

      // optimistically update to the new value
      trpc.holiday.getAll.setData(undefined, (prev) => {
        if (!prev) return previousHolidays;
        return prev.filter((h) => h.id !== deleteId);
      });

      // return a context object with the snapshot value
      return { previousHolidays };
    },
    // if the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newHoliday, context) => {
      toast.error(`An error occurred when deleting holiday`);
      if (!context) return;
      trpc.holiday.getAll.setData(undefined, () => context.previousHolidays);
    },

    // always re-fetch after error or success
    onSettled: async () => {
      await trpc.holiday.getAll.invalidate();
    },
  });

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h3>{holidayStartDay.toString()}</h3>
        <h3>{holidayEndDay.toString()}</h3>
        <p>{reason}</p>
      </div>
      <button
        className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        onClick={() => {
          deleteMutation(id);
        }}
      >
        Delete
      </button>
    </div>
    // <>
    //   {holidayStartDay}
    //   <br />
    //   {holidayEndDay}
    //   <br />
    //   {reason}
    //   <br />
    //   <br />
    // </>
  );
}
