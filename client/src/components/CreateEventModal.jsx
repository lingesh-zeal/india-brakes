import { useState } from "react";
import axios from "axios";
import api from "../api/api";
const initialSpeaker = {
  name: "",
  role: "",
  designation: "",
  department: "",
  organization: "",
  display_order: 1,
  image: null,
};

const initialFee = {
  category_name: "",
  fee: "",
  currency: "INR",
  display_order: 1,
};

const initialSponsor = {
  sponsor_name: "",
  website_url: "",
  display_order: 1,
  logo: null,
};

export default function CreateEventModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    { label: "General Info" },
    { label: "Event Media" },
    { label: "Themes & Audience" },
    { label: "Speakers & Sponsors" },
    { label: "Fees & Pricing" },
  ];

  const [form, setForm] = useState({
    title: "",
    description: "",
    status_id: "2",
    venue: "",
    organized_by: "",

    event_date: "",
    event_end_date: "",
    registration_deadline: "",
    registration_url: "",

    is_homepage: false,

    workshop_themes: [""],
    target_audience: [""],

    banner: null,
    brochure: null,
    photos: [],

    speakers: [initialSpeaker],
    fee_categories: [initialFee],
    sponsors: [initialSponsor],
  });

  if (!open) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("status_id", form.status_id);
      data.append("venue", form.venue);
      data.append("organized_by", form.organized_by);

      data.append("event_date", form.event_date);
      data.append("event_end_date", form.event_end_date);
      data.append("registration_deadline", form.registration_deadline);
      data.append("registration_url", form.registration_url);

      data.append("is_homepage", form.is_homepage);

      data.append(
        "workshop_themes",
        JSON.stringify(form.workshop_themes.filter(Boolean)),
      );

      data.append(
        "target_audience",
        JSON.stringify(form.target_audience.filter(Boolean)),
      );

      data.append(
        "speakers",
        JSON.stringify(form.speakers.map(({ image, ...rest }) => rest)),
      );

      data.append("fee_categories", JSON.stringify(form.fee_categories));

      data.append(
        "sponsors",
        JSON.stringify(form.sponsors.map(({ logo, ...rest }) => rest)),
      );

      if (form.banner) data.append("banner", form.banner);

      if (form.brochure) data.append("brochure", form.brochure);

      form.photos.forEach((file) => {
        data.append("photos", file);
      });

      form.speakers.forEach((speaker) => {
        if (speaker.image) data.append("speaker_images", speaker.image);
      });

      form.sponsors.forEach((sponsor) => {
        if (sponsor.logo) data.append("sponsor_logos", sponsor.logo);
      });

      await api.post("/events", data);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="w-full max-w-5xl h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Create Event</h2>
            <p className="text-slate-400 text-xs mt-0.5">Fill in details step by step to launch a new event</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 transition duration-200 text-xl flex items-center justify-center cursor-pointer border border-slate-100"
          >
            ×
          </button>
        </div>

        {/* Custom Premium Stepper */}
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 shrink-0 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-center max-w-4xl mx-auto w-full">
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className="flex items-center gap-3 group focus:outline-none cursor-pointer shrink-0"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm border ${
                    activeStep === idx 
                      ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-600 ring-4 ring-blue-100" 
                      : activeStep > idx 
                        ? "bg-emerald-500 text-white border-emerald-500" 
                        : "bg-white text-slate-500 border-slate-200 group-hover:bg-slate-100"
                  }`}>
                    {activeStep > idx ? "✓" : idx + 1}
                  </div>
                  <div className="flex flex-col text-left shrink-0">
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${
                      activeStep === idx ? "text-blue-600" : "text-slate-400"
                    }`}>
                      Step {idx + 1}
                    </span>
                    <span className={`text-xs font-semibold transition-colors ${
                      activeStep === idx 
                        ? "text-slate-800" 
                        : activeStep > idx 
                          ? "text-slate-600" 
                          : "text-slate-500 group-hover:text-slate-700"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={`h-[2px] flex-1 mx-4 min-w-[20px] transition-colors duration-300 ${
                    activeStep > idx ? "bg-emerald-400" : "bg-slate-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form
          id="create-event-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/20"
        >
          
          {/* STEP 0: GENERAL INFO */}
          <div className={activeStep === 0 ? "space-y-6" : "hidden"}>
            {/* BASIC */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-6">
                Basic Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Event Title
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition duration-150 text-slate-800 placeholder-slate-400"
                    placeholder="Enter event title"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </div>

                {/* <div>
                  <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition duration-150 text-slate-800"
                    value={form.status_id}
                    onChange={(e) => updateField("status_id", e.target.value)}
                  >
                    <option value="1">Draft</option>
                    <option value="2">Published</option>
                    <option value="3">Registration Open</option>
                    <option value="4">Registration Closed</option>
                    <option value="5">Completed</option>
                  </select>
                </div> */}

                <div>
                  <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Venue
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition duration-150 text-slate-800 placeholder-slate-400"
                    placeholder="Event Venue"
                    value={form.venue}
                    onChange={(e) => updateField("venue", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Organized By
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition duration-150 text-slate-800 placeholder-slate-400"
                    placeholder="Organized By"
                    value={form.organized_by}
                    onChange={(e) => updateField("organized_by", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 resize-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition duration-150 text-slate-800 placeholder-slate-400"
                    placeholder="Provide details about the event..."
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* DATES */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-6">
                Event Schedule
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Event Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition duration-150 text-slate-800"
                    value={form.event_date}
                    onChange={(e) => updateField("event_date", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Event End Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition duration-150 text-slate-800"
                    value={form.event_end_date}
                    onChange={(e) => updateField("event_end_date", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition duration-150 text-slate-800"
                    value={form.registration_deadline}
                    onChange={(e) => updateField("registration_deadline", e.target.value)}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block mb-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Registration URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/register"
                    className="w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition duration-150 text-slate-800 placeholder-slate-400"
                    value={form.registration_url}
                    onChange={(e) => updateField("registration_url", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* DISPLAY SETTINGS */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-4">
                Display Settings
              </h3>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-5">
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Show on Homepage</p>
                  <p className="text-xs text-slate-400 mt-0.5">Feature this event on the user-facing homepage listing.</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateField("is_homepage", !form.is_homepage)}
                  className={`relative inline-flex h-7 w-13 items-center rounded-full transition duration-300 cursor-pointer ${
                    form.is_homepage ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-300 ${
                      form.is_homepage ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </section>
          </div>

          {/* STEP 1: MEDIA FILES */}
          <div className={activeStep === 1 ? "space-y-6" : "hidden"}>
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3 mb-6">
                Event Media
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Banner - Clickable Card */}
                <label className="group block border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50/30 hover:bg-blue-50/20 rounded-2xl p-6 text-center cursor-pointer transition duration-200">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition duration-200">🖼️</div>
                  <h4 className="font-bold text-slate-700 text-sm">Event Banner</h4>
                  <p className="text-slate-400 text-xs mt-1">Recommended JPG, PNG</p>
                  
                  {form.banner ? (
                    <span className="inline-block mt-3 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-3 py-1.5 rounded-lg max-w-full truncate">
                      ✓ {form.banner.name}
                    </span>
                  ) : (
                    <span className="inline-block mt-3 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                      Upload Banner
                    </span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => updateField("banner", e.target.files[0])}
                  />
                </label>

                {/* Brochure - Clickable Card */}
                <label className="group block border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50/30 hover:bg-blue-50/20 rounded-2xl p-6 text-center cursor-pointer transition duration-200">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition duration-200">📄</div>
                  <h4 className="font-bold text-slate-700 text-sm">Event Brochure</h4>
                  <p className="text-slate-400 text-xs mt-1">Recommended PDF</p>
                  
                  {form.brochure ? (
                    <span className="inline-block mt-3 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-3 py-1.5 rounded-lg max-w-full truncate">
                      ✓ {form.brochure.name}
                    </span>
                  ) : (
                    <span className="inline-block mt-3 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                      Upload Brochure
                    </span>
                  )}

                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => updateField("brochure", e.target.files[0])}
                  />
                </label>

                {/* Gallery - Clickable Card */}
                <label className="group block border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50/30 hover:bg-blue-50/20 rounded-2xl p-6 text-center cursor-pointer transition duration-200">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition duration-200">📷</div>
                  <h4 className="font-bold text-slate-700 text-sm">Event Gallery</h4>
                  <p className="text-slate-400 text-xs mt-1">Multiple JPG, PNG images</p>
                  
                  {form.photos.length > 0 ? (
                    <span className="inline-block mt-3 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-3 py-1.5 rounded-lg">
                      ✓ {form.photos.length} files selected
                    </span>
                  ) : (
                    <span className="inline-block mt-3 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                      Upload Photos
                    </span>
                  )}

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => updateField("photos", [...e.target.files])}
                  />
                </label>
              </div>

              {/* Media File Previews */}
              {(form.banner || form.brochure || form.photos.length > 0) && (
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h4 className="font-bold text-slate-700 text-sm mb-4">
                    Selected Files Details
                  </h4>

                  <div className="grid gap-3">
                    {form.banner && (
                      <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm">
                        <span className="font-medium text-slate-500">Banner</span>
                        <span className="font-semibold text-blue-600 truncate max-w-xs">{form.banner.name}</span>
                      </div>
                    )}

                    {form.brochure && (
                      <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm">
                        <span className="font-medium text-slate-500">Brochure</span>
                        <span className="font-semibold text-blue-600 truncate max-w-xs">{form.brochure.name}</span>
                      </div>
                    )}

                    {form.photos.length > 0 && (
                      <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm">
                        <span className="font-medium text-slate-500">Gallery Photos</span>
                        <span className="font-semibold text-blue-600">{form.photos.length} images selected</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* STEP 2: THEMES & AUDIENCE */}
          <div className={activeStep === 2 ? "space-y-6" : "hidden"}>
            {/* WORKSHOP THEMES */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                  Workshop Themes
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Type a theme and press <kbd className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-bold text-slate-500 border border-slate-200">Enter</kbd> to add.
                </p>
              </div>

              <div className="min-h-[64px] rounded-xl border border-slate-200 bg-slate-50/30 p-3 flex flex-wrap gap-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition duration-150">
                {form.workshop_themes.filter(Boolean).map((theme, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 text-xs font-semibold"
                  >
                    {theme}
                    <button
                      type="button"
                      className="h-4 w-4 rounded-full bg-blue-100 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center text-xs cursor-pointer font-bold"
                      onClick={() =>
                        updateField(
                          "workshop_themes",
                          form.workshop_themes.filter((_, i) => i !== index),
                        )
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  placeholder="Type a theme and press Enter..."
                  className="flex-1 min-w-[200px] outline-none px-2 py-1.5 text-sm text-slate-700"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = e.target.value.trim();
                      if (value && !form.workshop_themes.includes(value)) {
                        updateField("workshop_themes", [
                          ...form.workshop_themes,
                          value,
                        ]);
                      }
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </section>

            {/* TARGET AUDIENCE */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                  Target Audience
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Type an audience group and press <kbd className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-bold text-slate-500 border border-slate-200">Enter</kbd> to add.
                </p>
              </div>

              <div className="min-h-[64px] rounded-xl border border-slate-200 bg-slate-50/30 p-3 flex flex-wrap gap-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition duration-150">
                {form.target_audience.filter(Boolean).map((audience, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 text-xs font-semibold"
                  >
                    {audience}
                    <button
                      type="button"
                      className="h-4 w-4 rounded-full bg-emerald-100 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center text-xs cursor-pointer font-bold"
                      onClick={() =>
                        updateField(
                          "target_audience",
                          form.target_audience.filter((_, i) => i !== index),
                        )
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  placeholder="Type audience and press Enter..."
                  className="flex-1 min-w-[200px] outline-none px-2 py-1.5 text-sm text-slate-700"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = e.target.value.trim();
                      if (value && !form.target_audience.includes(value)) {
                        updateField("target_audience", [
                          ...form.target_audience,
                          value,
                        ]);
                      }
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </section>
          </div>

          {/* STEP 3: SPEAKERS & SPONSORS */}
          <div className={activeStep === 3 ? "space-y-6" : "hidden"}>
            {/* SPEAKERS */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                    Speakers
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Add event speakers with profiles and photos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateField("speakers", [
                      ...form.speakers,
                      {
                        name: "",
                        role: "",
                        designation: "",
                        department: "",
                        organization: "",
                        display_order: 1,
                        image: null,
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  + Add Speaker
                </button>
              </div>

              <div className="space-y-6">
                {form.speakers.map((speaker, index) => (
                  <div
                    key={index}
                    className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 relative group/card hover:shadow-md transition duration-200"
                  >
                    {/* Header badge */}
                    <div className="md:col-span-2 flex justify-between items-center">
                      <span className="bg-slate-200/60 text-slate-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        Speaker #{index + 1}
                      </span>
                      {form.speakers.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              "speakers",
                              form.speakers.filter((_, i) => i !== index),
                            )
                          }
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {[
                      ["name", "Full Name"],
                      ["role", "Role (e.g. Chief Guest)"],
                      ["designation", "Designation"],
                      ["department", "Department"],
                      ["organization", "Organization"],
                    ].map(([field, label]) => (
                      <div key={field}>
                        <label className="block mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {label}
                        </label>
                        <input
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm text-slate-800"
                          placeholder={`Enter speaker's ${field}`}
                          value={speaker[field]}
                          onChange={(e) => {
                            const arr = [...form.speakers];
                            arr[index][field] = e.target.value;
                            updateField("speakers", arr);
                          }}
                        />
                      </div>
                    ))}

                    {/* Image Upload - Dotted Card direct click */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Speaker Image
                      </label>

                      <label className="group/upload flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/20 rounded-xl p-5 cursor-pointer transition text-slate-500 text-center">
                        <div className="text-3xl mb-2 group-hover/upload:scale-110 transition duration-150">📷</div>
                        <p className="text-xs font-bold text-slate-600">Click to upload photo</p>
                        
                        {speaker.image ? (
                          <p className="mt-2 text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                            ✓ {speaker.image.name}
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG up to 2MB</p>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const arr = [...form.speakers];
                            arr[index].image = e.target.files[0];
                            updateField("speakers", arr);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SPONSORS */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                    Sponsors
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Add supporting organizations and logos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateField("sponsors", [
                      ...form.sponsors,
                      {
                        sponsor_name: "",
                        website_url: "",
                        display_order: 1,
                        logo: null,
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  + Add Sponsor
                </button>
              </div>

              <div className="space-y-6">
                {form.sponsors.map((sponsor, index) => (
                  <div
                    key={index}
                    className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 relative hover:shadow-md transition duration-200"
                  >
                    <div className="md:col-span-2 flex justify-between items-center">
                      <span className="bg-slate-200/60 text-slate-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        Sponsor #{index + 1}
                      </span>
                      {form.sponsors.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              "sponsors",
                              form.sponsors.filter((_, i) => i !== index),
                            )
                          }
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Sponsor Name
                      </label>
                      <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm text-slate-800"
                        placeholder="e.g. Google"
                        value={sponsor.sponsor_name}
                        onChange={(e) => {
                          const arr = [...form.sponsors];
                          arr[index].sponsor_name = e.target.value;
                          updateField("sponsors", arr);
                        }}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Website URL
                      </label>
                      <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm text-slate-800"
                        placeholder="https://example.com"
                        value={sponsor.website_url}
                        onChange={(e) => {
                          const arr = [...form.sponsors];
                          arr[index].website_url = e.target.value;
                          updateField("sponsors", arr);
                        }}
                      />
                    </div>

                    {/* Logo Upload - Dotted Card direct click */}
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Sponsor Logo
                      </label>

                      <label className="group/upload flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/20 rounded-xl p-5 cursor-pointer transition text-slate-500 text-center">
                        <div className="text-3xl mb-2 group-hover/upload:scale-110 transition duration-150">🏢</div>
                        <p className="text-xs font-bold text-slate-600">Click to upload logo</p>
                        
                        {sponsor.logo ? (
                          <p className="mt-2 text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                            ✓ {sponsor.logo.name}
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-0.5">PNG Logo</p>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const arr = [...form.sponsors];
                            arr[index].logo = e.target.files[0];
                            updateField("sponsors", arr);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* STEP 4: FEES & PRICING */}
          <div className={activeStep === 4 ? "space-y-6" : "hidden"}>
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
                    Fee Categories
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Define different registration tiers and rates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateField("fee_categories", [
                      ...form.fee_categories,
                      {
                        category_name: "",
                        fee: "",
                        currency: "INR",
                        display_order: 1,
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  + Add Fee Category
                </button>
              </div>

              <div className="space-y-5">
                {form.fee_categories.map((fee, index) => (
                  <div
                    key={index}
                    className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-5 relative hover:shadow-md transition duration-200"
                  >
                    <div className="md:col-span-3 flex justify-between items-center">
                      <span className="bg-slate-200/60 text-slate-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        Pricing Tier #{index + 1}
                      </span>
                      {form.fee_categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              "fee_categories",
                              form.fee_categories.filter((_, i) => i !== index),
                            )
                          }
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Category Name
                      </label>
                      <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm text-slate-800"
                        placeholder="e.g. Student / Professional"
                        value={fee.category_name}
                        onChange={(e) => {
                          const arr = [...form.fee_categories];
                          arr[index].category_name = e.target.value;
                          updateField("fee_categories", arr);
                        }}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Fee Amount
                      </label>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm text-slate-800"
                        placeholder="0"
                        value={fee.fee}
                        onChange={(e) => {
                          const arr = [...form.fee_categories];
                          arr[index].fee = e.target.value;
                          updateField("fee_categories", arr);
                        }}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Currency
                      </label>
                      <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm text-slate-800"
                        placeholder="INR / USD"
                        value={fee.currency}
                        onChange={(e) => {
                          const arr = [...form.fee_categories];
                          arr[index].currency = e.target.value;
                          updateField("fee_categories", arr);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </form>

        {/* Modal Actions Footer */}
        <div className="flex justify-between items-center gap-3 p-5 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-250 bg-white text-slate-700 hover:bg-slate-100 transition duration-150 text-sm font-semibold cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {activeStep > 0 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev - 1)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-250 bg-white text-slate-700 hover:bg-slate-100 transition duration-150 text-sm font-semibold cursor-pointer"
              >
                Back
              </button>
            )}

            {activeStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm transition duration-150 cursor-pointer shadow-md shadow-blue-500/10"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                form="create-event-form"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 cursor-pointer shadow-md shadow-blue-500/10"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
