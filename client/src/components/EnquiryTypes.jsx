import { useEffect, useState } from "react";
import api from "../api/api";
import { FaTrash } from "react-icons/fa";
const EnquiryTypes = () => {
  const [types, setTypes] = useState([]);

  const [name, setName] = useState("");

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    const res = await api.get("/enquiry-types");

    setTypes(res.data.data);
  };

  const addType = async () => {
    if (!name.trim()) return;

    await api.post("/enquiry-types", {
      name,
    });

    setName("");

    loadTypes();
  };

  const disableType = async (id) => {
    const confirmDelete = window.confirm("Disable this enquiry type?");

    if (!confirmDelete) return;

    await api.delete(`/enquiry-types/${id}`);

    loadTypes();
  };

return (
  <div className="bg-white rounded-2xl border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Enquiry Types
      </h2>

      <span className="text-sm bg-blue-400 px-4 py-2 rounded-full text-white shadow-2xs font-semibold">
        {types.length} Types
      </span>
    </div>


    <div
      className="
        flex
        gap-3
        mb-6
        bg-gray-50
        border
        border-gray-200
        rounded-xl
        p-4
      "
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New enquiry type"
        className="
          flex-1
          max-w-sm
          border
          border-gray-200
          rounded-xl
          px-4
          py-2.5
          text-sm
          bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

      <button
        onClick={addType}
        className="
          px-5
          py-2.5
          rounded-xl
          bg-gray-900
          text-white
          text-sm
          font-medium
          hover:bg-black
          transition
        "
      >
        Add
      </button>
    </div>


    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            <th
              className="
                px-5
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Order
            </th>

            <th
              className="
                px-5
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Name
            </th>

            <th
              className="
                px-5
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
              "
            >
              Action
            </th>
          </tr>
        </thead>


        <tbody>
          {types.map((type) => (
            <tr
              key={type.id}
              className="
                border-b
                border-gray-100
                hover:bg-gray-50
                transition
              "
            >
              <td className="px-5 py-4 text-sm text-gray-600">
                {type.display_order}
              </td>

              <td className="px-5 py-4 text-sm font-medium text-gray-900">
                {type.name}
              </td>

              <td className="px-5 py-4">
                <button
                  onClick={() => disableType(type.id)}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    font-medium
                    text-red-600
                    bg-red-50
                    hover:bg-red-100
                    transition
                  "
                >
                  <FaTrash size={13} />

                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default EnquiryTypes;
