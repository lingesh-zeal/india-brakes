import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { BASE_IMG, BASE_URL } from "../api/api";

const getImageUrl = (path) => {
  if (!path) return "";

  // Remove any leading slashes and prepend exactly one
  return `${BASE_IMG}${path.replace(/^\/+/, "")}`;
};

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setEvent(res.data.data);
    } catch (err) {
      console.error("Failed to load event", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Loading event...</div>
    );
  }

  if (!event) {
    return (
      <div className="p-6 text-red-500">Event not found</div>
    );
  }

  return (
    <div className="p-1 md:p-4 space-y-6 font-sans text-slate-800">

      {/* HEADER / BANNER */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {event.banner_url && (
          <div className="w-full h-72 overflow-hidden relative">
            <img
              src={getImageUrl(event.banner_url)}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {event.title}
              </h1>

              <p className="text-sm font-semibold text-slate-400">
                Organized by: <span className="text-slate-650">{event.organized_by}</span>
              </p>
            </div>

            <StatusBadge status={event.status} />
          </div>

          <p className="mt-6 text-sm text-slate-600 leading-relaxed max-w-4xl">
            {event.description}
          </p>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <InfoCard
          title="Venue"
          value={event.venue}
        />

        <InfoCard
          title="Event Date"
          value={new Date(event.event_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
        />

        <InfoCard
          title="Registration Deadline"
          value={
            event.registration_deadline
              ? new Date(event.registration_deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })
              : "N/A"
          }
        />

        <InfoCard
          title="Registration Link"
          value={event.registration_url}
          isLink
        />
      </div>

      {/* THEMES & TARGET AUDIENCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* THEMES */}
        <Section title="Workshop Themes">
          <div className="flex flex-wrap gap-2 pt-2">
            {event.workshop_themes?.filter(Boolean).map((t, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-700 border border-blue-100 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                {t}
              </span>
            ))}
            {(!event.workshop_themes || event.workshop_themes.filter(Boolean).length === 0) && (
              <p className="text-xs text-slate-450 italic">No themes specified</p>
            )}
          </div>
        </Section>

        {/* TARGET AUDIENCE */}
        <Section title="Target Audience">
          <div className="flex flex-wrap gap-2 pt-2">
            {event.target_audience?.filter(Boolean).map((a, i) => (
              <span
                key={i}
                className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                {a}
              </span>
            ))}
            {(!event.target_audience || event.target_audience.filter(Boolean).length === 0) && (
              <p className="text-xs text-slate-450 italic">No target audience specified</p>
            )}
          </div>
        </Section>
      </div>

      {/* SPEAKERS */}
      <Section title="Event Speakers">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {event.speakers?.map((sp, i) => (
            <div
              key={i}
              className="bg-slate-50/40 border border-slate-150 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center"
            >
              {sp.profile_image_url ? (
                <img
                  src={getImageUrl(sp.profile_image_url)}
                  alt={sp.name}
                  className="h-20 w-20 rounded-full object-cover border border-slate-200 shadow-sm mb-4"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-extrabold text-xl mb-4 border border-slate-350">
                  {sp.name?.[0]?.toUpperCase() || "S"}
                </div>
              )}

              <h3 className="font-extrabold text-slate-800 text-sm">{sp.name}</h3>
              <p className="text-xs text-blue-600 font-semibold mt-1">
                {sp.designation}
              </p>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                {sp.organization}
              </p>
            </div>
          ))}
          {(!event.speakers || event.speakers.length === 0) && (
            <p className="text-xs text-slate-450 italic col-span-full">No speakers listed</p>
          )}
        </div>
      </Section>

      {/* SPONSORS */}
      <Section title="Event Sponsors">
        <div className="flex flex-wrap gap-4 pt-2">
          {event.sponsors?.map((s, i) => (
            <div
              key={i}
              className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm hover:shadow flex items-center gap-4 transition duration-150"
            >
              {s.logo_url && (
                <img
                  src={`${BASE_IMG}${s.logo_url}`}
                  className="h-10 w-10 object-contain"
                  alt=""
                />
              )}

              <div>
                <p className="font-bold text-slate-850 text-xs">
                  {s.sponsor_name}
                </p>

                {s.website_url && (
                  <a
                    href={s.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-blue-650 hover:underline mt-0.5 block"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
          ))}
          {(!event.sponsors || event.sponsors.length === 0) && (
            <p className="text-xs text-slate-450 italic">No sponsors listed</p>
          )}
        </div>
      </Section>

      {/* FEE CATEGORIES */}
      <Section title="Registration Fees">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
          {event.fee_categories?.map((fee) => (
            <div
              key={fee.id}
              className="bg-slate-50/40 border border-slate-150 rounded-2xl p-5 hover:shadow-md transition duration-200"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                {fee.category_name}
              </div>

              <div className="text-blue-600 text-lg font-extrabold">
                {fee.currency} {fee.fee.toLocaleString()}
              </div>
            </div>
          ))}
          {(!event.fee_categories || event.fee_categories.length === 0) && (
            <p className="text-xs text-slate-450 italic col-span-full">No pricing categories listed</p>
          )}
        </div>
      </Section>

      {/* PHOTOS */}
      <Section title="Event Photos">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {event.photos?.map((p) => {
            const imageUrl = `${BASE_IMG}${p.image_url}`;
            return (
              <div className="h-32 overflow-hidden rounded-xl border border-slate-150 shadow-sm relative group cursor-pointer" key={p.id}>
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            );
          })}
          {(!event.photos || event.photos.length === 0) && (
            <p className="text-xs text-slate-450 italic col-span-full">No event photos uploaded yet</p>
          )}
        </div>
      </Section>
    </div>
  );
}

function InfoCard({ title, value, isLink= false }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition duration-200">
      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">{title}</div>

      {isLink ? (
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-xs text-blue-600 hover:text-blue-800 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <div className="font-semibold text-xs text-slate-400">
            N/A
          </div>
        )
      ) : (
        <div className="font-extrabold text-sm text-slate-800">{value || "N/A"}</div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-slate-800 border-l-4 border-blue-500 pl-3 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Published: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Draft: "bg-slate-100 text-slate-700 border-slate-200",
    "Registration Open": "bg-blue-50 text-blue-700 border-blue-150",
    "Registration Closed": "bg-amber-50 text-amber-700 border-amber-150",
    Completed: "bg-purple-50 text-purple-700 border-purple-150",
  };

  return (
    <span
      className={`px-3 py-1.5 text-xs font-bold rounded-xl border shrink-0 ${
        colors[status] || "bg-slate-50 text-slate-700 border-slate-100"
      }`}
    >
      {status}
    </span>
  );
}