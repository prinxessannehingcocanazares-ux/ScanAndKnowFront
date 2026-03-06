import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";
import getDepartments from "../api/getDepartments";
import getRooms from "../api/getRooms";

const QRScanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState(null); // "success" | "error"
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const showSnackbar = (message, severity = "error") => setSnackbar({ open: true, message, severity });

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const { VITE_GETDEPARTMENTS_ENDPOINT } = window.__ENV__ || {};
        const response = await getDepartments.post(VITE_GETDEPARTMENTS_ENDPOINT);
        setDepartments(response.data || []);
      } catch (error) {
        showSnackbar(error.response?.data?.message || "Failed to fetch departments.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { VITE_GETROOMS_ENDPOINT } = window.__ENV__ || {};
        const response = await getRooms.post(VITE_GETROOMS_ENDPOINT);
        setRooms(response.data || []);
      } catch (error) {
        showSnackbar(error.response?.data?.message || "Failed to fetch rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Group rooms for admin view
  const groupedRooms = rooms.reduce((acc, room) => {
    const dept =
      departments.find((d) => d.departmentId === room.roomDepartmentId)?.departmentCollegeName || "Unknown Department";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(room);
    return acc;
  }, {});

  const downloadQR = (roomId, roomName) => {
    const canvas = document.getElementById(`qr-${roomId}`);
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${roomName}-QR.png`;
    link.click();
  };

  // QR scanner
  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      scanner.render(
        (decodedText) => {
          setIsScanning(false);
          scanner?.clear();
          try {
            const data = JSON.parse(decodedText);
            if (data.qrKey?.toLowerCase() === "scanandknow-qr") {
              // Show success animation first
              setScanResult(decodedText);
              setScanStatus("success");
              setTimeout(() => {
                navigate(`/qr-success/:roomId${data.roomId}`, { state: { payload: data } });
              }, 1200); // 1.2s delay before redirect
            } else {
              // Invalid QR
              setScanResult(decodedText);
              setScanStatus("error");
            }
          } catch (err) {
            setScanResult(decodedText);
            setScanStatus("error");
          }
        },
        (error) => console.warn("QR scan error:", error)
      );
    }

    return () => {
      if (scanner) scanner.clear().catch(console.error);
    };
  }, [isScanning, navigate]);

  // ---------------- ADMIN VIEW ----------------
  if (user?.role === "admin") {
    return (
      <div className="p-6 relative">
        <h2 className="text-xl font-bold mb-8 text-gray-800">Room QR Codes</h2>
        {loading && <p className="text-sm text-gray-500 mb-4">Loading...</p>}

        {Object.entries(groupedRooms).map(([department, rooms]) => (
          <div key={department} className="mb-10">
            <h3 className="text-lg font-bold text-indigo-600 mb-4">{department}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white p-6 rounded-2xl shadow border text-center">
                  <h4 className="font-semibold text-gray-900 mb-3">{room.roomCode || room.name}</h4>
                  <div className="cursor-pointer flex justify-center" onClick={() => setSelectedRoom(room)}>
                    <QRCodeCanvas
                      id={`qr-${room.id}`}
                      value={JSON.stringify({
                        roomId: room.id,
                        roomCode: room.roomCode,
                        roomCapacity: room.roomCapacity,
                        roomDepartmentId: room.roomDepartmentId,
                        qrKey: "scanandknow-qr",
                      })}
                      size={160}
                    />
                  </div>
                  <div className="mt-4 flex justify-center gap-3">
                    <button
                      onClick={() => downloadQR(room.id, room.name)}
                      className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {selectedRoom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full relative">
              <h3 className="text-lg font-bold mb-6">{selectedRoom.roomCode || selectedRoom.name}</h3>
              <div className="flex justify-center">
                <QRCodeCanvas
                  value={JSON.stringify({
                    roomId: selectedRoom.id,
                    roomCode: selectedRoom.roomCode,
                    roomCapacity: selectedRoom.roomCapacity,
                    roomDepartmentId: selectedRoom.roomDepartmentId,
                    qrKey: "scanandknow-qr",
                  })}
                  size={280}
                />
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => downloadQR(selectedRoom.id, selectedRoom.name)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  Download
                </button>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    );
  }

  // ---------------- NORMAL USER VIEW (Scanner) ----------------
  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {!isScanning && !scanResult && (
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <Camera size={40} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to Scan?</h3>
          <p className="text-sm text-gray-500 mb-8">Point your camera at the QR code to start.</p>
          <button
            onClick={() => setIsScanning(true)}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl"
          >
            Start Scanning
          </button>
        </div>
      )}

      {isScanning && (
        <div className="w-full max-w-md mx-auto">
          <div id="reader" className="overflow-hidden rounded-2xl border-2 border-indigo-100"></div>
          <button
            onClick={() => setIsScanning(false)}
            className="w-full mt-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {scanResult && scanStatus && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              scanStatus === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}
          >
            {scanStatus === "success" ? <CheckCircle size={32} /> : <XCircle size={32} />}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {scanStatus === "success" ? "Scan Successful!" : "Invalid QR!"}
          </h3>
          <p className="text-sm text-gray-500 mb-8">{scanResult}</p>

          {scanStatus === "error" && (
            <button
              onClick={() => {
                setScanResult(null);
                setScanStatus(null);
              }}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl"
            >
              Scan Again
            </button>
          )}
        </motion.div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default QRScanner;