import { useState, useEffect } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
const [scanResult, setScanResult] = useState(null);
  useEffect(() => {
let scanner = null;
    if (isScanning) {
      // Make sure the div with id="reader" exists before initializing
      scanner = new Html5QrcodeScanner(
        'reader', // id of the div in JSX
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          setIsScanning(false);
          scanner?.clear();
        },
        (error) => console.warn('QR scan error:', error)
      );
    }

    return () => {
      if (scanner) scanner.clear().catch(console.error);
    };
  }, [isScanning]);

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {!isScanning && !scanResult && (
        <div className="text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <Camera size={40} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Ready to Scan?</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-sm mx-auto">
            Point your camera at the QR code to start.
          </p>
          <button
            onClick={() => setIsScanning(true)}
            className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            Start Scanning
          </button>
        </div>
      )}

      {isScanning && (
        <div className="w-full max-w-md mx-auto">
          <div
            id="reader" // THIS id must match the one passed to Html5QrcodeScanner
            className="overflow-hidden rounded-2xl border-2 border-indigo-100"
          ></div>
          <button
            onClick={() => setIsScanning(false)}
            className="w-full mt-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {scanResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Scan Successful!</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-8">{scanResult}</p>
          <button
            onClick={() => setScanResult(null)}
            className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            Scan Another
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default QRScanner;