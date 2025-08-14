import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const base = "/dashboard";
  const linkCls = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm transition ${
      isActive
        ? "bg-[#ffe8db] text-[#3b1a0b]"
        : "text-[#3b1a0b] hover:bg-[#fff4ef]"
    }`;
  return (
    <aside className="w-56 p-4 border-r border-orange-100 bg-gradient-to-b from-[#fff9f5] to-[#fff]">
      <div className="text-lg font-bold mb-4 text-[#3b1a0b]">Manage</div>
      <nav className="space-y-1">
        <NavLink to={`${base}/tables`} className={linkCls}>
          Tables
        </NavLink>
        <NavLink to={`${base}/orders`} className={linkCls}>
          Orders
        </NavLink>
        <NavLink to={`${base}/menu`} className={linkCls}>
          Menu
        </NavLink>
        <NavLink to={`${base}/settings`} className={linkCls}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
