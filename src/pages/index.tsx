import { Button, TextField } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Bike } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Home = () => {
  const { data: session, status } = useSession();
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const createRental = trpc.useMutation(["rental.create"]);
  const {
    data: bikes,
    refetch,
    isLoading,
  } = trpc.useQuery(["bike.query", { start, end }]);

  if (isLoading || status === "loading") {
    return <div>loading....</div>;
  }

  if (status === "unauthenticated") {
    return (
      <Button
        onClick={() => {
          signIn();
        }}
      >
        Sign in
      </Button>
    );
  }

  if (!bikes) {
    return <div>error</div>;
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen w-screen flex flex-col justify-between items-center relative p-4">
        <Button
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </Button>
        <div className="flex">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start"
              value={start}
              disablePast={true}
              onChange={(newValue) => {
                setStart(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End"
              value={end}
              disablePast={true}
              onChange={(newValue) => {
                setEnd(newValue);
              }}
              shouldDisableDate={(day) => {
                return !start || day <= start;
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="w-full h-full p-12">
          {start && end && start < end ? (
            <DataGrid
              columns={[
                { field: "id", flex: 1 },
                { field: "model", flex: 1 },
                { field: "color", flex: 1 },
                { field: "location", flex: 1 },
                {
                  field: "rating",
                  flex: 1,
                  valueGetter: ({ row }) =>
                    isNaN(row.rating) ? "N/A" : row.rating,
                },
                {
                  field: "actions",
                  flex: 1,
                  renderCell: ({ row }: GridRenderCellParams<Bike>) => (
                    <Button
                      onClick={() => {
                        if (row?.id && start && end) {
                          createRental.mutate(
                            {
                              bikeId: row.id,
                              userId: 1,
                              startDate: start,
                              endDate: end,
                            },
                            {
                              onSuccess: () => {
                                refetch();
                              },
                            }
                          );
                        }
                      }}
                    >
                      Rent
                    </Button>
                  ),
                },
              ]}
              rows={bikes}
            ></DataGrid>
          ) : (
            <div>Set date range to query for rentable bikes</div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
