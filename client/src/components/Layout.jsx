import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100/40">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/50">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
