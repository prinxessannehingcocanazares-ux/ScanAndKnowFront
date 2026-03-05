import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import getAvailableRooms from "../../api/getAvailableRooms";
import updateScheduleById from "../../api/updateScheduleById"; // your API call to update schedule
import getRoomById from "../../api/getRoomById"; // API call to fetch room details
import getDepartmentById from "../../api/getDepartmentById"; // API call to fetch department details
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
          `${VITE_GETDEPARTMENTBYID_ENDPOINT}?id=${roomInfo?.roomDepartmentId}`,
        );

      console.log("Fetched department info:", response.data);
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
          `${VITE_GETROOMBYID_ENDPOINT}?id=${schedule?.room}`,
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
          <h3 className="text-xl font-bold mb-6">
            <strong>Schedule Details</strong>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-500 text-sm mb-1">
                <strong>Subject</strong>
              </label>
              <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">
                {schedule.title}
              </p>
            </div>

            {/* Room and Day side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  <strong>Day</strong>
                </label>
                <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">
                  {schedule.day}
                </p>
              </div>

              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  <strong>Room Info</strong>
                </label>
                <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">
                  {loadingRoom ? (
                    "Loading..."
                  ) : roomInfo ? (
                    <>
                      <strong>DEPARTMENT:</strong> <br />
                      {departmentInfo?.departmentCollegeName} <br />
                      <strong>ROOMCODE:</strong> <br />
                      {roomInfo.roomCode} <br />
                      <strong>CAPACITY:</strong> <br />
                      {roomInfo.roomCapacity}
                    </>
                  ) : selectedRoom ? (
                    <>
                      {selectedRoom.roomCode} (
                      {selectedRoom.departmentCollegeName}) - Capacity:{" "}
                      {selectedRoom.roomCapacity}
                    </>
                  ) : (
                    "Not Assigned"
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  <strong>Start Time</strong>
                </label>
                <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">
                  {formatTime(schedule.start)}
                </p>
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  <strong>End Time</strong>
                </label>
                <p className="w-full px-4 py-3 bg-gray-50 rounded-xl">
                  {formatTime(schedule.end)}
                </p>
              </div>
            </div>

            {/* Grouped available rooms */}
            <div className="mt-4">
              <label className="block text-blue-600 text-sm font-semibold mb-2">
                <strong>Available Rooms by Department</strong>
              </label>
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