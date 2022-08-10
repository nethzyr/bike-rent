import { Button, Rating } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Bike, Rating as PrismaRating, Rental, User } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const Rentals = () => {
  const { data: rentals, isLoading } = trpc.useQuery(["rental.getAll"]);

  if (isLoading) {
    return <>loading...</>;
  }

  if (!rentals) {
    return <>error</>;
  }

  return (
    <>
      <main className="h-screen w-screen flex flex-col justify-between items-center relative p-4">
        <div className="w-full h-full p-12">
          <DataGrid
            columns={[
              { field: "id", flex: 1 },
              { field: "startDate", flex: 1 },
              { field: "endDate", flex: 1 },
              {
                field: "bike",
                flex: 1,
                renderCell: ({ value }: GridRenderCellParams<Bike>) => {
                  return <div>{value?.id}</div>;
                },
              },
              {
                field: "user",
                flex: 1,
                renderCell: ({ value }: GridRenderCellParams<User>) => (
                  <div>{value?.id}</div>
                ),
              },
              {
                field: "rating",
                flex: 1,
                renderCell: ({
                  value,
                  row,
                }: GridRenderCellParams<PrismaRating>) => (
                  <RatingCell rating={value} rental={row} />
                ),
              },
              {
                field: "actions",
                flex: 1,
                renderCell: ({ row }: GridRenderCellParams<any>) => (
                  <Button onClick={() => {}}>Delete</Button>
                ),
              },
            ]}
            rows={rentals}
          ></DataGrid>
        </div>
      </main>
    </>
  );
};

const RatingCell = ({
  rating,
  rental,
}: {
  rating: PrismaRating | undefined;
  rental: Rental;
}) => {
  const mutateRating = trpc.useMutation(["rating.upsert"]);
  const [value, setValue] = useState(rating?.value ?? 0);

  return (
    <Rating
      name="simple-controlled"
      value={value}
      onChange={(event, newValue) => {
        if (newValue) {
          setValue(newValue);
          mutateRating.mutate({
            rental: {
              id: rental.id,
              bikeId: rental.bikeId,
              rating: { value: newValue },
            },
          });
        }
      }}
    />
  );
};

export default Rentals;
