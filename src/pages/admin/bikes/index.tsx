import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";

type Form = {
  model: string;
  color: string;
  location: string;
  available: boolean;
  rating: number;
};
const defaultForm: Form = {
  model: "",
  color: "",
  location: "",
  available: false,
  rating: 0,
};

const BikeTable = () => {
  const { data: bikes, refetch } = trpc.useQuery(["bike.getAll"]);
  const createBike = trpc.useMutation(["bike.create"]);
  const deleteBike = trpc.useMutation(["bike.delete"]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Form>(defaultForm);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <form
        className="flex flex-col items-center w-full max-w-2xl"
        onSubmit={async (e) => {
          e.preventDefault();

          createBike.mutate(form, {
            onSuccess: () => {
              refetch();
              setForm(defaultForm);
              setAdding(false);
            },
          });
        }}
      >
        <button onClick={() => setAdding(true)} disabled={adding}>
          Create
        </button>
        <table className="table-auto w-full border-collapse border border-slate-600">
          <thead>
            <tr>
              <th className="border border-slate-600">id</th>
              <th className="border border-slate-600">model</th>
              <th className="border border-slate-600">color</th>
              <th className="border border-slate-600">location</th>
              <th className="border border-slate-600">rating avg.</th>
              <th className="border border-slate-600">available</th>
              <th className="border border-slate-600">actions</th>
            </tr>
          </thead>
          <tbody>
            {adding && (
              <tr>
                <td className="border border-slate-600">id</td>
                <td className="border border-slate-600">
                  <input
                    type="text"
                    placeholder="model"
                    onChange={(e) => {
                      setForm({ ...form, model: e.target.value });
                    }}
                  />
                </td>
                <td className="border border-slate-600">
                  <input
                    type="text"
                    placeholder="color"
                    onChange={(e) => {
                      setForm({ ...form, color: e.target.value });
                    }}
                  />
                </td>
                <td className="border border-slate-600">
                  <input
                    type="text"
                    placeholder="location"
                    onChange={(e) => {
                      setForm({ ...form, location: e.target.value });
                    }}
                  />
                </td>
                <td className="border border-slate-600">N/A</td>
                <td className="border border-slate-600">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setForm({ ...form, available: e.target.checked });
                    }}
                  />
                </td>
                <td className="border border-slate-600">
                  <button type="submit">Save</button>
                  <button onClick={() => setAdding(false)}>Discard</button>
                </td>
              </tr>
            )}
            {bikes?.map((bike) => {
              return (
                <tr key={bike.id}>
                  <td className="border border-slate-600">{bike.id}</td>
                  <td className="border border-slate-600">{bike.model}</td>
                  <td className="border border-slate-600">{bike.color}</td>
                  <td className="border border-slate-600">{bike.location}</td>
                  <td className="border border-slate-600">
                    {bike.rating || "N/A"}
                  </td>
                  <td className="border border-slate-600">
                    <input type="checkbox" checked={bike.available} disabled />
                  </td>
                  <td className="border border-slate-600">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`bikes/edit/${bike.id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteBike.mutate(
                          { id: bike.id },
                          {
                            onSuccess: () => {
                              refetch();
                            },
                          }
                        );
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default BikeTable;
