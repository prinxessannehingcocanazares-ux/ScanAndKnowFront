import React from "react";
import { motion } from "framer-motion";

const AddScheduleModal = ({ formData, setFormData, handleSubmit, setShowAdd }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowAdd(false)}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        <h3 className="text-xl font-bold mb-6">Add New Schedule</h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Subject Name"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
            </select>

            {/* Removed Room Selection */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
            />
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.repeatWeekly}
              onChange={(e) =>
                setFormData({ ...formData, repeatWeekly: e.target.checked })
              }
              id="repeatWeekly"
            />
            <label htmlFor="repeatWeekly" className="text-sm font-medium">
              Repeat Weekly
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
          >
            Add Schedule
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddScheduleModal;