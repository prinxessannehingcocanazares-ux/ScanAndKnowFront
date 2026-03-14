import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion } from "framer-motion";

const UserScannerView = () => {
  const navigate = useNavigate();

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState(null);

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

            const today = new Date().toISOString().split("T")[0];

            if (data.qrKey?.toLowerCase() === "scanandknow-qr") {

              if (data.qrDate !== today) {
                setScanStatus("error");
                setScanResult("QR Code Expired");
                return;
              }

              setScanStatus("success");
              setScanResult("QR Valid");

              setTimeout(() => {
                navigate(`/qr-success`, {
                  state: { payload: data },
                });
              }, 1200);

            } else {
              setScanStatus("error");
              setScanResult("Invalid QR Code");
            }

          } catch {
            setScanStatus("error");
            setScanResult("Invalid QR Format");
          }
        },
        (error) => console.warn(error)
      );
    }

    return () => scanner?.clear().catch(console.error);
  }, [isScanning, navigate]);

  const handleScanAgain = () => {
    setScanResult(null);
    setScanStatus(null);
    setIsScanning(true);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">

      {/* Start Screen */}
      {!isScanning && !scanResult && (
        <div className="text-center">
          <Camera size={40} className="mx-auto mb-6 text-indigo-600" />
          <h3 className="text-lg font-bold mb-4">Ready to Scan?</h3>

          <button
            onClick={() => setIsScanning(true)}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold"
          >
            Start Scanning
          </button>
        </div>
      )}

      {/* Scanner */}
      {isScanning && <div id="reader" />}

      {/* Result */}
      {scanResult && scanStatus && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center mt-6"
        >
          {scanStatus === "success" ? (
            <CheckCircle className="text-green-500 mx-auto mb-4" size={40} />
          ) : (
            <XCircle className="text-red-500 mx-auto mb-4" size={40} />
          )}

          {/* MESSAGE */}
          <p
            className={`text-lg font-semibold mb-6 ${
              scanStatus === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {scanResult}
          </p>

          {/* Scan Again Button */}
          {scanStatus === "error" && (
            <button
              onClick={handleScanAgain}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
            >
              Scan Again
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default UserScannerView;