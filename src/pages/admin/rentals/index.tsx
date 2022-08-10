import RentalsTable from "../../../components/rentals";
import { trpc } from "../../../utils/trpc";

const AllRentals = () => {
  const { data, refetch, isLoading } = trpc.useQuery(["rental.getAll"]);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>error</div>;
  }

  return (
    <>
      <RentalsTable rentals={data} refetch={refetch} />
    </>
  );
};

export default AllRentals;
