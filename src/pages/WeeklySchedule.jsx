import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { mockSchedules } from "../lib/mockData";

const Section = () => {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [schedules, setSchedules] = useState(
    mockSchedules.map((s) => ({
      ...s,
      start: parseTimeSlotToDate(s.day, s.time).start,
      end: parseTimeSlotToDate(s.day, s.time).end,
      title: s.subject,
      id: Math.random().toString(36).substr(2, 9),
      rrule: null,
    }))
  );
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    day: "Monday",
    room: "",
    startTime: "09:00",
    endTime: "10:00",
    repeatWeekly: false,
  });

  // Update FullCalendar view when currentView changes
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.changeView(currentView);
  }, [currentView]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { subject, day, startTime, endTime, repeatWeekly } = formData;

    if (!subject) return alert("Please enter a subject");

    const startDate = parseTimeSlotToDate(day, startTime);
    const endDate = parseTimeSlotToDate(day, endTime);

    let newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: subject,
    };

  if (repeatWeekly) {
  newEvent.rrule = {
    freq: "weekly",
    dtstart: startDate.toISOString(), // Full date + time
  };
  // IMPORTANT: Set duration so it knows the event length
  newEvent.duration = { hours: (endDate - startDate) / (1000 * 60 * 60) };
} else {
  newEvent.start = startDate;
  newEvent.end = endDate;
}

    setSchedules([...schedules, newEvent]);
    setShowAdd(false);
    setFormData({ subject: "", day: "Monday", room: "", startTime: "09:00", endTime: "10:00", repeatWeekly: false });
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
        <button
          className={`px-4 py-2 rounded-xl font-bold ${
            currentView === "timeGridDay" ? "bg-indigo-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setCurrentView("timeGridDay")}
        >
          Day
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-bold ${
            currentView === "timeGridWeek" ? "bg-indigo-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setCurrentView("timeGridWeek")}
        >
          Week
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-bold ${
            currentView === "dayGridMonth" ? "bg-indigo-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setCurrentView("dayGridMonth")}
        >
          Month
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
          initialView={currentView}
          selectable={true}
          editable={true}
          events={schedules}
          height="auto"
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
        />
      </div>

      {/* Add Schedule Modal */}
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
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Add New Schedule
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="e.g. Advanced Mathematics"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                    <select
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room</label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. Lab 101"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.repeatWeekly}
                    onChange={(e) => setFormData({ ...formData, repeatWeekly: e.target.checked })}
                    id="repeatWeekly"
                  />
                  <label htmlFor="repeatWeekly" className="text-sm font-medium text-gray-700">
                    Repeat Weekly
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="w-full sm:flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm"
                  >
                    Add Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Convert day + HH:MM to Date
function parseTimeSlotToDate(day, time) {
  const dayMap = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };
  const today = new Date();
  const nextMonday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  const date = new Date(nextMonday);
  date.setDate(date.getDate() + (dayMap[day] - 1));

  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);

  return date;
}

export default Section;