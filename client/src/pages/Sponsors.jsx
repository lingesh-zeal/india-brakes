import { useState } from "react";
import SponsorInquiries from "../components/SponsorInquiries";
import EnquiryTypes from "../components/EnquiryTypes";

const Sponsors = () => {
  const [tab, setTab] = useState("inquiries");

  return (
    <div className="p-1 md:p-4 space-y-6 font-sans text-slate-800">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Sponsors Management
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">Manage sponsor inquiries and custom form inquiry categories</p>
      </div>

      {/* Modern Tabs Switcher */}
      <div className="flex gap-2 p-1 bg-slate-100/70 border border-slate-150 rounded-xl w-fit shrink-0">
        <button
          onClick={() => setTab("inquiries")}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition duration-150 cursor-pointer ${
            tab === "inquiries" 
              ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" 
              : "text-slate-500 hover:text-slate-850"
          }`}
        >
          Sponsor Inquiries
        </button>

        <button
          onClick={() => setTab("types")}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition duration-150 cursor-pointer ${
            tab === "types" 
              ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" 
              : "text-slate-500 hover:text-slate-850"
          }`}
        >
          Enquiry Types
        </button>
      </div>

      <div className="pt-2">
        {tab === "inquiries" ? <SponsorInquiries /> : <EnquiryTypes />}
      </div>
    </div>
  );
};

export default Sponsors;
