// 👇 import area stays the same
import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  useMediaQuery,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Slider,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import userIcon from "../../../assets/images/user.png";
import request from "../../../assets/images/request.png";
import Switch from "@mui/material/Switch";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNotifier } from "../../../components/Notification/Notifications"; 

const BloodRequestForm = ({
  title,
  openModel,
  handleCloseDialog,
  handleFormSubmit,
  data,
}) => {
  const isMobile = useMediaQuery("(max-width:960px)");
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const { notifySuccess } = useNotifier();

  const [formValues, setFormValues] = useState({
    requesterName: "",
    requesterType: "",
    patientOrHospitalId: "",
    bloodGroup: [],
    quantity: 1, // ✅ Start from 1, not 0
    reason: "",
    emergencyLevel: "Normal", 
    requestDate: today,
   
  });

  const [formErrors, setFormErrors] = useState({});

  // ✅ Sync form values from data (on edit mode)
  useEffect(() => {
    if (data) {
      setFormValues({ ...data });
    } else {
      setFormValues({
        requesterName: "",
        requesterType: "",
        patientOrHospitalId: "",
        bloodGroup: [],
        quantity: 1,
        reason: "",
        emergencyLevel: "Normal",
        requestDate: today,
       
      });
    }
  }, [data, openModel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "bloodGroup") {
      const updated = checked
        ? [...formValues.bloodGroup, value]
        : formValues.bloodGroup.filter((g) => g !== value);
      setFormValues({ ...formValues, bloodGroup: updated });
    } else {
      setFormValues({
        ...formValues,
        [name]: type === "number" ? Number(value) : value,
      });
    }
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.requesterName) errors.requesterName = "Required";
    if (!formValues.requesterType) errors.requesterType = "Required";
    if (
      formValues.requesterType === "Hospital" &&
      !formValues.patientOrHospitalId
    )
      errors.patientOrHospitalId = "Hospital ID is required";
    if (formValues.bloodGroup.length === 0)
      errors.bloodGroup = "Select at least one blood group";
    if (!formValues.quantity || formValues.quantity < 1)
      errors.quantity = "Must be greater than 0";
    if (!formValues.reason) errors.reason = "Required";
    if (!formValues.emergencyLevel) errors.emergencyLevel = "Required";
   

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    handleFormSubmit(formValues); // 🔁 Send to parent
    notifySuccess(
      data ? "Request updated successfully" : "Request created successfully"
    );
    handleCloseDialog(); // optional: close modal after submit
  };

  const captureAndScan = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setScanning(true);
      try {
        const result = await Tesseract.recognize(imageSrc, "eng");
        const extractedId = result.data.text.match(/IT \d{2} \d{4} \d{2}/);
        if (extractedId) {
          setFormValues((prev) => ({
            ...prev,
            patientOrHospitalId: extractedId[0],
          }));
        } else {
          alert("Valid Hospital ID not detected. Please try again.");
        }
      } catch (error) {
        console.error("Tesseract error:", error);
      } finally {
        setScanning(false);
      }
    }
  };

  return (
    <>
      <Dialog
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
        open={openModel}
        onClose={handleCloseDialog}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "20px",
            background: "linear-gradient(to right, #d68a8a, #a31d1d)",
            color: "white",
          }}
        >
          {title}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FieldHeader title="Requester Name" imgSrc={userIcon} />
                <TextField
                  name="requesterName"
                  fullWidth
                  size="small"
                  value={formValues.requesterName}
                  onChange={handleChange}
                  error={!!formErrors.requesterName}
                  helperText={formErrors.requesterName}
                />
              </Grid>

              <Grid item xs={12}>
                <FieldHeader title="Requester Type" imgSrc={request} />
                <RadioGroup
                  row
                  name="requesterType"
                  value={formValues.requesterType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Patient"
                    control={<Radio />}
                    label="Patient"
                  />
                  <FormControlLabel
                    value="Hospital"
                    control={<Radio />}
                    label="Hospital"
                  />
                </RadioGroup>
                {formErrors.requesterType && (
                  <Typography color="error" fontSize={12}>
                    {formErrors.requesterType}
                  </Typography>
                )}
              </Grid>

              {formValues.requesterType === "Hospital" && (
                <>
                  <Grid item xs={6}>
                    <FieldHeader title="Hospital ID" imgSrc={userIcon} />
                    <TextField
                      name="patientOrHospitalId"
                      fullWidth
                      size="small"
                      value={formValues.patientOrHospitalId}
                      onChange={handleChange}
                      error={!!formErrors.patientOrHospitalId}
                      helperText={formErrors.patientOrHospitalId}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontSize={16} fontWeight={600}>
                      Scan ID
                    </Typography>
                    <Button
                      onClick={() => setScanning(true)}
                      fullWidth
                      variant="contained"
                      startIcon={<CameraAltIcon />}
                    >
                      Open Camera
                    </Button>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <FieldHeader title="Blood Group" imgSrc={userIcon} />
                {["A+", "A-", "B+", "B-", "AB+", "O+", "O-"].map((group) => (
                  <FormControlLabel
                    key={group}
                    control={
                      <Checkbox
                        value={group}
                        name="bloodGroup"
                        checked={formValues.bloodGroup.includes(group)}
                        onChange={handleChange}
                        sx={{
                          color: "#a31d1d",
                          "&.Mui-checked": { color: "#a31d1d" },
                        }}
                      />
                    }
                    label={group}
                  />
                ))}
                {formErrors.bloodGroup && (
                  <Typography color="error" fontSize={12}>
                    {formErrors.bloodGroup}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <FieldHeader title="Quantity" imgSrc={userIcon} />
                <Slider
                  name="quantity"
                  value={formValues.quantity}
                  onChange={(e, value) =>
                    setFormValues({ ...formValues, quantity: value })
                  }
                  min={0}
                  max={1000}
                  valueLabelDisplay="auto"
                  sx={{
                    height: 10,
                    "& .MuiSlider-track": {
                      background:
                        "linear-gradient(to right,rgb(244, 184, 184),rgb(235, 0, 0))", // red gradient
                      border: "none",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "#333",
                    },
                    "& .MuiSlider-thumb": {
                      width: 24,
                      height: 24,
                      backgroundColor: "#fff",
                      border: "2px solid #00bfff",
                    },
                  }}
                />
                {formErrors.quantity && (
                  <Typography color="error" fontSize={12}>
                    {formErrors.quantity}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <FieldHeader title="Reason" imgSrc={userIcon} />
                <TextField
                  name="reason"
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  value={formValues.reason}
                  onChange={handleChange}
                  error={!!formErrors.reason}
                  helperText={formErrors.reason}
                />
              </Grid>

              <Grid item xs={12}>
                <FieldHeader title="Emergency Level" imgSrc={userIcon} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.emergencyLevel === "Emergency"}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          emergencyLevel: e.target.checked
                            ? "Emergency"
                            : "Normal",
                        })
                      }
                      color="error"
                    />
                  }
                  label={
                    formValues.emergencyLevel === "Emergency" ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <WarningAmberIcon color="error" fontSize="small" />
                        <Typography color="error">Emergency</Typography>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon color="success" fontSize="small" />
                        <Typography color="green">Normal</Typography>
                      </Box>
                    )
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FieldHeader title="Request Date" imgSrc={userIcon} />
                <TextField
                  name="requestDate"
                  type="date"
                  fullWidth
                  size="small"
                  value={formValues.requestDate}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 4, pb: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {data ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Webcam Dialog */}
      {scanning && (
        <Dialog open={scanning} onClose={() => setScanning(false)}>
          <DialogTitle>Scan ID Card</DialogTitle>
          <DialogContent>
            <Webcam ref={webcamRef} screenshotFormat="image/png" width="100%" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScanning(false)}>Cancel</Button>
            <Button onClick={captureAndScan} variant="contained">
              Capture
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default React.memo(BloodRequestForm);

const FieldHeader = ({ title, imgSrc }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    {imgSrc && (
      <img src={imgSrc} alt={title} style={{ width: "24px", height: "24px" }} />
    )}
    <Typography sx={{ fontSize: "14px", fontWeight: 500, ml: 1 }}>
      {title}
    </Typography>
  </Box>
);
