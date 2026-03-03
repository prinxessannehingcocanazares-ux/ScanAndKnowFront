import React, { useState } from 'react';
import { Plus, MoreVertical, Clock, DoorOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { mockSchedules } from '../lib/mockData'; // replace with your actual data source

const Section = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm sm:text-base text-gray-500">Manage and view your teaching sections.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                {schedule.day}
              </span>
              <button className="p-2 text-gray-400 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={18} />
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{schedule.subject}</h3>
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                <Clock size={14} className="sm:size-4" />
                {schedule.time}
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                <DoorOpen size={14} className="sm:size-4" />
                {schedule.room}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Add New Schedule</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="e.g. Advanced Mathematics" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="e.g. Lab 101" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="e.g. 09:00 AM - 11:00 AM" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button type="button" onClick={() => setShowAdd(false)} className="w-full sm:flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm">
                    Cancel
                  </button>
                  <button type="submit" className="w-full sm:flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm">
                    Add Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Section;