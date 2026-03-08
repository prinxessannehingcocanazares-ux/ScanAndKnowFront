// LazyCalendar.jsx
import React, { forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";

const LazyCalendar = forwardRef((props, ref) => (
  <FullCalendar
    ref={ref}
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
    {...props}
  />
));

export default LazyCalendar;