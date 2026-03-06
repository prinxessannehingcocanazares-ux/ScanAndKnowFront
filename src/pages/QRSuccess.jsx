// src/pages/RoomPayload.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RoomPayload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const payload = location.state?.payload;

  // Redirect back to scanner if no payload
  useEffect(() => {
    if (!payload) {
      navigate("/scan", { replace: true });
    }
  }, [payload, navigate]);

  if (!payload) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">QR Scan Payload</h2>

      <div className="bg-gray-50 p-6 rounded-xl shadow border overflow-x-auto">
        <pre className="text-sm text-gray-800">{JSON.stringify(payload, null, 2)}</pre>
      </div>

      <button
        onClick={() => navigate("/qr-scanner")}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
      >
        Scan Another QR
      </button>
    </div>
  );
};

export default RoomPayload;