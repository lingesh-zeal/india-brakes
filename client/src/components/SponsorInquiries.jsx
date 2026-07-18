import { useEffect, useState } from "react";
import api from "../api/api";

const SponsorInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get("/sponsors");

      setInquiries(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (item) => {
    setSelectedInquiry(item);

    setStatus(item.status);

    setNotes(item.admin_notes || "");
  };

  const closeModal = () => {
    setSelectedInquiry(null);

    setStatus("");

    setNotes("");
  };

  const updateInquiry = async () => {
    try {
      await api.patch(`/sponsors/${selectedInquiry.id}`, {
        status,
        admin_notes: notes,
      });

      closeModal();

      fetchInquiries();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredInquiries =
    statusFilter === "all"
      ? inquiries
      : inquiries.filter((item) => item.status === statusFilter);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">
            Sponsor Inquiries
          </h2>
          <p className="text-slate-400 text-xs mt-0.5 ml-3">Review proposals and sponsorship requests submitted online</p>
        </div>

        <div className="flex flex-row items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none border-none focus:ring-0 cursor-pointer pr-4"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="relative inline-flex items-center">
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
              Requests
            </span>
            <span className="absolute -top-2 -right-2 min-w-6 h-6 px-1.5 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-extrabold shadow-md shadow-blue-500/10">
              {inquiries.length}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Name</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Email</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Message</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Notes</th>
                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-700">
              {filteredInquiries.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition duration-150"
                >
                  <td className="px-5 py-4 font-bold text-slate-800">
                    {item.name}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.email}
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-500">
                    {item.enquiry_type}
                  </td>

                  <td className="px-5 py-4 max-w-xs truncate text-slate-500">
                    {item.message || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border
                        ${item.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-100" : ""}
                        ${item.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : ""}
                        ${item.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-100" : ""}
                        ${item.status === "contacted" ? "bg-blue-50 text-blue-700 border-blue-100" : ""}
                      `}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 max-w-xs truncate text-slate-500 font-medium">
                    {item.admin_notes || "-"}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openModal(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition duration-150 cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 border border-slate-100 shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Sponsor Inquiry Details
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">Review and update applicant information</p>
              </div>

              <button
                onClick={closeModal}
                className="h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition flex items-center justify-center text-sm font-bold border border-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Name</label>
                  <p className="font-bold text-slate-850 mt-1">{selectedInquiry.name}</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</label>
                  <p className="font-semibold text-slate-700 mt-1 break-all">{selectedInquiry.email}</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Company</label>
                  <p className="font-semibold text-slate-700 mt-1">{selectedInquiry.company || "-"}</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Enquiry Type</label>
                  <p className="font-semibold text-slate-700 mt-1">{selectedInquiry.enquiry_type}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Message</label>
                <div className="bg-slate-50/70 border border-slate-150 rounded-xl p-4 text-xs font-medium text-slate-600 mt-1.5 leading-relaxed">
                  {selectedInquiry.message || "No message provided."}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 grid gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full mt-1.5 border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Admin Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes about communication status..."
                    rows="3"
                    className="w-full mt-1.5 border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 text-xs font-semibold resize-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 shrink-0">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-slate-250 bg-white text-slate-700 hover:bg-slate-100 transition duration-150 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={updateInquiry}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition duration-150 cursor-pointer shadow-md shadow-blue-500/10"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mt-6">
        Showing {filteredInquiries.length} of {inquiries.length} inquiries
      </div>
    </div>
  );
};;

export default SponsorInquiries;
