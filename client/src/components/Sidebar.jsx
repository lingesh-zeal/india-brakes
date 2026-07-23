import { FaBars, FaCalendarAlt, FaCamera, FaHandshake, FaHome,FaImages, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icons: <FaHome />,
    },
    {
      name: "Events",
      path: "/events",
      icons: <FaCalendarAlt />
    },
    {
      name: "Sponsors",
      path: "/sponsors",
      icons: <FaHandshake/>
    },
    {
      name: "Welcome CMS",
      path: "/welcome",
      icons: <FaImages />
    },
    {
      name: "Hero Banner",
      path: "/hero-banner",
      icons: <FaCamera />
    }

  ];

  return (
    <div className={`h-screen bg-white shadow-sm p-4 flex flex-col justify-between transition-all duration-300 font-sans ${collapsed ? "w-20" : "w-64"}`}>
      
      {/* Brand & Toggle Header */}
      <div className="flex flex-col gap-6 shrink-0">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} py-2`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20">
                I
              </div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                India Brakes
              </h1>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition border border-slate-100 hover:border-slate-200 cursor-pointer"
          >
            <FaBars size={16} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150
                  ${isActive 
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 shadow-sm" 
                    : "text-slate-650 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <span className={`text-base ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {item.icons}
                </span>
                {!collapsed && (
                  <span>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action (Pinned Bottom) */}
      <div className="shrink-0 pt-4 border-t border-slate-100">
        <button
          onClick={logOut}
          className={`w-full bg-red-50 hover:bg-red-150 text-red-600 hover:text-red-700 py-3 rounded-xl transition font-bold text-xs flex items-center justify-center gap-2 border border-red-100 cursor-pointer ${
            collapsed ? "px-0" : "px-4"
          }`}
        >
          <FaSignOutAlt size={14} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
