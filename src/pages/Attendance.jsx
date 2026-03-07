import { Search, FileText } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import getSchedulesByUserId from "../api/getSchedulesByUserId";
import { useAuth } from "../context/AuthContext";
import LazySnackbar from "../pages/subPages/LazySnackbar";
import getRoomById from "../api/getRoomById";

const Attendance = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [rooms, setRooms] = useState({}); // roomId -> roomCode mapping

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  /* ---------------- FETCH SCHEDULES ---------------- */
  const fetchSchedules = async () => {
    if (!user?.id) return;
    setLoadingSchedules(true);

    try {
      const { VITE_GETSCHEDULES_ENDPOINT } = window.__ENV__ || {};
      const response = await getSchedulesByUserId.post(
        `${VITE_GETSCHEDULES_ENDPOINT}?id=${user.id}`
      );

      const data = response.data || [];
      console.log("Fetched schedules:", data);

      // Fetch room info for each unique roomId
      const uniqueRoomIds = [...new Set(data.map((s) => s.scheduleRoomId).filter(Boolean))];
      const roomMap = {};
      for (const roomId of uniqueRoomIds) {
        try {
          const { VITE_GETROOMBYID_ENDPOINT } = window.__ENV__ || {};
          const roomResp = await getRoomById.post(`${VITE_GETROOMBYID_ENDPOINT}?id=${roomId}`);
          roomMap[roomId] = roomResp.data?.roomCode || `Room ${roomId}`;
        } catch (err) {
          console.error(`Failed to fetch room ${roomId}`, err);
          roomMap[roomId] = `Room ${roomId}`;
        }
      }
      setRooms(roomMap);

      // Map schedules with proper room code
      const mappedSchedules = data.map((item) => {
        const start = item.scheduleStart ? new Date(item.scheduleStart) : null;
        const end = item.scheduleEnd ? new Date(item.scheduleEnd) : null;

        let duration = "";
        if (start && end) {
          const durationMs = end - start;
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          duration = `${hours}h ${minutes}m`;
        }

        return {
          id: item.scheduleId,
          date: item.scheduleDay,
          subject: item.scheduleSubject,
          room: item.scheduleRoomId ? roomMap[item.scheduleRoomId] : "Not Assigned",
          timeIn: start ? format(start, "hh:mm a") : "--:--",
          timeOut: end ? format(end, "hh:mm a") : "--:--",
          duration,
        };
      });

      setSchedules(mappedSchedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSnackbarMessage(error.response?.data?.message || "Failed to fetch schedules");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user?.id]);

  /* ---------------- SEARCH ---------------- */
  const filteredLogs = schedules.filter(
    (log) =>
      log.subject?.toLowerCase().includes(search.toLowerCase()) ||
      log.room?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- EXPORT ---------------- */
  const exportToExcel = () => {
    const data = filteredLogs.map((log) => ({
      Date: format(new Date(log.date), "yyyy-MM-dd"),
      Subject: log.subject,
      Room: log.room,
      TimeIn: log.timeIn,
      TimeOut: log.timeOut,
      Duration: log.duration,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_logs.xlsx");
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <p className="text-sm sm:text-base text-gray-500">
          Track your room usage and session history.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search subject or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <button
            onClick={exportToExcel}
            className="flex items-center justify-center gap-2 text-gray-600 font-semibold text-sm hover:text-indigo-600 bg-gray-50 sm:bg-transparent py-2 rounded-xl sm:py-0"
          >
            <FileText size={18} />
            Export Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">
                <th className="px-4 sm:px-6 py-4 font-semibold">Date</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Subject</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Room Used</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Time In</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Time Out</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Duration</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 && !loadingSchedules && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No records found
                  </td>
                </tr>
              )}

              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 text-sm sm:text-base">
                    {format(new Date(log.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
                    {log.subject}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
                    {log.room}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
                    {log.timeIn}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
                    {log.timeOut}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] sm:text-xs font-bold">
                      {log.duration}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LazySnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default Attendance;