import { useState, useEffect } from "react";
import { DoorOpen, User } from "lucide-react";
import getDepartments from "../api/getDepartments";
import getRooms from "../api/getRooms";
import { lazy, Suspense } from "react";
import LazySnackbar from "../pages/subPages/LazySnackbar";
import { useAuth } from "../context/AuthContext";
import getSchedulesByUserId from "../api/getSchedulesByUserId";

const RoomDetailsDrawer = lazy(
  () => import("../pages/subPages/RoomDetailsDrawer"),
);

const Rooms = () => {
  const { user } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [loadingSchedules, setLoadingSchedules] = useState(true);

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

      const mappedSchedules = data.map((s) => ({
        id: s.scheduleId,
        title: s.scheduleSubject,
        start: parseISOToLocalDate(s.scheduleStartTime),
        end: parseISOToLocalDate(s.scheduleEndTime),
        extendedProps: {
          room: s.scheduleRoomId,
          day: s.scheduleDay,
        },
        rrule: s.scheduleRepeatWeekly ? { freq: "weekly" } : null,
      }));

      setSchedules(mappedSchedules);
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.message || "Failed to fetch schedules"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user?.id]);

  /* ---------------- FETCH DEPARTMENTS ---------------- */

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { VITE_GETDEPARTMENTS_ENDPOINT } = window.__ENV__ || {};
        const response = await getDepartments.post(
          VITE_GETDEPARTMENTS_ENDPOINT
        );

        setDepartments(response.data);
      } catch (error) {
        setSnackbarMessage(
          error.response?.data?.message || "Failed to fetch departments."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchDepartments();
  }, []);

  /* ---------------- FETCH ROOMS ---------------- */

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { VITE_GETROOMS_ENDPOINT } = window.__ENV__ || {};
        const response = await getRooms.post(VITE_GETROOMS_ENDPOINT);

        setRooms(response.data);
      } catch (error) {
        setSnackbarMessage(
          error.response?.data?.message || "Failed to fetch rooms."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <p className="text-sm sm:text-base text-gray-500">
          Monitor room status and capacity in real-time.
        </p>
      </div>

      {departments.map((dept) => {
        const roomsPerDept = rooms.filter(
          (room) => room.roomDepartmentId === dept.departmentId
        );

        if (roomsPerDept.length === 0) return null;

        return (
          <div key={dept.departmentId} className="mb-8">
            <h3 className="text-base sm:text-lg font-bold text-indigo-600 mb-3">
              {dept.departmentCollegeName}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roomsPerDept.map((room) => {

                const roomSchedules = schedules.filter(
                  (s) => s.extendedProps.room === room.roomId
                );

                return (
                  <div
                    key={room.roomId}
                    onClick={() =>
                      setSelectedRoom({
                        ...room,
                        departmentName: dept.departmentCollegeName,
                        schedules: roomSchedules
                      })
                    }
                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <DoorOpen size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {room.roomCode}
                        </p>

                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <User size={12} />
                          Capacity: {room.roomCapacity}
                        </p>

                        <p className="text-xs text-indigo-500 mt-1">
                          {roomSchedules.length} schedules
                        </p>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Drawer */}
      <Suspense fallback={null}>
        <RoomDetailsDrawer
          selectedRoom={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      </Suspense>

      <LazySnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

function parseISOToLocalDate(isoString) {
  const [datePart, timePart] = isoString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export default Rooms;