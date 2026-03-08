import { useAuth } from "../../context/AuthContext";
import AdminQRView from "./AdminQRView";
import UserScannerView from "./UserScannerView";

const QRScanner = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminQRView />;
  }

  return <UserScannerView />;
};

export default QRScanner;