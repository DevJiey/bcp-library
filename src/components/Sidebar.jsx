import { useEffect, useState } from "react";
import {
  NavLink,
  useLocation,
} from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

import logo from "../assets/bcp-logo.png";

function Sidebar({
  links,
  role = "Borrower",
  mobileOpen = false,
  onClose,
}) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const activeMenus = {};

    links.forEach((link) => {
      if (link.children) {
        activeMenus[link.label] = link.children.some(
          (child) => child.path === location.pathname
        );
      }
    });

    setOpenMenus((currentMenus) => ({
      ...currentMenus,
      ...activeMenus,
    }));
  }, [location.pathname, links]);

  const toggleMenu = (label) => {
    setOpenMenus((currentMenus) => ({
      ...currentMenus,
      [label]: !currentMenus[label],
    }));
  };

  return (
    <aside
      className={`sidebar-scroll fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-[#08233f] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 ${mobileOpen
          ? "translate-x-0"
          : "-translate-x-full"
        }`}
    >
      {/* Branding */}
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="BCP Logo"
            className="h-11 w-11 object-contain"
          />

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">
              BCP Library
            </h1>

            <p className="mt-1 text-[11px] text-slate-300">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Main Menu
        </p>

        <div className="space-y-1.5">
          {links.map((link) => {
            if (link.children) {
              const isOpen = Boolean(
                openMenus[link.label]
              );

              const hasActiveChild =
                link.children.some(
                  (child) =>
                    child.path === location.pathname
                );

              return (
                <div key={link.label}>
                  {/* Dropdown Button */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleMenu(link.label)
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${hasActiveChild
                        ? "bg-blue-600/30 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <span className="text-base">
                      {link.icon}
                    </span>

                    <span className="flex-1">
                      {link.label}
                    </span>

                    {isOpen ? (
                      <FaChevronDown className="text-[10px]" />
                    ) : (
                      <FaChevronRight className="text-[10px]" />
                    )}
                  </button>

                  {/* Dropdown Links */}
                  <div
                    className={`grid transition-all duration-200 ${isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-4">
                        {link.children.map(
                          (child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              onClick={onClose}
                              className={({
                                isActive,
                              }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive
                                  ? "bg-blue-600 text-white"
                                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                                }`
                              }
                            >
                              <span className="text-sm">
                                {child.icon}
                              </span>

                              <span>
                                {child.label}
                              </span>
                            </NavLink>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="text-base">
                  {link.icon}
                </span>

                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-center text-[11px] leading-5 text-slate-400">
          {role}
          <br />
          BCP Library Portal
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;