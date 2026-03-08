import React from "react";

const ProfileField = ({ label, name, value, onChange, isEditing, type = "text", options = [] }) => {
  if (!isEditing) return (
    <div className="space-y-1 sm:space-y-2">
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className="text-sm sm:text-base font-medium text-gray-900">{value}</p>
    </div>
  );

  if (type === "select") {
    return (
      <div className="space-y-1 sm:space-y-2">
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="">Select {label}</option>
          {options.map((item) => {
            if (name === "department") return (
              <option key={item.departmentId} value={item.departmentCollegeName}>
                {item.departmentCollegeName}
              </option>
            );
            if (name === "position") return (
              <option key={item.positionId} value={item.positionTitle}>
                {item.positionTitle}
              </option>
            );
            return null;
          })}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-1 sm:space-y-2">
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
    </div>
  );
};

export default ProfileField;