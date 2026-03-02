import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react"; // make sure lucide-react is installed

const Step3 = ({ formData, setFormData, setStep, handleSubmit }) => {
  const { password, confirmPassword, email, userName } = formData;
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!password || !confirmPassword) {
      setCanSubmit(false);
      setError("");
    } else if (password !== confirmPassword) {
      setCanSubmit(false);
      setError("Passwords do not match");
    } else {
      setCanSubmit(true);
      setError("");
    }
  }, [password, confirmPassword]);

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Step 3: Password
      </h2>

         {/* userName Field */}
        <input
        type="text"
        placeholder="User Name"
        value={userName || ""}
        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
        className="w-full px-4 py-3 border rounded-xl mb-4"
      />

       {/* Email Field */}
      <input
        type="email"
        placeholder="University Email"
        value={email || ""}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full px-4 py-3 border rounded-xl mb-4"
      />

      {/* Password Field */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password || ""}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full px-4 py-3 border rounded-xl mb-4 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Confirm Password Field */}
      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword || ""}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className="w-full px-4 py-3 border rounded-xl mb-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex-1 py-4 rounded-xl font-bold transition-all ${
            canSubmit
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Create Account
        </button>
      </div>
    </>
  );
};

export default Step3;