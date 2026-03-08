// src/pages/RoomPayload.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import getSchedulesByUserId from "../../api/getSchedulesByUserId";
import updateStartOrEnd from "../../api/updateStartOrEnd";
import { format } from "date-fns";
import LazySnackbar from "../../utility/LazySnackbar";

const RoomPayload = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const payload = location.state?.payload;

  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Track loading per schedule button
  const [loadingButton, setLoadingButton] = useState({}); // { [scheduleId]: 'start' | 'end' | null }

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  /* ---------------- REDIRECT IF NO PAYLOAD ---------------- */
  useEffect(() => {
    if (!payload) {
      navigate("/scan", { replace: true });
    }
  }, [payload, navigate]);

  /* ---------------- FETCH SCHEDULES ---------------- */
  const fetchSchedules = async () => {
    if (!user || !payload) return;

    setLoadingSchedules(true);

    try {
      const { VITE_GETSCHEDULES_ENDPOINT } = window.__ENV__ || {};

      const response = await getSchedulesByUserId.post(
        `${VITE_GETSCHEDULES_ENDPOINT}?id=${user.id}`,
      );

      const data = response.data || [];

      // Only schedules for this room AND with scheduleEndTime null or empty
      const roomSchedules = data.filter(
        (s) =>
          s.scheduleRoomId === payload.roomId &&
          (!s.scheduleEnd || s.scheduleEnd === ""),
      );

      const mappedSchedules = roomSchedules.map((item) => {
        const start = item.scheduleStartTime
          ? new Date(item.scheduleStartTime)
          : null;
        const end = item.scheduleEndTime
          ? new Date(item.scheduleEndTime)
          : null;

        let duration = "";
        if (start && end) {
          const durationMs = end - start;
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor(
            (durationMs % (1000 * 60 * 60)) / (1000 * 60),
          );
          duration = `${hours}h ${minutes}m`;
        }

        return {
          id: item.scheduleId,
          date: item.scheduleDay,
          subject: item.scheduleSubject,
          timeIn: start ? format(start, "hh:mm a") : "--:--",
          timeOut: end ? format(end, "hh:mm a") : "--:--",
          duration,
        };
      });

      setSchedules(mappedSchedules);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(
        error.response?.data?.message || "Failed to fetch schedules",
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user, payload]);

  /* ---------------- EXPAND ROW ---------------- */
  const handleScheduleClick = (id) => {
    setSelectedSchedule(selectedSchedule === id ? null : id);
  };

  /* ---------------- UPDATE START / END ---------------- */
  const handleUpdateStartOrEnd = async (scheduleId, isStart) => {
    try {
      // Set loading for this button
      setLoadingButton({ [scheduleId]: isStart ? "start" : "end" });

      const { VITE_UPDATESTARTOREND_ENDPOINT } = window.__ENV__ || {};

      const response = await updateStartOrEnd.post(
        VITE_UPDATESTARTOREND_ENDPOINT,
        {
          userId: user.id,
          scheduleId,
          start: isStart,
          end: !isStart,
        },
      );

      setSnackbarMessage(response.data?.message || "Update failed");
      setSnackbarSeverity(
        response.data?.message === "ok" ? "success" : "error",
      );
      setSnackbarOpen(true);

      if (response.data?.message === "ok") {
        fetchSchedules();
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage(
        error.response?.data?.message || "Failed to update schedule",
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      // Reset loading state for this schedule
      setLoadingButton({});
    }
  };

  if (!payload) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Room: {payload.roomName || payload.roomCode}
      </h2>

      <div className="bg-gray-50 p-6 rounded-xl shadow border overflow-x-auto">
        {loadingSchedules ? (
          <p className="text-gray-500 text-sm">Loading schedules...</p>
        ) : schedules.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No schedules found for this room.
          </p>
        ) : (
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-2 font-semibold">Date</th>
                <th className="px-4 py-2 font-semibold">Subject</th>
                <th className="px-4 py-2 font-semibold">
                  Scheduled Start Time
                </th>
                <th className="px-4 py-2 font-semibold">Scheduled End Time</th>
                <th className="px-4 py-2 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((sched) => (
                <>
                  <tr
                    key={sched.id}
                    onClick={() => handleScheduleClick(sched.id)}
                    className="hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-900 text-sm">
                      {format(new Date(sched.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {sched.subject}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {sched.timeIn}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {sched.timeOut}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {sched.duration}
                    </td>
                  </tr>

                  {selectedSchedule === sched.id && (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 bg-gray-100">
                        <div className="flex gap-4">
                          <button
                            onClick={() =>
                              handleUpdateStartOrEnd(sched.id, true)
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                            disabled={loadingButton[sched.id] === "start"}
                          >
                            {loadingButton[sched.id] === "start"
                              ? "Updating..."
                              : `Start Time (${sched.timeIn})`}
                          </button>

                          <button
                            onClick={() =>
                              handleUpdateStartOrEnd(sched.id, false)
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                            disabled={loadingButton[sched.id] === "end"}
                          >
                            {loadingButton[sched.id] === "end"
                              ? "Updating..."
                              : `End Time (${sched.timeOut})`}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
