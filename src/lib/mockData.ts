import { Subject } from "@mui/icons-material";

export const mockUser = {
  id: '1',
  fullName: 'John Doe',
  email: 'john.doe@university.edu',
  contactNumber: '+1 234 567 890',
  department: 'Computer Science',
  position: 'Senior Lecturer',
  profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  role: 'admin' // or 'user'
};

export const mockDashboardRooms = [
  { id: '101', room: 'Lab 101', available: true, occupied: false, status: 'Clean' },
  { id: '102', room: 'Lecture Hall A', available: false, occupied: true, status: 'In Use' },
  { id: '103', room: 'Conference Room', available: true, occupied: false, status: 'Reserved' },
  { id: '104', room: 'Lab 102', available: true, occupied: false, status: 'Maintenance' },
  { id: '105', room: 'Seminar Room 1', available: false, occupied: true, status: 'In Use' },
];

export const mockSchedules = [
  { id: 's1', day: 'Monday', time: '09:00 AM - 11:00 AM', room: 'Lab 101', subject: 'Data Structures' },
  { id: 's2', day: 'Tuesday', time: '01:00 PM - 03:00 PM', room: 'Lecture Hall A', subject: 'Algorithms' },
  { id: 's3', day: 'Wednesday', time: '10:00 AM - 12:00 PM', room: 'Lab 102', subject: 'Operating Systems' },
  { id: 's4', day: 'Thursday', time: '02:00 PM - 04:00 PM', room: 'Seminar Room 1', subject: 'Database Systems' },
  { id: 's5', day: 'Friday', time: '09:00 AM - 11:00 PM', room: 'Lab 101', subject: 'Web Development' },
];

export const mockRooms = [
  { id: '101', name: 'Lab 101', roomId: 's1', department: 'College of Criminal Justice Education', status: 'Available', capacity: 30 },
  { id: '102', name: 'Lecture Hall A', roomId: 's2', department: 'College of Criminal Justice Education', status: 'Occupied', capacity: 100 },
  { id: '103', name: 'Conference Room', roomId: 's3', department: 'College of Information Technology', status: 'Available', capacity: 15 },
  { id: '104', name: 'Lab 102', roomId: 's4', department: 'College of Information Technology', status: 'Maintenance', capacity: 25 },
  { id: '105', name: 'Seminar Room 1', roomId: 's5', department: 'College of Nursing and Allied Health', status: 'Occupied', capacity: 40 },
];

export const mockAttendance = [
  { id: 'a1', subject: 'science', date: '2024-05-20', room: 'Lab 101', timeIn: '08:55 AM', timeOut: '11:05 AM' },
  { id: 'a2', subject: 'mathematics', date: '2024-05-21', room: 'Lecture Hall A', timeIn: '12:50 PM', timeOut: '03:10 PM' },
  { id: 'a3', subject: 'physics', date: '2024-05-22', room: 'Lab 102', timeIn: '09:45 AM', timeOut: '12:15 PM' },
];

export const mockReports = [
  { id: 'r1', teacher: 'John Doe', room: 'Lab 101', issue: 'Projector not working', date: '2024-05-18', status: 'Pending' },
  { id: 'r2', teacher: 'Jane Smith', room: 'Lab 102', issue: 'AC leakage', date: '2024-05-15', status: 'Resolved' },
  { id: 'r3', teacher: 'John Doe', room: 'Lecture Hall A', issue: 'Microphone battery low', date: '2024-05-10', status: 'Resolved' },
];
