import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import getAvailableRooms from "../../api/getAvailableRooms";
import updateScheduleById from "../../api/updateScheduleById"; // your API call to update schedule

const LazySnackbar = lazy(() => import("../../pages/subPages/LazySnackbar"));

const ViewScheduleModal = ({ schedule, onClose, onRoomSelect }) => {
  if (!schedule) return null;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(schedule.room || null);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const { VITE_GETAVAILABLEROOMS_ENDPOINT } = window.__ENV__ || {};

        const payload = {
          id: schedule.id,
          start: new Date(schedule.start).toISOString(),
          end: new Date(schedule.end).toISOString(),
        };

              console.log("fetch available payload:", payload);


        const response = await getAvailableRooms.post(
          VITE_GETAVAILABLEROOMS_ENDPOINT,
          payload
        );

        setAvailableRooms(response.data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to fetch rooms.",
          severity: "error",
        });
      }
    };

    if (schedule) fetchAvailableRooms();
  }, [schedule]);

  // Group rooms by department
  const roomsByDepartment = availableRooms.reduce((acc, room) => {
    const deptName = room.departmentCollegeName || "Unknown Department";
    if (!acc[deptName]) acc[deptName] = [];
    acc[deptName].push(room);
    return acc;
  }, {});

  const handleRoomClick = (room) => {
    setSelectedRoomId(room.roomId);
    if (onRoomSelect) onRoomSelect(room); // notify parent if needed
  };

  // Update schedule with selected room
  const handleUpdateSchedule = async () => {
    if (!selectedRoomId) {
      setSnackbar({
        open: true,
        message: "Please select a room first.",
        severity: "warning",
      });
      return;
    }

    try {
      const payload = {
        scheduleId: schedule.id,
        roomId: selectedRoomId,
      };

        const { VITE_UPDATESCHEDULEBYID_ENDPOINT } = window.__ENV__ || {};

      await updateScheduleById.post(VITE_UPDATESCHEDULEBYID_ENDPOINT, payload);
      setSnackbar({
        open: true,
        message: "Schedule updated successfully!",
        severity: "success",
      });

      // Optionally, you can notify parent about room selection
      if (onRoomSelect) {
        const selectedRoom = availableRooms.find((r) => r.roomId === selectedRoomId);
        onRoomSelect(selectedRoom);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update schedule.",
        severity: "error",
      });
    }
  };

  // Show selected room details
  const selectedRoom = availableRooms.find((r) => r.roomId === selectedRoomId);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Background overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        />

        {/* Modal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[80vh]"
        >
          <h3 className="text-xl font-bold mb-6">Schedule Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-500 text-sm mb-1">Subject</label>
              <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">{schedule.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-sm mb-1">Day</label>
                <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">{schedule.day}</p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">Room</label>
                <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">
                  {selectedRoom ? (
                    <>
                      {selectedRoom.roomCode} ({selectedRoom.departmentCollegeName}) - Capacity: {selectedRoom.roomCapacity}
                    </>
                  ) : (
                    "Not Assigned"
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-sm mb-1">Start Time</label>
                <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">{formatTime(schedule.start)}</p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">End Time</label>
                <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">{formatTime(schedule.end)}</p>
              </div>
            </div>

            {/* Grouped available rooms */}
            <div className="mt-4">
              <label className="block text-gray-500 text-sm mb-2">Available Rooms by Department</label>
              {Object.keys(roomsByDepartment).length > 0 ? (
                Object.entries(roomsByDepartment).map(([deptName, rooms]) => (
                  <div key={deptName} className="mb-3">
                    <p className="font-semibold mb-1">{deptName}</p>
                    {rooms.map((r) => (
                      <p
                        key={r.roomId}
                        onClick={() => handleRoomClick(r)}
                        className={`w-full px-4 py-2 rounded-xl mb-1 cursor-pointer transition ${
                          selectedRoomId === r.roomId
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {r.roomCode} - Capacity: {r.roomCapacity}
                      </p>
                    ))}
                  </div>
                ))
              ) : (
                <p className="w-full px-4 py-2 bg-gray-50 rounded-xl text-gray-400">
                  No available rooms
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={handleUpdateSchedule}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Update Room
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

// Helper to format time nicely
function formatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default ViewScheduleModal;