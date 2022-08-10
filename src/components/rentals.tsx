import { Button, Rating } from "@mui/material";
import { Bike, Rental, User } from "@prisma/client";
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { trpc } from "../utils/trpc";

const columnHelper = createColumnHelper<TRental>();

const Actions = ({
  info,
  refetch,
}: {
  info: CellContext<TRental, TRental>;
  refetch: () => void;
}) => {
  const deleteRental = trpc.useMutation(["rental.delete"]);
  const { id } = info.getValue();

  return (
    <>
      <Button
        onClick={() => {
          deleteRental.mutate(
            { id },
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
    </>
  );
};

interface TRental extends Rental {
  user?: User;
  bike?: Bike;
}

const RentalsTable = ({
  rentals,
  refetch,
}: {
  rentals: TRental[];
  refetch: () => void;
}) => {
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("startDate", {
      cell: (info) => info.getValue().toLocaleDateString(),
    }),
    columnHelper.accessor("endDate", {
      cell: (info) => info.getValue().toLocaleDateString(),
    }),
    columnHelper.accessor("user.name", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("user.email", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("rating", {
      cell: (info) => <Rating name="rating" value={info.getValue()} disabled />,
    }),
    columnHelper.accessor((row) => row, {
      id: "actions",
      header: () => <span>actions</span>,
      cell: (info) => <Actions info={info} refetch={refetch} />,
    }),
  ];
  const table = useReactTable({
    data: rentals,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RentalsTable;
