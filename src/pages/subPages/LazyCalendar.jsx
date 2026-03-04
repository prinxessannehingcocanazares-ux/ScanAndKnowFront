import React, { forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";

const LazyCalendar = forwardRef((props, ref) => {
  return (
    <FullCalendar
      ref={ref}
      {...props}
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        rrulePlugin,
      ]}
    />
  );
});

export default LazyCalendar;