import { useEffect, useState } from "react";
import api from "../../utils/api";
import Spinner from "../../components/Spinner";

export default function RequestedBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings/vendor");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.put(`/api/bookings/accept/${id}`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/bookings/reject/${id}`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Requested Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No booking requests</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Ticket</th>
                <th className="text-left py-3 px-4">Qty</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">{b.userName}<br /><span className="text-xs text-gray-500">{b.userEmail}</span></td>
                  <td className="py-3 px-4">{b.ticketId?.title || "Deleted"}</td>
                  <td className="py-3 px-4">{b.quantity}</td>
                  <td className="py-3 px-4 font-medium">${b.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                      b.status === "paid" ? "bg-green-100 dark:bg-green-900 text-green-700" :
                      b.status === "accepted" ? "bg-blue-100 dark:bg-blue-900 text-blue-700" :
                      b.status === "rejected" ? "bg-red-100 dark:bg-red-900 text-red-700" :
                      "bg-yellow-100 dark:bg-yellow-900 text-yellow-700"
                    }`}>{b.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    {b.status === "pending" && (
                      <div className="flex gap-1">
                        <button onClick={() => handleAccept(b._id)} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">Accept</button>
                        <button onClick={() => handleReject(b._id)} className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
