import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import getAvailableRooms from "../../api/getAvailableRooms";
import updateScheduleById from "../../api/updateScheduleById";

const LazySnackbar = lazy(() => import("../../pages/subPages/LazySnackbar"));

const AssignRoomModal = ({ schedule, onClose, onRoomAssigned }) => {
  if (!schedule) return null;

  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch available rooms
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const { VITE_GETAVAILABLEROOMS_ENDPOINT } = window.__ENV__ || {};

        const start = new Date(schedule.start);
        start.setHours(start.getHours() + 8);

        const end = new Date(schedule.end);
        end.setHours(end.getHours() + 8);

        const response = await getAvailableRooms.post(
          VITE_GETAVAILABLEROOMS_ENDPOINT,
          {
            id: schedule.id,
            start: start.toISOString(),
            end: end.toISOString(),
          },
        );

        setAvailableRooms(response.data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to fetch available rooms",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [schedule]);

  // Group rooms by department
  const roomsByDepartment = availableRooms.reduce((acc, room) => {
    const deptName = room.departmentCollegeName || "Unknown Department";
    if (!acc[deptName]) acc[deptName] = [];
    acc[deptName].push(room);
    return acc;
  }, {});

  const handleRoomClick = (room) => setSelectedRoomId(room.roomId);

  const handleAssignRoom = async () => {
    if (!selectedRoomId) {
      setSnackbar({
        open: true,
        message: "Select a room first",
        severity: "warning",
      });
      return;
    }

    try {
      const { VITE_UPDATESCHEDULEBYID_ENDPOINT } = window.__ENV__ || {};
      await updateScheduleById.post(VITE_UPDATESCHEDULEBYID_ENDPOINT, {
        scheduleId: schedule.id,
        roomId: selectedRoomId,
      });

      setSnackbar({
        open: true,
        message: "Room assigned successfully",
        severity: "success",
      });

      if (onRoomAssigned) {
        const assignedRoom = availableRooms.find(
          (r) => r.roomId === selectedRoomId,
        );
        onRoomAssigned(assignedRoom);
      }

      onClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to assign room",
        severity: "error",
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Background overlay */}
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal card */}
        <motion.div
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()} // prevent modal close on click inside
        >
          {/* Header */}
          <div className="sticky top-0 bg-white p-6 border-b z-10">
            <h3 className="text-xl font-bold text-gray-800">
              Assign Room for:{" "}
              <span className="text-indigo-600">{schedule.title}</span>
            </h3>

            {/* Date + Time */}
            <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-4">
              <span>📅 {formatDate(schedule.start)}</span>

              <span>
                ⏰ {formatTime(schedule.start)} - {formatTime(schedule.end)}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
            {loading ? (
              <p className="text-gray-500 text-center py-10">
                Loading available rooms...
              </p>
            ) : Object.keys(roomsByDepartment).length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                No rooms available for this time
              </p>
            ) : (
              Object.entries(roomsByDepartment).map(([deptName, rooms]) => (
                <div key={deptName} className="mb-4">
                  <p className="font-semibold text-gray-700 mb-2">{deptName}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {rooms.map((room) => (
                      <div
                        key={room.roomId}
                        onClick={() => handleRoomClick(room)}
                        className={`cursor-pointer p-3 border rounded-xl transition ${
                          selectedRoomId === room.roomId
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <p className="font-semibold">{room.roomCode}</p>
                        <p className="text-sm text-gray-600">
                          Capacity: {room.roomCapacity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-white">
            <button
              onClick={handleAssignRoom}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Assign
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>

      {/* Snackbar */}
      <Suspense fallback={null}>
        <LazySnackbar
          open={snackbar.open}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Suspense>
    </>
  );
};

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export default AssignRoomModal;
