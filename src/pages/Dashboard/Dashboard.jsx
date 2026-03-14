import React, { useEffect, useState, lazy, Suspense } from "react";
import { useAuth } from "../../context/AuthContext";
import { DoorOpen, CheckCircle, AlertCircle } from "lucide-react";
import cn from "../../utility/cn";

import getRooms from "../../api/getRooms";
import getAllSchedules from "../../api/getAllSchedules";
import deleteScheduleById from "../../api/deleteScheduleById";

// Lazy load the Edit Schedule Modal
const LazyEditScheduleModal = lazy(() => import("./EditScheduleModal"));

const Dashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);
      const { VITE_GETROOMS_ENDPOINT, VITE_GETAllSCHEDULES_ENDPOINT } =
        window.__ENV__ || {};
      const roomsRes = await getRooms.post(VITE_GETROOMS_ENDPOINT);
      const schedulesRes = await getAllSchedules.post(
        VITE_GETAllSCHEDULES_ENDPOINT
      );

      setRooms(roomsRes.data || []);
      setSchedules(schedulesRes.data || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + polling every 5 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5s
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Compute filtered rooms
  const filteredRooms = rooms
    .map((room) => {
      const roomSchedules = schedules
        .filter(
          (s) =>
            s.scheduleRoomId === room.roomId &&
            s.scheduleStartTime?.startsWith(today)
        )
        .map((s) => ({ ...s, id: s.scheduleId }));

      if (roomSchedules.length === 0) return null;

      let status = "Not yet started";
      if (roomSchedules.some((s) => s.scheduleStart && !s.scheduleEnd))
        status = "Ongoing";
      else if (roomSchedules.some((s) => s.scheduleStart && s.scheduleEnd))
        status = "Ended";
      else if (roomSchedules.some((s) => !s.scheduleStart && s.scheduleEnd))
        status = "UnAttended";

      const occupied = status === "Ongoing";
      return { ...room, occupied, status, roomSchedules };
    })
    .filter(Boolean);

  // Stats
  const totalScheduledRooms = filteredRooms.length;
  const totalAvailableRooms = rooms.length - totalScheduledRooms;
  const totalOccupiedRooms = filteredRooms.filter((r) => r.occupied).length;

  const stats = [
    {
      label: "Total Scheduled Rooms",
      value: totalScheduledRooms,
      icon: DoorOpen,
      color: "bg-blue-500",
    },
    {
      label: "Available",
      value: totalAvailableRooms,
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
    {
      label: "Occupied",
      value: totalOccupiedRooms,
      icon: AlertCircle,
      color: "bg-amber-500",
    },
  ];

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      const { VITE_DELETESCHEDULEBYID_ENDPOINT } = window.__ENV__ || {};
      await deleteScheduleById.post(
        `${VITE_DELETESCHEDULEBYID_ENDPOINT}?id=${scheduleId}`
      );

      // Instant UI update
      setSchedules((prev) => prev.filter((s) => s.scheduleId !== scheduleId));
      alert("Schedule deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete schedule");
    }
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullName}! 👋
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          Here's what's happening in your rooms today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white mb-4",
                stat.color
              )}
            >
              <stat.icon size={20} className="sm:size-6" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">
              {stat.label}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Today's Scheduled Rooms
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">
                <th className="px-4 sm:px-6 py-4 font-semibold">Room</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Subject</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Availability</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Occupancy</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Status</th>
                {user?.role === "admin" && (
                  <th className="px-4 sm:px-6 py-4 font-semibold">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRooms.map((room) =>
                room.roomSchedules.map((roomSchedule) => (
                  <tr
                    key={roomSchedule.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 text-sm sm:text-base">
                      {room.roomCode}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      {roomSchedule.scheduleSubject || "-"}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs rounded-lg font-semibold",
                          room.occupied
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        )}
                      >
                        {room.occupied ? "Occupied" : "Available"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      {room.roomCapacity}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      {room.status}
                    </td>
                    {user?.role === "admin" && (
                      <td className="px-4 sm:px-6 py-4 flex gap-2">
                        <button
                          onClick={() => setEditingSchedule(roomSchedule)}
                          className="text-indigo-600 text-xs sm:text-sm font-semibold hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(roomSchedule.id)}
                          className="text-red-600 text-xs sm:text-sm font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSchedule && (
        <Suspense fallback={null}>
          <LazyEditScheduleModal
            schedule={editingSchedule}
            onClose={() => setEditingSchedule(null)}
            onSave={(updatedSchedule) => {
              // Instant update after edit
              setSchedules((prev) =>
                prev.map((s) =>
                  s.scheduleId === updatedSchedule.id ? updatedSchedule : s
                )
              );
              setEditingSchedule(null);
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Dashboard;