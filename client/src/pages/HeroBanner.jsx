import { useEffect, useState } from "react";
import {
  FiEdit,
  FiImage,
  FiVideo,
  FiClock,
  FiUploadCloud,
} from "react-icons/fi";
import { BASE_IMG } from "../api/api";
import { getHeroBanner } from "../api/homeApi";
import HeroBannerModal from "../components/HeroBannerModal";

const HeroBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const loadBanner = async () => {
    try {
      setLoading(true);
      const response = await getHeroBanner();
      setBanner(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanner();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading banner...
        </p>
      </div>
    );
  }


  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 lg:p-10">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-medium text-blue-600">
              Content Management
            </p>

            <h1 className="mt-1 text-4xl font-bold text-gray-900">
              Hero Banner
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your homepage hero media.
            </p>
          </div>


          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <FiEdit />
            Update Banner
          </button>

        </div>



        {!banner ? (

          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white">

            <FiUploadCloud
              size={55}
              className="mb-5 text-gray-300"
            />

            <h2 className="text-xl font-semibold text-gray-900">
              No Banner Available
            </h2>

            <p className="mt-2 text-gray-500">
              Upload a new image or video banner.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 xl:grid-cols-[1.8fr_1fr]">


            {/* Preview */}
            <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white">


              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

                <p className="font-semibold text-gray-800">
                  Banner Preview
                </p>


                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                  Active
                </span>

              </div>



              <div className="bg-gray-100 p-6">

                {banner.type === "video" ? (

                  <video
                    controls
                    poster={
                      banner.poster_url
                        ? `${BASE_IMG}${banner.poster_url}`
                        : undefined
                    }
                    className="h-[600px] w-full rounded-2xl object-cover"
                  >

                    <source
                      src={`${BASE_IMG}${banner.media_url}`}
                      type="video/mp4"
                    />

                  </video>

                ) : (

                  <img
                    src={`${BASE_IMG}${banner.media_url}`}
                    alt="Hero Banner"
                    className="h-[600px] w-full rounded-2xl object-cover"
                  />

                )}

              </div>

            </section>




            {/* Details */}
            <div className="space-y-5">


              {/* Media Type */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">

                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Media Type
                </p>


                <div className="mt-5 flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    {
                      banner.type === "video"
                        ? <FiVideo size={22}/>
                        : <FiImage size={22}/>
                    }

                  </div>


                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {
                        banner.type === "video"
                        ? "Video Banner"
                        : "Image Banner"
                      }
                    </h3>

                    <p className="text-sm text-gray-500">
                      Homepage Hero Section
                    </p>
                  </div>

                </div>

              </div>



              {/* Title */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">

                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Title
                </p>

                <h2 className="mt-3 text-2xl font-bold text-gray-900">
                  {banner.title || "-"}
                </h2>

              </div>




              {/* Subtitle */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">

                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Subtitle
                </p>

                <p className="mt-3 leading-7 text-gray-600">
                  {banner.subtitle || "-"}
                </p>

              </div>




              {/* Updated */}
              <div className="flex items-center gap-4 rounded-2xl bg-blue-600 p-6 text-white">

                <FiClock size={25}/>

                <div>

                  <p className="text-sm text-blue-100">
                    Last Updated
                  </p>

                  <p className="font-semibold">
                    {new Date(
                      banner.updated_at
                    ).toLocaleString()}
                  </p>

                </div>

              </div>


            </div>


          </div>

        )}

      </div>


      <HeroBannerModal
        open={openModal}
        banner={banner}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          loadBanner();
        }}
      />

    </>
  );
};

export default HeroBanner;