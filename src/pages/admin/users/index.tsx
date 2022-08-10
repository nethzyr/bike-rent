import { Button, Checkbox } from "@mui/material";
import { User } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";

const columnHelper = createColumnHelper<User>();

const Actions = ({ user, refetch }: { user: User; refetch: () => void }) => {
  const deleteUser = trpc.useMutation(["user.delete"]);
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
  const [checked, setChecked] = useState(false);

  return (
    <div className="p-2">
      <label>
        hide users without rentals:
        <Checkbox
          checked={checked}
          onChange={(event) => {
            setChecked(event.target.checked);
          }}
        />
      </label>
      <UsersTable hideInactive={checked} />
    </div>
  );
};

export default Users;

const UsersTable = ({ hideInactive }: { hideInactive: boolean }) => {
  const { data, refetch, isLoading } = trpc.useQuery([
    "user.getAll",
    { hideInactive },
  ]);
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
      cell: (info) => <Actions user={info.getValue()} refetch={refetch} />,
    }),
  ];
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <>loading...</>;
  }

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
