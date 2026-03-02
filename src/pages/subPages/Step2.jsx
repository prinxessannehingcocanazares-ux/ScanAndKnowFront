import { useState, useEffect } from "react";

const Step2 = ({ formData, setFormData, setStep }) => {
  const [preview, setPreview] = useState(formData.profileFile ? URL.createObjectURL(formData.profileFile) : null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setPreview(URL.createObjectURL(selectedFile));
    setFormData({ ...formData, profileFile: selectedFile });
  };

  const canProceed = !!formData.profileFile;

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Step 2: Upload Profile Picture
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full px-4 py-3 border rounded-xl mb-4"
      />

      {preview && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          <img
            src={preview}
            alt="Profile Preview"
            className="mx-auto w-32 h-32 object-cover rounded-full border"
          />
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
        >
          Back
        </button>

        <button
          type="button"
          onClick={() => canProceed && setStep(3)}
          disabled={!canProceed}
          className={`flex-1 py-4 rounded-xl font-bold transition-all ${
            canProceed
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Step2;