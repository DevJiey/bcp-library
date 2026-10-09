import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AIAssistant from "../components/AIAssistant";
import bcpLogo from "../assets/bcp-logo.png";

function PortalLayout({ children, links, role, navbarProps, mobileBottomNav = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {!mobileBottomNav && sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <div className={mobileBottomNav ? "hidden lg:block" : "contents"}>
        <Sidebar
          links={links}
          role={role}
          mobileOpen={mobileBottomNav ? false : sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <div className="min-w-0 flex-1">
        {mobileBottomNav && (
          <header className="flex h-16 items-center justify-center border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
            <img
              src={bcpLogo}
              alt="BCP logo"
              className="h-12 w-auto max-w-[200px] object-contain"
            />
          </header>
        )}

        <div className={mobileBottomNav ? "hidden lg:block" : ""}>
          <Navbar {...navbarProps} onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <AIAssistant />
    </div>
  );
}

export default PortalLayout;
