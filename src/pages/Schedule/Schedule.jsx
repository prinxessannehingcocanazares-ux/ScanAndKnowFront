import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import createSchedules from "../../api/createSchedules";
import { useAuth } from "../../context/AuthContext";
import getSchedulesByUserId from "../../api/getSchedulesByUserId";

const LazyCalendar = lazy(() => import("./LazyCalendar"));
const AddScheduleModal = lazy(
  () => import("./AddScheduleModal"),
);
const LazySnackbar = lazy(() => import("../../utility/LazySnackbar"));
const LazyViewScheduleModal = lazy(
  () => import("./ViewScheduleModal"),
);

const Schedule = () => {
  const { user } = useAuth();
  const calendarRef = useRef(null);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    day: "",
    room: "",
    startTime: "09:00",
    endTime: "10:00",
    repeatWeekly: false,
    repeatDaily: false,
  });

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const fetchSchedules = async () => {
    try {
      const { VITE_GETSCHEDULES_ENDPOINT } = window.__ENV__ || {};
      const response = await getSchedulesByUserId.post(
        `${VITE_GETSCHEDULES_ENDPOINT}?id=${user.id}`,
      );
      const data = response.data;
      const mappedSchedules = data.map((s) => ({
        id: s.scheduleId,
        title: s.scheduleSubject,
        start: parseISOToLocalDate(s.scheduleStartTime),
        end: parseISOToLocalDate(s.scheduleEndTime),
        extendedProps: {
          room: s.scheduleRoomId || null,
          day: s.scheduleDay,
          isUnassigned: !s.scheduleRoomId,
        },
        rrule: null,
      }));
      setSchedules(mappedSchedules);
      setLoadingSchedules(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to fetch schedules",
        severity: "error",
      });
      setLoadingSchedules(false);
    }
  };

  // Fetch schedules
  useEffect(() => {
    fetchSchedules();
  }, [user.id]);

  // Switch calendar view
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.changeView(currentView);
  }, [currentView]);

  // Handle schedule submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  const { subject, day, repeatWeekly, repeatDaily, room } = formData;

  if (!subject) {
    setSnackbar({
      open: true,
      message: "Please enter a subject",
      severity: "warning",
    });
    return;
  }

  const payload = {
    ScheduleSubject: subject,
    ScheduleDay: day,
    ScheduleStartTime: `${formData.day}T${formData.startTime}:00`,
    ScheduleEndTime: `${formData.day}T${formData.endTime}:00`,
    ScheduleRepeatWeekly: repeatWeekly,
    ScheduleRepeatDaily: repeatDaily,
    ScheduleUserId: user?.id || null,
    ScheduleRoomId: room || null,
  };
  try {
    const { VITE_CREATESCHEDULE_ENDPOINT } = window.__ENV__ || {};

    const saveResponse = await createSchedules.post(
      VITE_CREATESCHEDULE_ENDPOINT,
      payload
    );

    const result = saveResponse.data;
    
    if (Array.isArray(result)) {
      const newEvents = result.map((item) => {
        const dayString = getDayString(item.scheduleDay);

        return {
          id: item.scheduleId,
          title: item.scheduleSubject,
          start: parseISOToLocalDate(item.scheduleStartTime),
          end: parseISOToLocalDate(item.scheduleEndTime),
          extendedProps: {
            room: item.scheduleRoomId || null,
            day: dayString,
            isUnassigned: !item.scheduleRoomId,
          },
          rrule:null,
        };
      });

      setSchedules((prev) => [...prev, ...newEvents]);

      setShowAdd(false);

      setFormData({
        subject: "",
        day: "Monday",
        room: "",
        startTime: "09:00",
        endTime: "10:00",
        repeatWeekly: false,
        repeatDaily: false,
      });

      setSnackbar({
        open: true,
        message: "Schedule saved successfully!",
        severity: "success",
      });
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (err) {
    setSnackbar({
      open: true,
      message:
        err.response?.data?.message ||
        err.message ||
        "Failed to save schedule",
      severity: "error",
    });
  }
};

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <p className="text-sm sm:text-base text-gray-500">
          Manage and view your teaching sections.
        </p>

        <button
          onClick={() => {
            fetchSchedules();
            setShowAdd(true);
          }}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Schedule
        </button>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 mb-4">
        {["timeGridDay", "timeGridWeek", "dayGridMonth"].map((view) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`px-4 py-2 rounded-xl font-bold ${currentView === view ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
          >
            {view === "timeGridDay"
              ? "Day"
              : view === "timeGridWeek"
                ? "Week"
                : "Month"}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
        <Suspense
          fallback={
            <div className="p-10 text-center text-gray-500">
              Loading calendar...
            </div>
          }
        >
          {loadingSchedules ? (
            <div className="p-10 text-center text-gray-500">
              Loading schedules...
            </div>
          ) : (
            <LazyCalendar
              ref={calendarRef}
              initialView={currentView}
              selectable
              editable
              events={schedules}
              height="auto"
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              eventClassNames={(arg) =>
                arg.event.extendedProps.isUnassigned ? ["unassigned-event"] : []
              }
              eventClick={(info) => {
                setSelectedSchedule({
                  id: info.event.id,
                  title: info.event.title,
                  day:
                    info.event.extendedProps?.day ||
                    getDayFromDate(info.event.start),

                  start: info.event.start,
                  end: info.event.end,
                  room: info.event.extendedProps?.room,
                });
                setShowViewModal(true);
              }}
            />
          )}
        </Suspense>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showViewModal && (
          <Suspense
            fallback={
              <div className="p-10 text-center text-gray-500">
                Loading schedule...
              </div>
            }
          >
            <LazyViewScheduleModal
              schedule={selectedSchedule}
              onClose={() => {
                setShowViewModal(false);
                fetchSchedules();
              }}
            />
          </Suspense>
        )}
        {showAdd && (
          <Suspense
            fallback={
              <div className="p-10 text-center text-gray-500">
                Loading modal...
              </div>
            }
          >
            <AddScheduleModal
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              setShowAdd={setShowAdd}
              setSnackbar={setSnackbar}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Snackbar */}
      <Suspense fallback={null}>
        <LazySnackbar
          open={snackbar.open}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Suspense>
    </div>
  );
};

// Utils

function getDayString(dateString) {
  const date = new Date(dateString);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

function parseISOToLocalDate(isoString) {
  const [datePart, timePart] = isoString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export default Schedule;
