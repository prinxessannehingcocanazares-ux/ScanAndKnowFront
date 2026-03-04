import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { mockSchedules } from "../lib/mockData";

const LazyCalendar = lazy(() => import("../pages/subPages/LazyCalendar"));

const Schedule = () => {

  const ROOMS = ["Room 101", "Room 102", "Room 201", "Lab 1"];

  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState("timeGridWeek");

  const [schedules, setSchedules] = useState(
    mockSchedules.map((s) => {
      const start = parseTimeSlotToDate(s.day, s.time);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      return {
        ...s,
        start,
        end,
        title: s.subject,
        id: Math.random().toString(36).substr(2, 9),
        rrule: null,
      };
    })
  );

  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    day: "Monday",
    room: "",
    startTime: "09:00",
    endTime: "10:00",
    repeatWeekly: false,
  });

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.changeView(currentView);
  }, [currentView]);

  const handleSubmit = (e) => {
  e.preventDefault();
  const { subject, day, startTime, endTime, repeatWeekly, room } = formData;

  if (!subject) return alert("Please enter a subject");

  const startDate = parseTimeSlotToDate(day, startTime);
  const endDate = parseTimeSlotToDate(day, endTime);

  let roomAssigned = room;

  if (room) {
    const available = isRoomAvailable(day, startDate, endDate, room, schedules);
    if (!available) {
      alert(`Room ${room} is already booked at this time!`);
      roomAssigned = ""; // clear room if not available
    }
  }

  let newEvent = {
    id: Math.random().toString(36).substr(2, 9),
    title: subject,
    room: roomAssigned, // assign only if available
  };

  if (repeatWeekly) {
    newEvent.rrule = {
      freq: "weekly",
      dtstart: startDate.toISOString(),
    };
    newEvent.duration = {
      hours: (endDate - startDate) / (1000 * 60 * 60),
    };
  } else {
    newEvent.start = startDate;
    newEvent.end = endDate;
  }

  setSchedules([...schedules, newEvent]);
  setShowAdd(false);

  setFormData({
    subject: "",
    day: "Monday",
    room: "",
    startTime: "09:00",
    endTime: "10:00",
    repeatWeekly: false,
  });
};

 const getAvailableRooms = () => {
  const { day, startTime, endTime } = formData;

  const startDate = parseTimeSlotToDate(day, startTime);
  const endDate = parseTimeSlotToDate(day, endTime);

  return ROOMS.map((room) => ({
    name: room,
    available: isRoomAvailable(day, startDate, endDate, room, schedules),
  }));
};
  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <p className="text-sm sm:text-base text-gray-500">
          Manage and view your teaching sections.
        </p>

        <button
          onClick={() => setShowAdd(true)}
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
            className={`px-4 py-2 rounded-xl font-bold ${
              currentView === view
                ? "bg-indigo-600 text-white"
                : "bg-gray-100"
            }`}
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
          <LazyCalendar
            ref={calendarRef}
            initialView={currentView}
            selectable
            editable
            events={schedules}
            height="auto"
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
          />
        </Suspense>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
            >
              <h3 className="text-xl font-bold mb-6">
                Add New Schedule
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
  {/* Subject */}
  <input
    type="text"
    placeholder="Subject Name"
    value={formData.subject}
    onChange={(e) =>
      setFormData({ ...formData, subject: e.target.value })
    }
    className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
  />

  {/* Day and Room */}
  <div className="grid grid-cols-2 gap-4">
    <select
      value={formData.day}
      onChange={(e) =>
        setFormData({ ...formData, day: e.target.value })
      }
      className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
    >
      <option>Monday</option>
      <option>Tuesday</option>
      <option>Wednesday</option>
      <option>Thursday</option>
      <option>Friday</option>
    </select>

   <select
  value={formData.room}
  onChange={(e) =>
    setFormData({ ...formData, room: e.target.value })
  }
  className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
>
  <option value="">Select Room (optional)</option>

  {getAvailableRooms().map((room) => (
    <option
      key={room.name}
      value={room.name}
      disabled={!room.available}
    >
      {room.name} {room.available ? "" : " (Booked)"}
    </option>
  ))}
</select>
  </div>

  {/* Start and End Time */}
  <div className="grid grid-cols-2 gap-4">
    <input
      type="time"
      value={formData.startTime}
      onChange={(e) =>
        setFormData({ ...formData, startTime: e.target.value })
      }
      className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
    />
    <input
      type="time"
      value={formData.endTime}
      onChange={(e) =>
        setFormData({ ...formData, endTime: e.target.value })
      }
      className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
    />
  </div>

  {/* Repeat Weekly */}
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={formData.repeatWeekly}
      onChange={(e) =>
        setFormData({ ...formData, repeatWeekly: e.target.checked })
      }
      id="repeatWeekly"
    />
    <label htmlFor="repeatWeekly" className="text-sm font-medium">
      Repeat Weekly
    </label>
  </div>

  {/* Submit */}
  <button
    type="submit"
    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
  >
    Add Schedule
  </button>
</form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function parseTimeSlotToDate(day, time) {
  const dayMap = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };
  const today = new Date();
  const nextMonday = new Date(
    today.setDate(today.getDate() - today.getDay() + 1)
  );
  const date = new Date(nextMonday);
  date.setDate(date.getDate() + (dayMap[day] - 1));

  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);

  return date;
}

function isRoomAvailable(day, startDate, endDate, room, schedules) {
  return !schedules.some((s) => {
    if (!s.room || s.day !== day || s.room !== room) return false;

    const existingStart = s.start instanceof Date ? s.start : new Date(s.start);
    const existingEnd = s.end instanceof Date ? s.end : new Date(s.end);

    return startDate < existingEnd && endDate > existingStart;
  });
}

export default Schedule;