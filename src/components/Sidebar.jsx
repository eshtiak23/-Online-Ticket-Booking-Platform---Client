import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || "user";

  const userLinks = [
    { to: "/dashboard/profile", label: "User Profile" },
    { to: "/dashboard/my-bookings", label: "My Booked Tickets" },
    { to: "/dashboard/transactions", label: "Transaction History" },
  ];

  const vendorLinks = [
    { to: "/dashboard/profile", label: "Vendor Profile" },
    { to: "/dashboard/add-ticket", label: "Add Ticket" },
    { to: "/dashboard/my-tickets", label: "My Added Tickets" },
    { to: "/dashboard/requested-bookings", label: "Requested Bookings" },
    { to: "/dashboard/revenue", label: "Revenue Overview" },
  ];

  const adminLinks = [
    { to: "/dashboard/profile", label: "Admin Profile" },
    { to: "/dashboard/manage-tickets", label: "Manage Tickets" },
    { to: "/dashboard/manage-users", label: "Manage Users" },
    { to: "/dashboard/advertise", label: "Advertise Tickets" },
  ];

  let links = [];
  if (role === "admin") links = adminLinks;
  else if (role === "vendor") links = vendorLinks;
  else links = userLinks;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {role} Menu
        </span>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
