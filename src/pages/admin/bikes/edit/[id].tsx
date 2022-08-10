import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../../../utils/trpc";

type Form = {
  model: string;
  color: string;
  location: string;
  available: boolean;
};
const defaultForm: Form = {
  model: "",
  color: "",
  location: "",
  available: false,
};

const EditBike = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: bike,
    isLoading,
    refetch,
  } = trpc.useQuery(["bike.getOne", { id: +(id ?? 0) }], {
    onSuccess: (value) => {
      if (value) {
        setForm(value);
      }
    },
  });
  const editBike = trpc.useMutation(["bike.edit"]);
  const [form, setForm] = useState<Form>(defaultForm);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!bike) {
    return <div>cannot find bike with id: {id}</div>;
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editBike.mutate(
            { ...form, id: bike.id },
            {
              onSuccess: () => {
                refetch();
              },
            }
          );
        }}
      >
        <label>
          model:
          <input
            type="text"
            placeholder={form.model}
            onChange={(e) => {
              setForm({ ...form, model: e.target.value });
            }}
          />
        </label>
        <label>
          color:
          <input
            type="text"
            placeholder={form.color}
            onChange={(e) => {
              setForm({ ...form, color: e.target.value });
            }}
          />
        </label>
        <label>
          location:
          <input
            type="text"
            placeholder={form.location}
            onChange={(e) => {
              setForm({ ...form, location: e.target.value });
            }}
          />
        </label>
        <label>
          available:
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => {
              setForm({ ...form, available: e.target.checked });
            }}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </>
  );
};

export default EditBike;
