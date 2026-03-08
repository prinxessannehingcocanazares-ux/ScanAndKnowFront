import { DoorOpen, User } from "lucide-react";

const RoomsTab = ({ departments, rooms, schedules, setSelectedRoom }) => {
  return (
    <>
      {departments.map((dept) => {
        const roomsPerDept = rooms.filter(
          (r) => r.roomDepartmentId === dept.departmentId,
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
                  (s) => s.extendedProps.room === room.roomId,
                );
                const hasSchedules = roomSchedules.length > 0;

                // Count attended vs not yet attended
                const attendedCount = roomSchedules.filter(
                  (s) => s.scheduleEnd,
                ).length;
                const notAttendedCount = roomSchedules.filter(
                  (s) => !s.scheduleEnd,
                ).length;

                return (
                  <div
                    key={room.roomId}
                    onClick={() =>
                      setSelectedRoom({
                        ...room,
                        departmentName: dept.departmentCollegeName,
                        schedules: roomSchedules,
                      })
                    }
                    className={`relative bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer
                      ${hasSchedules ? "border-green-500" : "border-gray-200"}`}
                  >
                    {hasSchedules ? (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Scheduled
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 bg-gray-300 text-white text-xs px-2 py-0.5 rounded-full">
                        Empty
                      </span>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <DoorOpen size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {room.roomCode}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <User size={12} /> Capacity: {room.roomCapacity}
                        </p>

                        {hasSchedules && (
                          <p className="text-xs mt-1">
                            <span className="text-green-600 font-semibold">
                              Attended: {attendedCount}
                            </span>
                            {" / "}
                            {notAttendedCount > 0 ? (
                              <span className="text-red-600 font-semibold">
                                Not Yet: {notAttendedCount}
                              </span>
                            ) : (
                              <span className="text-gray-500">
                                Not Yet: {notAttendedCount}
                              </span>
                            )}
                          </p>
                        )}

                        {!hasSchedules && (
                          <p className="text-xs text-gray-400 mt-1">
                            No schedules
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RoomsTab;
