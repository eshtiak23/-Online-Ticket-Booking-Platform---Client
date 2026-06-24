import { useAuth } from "../../contexts/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}&background=a78bfa&color=fff`}
            alt=""
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium capitalize ${
              user?.role === "admin" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              : user?.role === "vendor" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-400 mb-4">Account Details</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">User ID</span>
            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Account Status</span>
            <span className={user?.isFraud ? "text-red-600" : "text-green-600"}>
              {user?.isFraud ? "Flagged" : "Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
