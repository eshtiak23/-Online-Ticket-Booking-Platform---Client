import { useEffect, useState } from "react";
import api from "../../utils/api";
import Spinner from "../../components/Spinner";

export default function AdvertiseTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/advertise")
      .then(res => setTickets(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/api/advertise/${id}`);
      setTickets(prev => prev.map(t => t._id === id ? { ...t, isAdvertised: res.data.isAdvertised } : t));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  if (loading) return <Spinner />;

  const approved = tickets.filter(t => t.verificationStatus === "approved");
  const advertisedCount = approved.filter(t => t.isAdvertised).length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Advertise</h2>
        <p className="text-sm text-gray-500 mt-1">Feature tickets on the homepage <span className={`font-medium ${advertisedCount >= 6 ? "text-red-500" : "text-purple-600"}`}>({advertisedCount}/6)</span></p>
      </div>

      {approved.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No approved tickets to advertise</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {approved.map(t => (
            <div key={t._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {t.image && <img src={t.image} alt="" className="w-full h-32 object-cover" />}
              <div className="p-4">
                <h3 className="font-medium">{t.title}</h3>
                <p className="text-sm text-gray-500">{t.from} → {t.to}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-semibold">${t.price}</span>
                  <button
                    onClick={() => handleToggle(t._id)}
                    disabled={!t.isAdvertised && advertisedCount >= 6}
                    className={`px-3 py-1 text-sm rounded-lg transition ${
                      t.isAdvertised
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : advertisedCount >= 6
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {t.isAdvertised ? "Remove" : "Advertise"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
