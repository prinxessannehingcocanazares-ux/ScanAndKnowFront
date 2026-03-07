// src/pages/RoomPayload.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import getSchedulesByUserId from "../api/getSchedulesByUserId";
import { format } from "date-fns";
import LazySnackbar from "./subPages/LazySnackbar";

const RoomPayload = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const payload = location.state?.payload;
  console.log("Received payload:", payload);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  // Redirect back to scanner if no payload
  useEffect(() => {
    if (!payload) {
      navigate("/scan", { replace: true });
    }
  }, [payload, navigate]);

  /* ---------------- FETCH SCHEDULES ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchSchedules = async () => {
      setLoadingSchedules(true);
      setSchedules([]); // Clear old data

      try {
        const { VITE_GETSCHEDULES_ENDPOINT } = window.__ENV__ || {};
        const response = await getSchedulesByUserId.post(
          `${VITE_GETSCHEDULES_ENDPOINT}?id=${user.id}`
        );
        const data = response.data || [];

        if (!payload) return;

        // Filter schedules for this room
        const roomSchedules = data.filter((s) => s.scheduleRoomId === payload.roomId);

        // Map API data for display
        const mappedSchedules = roomSchedules.map((item) => {
          const start = new Date(item.scheduleStartTime);
          const end = new Date(item.scheduleEndTime);
          const durationMs = end - start;
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

          return {
            id: item.scheduleId,
            date: item.scheduleDay,
            subject: item.scheduleSubject,
            timeIn: format(start, "hh:mm a"),
            timeOut: format(end, "hh:mm a"),
            duration: `${hours}h ${minutes}m`,
          };
        });

        setSchedules(mappedSchedules);
      } catch (error) {
        console.error(error);
        setSnackbarMessage(
          error.response?.data?.message || "Failed to fetch schedules"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoadingSchedules(false);
      }
    };

    fetchSchedules();
  }, [user, payload]);

  if (!payload) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Room: {payload.roomName || payload.roomCode}
      </h2>

      <div className="bg-gray-50 p-6 rounded-xl shadow border overflow-x-auto">
        {loadingSchedules ? (
          <p className="text-gray-500 text-sm">Loading schedules...</p>
        ) : schedules.length === 0 ? (
          <p className="text-gray-400 text-sm">No schedules found for this room.</p>
        ) : (
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold">Date</th>
                <th className="px-4 py-2 font-semibold">Subject</th>
                <th className="px-4 py-2 font-semibold">Start Time</th>
                <th className="px-4 py-2 font-semibold">End Time</th>
                <th className="px-4 py-2 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((sched) => (
                <tr key={sched.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 text-gray-900 text-sm">
                    {format(new Date(sched.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-4 py-2 text-gray-700 text-sm">{sched.subject}</td>
                  <td className="px-4 py-2 text-gray-700 text-sm">{sched.timeIn}</td>
                  <td className="px-4 py-2 text-gray-700 text-sm">{sched.timeOut}</td>
                  <td className="px-4 py-2 text-gray-700 text-sm">{sched.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button
        onClick={() => navigate("/qr-scanner")}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
      >
        Scan Another QR
      </button>

      <LazySnackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default RoomPayload;