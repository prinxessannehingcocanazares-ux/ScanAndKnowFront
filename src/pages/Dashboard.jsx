import React from 'react';
import { useAuth } from '../context/AuthContext'; // adjust path if needed
import { DoorOpen, CheckCircle, AlertCircle, Settings, MoreVertical, X } from 'lucide-react';
import cn from '../utility/cn'; // adjust path according to your project structure

// Example mock data, replace with your actual data source
const mockDashboardRooms = [
  { id: 1, room: 'Room 101', available: true, occupied: false, status: 'Normal' },
  { id: 2, room: 'Room 102', available: false, occupied: true, status: 'In Use' },
  { id: 3, room: 'Room 103', available: true, occupied: false, status: 'Normal' },
  { id: 4, room: 'Room 104', available: false, occupied: true, status: 'Maintenance' },
];

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Rooms', value: '24', icon: DoorOpen, color: 'bg-blue-500' },
    { label: 'Available', value: '12', icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Occupied', value: '10', icon: AlertCircle, color: 'bg-amber-500' },
    { label: 'Maintenance', value: '2', icon: Settings, color: 'bg-rose-500' },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {user?.fullName}! 👋</h2>
        <p className="text-sm sm:text-base text-gray-500">Here's what's happening in your rooms today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white mb-4",
              stat.color
            )}>
              <stat.icon size={20} className="sm:size-6" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Room Status Overview</h3>
          <button className="text-indigo-600 font-semibold text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">
                <th className="px-4 sm:px-6 py-4 font-semibold">Room</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Availability</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Occupancy</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Status</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockDashboardRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 text-sm sm:text-base">{room.room}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold",
                      room.available ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {room.available ? <CheckCircle size={10} className="sm:size-3" /> : <X size={10} className="sm:size-3" />}
                      {room.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold",
                      room.occupied ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-600"
                    )}>
                      {room.occupied ? 'Occupied' : 'Vacant'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-xs sm:text-sm text-gray-600">{room.status}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <MoreVertical size={16} className="sm:size-[18px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;