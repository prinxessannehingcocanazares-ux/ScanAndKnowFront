import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RoomDetailsDrawer = ({ selectedRoom, onClose }) => {
  return (
    <Drawer anchor="right" open={Boolean(selectedRoom)} onClose={onClose}>
      <Box sx={{ width: 340, p: 3 }}>

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary">
            Room Details
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {selectedRoom && (
          <>
            <Typography variant="caption">Department</Typography>
            <Typography fontWeight="bold" mb={2}>
              {selectedRoom.departmentName}
            </Typography>

            <Typography variant="caption">Room Code</Typography>
            <Typography fontWeight="bold" mb={2}>
              {selectedRoom.roomCode}
            </Typography>

            <Typography variant="caption">Capacity</Typography>
            <Typography fontWeight="bold" mb={3}>
              {selectedRoom.roomCapacity}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={2}>
              Room Schedules
            </Typography>

            {selectedRoom.schedules?.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No schedules for this room.
              </Typography>
            )}

            {selectedRoom.schedules?.map((s) => (
              <Box
                key={s.id}
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "#f5f7ff"
                }}
              >
                <Typography fontWeight="bold" fontSize={14}>
                  {s.title}
                </Typography>

                <Typography fontSize={12} color="text.secondary">
                  {s.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  {" - "}
                  {s.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Typography>

                <Typography fontSize={11} color="text.secondary">
                  {s.extendedProps.day}
                </Typography>
              </Box>
            ))}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default RoomDetailsDrawer;