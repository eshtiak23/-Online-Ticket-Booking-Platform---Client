import { useEffect, useState } from "react";
import api from "../../utils/api";
import CountdownTimer from "../../components/CountdownTimer";

export default function MyBookedTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/bookings/user")
      .then(res => setBookings(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await api.put(`/api/cancel/${bookingId}`);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "cancelled" } : b));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel");
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

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-400 py-10 text-center">You haven't booked any tickets yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map(booking => {
            const t = booking.ticketId;
            const passed = t && new Date(`${t.departureDate}T${t.departureTime}`) < new Date();

            return (
              <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {t?.image && (
                  <img src={t.image} alt="" className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{t?.title || "Ticket unavailable"}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full capitalize shrink-0 ml-2 ${
                      booking.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
                      booking.status === "accepted" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                      booking.status === "cancelled" ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400" :
                      booking.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                    }`}>{booking.status}</span>
                  </div>

                  {t && <p className="text-sm text-gray-500 mb-2">{t.from} → {t.to}</p>}

                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>Qty: {booking.quantity}</span>
                    <span className="font-semibold text-purple-600">${(booking.totalPrice ?? 0).toFixed(2)}</span>
                  </div>

                  {t && (
                    <p className="text-xs text-gray-400 mb-2">{t.departureDate} {t.departureTime}</p>
                  )}

                  {t && booking.status !== "cancelled" && booking.status !== "rejected" && (
                    <div className="mb-2">
                      <CountdownTimer departureDate={t.departureDate} departureTime={t.departureTime} />
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    {booking.status === "pending" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="flex-1 px-4 py-1.5 text-sm border border-red-300 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === "accepted" && !passed && (
                      <button
                        onClick={() => handlePay(booking._id)}
                        className="flex-1 px-4 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Pay Now
                      </button>
                    )}
                    {booking.status === "paid" && (
                      <span className="px-4 py-1.5 text-sm text-green-600">Paid</span>
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
