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

            if (data.qrKey?.toLowerCase() === "scanandknow-qr") {
              setScanStatus("success");
              setScanResult(decodedText);

              setTimeout(() => {
                navigate(`/qr-success/:roomId${data.roomId}`, {
                  state: { payload: data },
                });
              }, 1200);
            } else {
              setScanStatus("error");
              setScanResult(decodedText);
            }
          } catch {
            setScanStatus("error");
            setScanResult(decodedText);
          }
        },
        (error) => console.warn(error)
      );
    }

    return () => scanner?.clear().catch(console.error);
  }, [isScanning, navigate]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
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

      {isScanning && <div id="reader" />}

      {scanResult && scanStatus && (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
          {scanStatus === "success" ? (
            <CheckCircle className="text-green-500 mx-auto mb-4" size={32} />
          ) : (
            <XCircle className="text-red-500 mx-auto mb-4" size={32} />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default UserScannerView;