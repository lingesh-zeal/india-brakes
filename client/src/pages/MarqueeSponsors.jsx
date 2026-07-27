import React, { useEffect, useState } from "react";

import {
  getAllMarqueeSponsors,
  createMarqueeSponsor,
  updateMarqueeSponsor,
  toggleMarqueeSponsor,
  deleteMarqueeSponsor,
} from "../api/marqueeSponsorApi";
import { BASE_IMG } from "../api/api";

function MarqueeSponsors() {
  const [sponsors, setSponsors] = useState([]);

  const [image, setImage] = useState(null);
  const [altText, setAltText] = useState("");

  const [editId, setEditId] = useState(null);

  const fetchSponsors = async () => {
    try {
      const res = await getAllMarqueeSponsors();
      setSponsors(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (image) formData.append("image", image);

    formData.append("alt_text", altText);

    try {
      if (editId) {
        await updateMarqueeSponsor(editId, formData);
      } else {
        await createMarqueeSponsor(formData);
      }

      setImage(null);
      setAltText("");
      setEditId(null);

      fetchSponsors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Marquee Sponsors
        </h1>
        <p className="text-gray-500 mt-2">
          Manage sponsor images displayed on your marquee section.
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-10">
        <h2 className="text-lg font-medium text-gray-800 mb-5">
          {editId ? "Update Sponsor" : "Add New Sponsor"}
        </h2>

        <form
          onSubmit={submitHandler}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <label className="w-full md:w-auto cursor-pointer">
            <div
              className="
              border border-dashed border-gray-300
              rounded-xl px-6 py-3
              text-sm text-gray-600
              hover:border-blue-500
              transition
            "
            >
              {image ? image.name : "Choose image"}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <input
            type="text"
            placeholder="Sponsor alt text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="
              w-full md:flex-1
              border border-gray-200
              rounded-xl
              px-4 py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <button
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-7 py-3
              rounded-xl
              font-medium
              transition
            "
          >
            {editId ? "Update" : "Upload"}
          </button>
        </form>
      </div>

      {/* Sponsor Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="
              bg-white
              rounded-2xl
              border border-gray-100
              shadow-sm
              p-5
              hover:shadow-md
              transition
            "
          >
            <div
              className="
              h-36
              bg-gray-50
              rounded-xl
              flex
              items-center
              justify-center
              mb-5
            "
            >
              <img
                src={`${BASE_IMG}${sponsor.image_url}`}
                alt={sponsor.alt_text}
                className="max-h-28 max-w-full object-contain"
              />
            </div>

            <h3
              className="
              font-semibold
              text-gray-800
              truncate
            "
            >
              {sponsor.alt_text}
            </h3>

            <div className="flex items-center justify-between mt-5">
              {/* <button
                onClick={() =>
                  toggleMarqueeSponsor(sponsor.id).then(fetchSponsors)
                }
                className={`
                  px-4 py-1.5
                  rounded-full
                  text-xs
                  font-medium
                  transition
                  ${
                    sponsor.is_active
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }
                `}
              >
                {sponsor.is_active ? "Visible" : "Hidden"}
              </button> */}
              <div className="flex flex-col items-center">

  <button
    onClick={() =>
      toggleMarqueeSponsor(sponsor.id).then(fetchSponsors)
    }
    className={`
      relative
      w-12
      h-6
      rounded-full
      transition
      duration-300
      ${
        sponsor.is_active
          ? "bg-green-500"
          : "bg-gray-300"
      }
    `}
  >
    <span
      className={`
        absolute
        top-1
        left-1
        w-4
        h-4
        bg-white
        rounded-full
        shadow
        transition-transform
        duration-300
        ${
          sponsor.is_active
            ? "translate-x-6"
            : "translate-x-0"
        }
      `}
    />
  </button>

  <span
    className={`
      mt-2
      text-xs
      font-medium
      ${
        sponsor.is_active
          ? "text-green-600"
          : "text-gray-500"
      }
    `}
  >
    {sponsor.is_active ? "Visible" : "Hidden"}
  </span>

</div>


              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => {
                    setEditId(sponsor.id);
                    setAltText(sponsor.alt_text);
                  }}
                  className="
                    text-blue-600
                    hover:text-blue-800
                    font-medium
                  "
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteMarqueeSponsor(sponsor.id).then(fetchSponsors)
                  }
                  className="
                    text-red-600
                    hover:text-red-800
                    font-medium
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarqueeSponsors;
