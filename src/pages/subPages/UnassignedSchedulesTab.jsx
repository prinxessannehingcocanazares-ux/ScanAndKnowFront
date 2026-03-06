import { useState, useMemo } from "react";
import AssignRoomModal from "./AssignRoomModal";

import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

const UnassignedSchedulesTab = ({ schedules, refreshSchedules }) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Sort schedules ASC
  const sortedSchedules = useMemo(() => {
    return [...schedules].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );
  }, [schedules]);

  // Group by Date
  const groupedSchedules = useMemo(() => {
    const groups = {};

    sortedSchedules.forEach((s) => {
      const dateKey = new Date(s.start).toLocaleDateString();

      if (!groups[dateKey]) groups[dateKey] = [];

      groups[dateKey].push(s);
    });

    return groups;
  }, [sortedSchedules]);

  if (sortedSchedules.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        All schedules are assigned to rooms.
      </Typography>
    );
  }

  return (
    <Box>
      {Object.entries(groupedSchedules).map(([date, list]) => (
        <Box key={date} mb={2}>
          {/* Date Header */}
          <Typography
            variant="subtitle2"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              mb: 1,
            }}
          >
            {date} ({list.length})
          </Typography>

          <Divider sx={{ mb: 1 }} />

          <Grid container spacing={1}>
            {list.map((s) => (
              <Grid item xs={12} md={6} lg={4} key={s.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}
                  onClick={() => setSelectedSchedule(s)}
                >
                  <Stack spacing={0.3}>
                    {/* Title */}
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      noWrap
                    >
                      {s.title}
                    </Typography>

                    {/* Day + Time */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Chip
                        label={s.extendedProps?.day}
                        size="small"
                        color="info"
                        sx={{ height: 20, fontSize: 11 }}
                      />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(s.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(s.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Assign Room Modal */}
      {selectedSchedule && (
        <AssignRoomModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onRoomAssigned={() => {
            setSelectedSchedule(null);
            refreshSchedules?.();
          }}
        />
      )}
    </Box>
  );
};

export default UnassignedSchedulesTab;