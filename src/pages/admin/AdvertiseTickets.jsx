import { useEffect, useState } from "react";
import api from "../../utils/api";
import Spinner from "../../components/Spinner";

export default function AdvertiseTickets() {
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

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/api/advertise/${id}`);
      setTickets((prev) => prev.map((t) => t._id === id ? { ...t, isAdvertised: res.data.isAdvertised } : t));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Advertise Tickets</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Route</th>
              <th className="text-left py-3 px-4">Price</th>
              <th className="text-left py-3 px-4">Advertised</th>
            </tr>
          </thead>
          <tbody>
            {tickets.filter((t) => t.verificationStatus === "approved").map((t) => (
              <tr key={t._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4">{t.title}</td>
                <td className="py-3 px-4">{t.from} → {t.to}</td>
                <td className="py-3 px-4">${t.price}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggle(t._id)}
                    className={`relative w-12 h-6 rounded-full transition ${t.isAdvertised ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${t.isAdvertised ? "left-6" : "left-0.5"}`}></span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
