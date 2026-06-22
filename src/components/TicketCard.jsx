import { Link } from "react-router-dom";

export default function TicketCard({ ticket, showDetails = true }) {
  const departure = new Date(`${ticket.departureDate}T${ticket.departureTime}`);
  const passed = departure < new Date();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition flex flex-col">
      <img src={ticket.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400"} alt={ticket.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{ticket.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {ticket.from} → {ticket.to}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-xs rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">{ticket.transportType}</span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">${ticket.price}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Qty: {ticket.quantity}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {(ticket.perks || []).map((perk, i) => (
            <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">{perk}</span>
          ))}
        </div>
        {ticket.departureDate && (
          <p className="text-xs text-gray-400 mb-3">Departure: {ticket.departureDate} {ticket.departureTime}</p>
        )}
        {showDetails && (
          <Link
            to={`/ticket/${ticket._id}`}
            className="mt-auto block text-center py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition text-sm"
          >
            See Details
          </Link>
        )}
      </div>
    </div>
  );
}
