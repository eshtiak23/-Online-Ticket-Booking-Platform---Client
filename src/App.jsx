import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllTickets from "./pages/AllTickets";
import TicketDetails from "./pages/TicketDetails";
import ErrorPage from "./components/ErrorPage";
import UserProfile from "./pages/user/UserProfile";
import MyBookedTickets from "./pages/user/MyBookedTickets";
import TransactionHistory from "./pages/user/TransactionHistory";
import VendorProfile from "./pages/vendor/VendorProfile";
import AddTicket from "./pages/vendor/AddTicket";
import MyAddedTickets from "./pages/vendor/MyAddedTickets";
import RequestedBookings from "./pages/vendor/RequestedBookings";
import RevenueOverview from "./pages/vendor/RevenueOverview";
import AdminProfile from "./pages/admin/AdminProfile";
import ManageTickets from "./pages/admin/ManageTickets";
import ManageUsers from "./pages/admin/ManageUsers";
import AdvertiseTickets from "./pages/admin/AdvertiseTickets";

function ProtectedRoute({ children }) {
  const { user, isPending } = useAuth();
  if (isPending) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function GuestRoute({ children }) {
  const { user, isPending } = useAuth();
  if (isPending) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

function RoleRoute({ children, role }) {
  const { user } = useAuth();
  if (user?.role !== role) return <Navigate to="/dashboard" />;
  return children;
}

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Navigate to="/dashboard/profile" />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/all-tickets" element={<AllTickets />} />
        <Route path="/ticket/:id" element={
          <ProtectedRoute><TicketDetails /></ProtectedRoute>
        } />
        <Route path="*" element={<ErrorPage />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardRedirect />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="my-bookings" element={<MyBookedTickets />} />
        <Route path="transactions" element={<TransactionHistory />} />
        <Route path="add-ticket" element={<RoleRoute role="vendor"><AddTicket /></RoleRoute>} />
        <Route path="my-tickets" element={<RoleRoute role="vendor"><MyAddedTickets /></RoleRoute>} />
        <Route path="requested-bookings" element={<RoleRoute role="vendor"><RequestedBookings /></RoleRoute>} />
        <Route path="revenue" element={<RoleRoute role="vendor"><RevenueOverview /></RoleRoute>} />
        <Route path="manage-tickets" element={<RoleRoute role="admin"><ManageTickets /></RoleRoute>} />
        <Route path="manage-users" element={<RoleRoute role="admin"><ManageUsers /></RoleRoute>} />
        <Route path="advertise" element={<RoleRoute role="admin"><AdvertiseTickets /></RoleRoute>} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}
