import { Button, MenuItem, Rating, Select, TextField } from "@mui/material";
import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import RentalsTable from "../../../components/rentals";
import { trpc } from "../../../utils/trpc";

const User = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, refetch, isLoading } = trpc.useQuery([
    "rental.getForUser",
    { userId: +(id ?? 0) },
  ]);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!id || !data) {
    return <div>error</div>;
  }

  return (
    <main>
      <EditUser userId={+id} />
      <RentalsTable rentals={data} refetch={refetch} />
    </main>
  );
};

const defaultForm = {
  name: "",
  email: "",
  image: "",
  role: "USER" as Role,
};

const EditUser = ({ userId }: { userId: number }) => {
  const [form, setForm] = useState(defaultForm);
  const { data, refetch } = trpc.useQuery(["user.getUser", { id: userId }], {
    onSuccess: (user) => {
      if (user) {
        setForm({
          ...form,
          name: user.name || "",
          email: user.email || "",
          image: user.image || "",
          role: user.role || "USER",
        });
      }
    },
  });
  const updateUser = trpc.useMutation(["user.update"]);

  return (
    <div className="p-4">
      <TextField
        label="name"
        value={form.name}
        onChange={(event) => {
          setForm({ ...form, name: event.target.value });
        }}
      />
      <TextField
        label="email"
        value={form.email}
        onChange={(event) => {
          setForm({ ...form, email: event.target.value });
        }}
      />
      <TextField
        label="image"
        value={form.image}
        onChange={(event) => {
          setForm({ ...form, image: event.target.value });
        }}
      />
      <Select
        label="role"
        value={form.role}
        onChange={(event) => {
          const newValue = event.target.value;
          if (newValue === "USER" || newValue === "MANAGER") {
            setForm({ ...form, role: newValue });
          }
        }}
      >
        <MenuItem value="USER">USER</MenuItem>
        <MenuItem value="MANAGER">MANAGER</MenuItem>
      </Select>
      <Button
        onClick={() => {
          if (data?.id) {
            updateUser.mutate(
              { ...form, id: data.id },
              {
                onSuccess: () => {
                  refetch();
                },
              }
            );
          }
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default User;
