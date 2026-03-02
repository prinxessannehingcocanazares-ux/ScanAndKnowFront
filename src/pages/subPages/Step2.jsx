import { useState } from "react";

const Step2 = ({ formData, setFormData, setStep }) => {
  const [preview, setPreview] = useState(
    formData.profileFile ? URL.createObjectURL(formData.profileFile) : null
  );

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

      <div className="relative w-full mb-4">
        {formData.profileFile && (
          <label className="absolute -top-3 left-3 text-xs text-gray-500 bg-white px-1">
            {formData.profileFile.name}
          </label>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`w-full px-4 py-3 border rounded-xl ${
            formData.profileFile ? "border-indigo-600" : "border-gray-300"
          }`}
        />
      </div>

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
          className="flex-1 py-4 rounded-xl font-bold transition-all bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-lg"
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