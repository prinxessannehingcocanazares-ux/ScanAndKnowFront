import { useState, useEffect} from "react";
import { motion } from "framer-motion";
import getRooms from "../../api/getRooms";

const ViewScheduleModal = ({ schedule, onClose }) => {
  if (!schedule) return null;

    const [rooms, setRooms] = useState([]);
  
  // Find the room info
  const roomInfo = rooms.find((r) => r.roomId === schedule.room);
  console.log("Room info for schedule:", schedule);

    // Fetch rooms
    useEffect(() => {
      const fetchRooms = async () => {
        try {
          const { VITE_GETROOMS_ENDPOINT } = window.__ENV__ || {};
          const response = await getRooms.post(VITE_GETROOMS_ENDPOINT);
          setRooms(response.data);
        } catch (error) {
          setSnackbar({
            open: true,
            message: error.response?.data?.message || "Failed to fetch rooms",
            severity: "error",
          });
        }
      };
      fetchRooms();
    }, []);

  return (
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
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
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
                {roomInfo?.roomCode || "Not Assigned"} 
                {roomInfo?.department && ` (${roomInfo.department})`}
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={schedule.rrule?.freq === "weekly"}
              readOnly
              id="repeatWeeklyView"
            />
            <label htmlFor="repeatWeeklyView" className="text-sm font-medium">
              Repeat Weekly
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Helper to format time nicely
function formatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default ViewScheduleModal;