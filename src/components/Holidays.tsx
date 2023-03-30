import { api } from "../utils/api";
import Holiday from "./Holiday";

export default function Holidays() {
  const { data: holidays, isLoading, isError } = api.holiday.getAll.useQuery();

  if (isLoading) return <div>Warten, Loading</div>;
  if (isError) return <div>Error fetching holidays</div>;

  return (
    <>
      {holidays.length
        ? holidays.map((holiday) => {
            return <Holiday key={holiday.id} holiday={holiday} />;
          })
        : "Nothing to see here... :( "}
    </>
  );
}
