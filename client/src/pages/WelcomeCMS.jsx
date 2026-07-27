import { useEffect, useState } from "react";
import { FaPlus, FaSave, FaImage } from "react-icons/fa";
import { BASE_IMG } from "../api/api";
import {
  addImage,
  deleteImage,
  getWelcome,
  updateImage,
  updateWelcome,
} from "../api/welcomeApi";

export default function WelcomeCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [section, setSection] = useState({
    heading: "",
    sub_heading: "",
    content: "",
  });

  const [carousel, setCarousel] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [deletingImage, setDeletingImage] = useState(null);

  // ----------------------------
  // Load Data
  // ----------------------------

  const fetchWelcome = async () => {
    try {
      setLoading(true);

      const res = await getWelcome();

      const welcomeData = res.data.data;

      setSection({
        heading: welcomeData.section?.heading || "",
        sub_heading: welcomeData.section?.sub_heading || "",
        content: welcomeData.section?.content || "",
      });

      setCarousel(welcomeData.carousel || []);
    } catch (err) {
      console.error(err);
      alert("Unable to load Welcome CMS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWelcome();
  }, []);

  // ----------------------------
  // Save Welcome Section
  // ----------------------------

  const saveWelcome = async () => {
    try {
      setSaving(true);

      await updateWelcome(section);

      alert("Welcome section updated.");
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------
  // Delete Image
  // ----------------------------

  const deleteCarouselImage = async () => {
    if (!deletingImage) return;

    try {
      await deleteImage(deletingImage.id);

      setDeletingImage(null);

      fetchWelcome();
    } catch (err) {
      console.error(err);

      alert("Unable to delete image.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white shadow-xl rounded-3xl px-10 py-8 text-xl font-semibold text-slate-700">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      <div className="px-20">
        {/* ================================
            Header
        ================================= */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">
              CMS Dashboard
            </p>

            <h1 className="text-4xl font-bold text-slate-900 mt-2">
              Welcome Section
            </h1>

            <p className="text-slate-500 mt-3">
              Manage homepage content and carousel images.
            </p>
          </div>

          <button
            disabled={saving}
            onClick={saveWelcome}
            className="
            bg-slate-900
            hover:bg-black
            text-white
            px-7
            py-3
            rounded-2xl
            flex
            items-center
            gap-3
            shadow-lg
            transition
            disabled:opacity-50
            "
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* ================================
            Content + Preview
        ================================= */}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORM CARD */}

          <div
            className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            shadow-xl
            overflow-hidden
          "
          >
            <div
              className="
              px-8
              py-6
              bg-slate-50
              border-b
            "
            >
              <h2 className="text-xl font-bold text-slate-900">
                Welcome Content
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Edit homepage introduction text
              </p>
            </div>

            <div className="p-8 space-y-7">
              {/* Heading */}

              <div>
                <label className="font-semibold text-slate-700 block mb-3">
                  Heading
                </label>

                <input
                  value={section.heading}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      heading: e.target.value,
                    })
                  }
                  className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  focus:ring-4
                  focus:ring-blue-100
                  focus:border-blue-500
                  outline-none
                  transition
                  "
                />
              </div>

              {/* Sub Heading */}

              <div>
                <label className="font-semibold text-slate-700 block mb-3">
                  Sub Heading
                </label>

                <input
                  value={section.sub_heading}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      sub_heading: e.target.value,
                    })
                  }
                  className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  focus:ring-4
                  focus:ring-blue-100
                  focus:border-blue-500
                  outline-none
                  transition
                  "
                />
              </div>

              {/* Content */}

              <div>
                <label className="font-semibold text-slate-700 block mb-3">
                  Content
                </label>

                <textarea
                  rows={7}
                  value={section.content}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      content: e.target.value,
                    })
                  }
                  className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  resize-none
                  focus:ring-4
                  focus:ring-blue-100
                  focus:border-blue-500
                  outline-none
                  transition
                  "
                />
              </div>
            </div>
          </div>

          {/* PREVIEW CARD */}

          <div
            className="
          bg-slate-900
          rounded-3xl
          shadow-xl
          p-10
          text-white
          flex
          flex-col
          justify-center
          "
          >
            <p
              className="
            text-blue-300
            uppercase
            tracking-[0.3em]
            text-sm
            font-semibold
            "
            >
              Live Preview
            </p>

            <h2
              className="
            text-4xl
            font-bold
            mt-6
            leading-tight
            "
            >
              {section.heading || "Your Heading"}
            </h2>

            <h3
              className="
            text-blue-300
            text-lg
            mt-5
            "
            >
              {section.sub_heading || "Your Sub Heading"}
            </h3>

            <p
              className="
            text-slate-300
            mt-6
            leading-8
            "
            >
              {section.content || "Your content preview will appear here."}
            </p>
          </div>
        </div>

        {/* ================================
            Carousel
        ================================= */}

        <div className="mt-14">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2
                className="
              text-3xl
              font-bold
              text-slate-900
              "
              >
                Carousel Gallery
              </h2>

              <p className="text-slate-500 mt-2">
                {carousel.length} / 6 Images
                {carousel.length === 1 && (
                  <span className="ml-2 text-amber-600">Minimum Required</span>
                )}
              </p>
            </div>
          </div>

          {carousel.length === 0 ? (
            <div
              className="
            bg-white
            rounded-3xl
            shadow-xl
            py-24
            text-center
            "
            >
              <FaImage size={60} className="mx-auto text-slate-300" />

              <h3
                className="
              mt-6
              text-xl
              font-bold
              "
              >
                No Carousel Images
              </h3>

              <p className="text-slate-500 mt-2">Upload your first image.</p>
            </div>
          ) : (
            <div
              className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
            "
            >
              {carousel.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  imageUrl={`${BASE_IMG}${image.image}`}
                  onEdit={() => setEditingImage(image)}
                  onDelete={
                    carousel.length > 1 ? () => setDeletingImage(image) : null
                  }
                />
              ))}

              {carousel.length < 6 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="
                  h-80
                  bg-white
                  rounded-3xl
                  border-2
                  border-dashed
                  border-slate-300
                  hover:border-blue-500
                  hover:bg-blue-50
                  transition
                  flex
                  flex-col
                  justify-center
                  items-center
                  "
                >
                  <div
                    className="
                  w-20
                  h-20
                  rounded-full
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  mb-5
                  "
                  >
                    <FaPlus size={30} className="text-blue-600" />
                  </div>

                  <span
                    className="
                  font-semibold
                  text-blue-600
                  "
                  >
                    Add Image
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* MODALS */}

        {showAddModal && (
          <ImageModal
            title="Add Carousel Image"
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);

              fetchWelcome();
            }}
          />
        )}

        {editingImage && (
          <ImageModal
            title="Update Carousel Image"
            image={editingImage}
            onClose={() => setEditingImage(null)}
            onSuccess={() => {
              setEditingImage(null);

              fetchWelcome();
            }}
          />
        )}

        {deletingImage && (
          <DeleteModal
            image={deletingImage}
            onCancel={() => setDeletingImage(null)}
            onConfirm={deleteCarouselImage}
          />
        )}
      </div>
    </div>
  );
}
// ============================================================
// Image Card
// ============================================================

function ImageCard({ image, imageUrl, onEdit, onDelete }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition duration-300">
      {/* Image Area */}
      <div className="relative h-72 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={image.alt_tag}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />

        {/* Floating Buttons */}
        <div className="absolute bottom-5 right-5 flex gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
          <button
            onClick={onEdit}
            className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 shadow-sm font-medium hover:bg-slate-50 transition"
          >
            Update
          </button>

          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm font-medium hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-slate-900 truncate">
          {image.alt_tag || "Untitled Image"}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-slate-400">Image #{image.id}</p>

          <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
            Carousel
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Add / Update Image Modal
// ============================================================

function ImageModal({ title, image, onClose, onSuccess }) {
  const [altTag, setAltTag] = useState(image?.alt_tag || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    image ? `${BASE_IMG}${image.image}` : null,
  );
  const [saving, setSaving] = useState(false);

  const chooseFile = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const submit = async () => {
    if (!altTag.trim()) {
      alert("Alt tag is required.");
      return;
    }

    if (!image && !file) {
      alert("Please choose an image.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("alt_tag", altTag);

      if (file) {
        formData.append("image", file);
      }

      if (image) {
        await updateImage(image.id, formData);
      } else {
        await addImage(formData);
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Unable to save image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400 mt-1">
              Upload and manage carousel image
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white text-3xl hover:text-red-400 transition"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-7">
          {/* Preview */}
          <div>
            <label className="block font-semibold text-slate-700 mb-3">
              Preview
            </label>

            <div className="h-72 rounded-2xl overflow-hidden border bg-slate-100">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No Image Selected
                </div>
              )}
            </div>
          </div>

          {/* Upload */}
          <div>
            <label className="block font-semibold text-slate-700 mb-3">
              Choose Image
            </label>

            <label className="flex items-center justify-center w-full border-2 border-dashed border-slate-300 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <div className="text-center">
                <p className="font-medium text-blue-600">
                  Click to upload image
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  PNG, JPG, WEBP supported
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={chooseFile}
                className="hidden"
              />
            </label>

            {image && (
              <p className="text-xs text-slate-500 mt-3">
                Leave empty to keep existing image.
              </p>
            )}
          </div>

          {/* Alt Tag */}
          <div>
            <label className="block font-semibold text-slate-700 mb-3">
              Alt Tag
            </label>

            <input
              value={altTag}
              onChange={(e) => setAltTag(e.target.value)}
              placeholder="Enter image description"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t bg-slate-50 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border hover:bg-white transition"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={submit}
            className="px-7 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-medium disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : image ? "Update Image" : "Upload Image"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Delete Confirmation Modal
// ============================================================

function DeleteModal({ image, onCancel, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const remove = async () => {
    setLoading(true);

    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        {/* Top Section */}

        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-4xl">🗑️</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-6">
            Delete Image?
          </h2>

          <p className="text-slate-500 mt-3 leading-6">
            Are you sure you want to delete
            <span className="font-semibold text-slate-800">
              {" "}
              "{image.alt_tag}"
            </span>
            ?
          </p>

          <p className="text-sm text-red-500 mt-4">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}

        <div className="bg-slate-50 border-t px-8 py-5 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-lg border border-slate-300 hover:bg-white transition font-medium"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={remove}
            className="px-7 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
