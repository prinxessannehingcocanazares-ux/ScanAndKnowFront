import React from "react";
import { Camera } from "lucide-react";

const ProfileHeader = ({ userDetails, formData, isEditing, onPhotoChange }) => {
  return (
    <div className="relative -mt-12 sm:-mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 text-center sm:text-left">
      <div className="relative mx-auto sm:mx-0">
        <img
          // Use formData first to show preview if exists
          src={formData?.profilePicture || userDetails?.profilePicture}
          alt="Profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-lg object-cover"
        />

        {isEditing && (
          <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2 bg-white rounded-xl shadow-md text-gray-600 hover:text-indigo-600 cursor-pointer">
            <Camera size={18} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoChange}
            />
          </label>
        )}
      </div>

      <div className="pb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {formData?.firstName || userDetails?.firstName}{" "}
          {formData?.lastName || userDetails?.lastName}
        </h2>
        <p className="text-sm sm:text-base text-gray-500 font-medium">
          {formData?.position || userDetails?.position} •{" "}
          {formData?.department || userDetails?.department}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;