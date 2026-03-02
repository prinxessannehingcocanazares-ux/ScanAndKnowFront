const Step1 = ({ formData, setFormData, setStep }) => {
  const { firstName, lastName, contactNumber, department, position } = formData;
  const canProceed =
    firstName && lastName && contactNumber && department && position;

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Step 1: Personal Info
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="w-full px-4 py-3 border rounded-xl"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="w-full px-4 py-3 border rounded-xl"
        />
      </div>

      <input
        type="text"
        placeholder="Contact Number"
        value={contactNumber}
        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
        className="w-full px-4 py-3 mt-4 border rounded-xl"
      />
      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        className="w-full px-4 py-3 mt-4 border rounded-xl"
      />
      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        className="w-full px-4 py-3 mt-4 border rounded-xl"
      />

      <button
        type="button"
        onClick={() => canProceed && setStep(2)}
        disabled={!canProceed}
        className={`w-full py-4 mt-4 rounded-xl font-bold transition-all ${
          canProceed
            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </>
  );
};

export default Step1;