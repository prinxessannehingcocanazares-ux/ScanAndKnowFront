import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import getUserById from "../api/getUserByIdApi";


const Header = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [userDetails, setUserDetails] = useState(null);
      const [loading, setLoading] = useState(false);
    
  const { VITE_GETUSERBYID_ENDPOINT } = window.__ENV__ || {};
  
    useEffect(() => {
      if (!user?.id) return;
  
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await getUserById.post(
            `${VITE_GETUSERBYID_ENDPOINT}?id=${user.id}`
          );
          setUserDetails(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, [user]);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative hidden sm:block">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-all"
          >
            {userDetails?.profilePicture ? (
              <img
                src={userDetails?.profilePicture}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                {userDetails?.firstName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}

            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-gray-900 leading-none">
                {userDetails?.firstName}
              </p>
              <p className="text-[10px] text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                ></div>

                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20"
                >
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} />
                    View Profile
                  </Link>

                  <div className="h-px bg-gray-100 my-2"></div>

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;