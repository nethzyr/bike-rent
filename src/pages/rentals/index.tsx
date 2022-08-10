import { Button, Rating } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Bike, User } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const Rentals = () => {
  const {
    data: rentals,
    isLoading,
    refetch,
  } = trpc.useQuery(["rental.getForLoggedInUser"]);
  const deleteRental = trpc.useMutation(["rental.delete"]);

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
                renderCell: ({ value, row }: GridRenderCellParams<number>) => (
                  <RatingCell rating={value ?? 0} rentalId={row.id} />
                ),
              },
              {
                field: "actions",
                flex: 1,
                renderCell: ({ row }: GridRenderCellParams<any>) => (
                  <Button
                    onClick={() => {
                      deleteRental.mutate(
                        { id: row.id },
                        {
                          onSuccess: () => {
                            refetch();
                          },
                        }
                      );
                    }}
                  >
                    Delete
                  </Button>
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
  rentalId,
}: {
  rating: number;
  rentalId: number;
}) => {
  const addRating = trpc.useMutation(["rental.rate"]);
  const [value, setValue] = useState(rating);

  return (
    <Rating
      name="rating"
      value={value}
      onChange={(event, newValue) => {
        if (newValue) {
          setValue(newValue);
          addRating.mutate({
            id: rentalId,
            rating: newValue,
          });
        }
      }}
    />
  );
};

export default Rentals;
