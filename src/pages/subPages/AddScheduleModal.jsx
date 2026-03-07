import React, { useState } from "react";
import { motion } from "framer-motion";

const AddScheduleModal = ({ formData, setFormData, handleSubmit, setShowAdd, setSnackbar }) => {
  const [loading, setLoading] = useState(false);

  // Wrapped submit to handle loading state + validation
  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate subject
    if (!formData.subject || formData.subject.trim() === "") {
      setSnackbar?.({
        open: true,
        message: "Please enter a subject",
        severity: "warning",
      });
      return;
    }

    // Validate date
    if (!formData.day) {
      setSnackbar?.({
        open: true,
        message: "Please select a date",
        severity: "warning",
      });
      return;
    }

    // Validate time
    if (!formData.startTime || !formData.endTime) {
      setSnackbar?.({
        open: true,
        message: "Please select start and end times",
        severity: "warning",
      });
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setSnackbar?.({
        open: true,
        message: "Start time must be before end time",
        severity: "warning",
      });
      return;
    }

    // Everything is valid, proceed to submit
    setLoading(true);
    try {
      await handleSubmit(e);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

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

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Subject Name"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
            />
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

          <div className="flex items-center gap-4 mt-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.repeatDaily}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    repeatDaily: e.target.checked,
                    repeatWeekly: e.target.checked ? false : prev.repeatWeekly,
                  }))
                }
              />
              Repeat Daily
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.repeatWeekly}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    repeatWeekly: e.target.checked,
                    repeatDaily: e.target.checked ? false : prev.repeatDaily,
                  }))
                }
              />
              Repeat Weekly
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
            disabled={loading}
          >
            {loading ? "Adding Schedule..." : "Add Schedule"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddScheduleModal;