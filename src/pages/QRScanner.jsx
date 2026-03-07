import { useAuth } from "../context/AuthContext";
import AdminQRView from "../pages/subPages/AdminQRView";
import UserScannerView from "../pages/subPages/UserScannerView";

const QRScanner = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminQRView />;
  }

  return <UserScannerView />;
};

export default QRScanner;