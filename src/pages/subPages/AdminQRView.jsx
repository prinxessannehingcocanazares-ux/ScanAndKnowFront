import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Snackbar, Alert } from "@mui/material";
import getDepartments from "../../api/getDepartments";
import getRooms from "../../api/getRooms";

const AdminQRView = () => {
  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const showSnackbar = (message, severity = "error") => setSnackbar({ open: true, message, severity });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const { VITE_GETDEPARTMENTS_ENDPOINT } = window.__ENV__ || {};
        const res = await getDepartments.post(VITE_GETDEPARTMENTS_ENDPOINT);
        setDepartments(res.data || []);
      } catch (err) {
        showSnackbar("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { VITE_GETROOMS_ENDPOINT } = window.__ENV__ || {};
        const res = await getRooms.post(VITE_GETROOMS_ENDPOINT);
        setRooms(res.data || []);
      } catch (err) {
        showSnackbar("Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const groupedRooms = rooms.reduce((acc, room) => {
    const dept =
      departments.find((d) => d.departmentId === room.roomDepartmentId)?.departmentCollegeName ||
      "Unknown Department";

    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(room);
    return acc;
  }, {});

  const downloadQR = (roomId, roomName, departmentName) => {
    const canvas = document.getElementById(`qr-${roomId}`);
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const safeDept = departmentName.replace(/\s+/g, "_");
    const safeRoom = roomName.replace(/\s+/g, "_");

    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeDept}-${safeRoom}-QR.png`;
    link.click();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-8">Room QR Codes</h2>

      {Object.entries(groupedRooms).map(([department, rooms]) => (
        <div key={department} className="mb-10">
          <h3 className="text-lg font-bold text-indigo-600 mb-4">
            {department}
          </h3>

          <div className="grid grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white p-6 rounded-xl shadow text-center"
              >
                <h4 className="font-semibold mb-3">{room.roomCode}</h4>

                <QRCodeCanvas
                  id={`qr-${room.id}`}
                  value={JSON.stringify({
                    roomId: room.roomId, // the actual room ID
                    roomCode: room.roomCode, // room code or name
                    roomName: room.roomName || room.roomCode, // optional: human-readable name
                    roomCapacity: room.roomCapacity,
                    roomDepartmentId: room.roomDepartmentId,
                    qrKey: "scanandknow-qr",
                  })}
                  size={160}
                />

                <button
                  onClick={() =>
                    downloadQR(room.id, room.roomCode || room.name, department)
                  }
                  className="mt-4 text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default AdminQRView;