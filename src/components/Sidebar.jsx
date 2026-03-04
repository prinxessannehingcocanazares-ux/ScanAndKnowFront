import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Calendar,
  DoorOpen,
  ClipboardCheck,
  QrCode,
  FileText,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import getUserById from "../api/getUserByIdApi";
import cn from "../utility/cn";
import { Snackbar, Alert } from "@mui/material";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { VITE_GETUSERBYID_ENDPOINT } = window.__ENV__ || {};

  useEffect(() => {
    if (!user?.id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserById.post(
          `${VITE_GETUSERBYID_ENDPOINT}?id=${user.id}`,
        );
        setUserDetails(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch user details.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user?.id]);

  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: DoorOpen, label: "Rooms", path: "/rooms" },
    { icon: ClipboardCheck, label: "Attendance", path: "/attendance" },
    { icon: QrCode, label: "QR Scanner", path: "/qr-scanner" },
    // { icon: FileText, label: "Teacher Reports", path: "/reports" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2"
            onClick={onClose}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <QrCode size={18} />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Scan And Know
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-gray-600",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 mb-4">
            <img
              src={userDetails?.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-indigo-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userDetails?.firstName}
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userDetails?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MUI Snackbar Alert */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Sidebar;
