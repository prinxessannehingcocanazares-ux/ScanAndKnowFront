import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Step1 from "./subPages/Step1";
import Step2 from "./subPages/Step2";
import Step3 from "./subPages/Step3";
import signUpApi from "../api/signUpApi";
import getDepartments from "../api/getDepartments";
import getPositions from "../api/getPositions";
import { Snackbar, Alert } from "@mui/material";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { VITE_GETDEPARTMENTS_ENDPOINT } = window.__ENV__ || {};
        const response = await getDepartments.post(
          VITE_GETDEPARTMENTS_ENDPOINT,
        );
        setDepartments(response.data);
      } catch (error) {
        setSnackbarMessage(
          "Error fetching departments: " +
            (error.response?.data?.message || error.message),
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { VITE_GETPOSITIONS_ENDPOINT } = window.__ENV__ || {};
        const response = await getPositions.post(VITE_GETPOSITIONS_ENDPOINT);
        setPositions(response.data);
      } catch (error) {
        setSnackbarMessage(
          "Error fetching positions: " +
            (error.response?.data?.message || error.message),
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchPositions();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    department: "",
    position: "",
    profilePicture: "",
    password: "",
    userName: "",
  });

  const handleSubmit = async () => {
    const { VITE_SIGNUP_ENDPOINT } = window.__ENV__ || {};
    const endpointUrl = VITE_SIGNUP_ENDPOINT;

    try {
      const formToSend = new FormData();
      formToSend.append("firstName", formData.firstName);
      formToSend.append("lastName", formData.lastName);
      formToSend.append("contactNumber", formData.contactNumber);
      formToSend.append("department", formData.department);
      formToSend.append("position", formData.position);
      formToSend.append("userName", formData.userName);
      formToSend.append("email", formData.email);
      formToSend.append("password", formData.password);
      formToSend.append("profilePicture", formData.profileFile); // <-- File object from Step2

      const response = await signUpApi.post(endpointUrl, formToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.status) {
        alert("Signup successful!");
        setSnackbarMessage("Signup successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        navigate("/login");
      } else {
        alert("Signup failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      setSnackbarMessage(
        "API error: " + (error.response?.data?.message || error.message),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100"
      >
        {step === 1 && (
          <Step1
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
            departments={departments}
            positions={positions}
          />
        )}
        {step === 2 && (
          <Step2
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
          />
        )}
        {step === 3 && (
          <Step3
            formData={formData}
            setFormData={setFormData}
            setStep={setStep} // ← Add this
            handleSubmit={handleSubmit}
          />
        )}

        {/* Cancel button always visible */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all mt-4"
        >
          Cancel
        </button>

        {/* Login link */}
        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
