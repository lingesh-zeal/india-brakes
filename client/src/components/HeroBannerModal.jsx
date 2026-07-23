import { useEffect, useMemo, useState } from "react";
import { FiImage, FiUploadCloud, FiVideo, FiX } from "react-icons/fi";
import { BASE_IMG } from "../api/api";
import { updateHeroBanner } from "../api/homeApi";

const HeroBannerModal = ({ open, onClose, banner, onSuccess }) => {
  const [type, setType] = useState("image");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [media, setMedia] = useState(null);
  const [poster, setPoster] = useState(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setType(banner?.type || "image");
    setTitle(banner?.title || "");
    setSubtitle(banner?.subtitle || "");

    setMedia(null);
    setPoster(null);
  }, [open, banner]);

  const mediaPreview = useMemo(() => {
    if (media) return URL.createObjectURL(media);

    if (banner?.media_url) {
      return `${BASE_IMG}${banner.media_url}`;
    }

    return null;
  }, [media, banner]);

  const posterPreview = useMemo(() => {
    if (poster) return URL.createObjectURL(poster);

    if (banner?.poster_url) {
      return `${BASE_IMG}${banner.poster_url}`;
    }

    return null;
  }, [poster, banner]);

  useEffect(() => {
    return () => {
      if (mediaPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(mediaPreview);
      }

      if (posterPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(posterPreview);
      }
    };
  }, [mediaPreview, posterPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media) {
      alert("Please select a media file.");
      return;
    }

    if (type === "video" && !poster && !banner?.poster_url) {
      alert("Please upload a poster image.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("type", type);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("media", media);

      if (type === "video" && poster) {
        formData.append("poster", poster);
      }

      await updateHeroBanner(formData);

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to update hero banner.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">
      <div className="w-full max-w-[800px] h-[85vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Replace Hero Banner
            </h2>

            <p className="mt-1 text-sm text-cyan-100">
              Upload a new image or video for your homepage.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-white transition hover:bg-white/20"
          >
            <FiX size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="h-[calc(85vh-90px)] space-y-6 overflow-y-auto bg-slate-50 p-6"
        >
          {/* Banner Type */}

          {/* Banner Type */}

          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Banner Type
            </label>

            <div className="grid grid-cols-2 gap-4">
              {/* Image Option */}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  type === "image"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="bannerType"
                  value="image"
                  checked={type === "image"}
                  onChange={(e) => setType(e.target.value)}
                  className="h-4 w-4 accent-blue-600"
                />

                <FiImage
                  className={
                    type === "image" ? "text-blue-600" : "text-slate-400"
                  }
                  size={22}
                />

                <div>
                  <p className="font-medium text-slate-800">Image</p>

                  <p className="text-xs text-slate-500">Upload image banner</p>
                </div>
              </label>

              {/* Video Option */}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  type === "video"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="bannerType"
                  value="video"
                  checked={type === "video"}
                  onChange={(e) => setType(e.target.value)}
                  className="h-4 w-4 accent-blue-600"
                />

                <FiVideo
                  className={
                    type === "video" ? "text-blue-600" : "text-slate-400"
                  }
                  size={22}
                />

                <div>
                  <p className="font-medium text-slate-800">Video</p>

                  <p className="text-xs text-slate-500">Upload video banner</p>
                </div>
              </label>
            </div>
          </div>

          {/* Media Upload */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {type === "image" ? "Upload Image" : "Upload Video"}
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove(
                  "border-blue-500",
                  "bg-blue-50",
                );
              }}
              onDrop={(e) => {
                e.preventDefault();

                const file = e.dataTransfer.files[0];

                if (file) {
                  setMedia(file);
                }

                e.currentTarget.classList.remove(
                  "border-blue-500",
                  "bg-blue-50",
                );
              }}
              className="flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-4 transition"
            >
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <FiUploadCloud size={22} className="text-blue-600" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  Drag & drop your {type} file
                </p>

                <p className="text-xs text-slate-500">
                  or click browse •
                  {type === "image" ? " JPG, PNG, WEBP" : " MP4, WEBM"}
                </p>
              </div>

              {/* Browse Button */}
              <label
                htmlFor="mediaUpload"
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Browse
              </label>

              <input
                id="mediaUpload"
                type="file"
                accept={type === "image" ? "image/*" : "video/mp4,video/webm"}
                onChange={(e) => setMedia(e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Selected File */}
            {media && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm">
                <span className="truncate text-slate-700">{media.name}</span>

                <button
                  type="button"
                  onClick={() => setMedia(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Poster Upload */}

{type === "video" && (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Poster Image
    </label>

    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add(
          "border-blue-500",
          "bg-blue-50"
        );
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove(
          "border-blue-500",
          "bg-blue-50"
        );
      }}
      onDrop={(e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];

        if (file) {
          setPoster(file);
        }

        e.currentTarget.classList.remove(
          "border-blue-500",
          "bg-blue-50"
        );
      }}
      className="flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-4 transition"
    >

      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <FiUploadCloud
          size={22}
          className="text-blue-600"
        />
      </div>


      {/* Text */}
      <div className="flex-1">

        <p className="text-sm font-medium text-slate-800">
          Drag & drop poster image
        </p>

        <p className="text-xs text-slate-500">
          JPG, PNG, WEBP supported
        </p>

      </div>


      {/* Browse */}
      <label
        htmlFor="posterUpload"
        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Browse
      </label>


      <input
        id="posterUpload"
        type="file"
        accept="image/*"
        onChange={(e) => setPoster(e.target.files[0])}
        className="hidden"
      />

    </div>


    {/* Selected Poster */}
    {poster && (
      <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm">

        <span className="truncate text-slate-700">
          {poster.name}
        </span>

        <button
          type="button"
          onClick={() => setPoster(null)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>

      </div>
    )}

  </div>
)}

          {/* Title */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Banner Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter banner title..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          {/* Subtitle */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Banner Subtitle
            </label>

            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter banner subtitle..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 resize-none"
            />
          </div>

          {/* Preview */}

          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-800">
              Live Preview
            </h3>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              {mediaPreview ? (
                type === "video" ? (
                  <video
                    controls
                    poster={posterPreview || undefined}
                    className="max-h-[420px] w-full rounded-2xl object-cover shadow-lg"
                  >
                    <source src={mediaPreview} />
                  </video>
                ) : (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="max-h-[420px] w-full rounded-2xl object-cover shadow-lg"
                  />
                )
              ) : (
                <div className="flex h-72 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400">
                  No Preview Available
                </div>
              )}
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroBannerModal;
