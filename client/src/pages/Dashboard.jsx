import { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaUsers, FaRupeeSign, FaMapMarkerAlt, FaClock } from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BASE_IMG, BASE_URL } from "../api/api";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setData(response.data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
          <div className="text-sm font-semibold text-slate-500">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-sm font-semibold text-red-500 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
          Unable to load dashboard
        </div>
      </div>
    );
  }

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="p-1 md:p-4 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 text-xs mt-0.5">Overview of platform metrics, registration trends, and upcoming events</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Events */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Events</h3>
              <h2 className="text-3xl font-extrabold text-slate-800">{data.stats.totalEvents}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition duration-200 shadow-sm">
              <FaCalendarAlt size={20} />
            </div>
          </div>

          {/* Total Registrations */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Registrations</h3>
              <h2 className="text-3xl font-extrabold text-slate-800">{data.stats.totalRegistrations}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition duration-200 shadow-sm">
              <FaUsers size={20} />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</h3>
              <h2 className="text-3xl font-extrabold text-slate-800">₹ {data.stats.totalRevenue.toLocaleString()}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition duration-200 shadow-sm">
              <FaRupeeSign size={20} />
            </div>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* EVENT REGISTRATION CHART */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition duration-200 flex flex-col">
            <h2 className="text-base font-bold text-slate-800 mb-6 border-l-4 border-blue-500 pl-3">Event Registrations</h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.eventStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 550}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 550}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'}} />
                  <Bar dataKey="registrations" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* STATUS CHART */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition duration-200 flex flex-col">
            <h2 className="text-base font-bold text-slate-800 mb-6 border-l-4 border-blue-500 pl-3">Event Status</h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusStats}
                    dataKey="total"
                    nameKey="status_name"
                    outerRadius={95}
                    innerRadius={60}
                    paddingAngle={3}
                    label
                  >
                    {data.statusStats.map((item, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: '500'}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT REGISTRATIONS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 border-l-4 border-blue-500 pl-3">Recent Registrations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-50/70 text-slate-500">
                <tr>
                  <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider border-b border-slate-150">Name</th>
                  <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider border-b border-slate-150">Email</th>
                  <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider border-b border-slate-150">Phone</th>
                  <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider border-b border-slate-150">Event</th>
                  <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider border-b border-slate-150">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {data.recentRegistrations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition duration-150">
                    <td className="py-4 px-6 font-semibold text-slate-800">{item.full_name}</td>
                    <td className="py-4 px-6 text-slate-600">{item.email}</td>
                    <td className="py-4 px-6 text-slate-600">{item.phone}</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-700 py-1 px-3.5 rounded-full text-xs font-semibold border border-blue-100">
                        {item.event_name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* UPCOMING EVENTS */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-slate-800 border-l-4 border-blue-500 pl-3">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.upcomingEvents.map((event) => (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group" key={event.id}>
                {event.banner_url ? (
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={`${BASE_IMG}${event.banner_url}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      alt={event.title} 
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-tr from-slate-100 to-slate-200/50 flex items-center justify-center text-slate-400">
                    <FaCalendarAlt size={32} />
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3 truncate group-hover:text-blue-600 transition">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FaMapMarkerAlt className="text-slate-400 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FaClock className="text-slate-400 shrink-0" />
                        <span>{new Date(event.event_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
