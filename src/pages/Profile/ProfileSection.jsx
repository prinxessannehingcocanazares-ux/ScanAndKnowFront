import React from "react";

const ProfileSection = ({ title, icon: Icon, children }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
        <Icon size={20} className="text-indigo-600" />
        {title}
      </h3>
      {children}
    </div>
  );
};

export default ProfileSection;