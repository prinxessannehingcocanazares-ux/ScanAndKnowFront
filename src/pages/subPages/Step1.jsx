import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const Step1 = ({ formData, setFormData, setStep }) => {
  const { firstName, lastName, contactNumber, department, position } = formData;
  const canProceed =
    firstName && lastName && contactNumber && department && position;

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Step 1: Personal Info
      </h2>

      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            value={firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            value={lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </Stack>

        <TextField
          label="Contact Number"
          variant="outlined"
          fullWidth
          value={contactNumber}
          onChange={(e) =>
            setFormData({ ...formData, contactNumber: e.target.value })
          }
          type="text" // keep as text for better control
          inputProps={{
            inputMode: "numeric", // mobile devices show numeric keyboard
            pattern: "[0-9]*", // numeric only pattern
          }}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, ""); // remove non-numeric chars
          }}
        />
        <TextField
          label="Department"
          variant="outlined"
          fullWidth
          value={department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
        />
        <TextField
          label="Position"
          variant="outlined"
          fullWidth
          value={position}
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!canProceed}
          onClick={() => canProceed && setStep(2)}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            mt: 2,
          }}
        >
          Next
        </Button>
      </Stack>
    </>
  );
};

export default Step1;