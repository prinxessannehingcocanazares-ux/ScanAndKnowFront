import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import getAvailableRooms from "../../api/getAvailableRooms";
import updateScheduleById from "../../api/updateScheduleById";
import getRoomById from "../../api/getRoomById";
import getDepartmentById from "../../api/getDepartmentById";

const LazySnackbar = lazy(() => import("../../utility/LazySnackbar"));

const EditScheduleModal = ({ schedule, onClose, onSave }) => {
  if (!schedule) return null;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(schedule.scheduleRoomId || null);

  const [roomInfo, setRoomInfo] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [departmentInfo, setDepartmentInfo] = useState(null);

  const [editData, setEditData] = useState({
    subject: schedule.scheduleSubject || "",
    day: formatDateInput(schedule.scheduleStartTime),
    start: formatTimeInput(schedule.scheduleStartTime),
    end: formatTimeInput(schedule.scheduleEndTime),
  });

  // Fetch Room info
  useEffect(() => {
    const fetchRoom = async () => {
      if (!schedule?.scheduleRoomId) return;
      setLoadingRoom(true);
      try {
        const { VITE_GETROOMBYID_ENDPOINT } = window.__ENV__ || {};
        const response = await getRoomById.post(
          `${VITE_GETROOMBYID_ENDPOINT}?id=${schedule.scheduleRoomId}`
        );
        setRoomInfo(response.data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to fetch room info",
          severity: "error",
        });
      } finally {
        setLoadingRoom(false);
      }
    };
    fetchRoom();
  }, [schedule?.scheduleRoomId]);

  // Fetch Department info
  useEffect(() => {
    const fetchDepartment = async () => {
      if (!roomInfo?.roomDepartmentId) return;
      setLoadingRoom(true);
      try {
        const { VITE_GETDEPARTMENTBYID_ENDPOINT } = window.__ENV__ || {};
        const response = await getDepartmentById.post(
          `${VITE_GETDEPARTMENTBYID_ENDPOINT}?id=${roomInfo.roomDepartmentId}`
        );
        setDepartmentInfo(response.data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to fetch department info",
          severity: "error",
        });
      } finally {
        setLoadingRoom(false);
      }
    };
    fetchDepartment();
  }, [roomInfo?.roomDepartmentId]);

  // Fetch Available Rooms
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const { VITE_GETAVAILABLEROOMS_ENDPOINT } = window.__ENV__ || {};
        const start = new Date(`${editData.day}T${editData.start}:00`);
        const end = new Date(`${editData.day}T${editData.end}:00`);
        start.setHours(start.getHours() + 8);
        end.setHours(end.getHours() + 8);

        const payload = {
          id: schedule.id,
          start: start.toISOString(),
          end: end.toISOString(),
        };

        const response = await getAvailableRooms.post(
          VITE_GETAVAILABLEROOMS_ENDPOINT,
          payload
        );
        setAvailableRooms(response.data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || "Failed to fetch available rooms",
          severity: "error",
        });
      }
    };
    fetchAvailableRooms();
  }, [editData, schedule.id]);

  const roomsByDepartment = availableRooms.reduce((acc, room) => {
    const deptName = room.departmentCollegeName || "Unknown Department";
    if (!acc[deptName]) acc[deptName] = [];
    acc[deptName].push(room);
    return acc;
  }, {});

  const handleRoomClick = (room) => {
    setSelectedRoomId(room.roomId);
  };

  const handleUpdateSchedule = async () => {
    try {
      const payload = {
        scheduleId: schedule.id,
        scheduleSubject: editData.subject,
        scheduleDay: editData.day,
        scheduleStartTime: `${editData.day}T${editData.start}:00`,
        scheduleEndTime: `${editData.day}T${editData.end}:00`,
        roomId: selectedRoomId,
        updateTag: "editDashFlag"
      };

      const { VITE_UPDATESCHEDULEBYID_ENDPOINT } = window.__ENV__ || {};
      await updateScheduleById.post(VITE_UPDATESCHEDULEBYID_ENDPOINT, payload);

      setSnackbar({
        open: true,
        message: "Schedule updated successfully!",
        severity: "success",
      });

      // Notify parent (Dashboard) to update state
      if (onSave) {
        onSave({
          ...schedule,
          scheduleSubject: editData.subject,
          scheduleStartTime: payload.scheduleStartTime,
          scheduleEndTime: payload.scheduleEndTime,
          scheduleRoomId: selectedRoomId,
        });
      }

      onClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update schedule",
        severity: "error",
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl p-5 overflow-y-auto max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Schedule</h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Input label="Subject" value={editData.subject} onChange={(v) => setEditData({ ...editData, subject: v })} />
            <Input label="Date" type="date" value={editData.day} onChange={(v) => setEditData({ ...editData, day: v })} />
            <Input label="Start" type="time" value={editData.start} onChange={(v) => setEditData({ ...editData, start: v })} />
            <Input label="End" type="time" value={editData.end} onChange={(v) => setEditData({ ...editData, end: v })} />

            <div className="col-span-2">
              <label className="text-gray-500 text-xs">Current Room</label>
              <div className="mt-1 bg-gray-50 rounded-lg px-3 py-2 text-sm">
                {loadingRoom ? "Loading..." : roomInfo ? (
                  <div className="flex justify-between">
                    <span className="font-semibold">{roomInfo.roomCode}</span>
                    <span className="text-gray-500">{departmentInfo?.departmentCollegeName}</span>
                    <span className="text-gray-500">Cap {roomInfo.roomCapacity}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">Not Assigned</span>
                )}
              </div>
            </div>
          </div>

          {/* Available Rooms */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-indigo-600 mb-2">Available Rooms</p>
            {Object.keys(roomsByDepartment).length > 0 ? Object.entries(roomsByDepartment).map(([deptName, rooms]) => (
              <div key={deptName} className="mb-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">{deptName}</p>
                <div className="grid grid-cols-3 gap-2">
                  {rooms.map((r) => (
                    <div
                      key={r.roomId}
                      onClick={() => handleRoomClick(r)}
                      className={`cursor-pointer rounded-lg px-2 py-2 text-xs text-center border transition ${
                        selectedRoomId === r.roomId ? "bg-indigo-600 text-white border-indigo-600" : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="font-semibold">{r.roomCode}</div>
                      <div className="text-[10px] opacity-70">Cap {r.roomCapacity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )) : (
              <div className="text-sm text-gray-400 bg-gray-50 rounded-lg p-2">No available rooms</div>
            )}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={handleUpdateSchedule}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
            >
              Update
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>

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

// Helpers
function formatTimeInput(date) {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function formatDateInput(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="text-gray-500 text-xs">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm"
    />
  </div>
);

export default EditScheduleModal;