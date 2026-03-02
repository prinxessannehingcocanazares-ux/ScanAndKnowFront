import React from 'react';
import { DoorOpen, User } from 'lucide-react';
import cn from '../utility/cn';
import { mockRooms } from '../lib/mockData';

const Rooms = () => (
  <div className="p-4 sm:p-8">
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Room Management</h2>
      <p className="text-sm sm:text-base text-gray-500">Monitor room status and capacity in real-time.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {mockRooms.map((room) => (
        <div
          key={room.id}
          className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <DoorOpen size={20} className="sm:size-6" />
            </div>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                room.status === 'Available'
                  ? "bg-emerald-50 text-emerald-600"
                  : room.status === 'Occupied'
                  ? "bg-amber-50 text-amber-600"
                  : "bg-rose-50 text-rose-600"
              )}
            >
              {room.status}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
          <div className="flex items-center gap-4 text-gray-500 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <User size={14} className="sm:size-4" />
              Capacity: {room.capacity}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-50 flex gap-2">
            <button className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs sm:text-sm font-bold hover:bg-indigo-100 transition-all">
              Details
            </button>
            <button className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all">
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Rooms;