import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { BASE_URL } from "../api/api";

function EventRegistrations() {
  const { id } = useParams();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, [id]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/registrations/events/${id}`);
      setRegistrations(res.data.data);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [id]);

  return (
    <div className="p-1 md:p-4 space-y-6 font-sans text-slate-800">
      
      {/* Back & Header Container */}
      <div className="flex flex-col gap-4">
        <div>
          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-205 text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
          >
            ← Back to Events
          </Link>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Event Registrations</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Registered attendees list for <span className="font-semibold text-slate-650">{registrations[0]?.event_name || "Event"}</span>
          </p>
        </div>
      </div>

      {/* Registrations Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">#</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">Name</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">Email</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">Phone</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">Organization</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">Department</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">Designation</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">Category</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">Fee Paid</th>
                <th className="py-3.5 px-4 text-[10px] font-bold uppercase tracking-wider">Date Registered</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
                    <span className="text-xs font-semibold">Loading registrations...</span>
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-slate-400 font-semibold text-xs">
                    No registrations found for this event
                  </td>
                </tr>
              ) : (
                registrations.map((r, index) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition duration-150">
                    <td className="py-4 px-4 font-semibold text-slate-450">{index + 1}</td>
                    <td className="py-4 px-4 font-bold text-slate-850">{r.full_name}</td>
                    <td className="py-4 px-4 text-slate-600">{r.email}</td>
                    <td className="py-4 px-4 text-slate-600">{r.phone}</td>
                    <td className="py-4 px-4 text-slate-500 font-medium">{r.organization || "-"}</td>
                    <td className="py-4 px-4 text-slate-500">{r.department || "-"}</td>
                    <td className="py-4 px-4 text-slate-500">{r.designation || "-"}</td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-xs font-semibold">
                        {r.category_name}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-blue-650">₹{r.fee.toLocaleString()}</td>
                    <td className="py-4 px-4 text-slate-400 text-xs">
                      {new Date(r.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EventRegistrations;
