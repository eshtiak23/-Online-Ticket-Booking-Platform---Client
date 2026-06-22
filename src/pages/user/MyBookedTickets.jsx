import { useEffect, useState } from "react";
import api from "../../utils/api";
import CountdownTimer from "../../components/CountdownTimer";

export default function MyBookedTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/bookings/user");
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await api.put(`/api/cancel/${bookingId}`);
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: "rejected" } : b));
    } catch (err) {
      alert(err.response?.data?.error || "Cancel failed");
    }
  };

  const handlePay = async (bookingId) => {
    try {
      const res = await api.post("/api/payments/create-checkout", { bookingId });
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.error || "Payment failed");
    }
  };

  if (loading) return <div className="flex justify-center py-10"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">My Booked Tickets</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => {
            const t = booking.ticketId;
            const passed = t && new Date(`${t.departureDate}T${t.departureTime}`) < new Date();
            return (
              <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                {t && <img src={t.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400"} alt={t.title} className="w-full h-36 object-cover" />}
                <div className="p-4">
                  <h3 className="font-semibold">{t?.title || "Deleted Ticket"}</h3>
                  {t && <p className="text-sm text-gray-500">{t.from} → {t.to}</p>}
                  <p className="text-sm mt-1">Qty: {booking.quantity}</p>
                  <p className="text-lg font-bold text-purple-600">${booking.totalPrice.toFixed(2)}</p>
                  {t && <p className="text-xs text-gray-400 mt-1">{t.departureDate} {t.departureTime}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                      booking.status === "paid" ? "bg-green-100 dark:bg-green-900 text-green-700" :
                      booking.status === "accepted" ? "bg-blue-100 dark:bg-blue-900 text-blue-700" :
                      booking.status === "rejected" ? "bg-red-100 dark:bg-red-900 text-red-700" :
                      "bg-yellow-100 dark:bg-yellow-900 text-yellow-700"
                    }`}>{booking.status}</span>
                    {t && booking.status !== "rejected" && <CountdownTimer departureDate={t.departureDate} departureTime={t.departureTime} />}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {booking.status === "pending" && (
                      <button onClick={() => handleCancel(booking._id)} className="flex-1 py-2 border border-red-500 text-red-500 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900 transition">
                        Cancel
                      </button>
                    )}
                    {booking.status === "accepted" && !passed && (
                      <button onClick={() => handlePay(booking._id)} className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-sm hover:opacity-90 transition">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
