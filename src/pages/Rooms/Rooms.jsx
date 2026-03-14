import { useState, useEffect, lazy, Suspense } from "react";
import { Tabs, Tab, Badge } from "@mui/material";
import getDepartments from "../../api/getDepartments";
import getRooms from "../../api/getRooms";
import getSchedulesByUserId from "../../api/getSchedulesByUserId";
import LazySnackbar from "../../utility/LazySnackbar";
import { useAuth } from "../../context/AuthContext";

const RoomDetailsDrawer = lazy(
  () => import("./RoomDetailsDrawer"),
);
const RoomsTab = lazy(() => import("./RoomsTab"));
const UnassignedSchedulesTab = lazy(
  () => import("./UnassignedSchedulesTab"),
);

const Rooms = () => {
  const { user } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [unassignedSchedules, setUnassignedSchedules] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  /* ---------------- FETCH SCHEDULES ---------------- */
  const fetchSchedules = async () => {
    if (!user?.id) return;
    setLoadingSchedules(true);

    try {
      const { VITE_GETSCHEDULES_ENDPOINT } = window.__ENV__ || {};
      const response = await getSchedulesByUserId.post(
        `${VITE_GETSCHEDULES_ENDPOINT}?id=${user.id}`,
      );
      const data = response.data || [];

      const mappedSchedules = data.map((s) => ({
        id: s.scheduleId,
        title: s.scheduleSubject,
        start: parseISOToLocalDate(s.scheduleStartTime),
        end: parseISOToLocalDate(s.scheduleEndTime),
        scheduleEnd: s.scheduleEnd,
        extendedProps: {
          room: s.scheduleRoomId || null,
          day: s.scheduleDay,
        },
        rrule: s.scheduleRepeatWeekly ? { freq: "weekly" } : null,
      }));

      setSchedules(mappedSchedules);
      setUnassignedSchedules(
        mappedSchedules.filter((s) => !s.extendedProps.room),
      );
    } catch (error) {
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
  }, [user?.id]);

  /* ---------------- FETCH DEPARTMENTS ---------------- */
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { VITE_GETDEPARTMENTS_ENDPOINT } = window.__ENV__ || {};
        const response = await getDepartments.post(
          VITE_GETDEPARTMENTS_ENDPOINT,
        );
        setDepartments(response.data);
      } catch (error) {
        setSnackbarMessage(
          error.response?.data?.message || "Failed to fetch departments.",
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
          error.response?.data?.message || "Failed to fetch rooms.",
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-4 text-gray-500">
        Monitor room schedules in real-time.
      </div>

      {/* ---------------- Tabs ---------------- */}
      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        sx={{ mb: 6 }}
      >
        <Tab label="Rooms" />
        <Tab
          label={
            <Badge
              color="error"
              badgeContent={unassignedSchedules.length}
              max={99}
            >
<<<<<<< HEAD
              UnScheduled
=======
              UnAssigned
>>>>>>> be8bdeb6d6fe9de70381c000c9da0348d8a166af
            </Badge>
          }
        />
      </Tabs>

      {/* ---------------- Tab Panels ---------------- */}
      <Suspense fallback={<p>Loading...</p>}>
        {tabIndex === 0 && (
          <RoomsTab
            departments={departments}
            rooms={rooms}
            schedules={schedules}
            setSelectedRoom={setSelectedRoom}
          />
        )}

        {tabIndex === 1 && (
          <UnassignedSchedulesTab
            schedules={unassignedSchedules}
            refreshSchedules={fetchSchedules} // <-- pass the refresh function
          />
        )}
      </Suspense>

      {/* Room Details Drawer */}
      <Suspense fallback={null}>
        <RoomDetailsDrawer
          selectedRoom={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      </Suspense>

      {/* Snackbar */}
      <LazySnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

/* ---------------- UTIL ---------------- */
function parseISOToLocalDate(isoString) {
  const [datePart, timePart] = isoString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export default Rooms;
