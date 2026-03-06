import { useState } from "react";
import AssignRoomModal from "./AssignRoomModal";

const UnassignedSchedulesTab = ({ schedules, refreshSchedules }) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Sort schedules by descending start date
  const sortedSchedules = [...schedules].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  return (
    <>
      {sortedSchedules.length === 0 ? (
        <p className="text-gray-500">All schedules are assigned to rooms.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedSchedules.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSchedule(s)}
              className="bg-white border border-red-300 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition"
            >
              <p className="text-sm font-bold text-gray-900">{s.title}</p>
              <p className="text-xs text-gray-500">Day: {s.extendedProps.day}</p>
              <p className="text-xs text-gray-500">
                Time: {s.start.toLocaleTimeString()} - {s.end.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedSchedule && (
        <AssignRoomModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onRoomAssigned={() => {
            setSelectedSchedule(null);
            if (refreshSchedules) refreshSchedules();
          }}
        />
      )}
    </>
  );
};

export default UnassignedSchedulesTab;