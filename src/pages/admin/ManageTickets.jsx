import { useEffect, useState } from "react";
import api from "../../utils/api";
import Spinner from "../../components/Spinner";

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/advertise");
        setTickets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/tickets/approve/${id}`);
      setTickets((prev) => prev.map((t) => t._id === id ? { ...t, verificationStatus: "approved" } : t));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/tickets/reject/${id}`);
      setTickets((prev) => prev.map((t) => t._id === id ? { ...t, verificationStatus: "rejected" } : t));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Manage Tickets</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Vendor</th>
              <th className="text-left py-3 px-4">Price</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4">{t.title}<br /><span className="text-xs text-gray-500">{t.from} → {t.to}</span></td>
                <td className="py-3 px-4 text-xs">{t.vendorName}<br />{t.vendorEmail}</td>
                <td className="py-3 px-4">${t.price}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                    t.verificationStatus === "approved" ? "bg-green-100 dark:bg-green-900 text-green-700" :
                    t.verificationStatus === "rejected" ? "bg-red-100 dark:bg-red-900 text-red-700" :
                    "bg-yellow-100 dark:bg-yellow-900 text-yellow-700"
                  }`}>{t.verificationStatus}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {t.verificationStatus !== "approved" && (
                      <button onClick={() => handleApprove(t._id)} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                    )}
                    {t.verificationStatus !== "rejected" && (
                      <button onClick={() => handleReject(t._id)} className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
