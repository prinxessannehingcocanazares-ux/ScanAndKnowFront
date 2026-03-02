import React, { useState } from 'react';
import { DoorOpen, User, Camera, Edit2 } from 'lucide-react';
import {mockUser} from '../lib/mockData'; // adjust path if needed

const Profile = () => {
  const user  = mockUser;
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    contactNumber: user?.contactNumber || '',
    department: user?.department || '',
    position: user?.position || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle form submission
    console.log('Updated profile:', formData);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
        <div className="px-4 sm:px-8 pb-8">
          <div className="relative -mt-12 sm:-mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 text-center sm:text-left">
            <div className="relative mx-auto sm:mx-0">
              <img 
                src={user?.profilePicture} 
                alt="Profile" 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-lg object-cover"
              />
              <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-white rounded-xl shadow-md text-gray-600 hover:text-indigo-600 transition-all">
                <Camera size={16} className="sm:size-[18px]" />
              </button>
            </div>
            <div className="pb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-sm sm:text-base text-gray-500 font-medium">{user?.position} • {user?.department}</p>
            </div>
          </div>

          {/* Personal & Work Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                <User size={18} className="text-indigo-600 sm:size-5" />
                Personal Details
              </h3>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                <p className="text-sm sm:text-base font-medium text-gray-900">{user?.fullName}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-500">Email Address</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{user?.email}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-500">Contact Number</p>
                <p className="text-sm sm:text-base font-medium text-gray-900">{user?.contactNumber}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                <DoorOpen size={18} className="text-indigo-600 sm:size-5" />
                Work Information
              </h3>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-500">Department</p>
                <p className="text-sm sm:text-base font-medium text-gray-900">{user?.department}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-500">Position</p>
                <p className="text-sm sm:text-base font-medium text-gray-900">{user?.position}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-500">Role</p>
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Edit2 size={18} className="text-indigo-600 sm:size-5" />
          Edit Profile
        </h3>
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Full Name */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Full Name</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            {/* Email */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            {/* Contact Number */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Contact Number</label>
              <input 
                type="text" 
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                className="w-full px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            {/* Department */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Department</label>
              <input 
                type="text" 
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            {/* Position */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Position</label>
              <input 
                type="text" 
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            {/* Profile Picture Upload */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">Profile Picture</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                <div className="flex-1 px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-xs sm:text-sm">
                  Choose new image...
                </div>
                <button type="button" className="px-4 py-2 sm:py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm">
                  Upload
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end pt-4">
            <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;