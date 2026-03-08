import React, { useState, useEffect } from "react";
import { DoorOpen, User, Edit2, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import getUserById from "../../api/getUserByIdApi";
import updateUser from "../../api/updateUser";
import { Snackbar, Alert } from "@mui/material";
import getDepartments from "../../api/getDepartments";
import getPositions from "../../api/getPositions";

import ProfileField from "./ProfileField";
import ProfileSection from "./ProfileSection";

const Profile = () => {
  const { user } = useAuth();
  const env = window.__ENV__ || {};
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [preview, setPreview] = useState(null);

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchDepartments();
    fetchPositions();
    fetchUser();
  }, [user]);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments.post(env.VITE_GETDEPARTMENTS_ENDPOINT);
      setDepartments(res.data || []);
    } catch (err) {
      showSnackbar("Error fetching departments: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await getPositions.post(env.VITE_GETPOSITIONS_ENDPOINT);
      setPositions(res.data || []);
    } catch (err) {
      showSnackbar("Error fetching positions: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const fetchUser = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await getUserById.post(`${env.VITE_GETUSERBYID_ENDPOINT}?id=${user.id}`);
      setUserDetails(res.data);
      setFormData({
        ...res.data,
        profilePicture: null,
        password: "",
      });
      setPreview(res.data.profilePicture || null);
    } catch (err) {
      showSnackbar("Failed to fetch user details.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files?.[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ---------------- CHECK IF CHANGED ----------------
  const hasChanges = () => {
    if (!userDetails) return false;
    return Object.keys(formData).some((key) => {
      if (key === "profilePicture") return formData.profilePicture !== null;
      if (key === "password") return formData.password?.trim() !== "";
      return formData[key] !== userDetails[key];
    });
  };

  // ---------------- UPDATE USER ----------------
  const handleSubmit = async () => {
  try {
    setLoading(true);
    const { VITE_UPDATEUSER_ENDPOINT } = window.__ENV__ || {};
    const endpointUrl = `${VITE_UPDATEUSER_ENDPOINT}?id=${user.id}`;

    const formToSend = new FormData();

    // ALWAYS send all fields from userDetails if empty in formData
    formToSend.append("id", user.id);
    formToSend.append("FirstName", formData.firstName || userDetails.firstName);
    formToSend.append("LastName", formData.lastName || userDetails.lastName);
    formToSend.append("Email", formData.email || userDetails.email);
    formToSend.append("ContactNumber", formData.contactNumber || userDetails.contactNumber);
    formToSend.append("Department", formData.department || userDetails.department);
    formToSend.append("Position", formData.position || userDetails.position);
    formToSend.append("UserName", formData.userName || userDetails.userName);

    if (formData.password?.trim()) formToSend.append("Password", formData.password);

    // File upload
    if (formData.profilePicture instanceof File) {
      formToSend.append("ProfilePicture", formData.profilePicture, formData.profilePicture.name);
    }

    const res = await updateUser.post(endpointUrl, formToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setUserDetails(res.data);
    setIsEditing(false);
    setPreview(res.data.profilePicture || null);
    showSnackbar("Profile updated successfully!");
    setFormData((prev) => ({ ...prev, password: "" }));
  } catch (err) {
    console.error("Update API error:", err);
    showSnackbar(
      "Failed to update profile: " + (err.response?.data?.message || err.message),
      "error"
    );
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setFormData({ ...userDetails, profilePicture: null, password: "" });
    setPreview(userDetails?.profilePicture || null);
    setIsEditing(false);
  };

  if (!userDetails) return null;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* PROFILE HEADER */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
        <div className="px-4 sm:px-8 pb-8 flex flex-col">
          <div className="relative -mt-12 sm:-mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 text-center sm:text-left">
            <div className="relative mx-auto sm:mx-0">
              <img
                src={preview || "/default-profile.png"}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-lg object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2 bg-white rounded-xl shadow-md text-gray-600 hover:text-indigo-600 cursor-pointer">
                  <Camera size={18} />
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="pb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {formData.firstName || userDetails.firstName} {formData.lastName || userDetails.lastName}
              </h2>
              <p className="text-sm sm:text-base text-gray-500 font-medium">
                {formData.position || userDetails.position} • {formData.department || userDetails.department}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <ProfileSection title="Personal Details" icon={User}>
              <ProfileField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} isEditing={isEditing} />
              <ProfileField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} isEditing={isEditing} />
              <ProfileField label="Email Address" name="email" value={formData.email} onChange={handleChange} isEditing={isEditing} />
              <ProfileField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} isEditing={isEditing} />
            </ProfileSection>

            <ProfileSection title="Work Information" icon={DoorOpen}>
              <ProfileField label="Department" name="department" value={formData.department} onChange={handleChange} isEditing={isEditing} type="select" options={departments} />
              <ProfileField label="Position" name="position" value={formData.position} onChange={handleChange} isEditing={isEditing} type="select" options={positions} />
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-500">Role</p>
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">{user?.role}</span>
              </div>
            </ProfileSection>
          </div>

          <div className="mt-8 flex justify-center sm:justify-end gap-3">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !hasChanges()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100">
                <Edit2 size={18} /> Update Information
              </button>
            )}
          </div>
        </div>
      </div>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;