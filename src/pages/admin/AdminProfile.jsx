import { useAuth } from "../../contexts/AuthContext";

export default function AdminProfile() {
  const { user, isPending } = useAuth();

  if (isPending) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Admin Profile</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`} alt="" className="w-20 h-20 rounded-full border-2 border-purple-500" />
          <div>
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block px-3 py-0.5 mt-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium capitalize">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
