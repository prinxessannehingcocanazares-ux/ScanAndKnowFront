// src/components/ViewScheduleModal.jsx
import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import getAvailableRooms from "../../api/getAvailableRooms";
import updateScheduleById from "../../api/updateScheduleById";
import getRoomById from "../../api/getRoomById";
import getDepartmentById from "../../api/getDepartmentById";
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

  const [roomInfo, setRoomInfo] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [departmentInfo, setDepartmentInfo] = useState(null);

  useEffect(() => {
    const fetchDepartmentInfo = async () => {
      if (!roomInfo?.roomDepartmentId) return;
      setLoadingRoom(true);
      try {
        const { VITE_GETDEPARTMENTBYID_ENDPOINT } = window.__ENV__ || {};
        const response = await getDepartmentById.post(
          `${VITE_GETDEPARTMENTBYID_ENDPOINT}?id=${roomInfo?.roomDepartmentId}`
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
    fetchDepartmentInfo();
  }, [roomInfo?.roomDepartmentId]);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      if (!schedule?.room) return;
      setLoadingRoom(true);
      try {
        const { VITE_GETROOMBYID_ENDPOINT } = window.__ENV__ || {};
        const response = await getRoomById.post(
          `${VITE_GETROOMBYID_ENDPOINT}?id=${schedule?.room}`
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
    fetchRoomInfo();
  }, [schedule?.room]);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const { VITE_GETAVAILABLEROOMS_ENDPOINT } = window.__ENV__ || {};
        const start = new Date(schedule.start);
        start.setHours(start.getHours() + 8);
        const end = new Date(schedule.end);
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

  const roomsByDepartment = availableRooms.reduce((acc, room) => {
    const deptName = room.departmentCollegeName || "Unknown Department";
    if (!acc[deptName]) acc[deptName] = [];
    acc[deptName].push(room);
    return acc;
  }, {});

  const handleRoomClick = (room) => {
    setSelectedRoomId(room.roomId);
    if (onRoomSelect) onRoomSelect(room);
  };

  // Update schedule and close modal on success
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

      // Notify parent
      if (onRoomSelect) {
        const selectedRoom = availableRooms.find((r) => r.roomId === selectedRoomId);
        onRoomSelect(selectedRoom);
      }

      // CLOSE modal automatically after success
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update schedule.",
        severity: "error",
      });
    }
  };

  const selectedRoom = availableRooms.find((r) => r.roomId === selectedRoomId);

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
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Schedule Details
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Subject" value={schedule.title} />
            <Info label="Day" value={schedule.day} />
            <Info label="Start" value={formatTime(schedule.start)} />
            <Info label="End" value={formatTime(schedule.end)} />
            <div className="col-span-2">
              <label className="text-gray-500 text-xs">Room</label>
              <div className="mt-1 bg-gray-50 rounded-lg px-3 py-2 text-sm">
                {loadingRoom ? (
                  "Loading..."
                ) : roomInfo ? (
                  <div className="flex justify-between">
                    <span className="font-semibold">{roomInfo.roomCode}</span>
                    <span className="text-gray-500">
                      {departmentInfo?.departmentCollegeName}
                    </span>
                    <span className="text-gray-500">Cap {roomInfo.roomCapacity}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">Not Assigned</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-indigo-600 mb-2">
              Available Rooms
            </p>
            {Object.keys(roomsByDepartment).length > 0 ? (
              Object.entries(roomsByDepartment).map(([deptName, rooms]) => (
                <div key={deptName} className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    {deptName}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {rooms.map((r) => (
                      <div
                        key={r.roomId}
                        onClick={() => handleRoomClick(r)}
                        className={`cursor-pointer rounded-lg px-2 py-2 text-xs text-center border transition
                          ${
                            selectedRoomId === r.roomId
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          }`}
                      >
                        <div className="font-semibold">{r.roomCode}</div>
                        <div className="text-[10px] opacity-70">Cap {r.roomCapacity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 bg-gray-50 rounded-lg p-2">
                No available rooms
              </div>
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

function formatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const Info = ({ label, value }) => (
  <div>
    <label className="text-gray-500 text-xs">{label}</label>
    <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium">{value}</div>
  </div>
);

export default ViewScheduleModal;