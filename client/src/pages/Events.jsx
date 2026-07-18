import { useEffect, useState } from "react";
import API from "../api/api";
import CreateEventModal from "../components/CreateEventModal";
import { Link } from "react-router-dom";
import EditEventModal from "../components/EditEventModal";
import {
  FaCalendarAlt,
  FaEdit,
  FaEye,
  FaGlobe,
  FaSearch,
  FaTrash,
  FaCheckCircle,
  FaFileAlt,
  FaArchive,
} from "react-icons/fa";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events", {
        params: { search },
      });
      setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search]);

  const togglePublish = async (event) => {
    const newStatus = event.status === "Published" ? "Draft" : "Published";

    const confirmed = window.confirm(
      `Are you sure you want to change "${event.title}" status to ${newStatus}?`,
    );

    if (!confirmed) return;

    try {
      await API.patch(`/events/${event.id}/status`, {
        status: newStatus,
      });

      fetchEvents();
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to update event status");
    }
  };

  const archiveEvent = async (id) => {
    const event = events.find(
      (item) => item.id === id
    );
  const confirmed = window.confirm(
    `Are you sure you want to archive "${event?.title}"?\n\nArchived events will not appear on the client website.`
  );
   if(!confirmed) return;

    try {
      await API.patch(`/events/${id}/archive`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const restoreEvent = async (id) => {

    const event = events.find(
    (item)=>item.id === id
  );


  const confirmed = window.confirm(
    `Restore "${event?.title}"?\n\nThis event will become visible again.`
  );


  if(!confirmed) return;
    try {
      await API.patch(`/events/${id}/restore`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await API.delete(`/events/${id}`);
      await fetchEvents();
      alert("Event deleted successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-1 md:p-4 space-y-6 font-sans text-slate-800">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Events Management
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Create, modify, publish, and delete events on the platform
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition cursor-pointer shadow-md shadow-blue-500/10"
        >
          + Create Event
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Events"
          value={events.length}
          icon={<FaCalendarAlt />}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Published"
          value={
            events.filter(
              (e) => e.lifecycle !== "Draft" && e.lifecycle !== "Archived",
            ).length
          }
          icon={<FaCheckCircle />}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Drafts"
          value={events.filter((e) => e.lifecycle === "Draft").length}
          icon={<FaFileAlt />}
          iconColor="bg-slate-100 text-slate-650"
        />
        <StatCard
          title="Featured on Web"
          value={events.filter((e) => e.is_homepage).length}
          icon={<FaGlobe />}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Archived"
          value={events.filter((e) => e.lifecycle === "Archived").length}
          icon={<FaTrash />}
          iconColor="bg-red-50 text-red-600"
        />
      </div>

      {/* Search Input */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-150 shadow-sm flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition duration-150">
        <FaSearch className="text-slate-400 shrink-0" size={14} />
        <input
          type="text"
          placeholder="Search events by title or venue..."
          className="flex-1 outline-none text-sm bg-transparent text-slate-800 placeholder-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider">
                  Event Details
                </th>
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider">
                  Organizer
                </th>
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider">
                  Registrations
                </th>
                <th className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="text-slate-700">
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition duration-150"
                >
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-850">
                      {event.title}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {event.venue}
                    </div>
                  </td>

                  <td className="py-4 px-5 font-medium text-slate-650">
                    {event.organized_by}
                  </td>

                  <td className="py-4 px-5 text-slate-500 font-medium">
                    {new Date(event.event_date).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </td>

                  {/* <td className="py-4 px-5">
                    <StatusBadge status={event.status} />
                  </td> */}

                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          status={event.archived ? "Archived" : event.status}
                        />

                        {/* Publish Toggle */}

                        {!event.archived && (
                          <button
                            onClick={() => togglePublish(event)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition

${event.status === "Published" ? "bg-green-600" : "bg-gray-300"}

`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition

${event.status === "Published" ? "translate-x-6" : "translate-x-1"}

`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Archive / Restore */}

                      {!event.archived ? (
                        <button
                          onClick={() => archiveEvent(event.id)}
                          className="
text-xs
bg-yellow-100
text-yellow-700
px-3
py-1
rounded-lg
hover:bg-yellow-600
hover:text-white
w-fit
"
                        >
                          Archive
                        </button>
                      ) : (
                        <button
                          onClick={() => restoreEvent(event.id)}
                          className="
text-xs
bg-blue-100
text-blue-700
px-3
py-1
rounded-lg
hover:bg-blue-600
hover:text-white
w-fit
"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <Link
                      to={`/events/${event.id}/registrations`}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-bold text-xs bg-blue-50/50 border border-blue-100/50 px-2.5 py-1 rounded-lg transition"
                    >
                      {event.registration_count || 0} Users
                    </Link>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/events/${event.id}`} title="View Event">
                        <button className="flex items-center justify-center p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-150 cursor-pointer">
                          <FaEye size={13} />
                        </button>
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedId(event.id);
                          setEditOpen(true);
                        }}
                        title="Edit Event"
                        className="flex items-center justify-center p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition duration-150 cursor-pointer"
                      >
                        <FaEdit size={13} />
                      </button>

                      <button
                        disabled={deletingId === event.id}
                        onClick={() => handleDelete(event.id, event.title)}
                        title="Delete Event"
                        className="flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-650 hover:bg-red-600 hover:text-white transition duration-150 cursor-pointer disabled:opacity-50"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {events.length === 0 && (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <FaCalendarAlt size={36} className="text-slate-200 mb-3" />
            <p className="text-sm font-semibold">
              No events found matching criteria
            </p>
          </div>
        )}
      </div>

      <CreateEventModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchEvents}
      />

      <EditEventModal
        open={editOpen}
        eventId={selectedId}
        onClose={() => {
          setEditOpen(false);
          setSelectedId(null);
        }}
        onSuccess={fetchEvents}
      />
    </div>
  );
}

function StatCard({ title, value, icon, iconColor }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="space-y-1">
        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          {title}
        </div>
        <div className="text-2xl font-extrabold text-slate-800">{value}</div>
      </div>
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconColor || "bg-slate-50 text-slate-600"} shadow-sm transition duration-200`}
      >
        {icon}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Published: "bg-emerald-50 text-emerald-700 border-emerald-100",

    Draft: "bg-slate-100 text-slate-700 border-slate-200",

    Archived: "bg-red-50 text-red-700 border-red-200",

    "Registration Open": "bg-blue-50 text-blue-700 border-blue-150",

    "Registration Closed": "bg-amber-50 text-amber-700 border-amber-150",

    Completed: "bg-purple-50 text-purple-700 border-purple-150",
  };

  return (
    <span
      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border
     ${colors[status] || "bg-slate-50 text-slate-700"}`}
    >
      {status}
    </span>
  );
}
