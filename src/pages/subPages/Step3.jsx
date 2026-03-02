import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Step3 = ({ formData, setFormData, setStep, handleSubmit }) => {
  const { password, confirmPassword, email, userName } = formData;
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

 useEffect(() => {
  const emailValid = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsFilled = password && confirmPassword;
  const passwordsMatch = password === confirmPassword;

  if (!passwordsFilled) {
    setCanSubmit(false);
    setError("");
  } else if (!passwordsMatch) {
    setCanSubmit(false);
    setError("Passwords do not match");
  } else if (!emailValid) {
    setCanSubmit(false);
    setError("Please enter a valid email address");
  } else {
    setCanSubmit(true);
    setError("");
  }
}, [password, confirmPassword, email]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      await handleSubmit();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Step 3: Account Info
      </h2>

      <Stack spacing={2}>
        <TextField
          label="User Name"
          variant="outlined"
          fullWidth
          value={userName || ""}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
        />
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          type="email"
          value={email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={!!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
          helperText={
            !!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
              ? "Please enter a valid email address"
              : ""
          }
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type={showPassword ? "text" : "password"}
          value={password || ""}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={!!error && password !== confirmPassword}
          helperText={password !== confirmPassword ? error : ""}
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
        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          type={showConfirm ? "text" : "password"}
          value={confirmPassword || ""}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          error={!!error && password !== confirmPassword}
          helperText={password !== confirmPassword ? error : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirm(!showConfirm)}
                  edge="end"
                >
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setStep(2)}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!canSubmit || loading}
            onClick={onSubmit}
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default Step3;