import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RoomDetailsDrawer = ({ selectedRoom, onClose }) => {
  // Sort schedules ascending by start time
  const sortedSchedules = selectedRoom?.schedules
    ? [...selectedRoom.schedules].sort(
        (a, b) => a.start.getTime() - b.start.getTime()
      )
    : [];

  // Group schedules by day
  const schedulesByDay = sortedSchedules.reduce((acc, sched) => {
    const day = sched.extendedProps.day || "Unknown Day";
    if (!acc[day]) acc[day] = [];
    acc[day].push(sched);
    return acc;
  }, {});

  return (
    <Drawer anchor="right" open={Boolean(selectedRoom)} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            Room Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {selectedRoom && (
          <>
            {/* Compact info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Department / Room / Capacity</Typography>
              <Typography fontWeight="bold" fontSize={13}>
                {selectedRoom.departmentName} / {selectedRoom.roomCode} / {selectedRoom.roomCapacity}
              </Typography>
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* Room schedules */}
            <Typography fontWeight="bold" mb={1} fontSize={13}>
              Room Schedules
            </Typography>

            {sortedSchedules.length === 0 && (
              <Typography variant="body2" color="text.secondary" fontSize={12}>
                No schedules for this room.
              </Typography>
            )}

            {Object.entries(schedulesByDay).map(([day, daySchedules]) => (
              <Box key={day} sx={{ mb: 2 }}>
                {/* Day header */}
                <Typography fontWeight="bold" sx={{ color: "#1976d2", fontSize: 12 }} mb={0.5}>
                  {day}
                </Typography>
                <Divider sx={{ mb: 0.5 }} />

                {daySchedules.map((s) => (
                  <Box
                    key={s.id}
                    sx={{
                      mb: 1,
                      p: 1,
                      borderRadius: 1.5,
                      backgroundColor: "#f5f7ff",
                    }}
                  >
                    <Typography fontWeight="bold" fontSize={13}>
                      {s.title}
                    </Typography>
                    <Typography fontSize={11} color="text.secondary">
                      {s.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {" - "}
                      {s.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default RoomDetailsDrawer;