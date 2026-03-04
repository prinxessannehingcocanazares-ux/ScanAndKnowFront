import { useState, useEffect } from "react";
import { DoorOpen, User } from "lucide-react";
import getDepartments from "../api/getDepartments";
import getRooms from "../api/getRooms";
import { Snackbar, Alert } from "@mui/material";

const Rooms = () => {
  const [departments, setDepartments] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { VITE_GETDEPARTMENTS_ENDPOINT } = window.__ENV__ || {};
        const response = await getDepartments.post(
          VITE_GETDEPARTMENTS_ENDPOINT,
        );
        setDepartments(response.data);
      } catch (error) {
        setSnackbarMessage(
          error.response?.data?.message || "Failed to fetch departments.",
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchDepartments();
  }, []);

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { VITE_GETROOMS_ENDPOINT } = window.__ENV__ || {};
        const response = await getRooms.post(VITE_GETROOMS_ENDPOINT);
        setRooms(response.data);
      } catch (error) {
        setSnackbarMessage(
          error.response?.data?.message || "Failed to fetch rooms.",
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <p className="text-sm sm:text-base text-gray-500">
          Monitor room status and capacity in real-time.
        </p>
      </div>

      {departments.map((dept) => {
        const roomsPerDept = rooms.filter(
          (room) => room.roomDepartmentId === dept.departmentId,
        );

        if (roomsPerDept.length === 0) return null;

        return (
          <div key={dept.departmentId} className="mb-8">
            <h3 className="text-base sm:text-lg font-bold text-indigo-600 mb-3">
              {dept.departmentCollegeName}
            </h3>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y">
              {roomsPerDept.map((room) => (
                <div
                  key={room.roomId}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                >
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                      <DoorOpen size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {room.roomCode}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <User size={12} />
                        Capacity: {room.roomCapacity}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide bg-emerald-50 text-emerald-600">
                      Available
                    </span>

                    <button className="text-xs font-medium text-indigo-600 hover:underline">
                      Details
                    </button>

                    <button className="text-xs font-medium text-gray-500 hover:underline">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Rooms;
