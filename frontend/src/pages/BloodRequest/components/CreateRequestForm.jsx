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
  Backdrop,
  Paper,
  Grow,
  IconButton,
  Fade,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import OpacityIcon from "@mui/icons-material/Opacity";
import MedicationIcon from "@mui/icons-material/Medication";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EventIcon from "@mui/icons-material/Event";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import { useNotifier } from "../../../components/Notification/Notifications";
import { Chip, Select, MenuItem, InputAdornment } from '@mui/material';

// MUI Icons
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';


// Custom styled components
const BloodBagContainer = styled(Paper)(({ theme, emergency = false }) => ({
  position: "relative",
  width: "100%",
  minHeight: "650px",
  borderRadius: "16px 16px 80px 80px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  background: emergency
    ? "linear-gradient(to bottom, #ffebee 0%, #ffcdd2 20%, #ef9a9a 50%, #e57373 80%, #f44336 100%)"
    : "linear-gradient(to bottom, #ffebee 0%, #ffcdd2 20%, #ef9a9a 50%, #e57373 80%, #ef5350 100%)",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "20px",
    background: "#e53935",
    borderRadius: "16px 16px 0 0",
  },
  transition: "all 0.5s ease-in-out",
}));

const BloodDroplet = styled("div")(({ theme, delay = 0 }) => ({
  position: "absolute",
  width: "15px",
  height: "15px",
  background: "#f44336",
  borderRadius: "0 50% 50% 50%",
  transform: "rotate(45deg)",
  animation: `droplet 10s infinite ${delay}s`,
  opacity: 0,
  "@keyframes droplet": {
    "0%": { top: "-20px", opacity: 1 },
    "80%": { opacity: 1 },
    "100%": { top: "calc(100% - 20px)", opacity: 0 },
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 5,
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "12px",
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(5px)",
  transition: "transform 0.3s ease, opacity 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
  },
}));

const BloodGroupButton = styled(Button)(({ theme, selected }) => ({
  minWidth: "50px",
  height: "50px",
  margin: theme.spacing(0.5),
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  color: selected ? "#fff" : "#f44336",
  backgroundColor: selected ? "#f44336" : "#fff",
  border: `2px solid ${selected ? "#d32f2f" : "#f44336"}`,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: selected ? "#d32f2f" : "#ffcdd2",
    transform: "scale(1.1)",
  },
}));

const PulsatingIcon = styled(Box)(({ theme }) => ({
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(244, 67, 54, 0.7)",
    },
    "70%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 10px rgba(244, 67, 54, 0)",
    },
    "100%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(244, 67, 54, 0)",
    },
  },
}));

const AnimatedBloodRequestForm = ({
  title = "Blood Request Form",
  openModel,
  handleCloseDialog,
  handleFormSubmit,
  data,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const { notifySuccess } = useNotifier();
  const [activeStep, setActiveStep] = useState(0);
  const [droplets, setDroplets] = useState([]);
  const [formAnimation, setFormAnimation] = useState(false);

  const [formValues, setFormValues] = useState({
    requesterName: "",
    requesterType: "",
    patientOrHospitalId: "",
    bloodGroup: [],
    quantity: 1,
    reason: "",
    emergencyLevel: "Normal",
    requestDate: today,
  });

  const [formErrors, setFormErrors] = useState({});

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

    // Generate random blood droplets
    if (openModel) {
      const newDroplets = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 90}%`,
        delay: Math.random() * 5,
      }));
      setDroplets(newDroplets);

      // Trigger form animation
      setTimeout(() => {
        setFormAnimation(true);
      }, 300);
    } else {
      setFormAnimation(false);
      setActiveStep(0);
    }
  }, [data, openModel, today]);

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

    // Add success animation
    setFormAnimation(false);

    setTimeout(() => {
      handleFormSubmit(formValues);
      notifySuccess(
        data ? "Request updated successfully" : "Request created successfully"
      );
      handleCloseDialog();
    }, 500);
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleBloodGroupToggle = (group) => {
    const updated = formValues.bloodGroup.includes(group)
      ? formValues.bloodGroup.filter((g) => g !== group)
      : [...formValues.bloodGroup, group];

    setFormValues({ ...formValues, bloodGroup: updated });
    setFormErrors({ ...formErrors, bloodGroup: "" });
  };

  const steps = [
    {
      label: "Requester Information",
      icon: <PersonIcon />,
      content: (
        <Grow in={activeStep === 0} timeout={500}>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="requesterName"
                  label="Requester Name"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <PersonIcon
                        sx={{ mr: 1, color: "rgba(0, 0, 0, 0.54)" }}
                      />
                    ),
                  }}
                  value={formValues.requesterName}
                  onChange={handleChange}
                  error={!!formErrors.requesterName}
                  helperText={formErrors.requesterName}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                  Requester Type
                </Typography>
                <RadioGroup
                  row
                  name="requesterType"
                  value={formValues.requesterType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Patient"
                    control={
                      <Radio
                        sx={{
                          color: "#f44336",
                          "&.Mui-checked": { color: "#f44336" },
                        }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        <PersonIcon sx={{ mr: 0.5 }} />
                        Patient
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="Hospital"
                    control={
                      <Radio
                        sx={{
                          color: "#f44336",
                          "&.Mui-checked": { color: "#f44336" },
                        }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        <LocalHospitalIcon sx={{ mr: 0.5 }} />
                        Hospital
                      </Box>
                    }
                  />
                </RadioGroup>
                {formErrors.requesterType && (
                  <Typography color="error" fontSize={12} mt={1}>
                    {formErrors.requesterType}
                  </Typography>
                )}
              </Grid>

              {formValues.requesterType === "Hospital" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="patientOrHospitalId"
                      label="Hospital ID"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <LocalHospitalIcon
                            sx={{ mr: 1, color: "rgba(0, 0, 0, 0.54)" }}
                          />
                        ),
                      }}
                      value={formValues.patientOrHospitalId}
                      onChange={handleChange}
                      error={!!formErrors.patientOrHospitalId}
                      helperText={formErrors.patientOrHospitalId}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      onClick={() => setScanning(true)}
                      fullWidth
                      variant="contained"
                      startIcon={<CameraAltIcon />}
                      sx={{
                        mt: { xs: 0, sm: 2 },
                        background:
                          "linear-gradient(45deg, #f44336 30%, #ff9800 90%)",
                        color: "white",
                        textTransform: "none",
                        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                        height: 56,
                      }}
                    >
                      Scan ID Card
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Grow>
      ),
    },
    {
      label: "Blood Requirements",
      icon: <OpacityIcon />,
      content: (
        <Grow in={activeStep === 1} timeout={500}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {/* Blood Group Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                  Blood Group
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <BloodGroupButton
                        key={group}
                        selected={formValues.bloodGroup.includes(group)}
                        onClick={() => handleBloodGroupToggle(group)}
                        sx={{
                          transition: "all 0.3s ease",
                          transform: formValues.bloodGroup.includes(group)
                            ? "scale(1.05)"
                            : "scale(1)",
                          boxShadow: formValues.bloodGroup.includes(group)
                            ? "0 4px 12px rgba(244, 67, 54, 0.5)"
                            : "none",
                        }}
                      >
                        {group}
                      </BloodGroupButton>
                    )
                  )}
                </Box>
                {formErrors.bloodGroup && (
                  <Typography
                    color="error"
                    fontSize={12}
                    mt={1}
                    textAlign="center"
                  >
                    {formErrors.bloodGroup}
                  </Typography>
                )}
              </Grid>

              {/* Quantity Slider Section */}
              <Grid item xs={12}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: "linear-gradient(145deg, #fafafa, #f5f5f5)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    mb={2}
                    sx={{
                      textAlign: "center",
                      color: "#d32f2f",
                      textShadow: "0px 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    Quantity (Units)
                  </Typography>

                  {/* Improved slider container with proper styling */}
                  <Box sx={{ mb: 3 }}>
                    <Slider
                      name="quantity"
                      value={formValues.quantity}
                      onChange={(e, value) =>
                        setFormValues({ ...formValues, quantity: value })
                      }
                      min={1}
                      max={10}
                      step={1}
                      marks={[...Array(10)].map((_, i) => ({
                        value: i + 1,
                        label: "",
                      }))}
                      valueLabelDisplay="on"
                      aria-labelledby="quantity-slider"
                      sx={{
                        height: 10,
                        width: "100%",
                        "& .MuiSlider-thumb": {
                          height: 28,
                          width: 28,
                          backgroundColor: "#fff",
                          border: "2px solid #d32f2f",
                          "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible":
                            {
                              boxShadow: "0 0 0 8px rgba(211, 47, 47, 0.16)",
                            },
                          "&:before": {
                            display: "none",
                          },
                        },
                        "& .MuiSlider-track": {
                          height: 10,
                          borderRadius: 5,
                          background:
                            "linear-gradient(90deg, #ffcdd2 0%, #ef5350 50%, #d32f2f 100%)",
                        },
                        "& .MuiSlider-rail": {
                          height: 10,
                          borderRadius: 5,
                          opacity: 0.5,
                          backgroundColor: "#e0e0e0",
                        },
                        "& .MuiSlider-mark": {
                          backgroundColor: "#bdbdbd",
                          height: 10,
                          width: 2,
                          "&.MuiSlider-markActive": {
                            opacity: 1,
                            backgroundColor: "#fff",
                          },
                        },
                        "& .MuiSlider-valueLabel": {
                          lineHeight: 1.2,
                          fontSize: 14,
                          fontWeight: "bold",
                          background: "unset",
                          padding: 0,
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: "#d32f2f",
                          color: "#fff",
                          transformOrigin: "bottom center",
                          transform: "translate(-50%, -100%) scale(0)",
                          "&:before": { display: "none" },
                          "&.MuiSlider-valueLabelOpen": {
                            transform: "translate(-50%, -100%) scale(1)",
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      width: "100%",
                      px: 1,
                    }}
                  >
                    <Chip
                      label="Minimum: 1 unit"
                      size="small"
                      sx={{
                        bgcolor: "#ffcdd2",
                        color: "#d32f2f",
                        fontWeight: "medium",
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#d32f2f" }}
                    >
                      {formValues.quantity}{" "}
                      {formValues.quantity === 1 ? "unit" : "units"}
                    </Typography>
                    <Chip
                      label="Maximum: 10 units"
                      size="small"
                      sx={{
                        bgcolor: "#ffcdd2",
                        color: "#d32f2f",
                        fontWeight: "medium",
                      }}
                    />
                  </Box>
                </Paper>
                {formErrors.quantity && (
                  <Typography
                    color="error"
                    fontSize={12}
                    mt={1}
                    textAlign="center"
                  >
                    {formErrors.quantity}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grow>
      ),
    },
    {
      label: "Reason & Priority",
      icon: <FormatListBulletedIcon />,
      content: (
        <Grow in={activeStep === 2} timeout={500}>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="reason"
                  label="Reason for Request"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: (
                      <FormatListBulletedIcon
                        sx={{ mr: 1, mt: 1, color: "rgba(0, 0, 0, 0.54)" }}
                      />
                    ),
                  }}
                  value={formValues.reason}
                  onChange={handleChange}
                  error={!!formErrors.reason}
                  helperText={formErrors.reason}
                />
              </Grid>

              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${
                      formValues.emergencyLevel === "Emergency"
                        ? "#f44336"
                        : "#4caf50"
                    }`,
                    background:
                      formValues.emergencyLevel === "Emergency"
                        ? "linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(255, 152, 0, 0.1))"
                        : "linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Emergency Level
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center">
                      {formValues.emergencyLevel === "Emergency" ? (
                        <PulsatingIcon>
                          <WarningAmberIcon color="error" fontSize="large" />
                        </PulsatingIcon>
                      ) : (
                        <CheckCircleIcon color="success" fontSize="large" />
                      )}
                      <Typography
                        variant="h6"
                        ml={1}
                        color={
                          formValues.emergencyLevel === "Emergency"
                            ? "error"
                            : "success"
                        }
                      >
                        {formValues.emergencyLevel}
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={formValues.emergencyLevel === "Emergency"}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              emergencyLevel: e.target.checked
                                ? "Emergency"
                                : "Normal",
                            })
                          }
                          sx={{
                            color: "#f44336",
                            "&.Mui-checked": { color: "#f44336" },
                          }}
                        />
                      }
                      label="Mark as Emergency"
                    />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="requestDate"
                  label="Request Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <EventIcon sx={{ mr: 1, color: "rgba(0, 0, 0, 0.54)" }} />
                    ),
                  }}
                  value={formValues.requestDate}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        </Grow>
      ),
    },
    {
      label: "Confirmation",
      icon: <CheckCircleIcon />,
      content: (
        <Grow in={activeStep === 3} timeout={500}>
          <Box>
            <Typography variant="h6" gutterBottom textAlign="center">
              Review Your Request
            </Typography>

            <Box
              sx={{
                background: "rgba(244, 67, 54, 0.05)",
                p: 2,
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Requester Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formValues.requesterName || "Not provided"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Requester Type
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formValues.requesterType || "Not selected"}
                  </Typography>
                </Grid>

                {formValues.requesterType === "Hospital" && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Hospital ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formValues.patientOrHospitalId || "Not provided"}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Blood Group(s)
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                    {formValues.bloodGroup &&
                    formValues.bloodGroup.length > 0 ? (
                      formValues.bloodGroup.map((group) => (
                        <Box
                          key={group}
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            backgroundColor: "#f44336",
                            color: "white",
                            fontSize: "0.875rem",
                            fontWeight: "medium",
                          }}
                        >
                          <OpacityIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {group}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="error">
                        No blood groups selected
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Quantity
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formValues.quantity} unit
                    {formValues.quantity !== 1 ? "s" : ""}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Emergency Level
                  </Typography>
                  <Box display="flex" alignItems="center">
                    {formValues.emergencyLevel === "Emergency" ? (
                      <>
                        <WarningAmberIcon fontSize="small" color="error" />
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color="error"
                          ml={0.5}
                        >
                          Emergency
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon fontSize="small" color="success" />
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color="success"
                          ml={0.5}
                        >
                          Normal
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Request Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {new Date(formValues.requestDate).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Reason
                  </Typography>
                  <Typography variant="body1">
                    {formValues.reason || "Not provided"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="error"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 4,
                  background:
                    "linear-gradient(45deg, #f44336 30%, #ff9800 90%)",
                  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
                onClick={handleSubmit}
              >
                {formValues.emergencyLevel === "Emergency"
                  ? "Submit Emergency Request"
                  : data
                  ? "Update Request"
                  : "Submit Request"}
              </Button>
            </Box>
          </Box>
        </Grow>
      ),
    },
  ];

  return (
    <>
      <Dialog
        fullScreen={isMobile}
        fullWidth
        maxWidth="md"
        open={openModel}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        TransitionComponent={Grow}
        transitionDuration={500}
      >
        <DialogTitle
          sx={{
            p: 0,
            m: 0,
            position: "relative",
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              background: "linear-gradient(to right, #d32f2f, #b71c1c)",
              color: "white",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <Box display="flex" alignItems="center">
              <OpacityIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div" fontWeight="bold">
                {title}
              </Typography>
            </Box>
            <IconButton
              color="inherit"
              onClick={handleCloseDialog}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          <BloodBagContainer
            emergency={formValues.emergencyLevel === "Emergency"}
          >
            {/* Animated blood droplets */}
            {droplets.map((droplet) => (
              <BloodDroplet
                key={droplet.id}
                style={{ left: droplet.left }}
                delay={droplet.delay}
              />
            ))}

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Stepper
                activeStep={activeStep}
                orientation={isMobile ? "vertical" : "horizontal"}
                sx={{
                  background: "rgba(255, 255, 255, 0.9)",
                  p: 2,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={({ active, completed }) => (
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor:
                              active || completed ? "#f44336" : "#e0e0e0",
                            color: active || completed ? "white" : "#616161",
                            boxShadow:
                              active || completed
                                ? "0 4px 10px rgba(244, 67, 54, 0.3)"
                                : "none",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {step.icon}
                        </Avatar>
                      )}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={activeStep === index ? "bold" : "normal"}
                      >
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Fade in={formAnimation} timeout={500}>
                <FormSection>
                  {steps[activeStep].content}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 3,
                    }}
                  >
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      sx={{
                        color: "#f44336",
                        borderColor: "#f44336",
                        "&:hover": {
                          borderColor: "#d32f2f",
                          backgroundColor: "rgba(244, 67, 54, 0.04)",
                        },
                      }}
                    >
                      Back
                    </Button>

                    {activeStep < steps.length - 1 && (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          background:
                            "linear-gradient(45deg, #f44336 30%, #ff9800 90%)",
                          boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                        }}
                      >
                        Continue
                      </Button>
                    )}
                  </Box>
                </FormSection>
              </Fade>
            </Box>
          </BloodBagContainer>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnimatedBloodRequestForm;
