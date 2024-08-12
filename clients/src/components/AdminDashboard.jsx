import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from '../components/Hook/useDebounce.jsx';
import { admindatas } from "../Redux/Reducer";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const admindata = useSelector((state) => state.auth.admindata);
  const [search, setSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(admindatas());
  }, [dispatch]);

  const debouncedCallBack = useDebounce((e) => setSearchTerm(e.target.value));

  const total_user = admindata?.length;
  const tabledata = (search && searchTerm) ? filterdata.slice(-10) : admindata?.slice(-6);

  return (
    <div className="min-h-screen bg-blue-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card title="Total Users" value={total_user ? total_user : 0} />
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
          <div className="bg-blue-50 p-6 rounded">
            {/* Pie Chart or other content can go here */}
          </div>
        </div>
      </main>

      <div className="relative flex mt-6 w-full flex-col rounded-xl border border-gray-200 bg-blue-50 shadow-md">
        <div className="w-full overflow-x-auto px-4">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr>
                  <th className="pb-2 pt-4 text-start uppercase tracking-wide text-gray-600">Username</th>
                  <th className="pb-2 pt-4 text-start uppercase tracking-wide text-gray-600">Email</th>
                  <th className="pb-2 pt-4 text-start uppercase tracking-wide text-gray-600">Questions Attempted</th>
                  <th className="pb-2 pt-4 text-start uppercase tracking-wide text-gray-600">Avatar</th>
                </tr>
              </thead>
              <tbody>
                {tabledata.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 text-sm">
                      <p className="text-sm font-medium text-gray-700">{user.fullname}</p>
                    </td>
                    <td className="py-3 text-sm">
                      <p className="text-sm font-medium text-gray-700">{user.email}</p>
                    </td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-white ${user.isSubscribed?.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                        {user.isSubscribed?.length > 0 ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full">
                          <img src={user.avatar} className="h-full w-full rounded-full" alt={user.username} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, change }) {
  return (
    <div className="bg-blue-50 p-6 rounded text-blue-500">
      <h3 className="font-bold">{title}</h3>
      <div className="text-4xl font-bold">{value}</div>
      <div className="text-sm text-blue-500/80">{change}</div>
    </div>
  );
}
