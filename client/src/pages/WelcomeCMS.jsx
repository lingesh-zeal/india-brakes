import { useEffect, useState } from "react";
import { FaPlus, FaSave, FaImage } from "react-icons/fa";
import api, { BASE_IMG } from "../api/api";
import { addImage, deleteImage, getWelcome, updateImage, updateWelcome } from "../api/welcomeApi";

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

      const res = await getWelcome()
      console.log("WELCOME RESPONSE:", res.data)

      const welcomeData = res.data.data

      setSection({
        heading: welcomeData.section?.heading || "",
        sub_heading: welcomeData.section?.sub_heading|| "",
        content: welcomeData.section?.content|| "",
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

      await updateWelcome(section)

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
      await deleteImage(deletingImage.id)
      setDeletingImage(null);

      fetchWelcome();
    } catch (err) {
      console.error(err);
      alert("Unable to delete image.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* ===================================== */}
      {/* Header */}
      {/* ===================================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome CMS</h1>

        <p className="text-slate-500 mt-2">
          Manage the homepage welcome section and carousel images.
        </p>
      </div>

      {/* ===================================== */}
      {/* Welcome Form */}
      {/* ===================================== */}

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Welcome Content</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Heading */}

          <div>
            <label className="block font-medium mb-2">Heading</label>

            <input
              type="text"
              value={section.heading}
              onChange={(e) =>
                setSection({
                  ...section,
                  heading: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Sub Heading */}

          <div>
            <label className="block font-medium mb-2">Sub Heading</label>

            <input
              type="text"
              value={section.sub_heading}
              onChange={(e) =>
                setSection({
                  ...section,
                  sub_heading: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Content */}

          <div>
            <label className="block font-medium mb-2">Content</label>

            <textarea
              rows={6}
              value={section.content}
              onChange={(e) =>
                setSection({
                  ...section,
                  content: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Save */}

          <div className="flex justify-end">
            <button
              disabled={saving}
              onClick={saveWelcome}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* Carousel */}
      {/* ===================================== */}

      <div className="mt-10 bg-white rounded-xl shadow-sm border">
        <div className="border-b px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Carousel Images</h2>

            <p className="text-sm text-slate-500 mt-1">
              {carousel.length} / 6 Images
              {carousel.length ===1 &&(
                <span className="text-amber-600 ml-2">
                    (Minimum Required)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="p-6">
          {carousel.length === 0 ? (
            <div className="text-center py-20">
              <FaImage size={60} className="mx-auto text-slate-300" />

              <h3 className="mt-5 text-lg font-semibold">No Carousel Images</h3>

              <p className="text-slate-500 mt-2">Upload your first image.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {carousel.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  imageUrl={`${BASE_IMG}${image.image}`}
                  onEdit={() => setEditingImage(image)}
                  onDelete={
                    carousel.length >1 
                    ? () => setDeletingImage(image)
                    : null
                  }
                />
              ))}

              {/* Add Image Card */}

              {carousel.length < 6 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="border-2 border-dashed rounded-xl h-72 flex flex-col justify-center items-center hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <FaPlus className="text-blue-600 mb-3" size={28} />

                  <span className="font-semibold text-blue-600">Add Image</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===================================== */}
      {/* Modals */}
      {/* ===================================== */}

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
  );
}
// ============================================================
// Image Card
// ============================================================

function ImageCard({ image, imageUrl, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="overflow-hidden h-52 bg-slate-100">
        <img
          src={imageUrl}
          alt={image.alt_tag}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-800 line-clamp-1">
          {image.alt_tag || "Untitled"}
        </h3>

        <p className="text-xs text-slate-400 mt-1">Image #{image.id}</p>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onEdit}
            className="flex-1 border rounded-lg py-2 font-medium hover:bg-slate-50 transition"
          >
            Update
          </button>

          {/* <button
            onClick={onDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 font-medium transition"
          >
            Delete
          </button> */}

          {onDelete && (
            <button onClick={onDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 font-medium transition"
            >
            Delete
            </button>
          )}
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
        await updateImage(image.id, formData)
      } else {
        await addImage(formData)
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
        {/* Header */}

        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="text-2xl leading-none hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-6">
          {/* Preview */}

          <div>
            <label className="block mb-2 font-medium">Preview</label>

            <div className="h-64 rounded-lg overflow-hidden border bg-slate-100 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400">No Image Selected</div>
              )}
            </div>
          </div>

          {/* Upload */}

          <div>
            <label className="block mb-2 font-medium">Choose Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={chooseFile}
              className="w-full border rounded-lg p-3"
            />

            {image && (
              <p className="text-xs text-slate-500 mt-2">
                Leave empty to keep the existing image.
              </p>
            )}
          </div>

          {/* Alt Tag */}

          <div>
            <label className="block mb-2 font-medium">Alt Tag</label>

            <input
              value={altTag}
              onChange={(e) => setAltTag(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter image description"
            />
          </div>
        </div>

        {/* Footer */}

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={submit}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 disabled:opacity-50"
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-semibold text-red-600">Delete Image</h2>
        </div>

        <div className="p-6">
          <p className="text-slate-600">
            Are you sure you want to delete
            <span className="font-semibold"> "{image.alt_tag}"</span>?
          </p>

          <p className="text-sm text-slate-400 mt-3">
            This action cannot be undone.
          </p>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="border rounded-lg px-5 py-2 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={remove}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
