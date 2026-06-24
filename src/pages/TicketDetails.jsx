import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import CountdownTimer from "../components/CountdownTimer";

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/api/tickets/${id}`);
        setTicket(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!ticket) {
    return <p className="text-center py-20 text-gray-500">Ticket not found</p>;
  }

  const departure = new Date(`${ticket.departureDate}T${ticket.departureTime}`);
  const passed = departure < new Date();
  const soldOut = ticket.quantity <= 0;

  const handleBookNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (quantity > ticket.quantity) {
      setBookingError(`Only ${ticket.quantity} tickets available`);
      return;
    }
    try {
      await api.post("/api/bookings", { ticketId: id, quantity });
      setShowModal(false);
      navigate("/dashboard/my-bookings");
    } catch (err) {
      setBookingError(err.response?.data?.error || "Booking failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <img src={ticket.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800"} alt={ticket.title} className="w-full h-72 object-cover" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{ticket.title}</h1>
              <p className="text-lg text-gray-500">{ticket.from} → {ticket.to}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm font-medium">{ticket.transportType}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-2xl font-bold text-purple-600">${ticket.price}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold">{ticket.quantity}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500">Departure</p>
              <p className="font-semibold">{ticket.departureDate}</p>
              <p className="text-sm text-gray-500">{ticket.departureTime}</p>
              {!passed && (
                <div className="mt-1">
                  <CountdownTimer departureDate={ticket.departureDate} departureTime={ticket.departureTime} />
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Perks</h3>
            <div className="flex flex-wrap gap-2">
              {(ticket.perks || []).map((perk, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">{perk}</span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Vendor</h3>
            <p className="text-sm text-gray-500">{ticket.vendorName} ({ticket.vendorEmail})</p>
          </div>

          <button
            onClick={() => {
              if (!user) { navigate("/login"); return; }
              setShowModal(true);
            }}
            disabled={passed || soldOut}
            className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-white transition ${
              passed || soldOut
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
            }`}
          >
            {passed ? "Departed" : soldOut ? "Sold Out" : "Book Now"}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Book Ticket</h3>
            <p className="text-sm text-gray-500 mb-4">{ticket.title} - ${ticket.price}/unit</p>

            <label className="block text-sm font-medium mb-1">Quantity (max: {ticket.quantity})</label>
            <input
              type="number"
              min="1"
              max={ticket.quantity}
              value={quantity}
              onChange={(e) => { setQuantity(Number(e.target.value)); setBookingError(""); }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
            />

            <p className="text-lg font-bold mb-4">Total: ${(ticket.price * quantity).toFixed(2)}</p>

            {bookingError && <p className="text-red-500 text-sm mb-4">{bookingError}</p>}

            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
              <button onClick={handleBookNow} className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
