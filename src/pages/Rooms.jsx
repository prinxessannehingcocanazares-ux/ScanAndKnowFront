import React from 'react';
import { DoorOpen, User } from 'lucide-react';
import cn from '../utility/cn';
import { mockRooms, mockSchedules } from '../lib/mockData';

const departments = [
  "College of Criminal Justice Education",
  "College of Information Technology",
  "College of Nursing and Allied Health",
  "College of Hospitality Management and Tourism"
];

const Rooms = () => (
  <div className="p-4 sm:p-8">
    <div className="mb-8">
      <p className="text-sm sm:text-base text-gray-500">
        Monitor room status and capacity in real-time.
      </p>
    </div>

   {departments.map((dept) => {
  const roomsPerDept = mockRooms.filter(
    (room) => room.department === dept
  );

  if (roomsPerDept.length === 0) return null;

  return (
    <div key={dept} className="mb-8">
      {/* Department Title */}
      <h3 className="text-base sm:text-lg font-bold text-indigo-600 mb-3">
        {dept}
      </h3>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y">
        {roomsPerDept.map((room) => (
          <div
            key={room.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
          >
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <DoorOpen size={16} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {room.name}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <User size={12} />
                  {room.capacity}
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide",
                  room.status === "Available"
                    ? "bg-emerald-50 text-emerald-600"
                    : room.status === "Occupied"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-rose-50 text-rose-600"
                )}
              >
                {room.status}
              </span>

              <button className="text-xs font-medium text-indigo-600 hover:underline">
                Details
              </button>

              <button className="text-xs font-medium text-gray-500 hover:underline">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    
  );
})}
  </div>
  
);

export default Rooms;