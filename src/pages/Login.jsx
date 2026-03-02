import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import { TextField, Button, IconButton, InputAdornment, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import signUpApi from "../api/loginApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { VITE_LOGIN_ENDPOINT } = window.__ENV__ || {};
    const endpointUrl = VITE_LOGIN_ENDPOINT;

    try {
      setLoading(true);
      const response = await signUpApi.post(endpointUrl, formData);

      if (response.data.status) {
        login();
        navigate("/dashboard");
      } else {
        alert("Login failed: " + (response.data.message || "Invalid credentials"));
      }
    } catch (err) {
      console.error(err);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const emailValid =
  !!formData.email &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

const canLogin = formData.userName && formData.password && emailValid;

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f9fafb"
      p={2}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: 400,
          width: "100%",
          padding: 32,
          background: "#fff",
          borderRadius: 32,
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Box
            width={64}
            height={64}
            bgcolor="primary.main"
            borderRadius={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            mb={2}
          >
            <QrCode size={32} color="white" />
          </Box>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ color: "#6b7280", marginTop: 8 }}>
            Login to manage your workspace
          </p>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="User Name"
            variant="outlined"
            fullWidth
            value={formData.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
            margin="normal"
            required
          />

          <TextField
            label="Email Address"
            variant="outlined"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            margin="normal"
            required
            error={!!formData.email && !emailValid}
            helperText={
              !!formData.email && !emailValid
                ? "Please enter a valid email address"
                : ""
            }
          />

          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!canLogin || loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              color="inherit"
              fullWidth
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </Box>
        </form>

        <p style={{ textAlign: "center", marginTop: 16, color: "#6b7280" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#6366f1", fontWeight: "bold" }}>
            Sign Up
          </Link>
        </p>
      </motion.div>
    </Box>
  );
};

export default Login;