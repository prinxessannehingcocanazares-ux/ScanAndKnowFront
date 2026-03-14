import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Snackbar, Alert } from "@mui/material";
import getDepartments from "../../api/getDepartments";
import getRooms from "../../api/getRooms";

const AdminQRView = () => {
  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
<<<<<<< HEAD
  const [selectedDepartment, setSelectedDepartment] = useState("all");
=======
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
>>>>>>> be8bdeb6d6fe9de70381c000c9da0348d8a166af
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const showSnackbar = (message, severity = "error") =>
    setSnackbar({ open: true, message, severity });

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

<<<<<<< HEAD
  const filteredRooms =
    selectedDepartment === "all"
      ? rooms
      : rooms.filter((room) => room.roomDepartmentId === selectedDepartment);
=======
  const groupedRooms = rooms.reduce((acc, room) => {
    const dept =
      departments.find((d) => d.departmentId === room.roomDepartmentId)
        ?.departmentCollegeName || "Unknown Department";

    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(room);
    return acc;
  }, {});
>>>>>>> be8bdeb6d6fe9de70381c000c9da0348d8a166af

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

  const selectedDepartmentName =
    departments.find((d) => d.departmentId === selectedDepartment)
      ?.departmentCollegeName || "";

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Room QR Codes</h2>

      {/* Department Dropdown */}
      <div className="mb-8">
<<<<<<< HEAD
        <select
          value={selectedDepartment}
          onChange={(e) =>
            setSelectedDepartment(
              e.target.value === "all" ? "all" : Number(e.target.value),
            )
          }
          className="border p-2 rounded-lg"
        >
          <option value="all">Select All</option>

          {departments.map((dept) => (
            <option key={dept.departmentId} value={dept.departmentId}>
              {dept.departmentCollegeName}
            </option>
          ))}
        </select>
      </div>

      {/* QR Codes */}
      {selectedDepartment && (
        <>
          <h3 className="text-lg font-bold text-indigo-600 mb-4">
            {selectedDepartmentName}
          </h3>

          <div className="grid grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white p-6 rounded-xl shadow text-center"
              >
                <h4 className="font-semibold mb-3">{room.roomCode}</h4>

                <QRCodeCanvas
                  id={`qr-${room.id}`}
                  value={JSON.stringify({
                    roomId: room.roomId,
                    roomCode: room.roomCode,
                    roomName: room.roomName || room.roomCode,
                    roomCapacity: room.roomCapacity,
                    roomDepartmentId: room.roomDepartmentId,
                    qrKey: "scanandknow-qr",
                  })}
                  size={160}
                />

                <button
                  onClick={() =>
                    downloadQR(
                      room.id,
                      room.roomCode || room.name,
                      selectedDepartmentName,
                    )
                  }
                  className="mt-4 text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg"
=======
        <label className="mr-3 font-semibold">Select Department:</label>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Departments</option>

          {departments.map((dept) => (
            <option
              key={dept.departmentId}
              value={dept.departmentCollegeName}
            >
              {dept.departmentCollegeName}
            </option>
          ))}
        </select>
      </div>

      {/* Rooms */}
      {Object.entries(groupedRooms)
        .filter(
          ([department]) =>
            selectedDepartment === "" || department === selectedDepartment
        )
        .map(([department, rooms]) => (
          <div key={department} className="mb-10">
            <h3 className="text-lg font-bold text-indigo-600 mb-4">
              {department}
            </h3>

            <div className="grid grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white p-6 rounded-xl shadow text-center"
>>>>>>> be8bdeb6d6fe9de70381c000c9da0348d8a166af
                >
                  <h4 className="font-semibold mb-3">{room.roomCode}</h4>

                  <QRCodeCanvas
                    id={`qr-${room.id}`}
                    value={JSON.stringify({
                      roomId: room.roomId,
                      roomCode: room.roomCode,
                      roomName: room.roomName || room.roomCode,
                      roomCapacity: room.roomCapacity,
                      roomDepartmentId: room.roomDepartmentId,
                      qrKey: "scanandknow-qr",
                    })}
                    size={160}
                  />

                  <button
                    onClick={() =>
                      downloadQR(
                        room.id,
                        room.roomCode || room.name,
                        department
                      )
                    }
                    className="mt-4 text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
<<<<<<< HEAD
        </>
      )}
=======
        ))}
>>>>>>> be8bdeb6d6fe9de70381c000c9da0348d8a166af

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
