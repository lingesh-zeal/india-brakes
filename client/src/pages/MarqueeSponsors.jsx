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
  const [showModal, setShowModal] = useState(false);
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

    //confirmation
    const confirmed = window.confirm(
      editId
        ? "Are you sure you want to update this sponsor?"
        : "Are you sure you want to upload this sponsor?",
    );

    if (!confirmed) return;

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

      setShowModal(false);

      fetchSponsors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Marquee Sponsors
          </h1>
          <p className="text-gray-500 mt-2">
            Manage sponsor images displayed on your marquee section.
          </p>
        </div>

        <button
          onClick={() => {
            setEditId(null);
            setAltText("");
            setImage(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl"
        >
          + Add Sponsor
        </button>
      </div>

      {/* Sponsor Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-5 flex h-36 items-center justify-center rounded-xl bg-gray-50">
              <img
                src={`${BASE_IMG}${sponsor.image_url}`}
                alt={sponsor.alt_text}
                className="max-h-28 max-w-full object-contain"
              />
            </div>

            <h3 className="truncate font-semibold text-gray-800">
              {sponsor.alt_text}
            </h3>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex flex-col items-center">
                <button
                  onClick={async () => {
                    const confirmed = window.confirm(
                      `Are you sure you want to ${sponsor.is_active ? "hide" : "show"} this sponsor`,
                    );
                    if (!confirmed) return;
                    await toggleMarqueeSponsor(sponsor.id);
                    fetchSponsors();
                  }}
                  className={`relative h-6 w-12 rounded-full transition duration-300 ${sponsor.is_active ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${sponsor.is_active ? "translate-x-6" : "translate-x-0"}`}
                  />
                </button>

                <span
                  className={`mt-2 text-xs font-medium ${sponsor.is_active ? "text-green-600" : "text-gray-500"}`}
                >
                  {sponsor.is_active ? "Visible" : "Hidden"}
                </span>
              </div>

              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => {
                    setEditId(sponsor.id);
                    setAltText(sponsor.alt_text);
                    setImage(null);
                    setShowModal(true);
                  }}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this sponsor?",
                    );
                    if (!confirmed) return;
                    await deleteMarqueeSponsor(sponsor.id);
                    fetchSponsors();
                  }}
                  className="font-medium text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editId ? "Update Sponsor" : "Add Sponsor"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a sponsor logo and add alt text.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                  setAltText("");
                  setImage(null);
                }}
                className="rounded-full p-2 text-gray-400 transition hover:bg-red-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitHandler} className="space-y-5 p-6">
              {/* Upload */}
              <label className="block cursor-pointer">
                <div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 transition hover:border-blue-500 hover:bg-blue-50">
                  {image ? (
                    <>
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="mb-3 h-16 w-16 rounded-lg object-contain"
                      />
                      <p className="text-sm font-medium text-gray-900">
                        {image.name}
                      </p>
                      <span className="mt-1 text-xs text-gray-500">
                        Click to change
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm ">
                        📁
                      </div>

                      <p className="text-sm font-medium text-gray-900">
                        {editId
                          ? "Choose a new image (optional)"
                          : "Choose an image"}
                      </p>

                      <span className="mt-1 text-xs text-gray-500">
                        PNG, JPG or SVG
                      </span>
                    </>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              {/* Alt Text */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Alt Text
                </label>

                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Microsoft logo"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setAltText("");
                    setImage(null);
                  }}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
                >
                  {editId ? "Save Changes" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarqueeSponsors;
