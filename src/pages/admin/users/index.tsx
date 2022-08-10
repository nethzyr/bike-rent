import { Button, Checkbox } from "@mui/material";
import { User } from "@prisma/client";
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";

const columnHelper = createColumnHelper<User>();

const Actions = ({
  info,
  refetch,
}: {
  info: CellContext<User, User>;
  refetch: () => void;
}) => {
  const deleteUser = trpc.useMutation(["user.delete"]);
  const user = info.getValue();
  const router = useRouter();

  return (
    <>
      <Button
        onClick={() => {
          router.push(`/admin/users/${user.id}`);
        }}
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          deleteUser.mutate(
            { userId: user.id },
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

const Users = () => {
  const [hideInactive, setHideInactive] = useState(false);
  const { data, refetch } = trpc.useQuery(["user.getAll", { hideInactive }]);
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.email, {
      id: "lastName",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>,
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("role", {
      header: () => "Role",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor((row) => row, {
      id: "actions",
      header: () => <span>actions</span>,
      cell: (info) => <Actions info={info} refetch={refetch} />,
    }),
  ];
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <label>
        hide inactive users
        <input
          type="checkbox"
          checked={hideInactive}
          onChange={(event) => {
            setHideInactive(event.target.checked);
          }}
        />
      </label>
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

export default Users;
