import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function TransactionHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/payments/history")
      .then(res => setPayments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

      {payments.length === 0 ? (
        <p className="text-gray-400 py-10 text-center">No transactions yet</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Ticket</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 font-mono text-xs text-gray-400">{p.transactionId?.slice(0, 18) || "N/A"}...</td>
                    <td className="py-3 px-4">{p.ticketTitle || "N/A"}</td>
                    <td className="py-3 px-4 font-medium">${(p.amount ?? 0).toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
