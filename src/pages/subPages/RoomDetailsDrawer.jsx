import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RoomDetailsDrawer = ({ selectedRoom, onClose }) => {
  if (!selectedRoom) return null;

  // Sort schedules ascending by start time
  const sortedSchedules = selectedRoom?.schedules
    ? [...selectedRoom.schedules].sort(
        (a, b) => a.start.getTime() - b.start.getTime(),
      )
    : [];

  // Group schedules into "Done" and "Not Yet Done"
  const schedulesGrouped = sortedSchedules.reduce(
    (acc, sched) => {
      if (sched.scheduleEnd) {
        acc.done.push(sched);
      } else {
        acc.notYet.push(sched);
      }
      return acc;
    },
    { done: [], notYet: [] },
  );

  // Helper to render a list of schedules
  const renderSchedules = (schedules) =>
    schedules.map((s) => (
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
          {s.start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" - "}
          {s.end
            ? s.end.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--:--"}
        </Typography>
      </Box>
    ));

  return (
    <Drawer anchor="right" open={Boolean(selectedRoom)} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            Room Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Compact info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Department / Room / Capacity
          </Typography>
          <Typography fontWeight="bold" fontSize={13}>
            {selectedRoom.departmentName} / {selectedRoom.roomCode} /{" "}
            {selectedRoom.roomCapacity}
          </Typography>
        </Box>

        <Divider sx={{ mb: 1 }} />
        {/* Not Yet Attended schedules */}
        <Typography fontWeight="bold" mb={1} fontSize={13} color="orange">
          Not Yet Attended
        </Typography>
        {schedulesGrouped.notYet.length > 0 ? (
          renderSchedules(schedulesGrouped.notYet)
        ) : (
          <Typography fontSize={12} color="text.secondary">
            No ongoing schedules.
          </Typography>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Done schedules */}
        <Typography fontWeight="bold" mb={1} fontSize={13} color="green">
          Attended
        </Typography>
        {schedulesGrouped.done.length > 0 ? (
          renderSchedules(schedulesGrouped.done)
        ) : (
          <Typography fontSize={12} color="text.secondary" mb={2}>
            No completed schedules.
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default RoomDetailsDrawer;
