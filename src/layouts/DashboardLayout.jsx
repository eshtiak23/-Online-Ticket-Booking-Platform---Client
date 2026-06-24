import { Outlet, Navigate, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function DashboardLayout() {
  const { user, isPending } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const role = user?.role || "user";

  const userLinks = [
    { to: "/dashboard/profile", label: "Profile" },
    { to: "/dashboard/my-bookings", label: "My Bookings" },
    { to: "/dashboard/transactions", label: "Transactions" },
  ];

  const vendorLinks = [
    { to: "/dashboard/profile", label: "Profile" },
    { to: "/dashboard/add-ticket", label: "Add Ticket" },
    { to: "/dashboard/my-tickets", label: "My Tickets" },
    { to: "/dashboard/requested-bookings", label: "Bookings" },
    { to: "/dashboard/revenue", label: "Revenue" },
  ];

  const adminLinks = [
    { to: "/dashboard/profile", label: "Profile" },
    { to: "/dashboard/manage-tickets", label: "Tickets" },
    { to: "/dashboard/manage-users", label: "Users" },
    { to: "/dashboard/advertise", label: "Advertise" },
  ];

  let links = [];
  if (role === "admin") links = adminLinks;
  else if (role === "vendor") links = vendorLinks;
  else links = userLinks;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-4 px-2">{role} panel</p>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden fixed bottom-5 right-5 z-40 bg-purple-600 text-white p-3 rounded-full shadow-lg"
        >
          ☰
        </button>

        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)}></div>
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 p-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-gray-400 uppercase">{role}</p>
                <button onClick={() => setMobileOpen(false)} className="text-gray-500">✕</button>
              </div>
              <nav className="space-y-1">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm transition ${
                        isActive
                          ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
