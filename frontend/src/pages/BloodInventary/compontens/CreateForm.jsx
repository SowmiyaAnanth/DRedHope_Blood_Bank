import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { QRCodeCanvas } from "qrcode.react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  InputLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  Tooltip,
  Zoom,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNotifier } from "../../../components/Notification/Notifications";

// Import Material UI icons to replace GIFs
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import OpacityIcon from "@mui/icons-material/Opacity";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EventIcon from "@mui/icons-material/Event";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ReportIcon from "@mui/icons-material/Report";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

// Create animated icon components to replace static GIFs
const AnimatedIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  transition: "all 0.3s ease",
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%": {
      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}`,
      transform: "scale(0.95)",
    },
    "70%": {
      boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}`,
      transform: "scale(1)",
    },
    "100%": {
      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`,
      transform: "scale(0.95)",
    },
  },
}));

// Blood type icon with droplet animation
const BloodTypeAnimatedIcon = styled(AnimatedIcon)(({ theme, bloodtype }) => {
  // Blood type color mapping
  const bloodColors = {
    "A+": "#e53935",
    "A-": "#c62828",
    "B+": "#2196f3",
    "B-": "#1565c0",
    "AB+": "#9c27b0",
    "AB-": "#6a1b9a",
    "O+": "#43a047",
    "O-": "#1b5e20",
  };

  const color = bloodColors[bloodtype] || theme.palette.primary.main;

  return {
    backgroundColor: alpha(color, 0.1),
    color: color,
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: `0 0 15px ${alpha(color, 0.5)}`,
    },
    animation: "bloodDrop 2s infinite",
    "@keyframes bloodDrop": {
      "0%": {
        transform: "translateY(0)",
      },
      "50%": {
        transform: "translateY(3px)",
      },
      "100%": {
        transform: "translateY(0)",
      },
    },
  };
});

// Quantity icon with counting animation
const QuantityAnimatedIcon = styled(AnimatedIcon)(({ theme }) => ({
  animation: "count 3s infinite",
  "@keyframes count": {
    "0%": {
      transform: "rotateY(0deg)",
    },
    "50%": {
      transform: "rotateY(180deg)",
    },
    "100%": {
      transform: "rotateY(360deg)",
    },
  },
}));

// Calendar icon with date animation
const CalendarAnimatedIcon = styled(AnimatedIcon)(({ theme }) => ({
  animation: "calendar 2s infinite",
  "@keyframes calendar": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.1)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
}));

// Location icon with pin drop animation
const LocationAnimatedIcon = styled(AnimatedIcon)(({ theme }) => ({
  animation: "pinDrop 2s infinite",
  "@keyframes pinDrop": {
    "0%": {
      transform: "translateY(-3px)",
    },
    "50%": {
      transform: "translateY(3px)",
    },
    "100%": {
      transform: "translateY(-3px)",
    },
  },
}));

// Person icon with beating animation
const PersonAnimatedIcon = styled(AnimatedIcon)(({ theme }) => ({
  animation: "beatIcon 1.5s ease infinite",
  "@keyframes beatIcon": {
    "0%": {
      transform: "scale(1)",
    },
    "25%": {
      transform: "scale(1.1)",
    },
    "40%": {
      transform: "scale(1)",
    },
    "60%": {
      transform: "scale(1.1)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
}));

// QR Code icon with scanning animation
const QrCodeAnimatedIcon = styled(AnimatedIcon)(({ theme }) => ({
  animation: "scan 3s infinite",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: "0%",
    height: "3px",
    width: "100%",
    background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}, transparent)`,
    animation: "scanLine 3s ease-in-out infinite",
  },
  "@keyframes scan": {
    "0%": {
      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    "70%": {
      boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}`,
    },
    "100%": {
      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`,
    },
  },
  "@keyframes scanLine": {
    "0%": {
      top: "0%",
    },
    "50%": {
      top: "100%",
    },
    "100%": {
      top: "0%",
    },
  },
}));

// Styled components for enhanced UI
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
}));

const FormSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-2px)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
}));

const BloodTypeButton = styled(FormControlLabel)(({ theme, checked }) => ({
  margin: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  border: checked
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  background: checked ? alpha(theme.palette.primary.main, 0.08) : "transparent",
  transition: "all 0.2s",
  "& .MuiFormControlLabel-label": {
    fontWeight: checked ? 700 : 400,
  },
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.04),
    transform: "translateY(-1px)",
  },
}));

const QRCodeWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  background: alpha(theme.palette.primary.main, 0.03),
  transition: "all 0.3s",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    background: alpha(theme.palette.primary.main, 0.05),
  },
}));

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  "&.MuiOutlinedInput-root": {
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
}));

const BloodTypeChip = styled(Chip)(({ theme, bloodtype }) => {
  // Blood type color mapping
  const bloodColors = {
    "A+": "#e53935",
    "A-": "#c62828",
    "B+": "#2196f3",
    "B-": "#1565c0",
    "AB+": "#9c27b0",
    "AB-": "#6a1b9a",
    "O+": "#43a047",
    "O-": "#1b5e20",
  };

  return {
    backgroundColor: alpha(
      bloodColors[bloodtype] || theme.palette.primary.main,
      0.1
    ),
    color: bloodColors[bloodtype] || theme.palette.primary.main,
    fontWeight: "bold",
    border: `1px solid ${bloodColors[bloodtype] || theme.palette.primary.main}`,
  };
});

// Main component (keeping all the original functionality)
const BloodInventoryForm = ({ open, onClose, onSuccess, defaultValues }) => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const { notifySuccess, notifyError } = useNotifier();
  const [qrCode, setQrCode] = useState("");

  // Selected blood group for enhanced UI
  const selectedBloodGroup = watch("bloodGroup");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset({
        bloodGroup: "",
        quantity: "",
        collectionDate: "",
        expiryDate: "",
        storageLocation: "",
        donorID: "",
        collectedBy: "",
      });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      setQrCode(JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data) => {
    try {
      if (defaultValues && defaultValues._id) {
        data._id = defaultValues._id;
        data.used = defaultValues.used || 0; // Preserve existing used value
      } else {
        data.used = 0; // For new entry, start with used = 0
      }
      onSuccess(data);
      notifySuccess("Blood inventory saved successfully.");
      reset();
    } catch (error) {
      notifyError("Error saving inventory.");
    }
  };


  const handleCancel = () => {
    reset();
    onClose();
  };

  // Calculate days between collection and expiry
  const calculateShelfLife = () => {
    const collectionDate = watch("collectionDate");
    const expiryDate = watch("expiryDate");

    if (collectionDate && expiryDate) {
      const diffTime = new Date(expiryDate) - new Date(collectionDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return null;
  };

  const shelfLifeDays = calculateShelfLife();

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <StyledDialogTitle>
        <Box display="flex" alignItems="center">
          <MonitorHeartIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6">
            {defaultValues?._id
              ? "Update Blood Inventory"
              : "Add New Blood Inventory"}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCancel}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <form id="blood-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Blood Group Section */}
            <Grid item xs={12}>
              <FormSection>
                <SectionTitle variant="h6">
                  <BloodTypeAnimatedIcon sx={{ mr: 1 }}>
                    <BloodtypeIcon />
                  </BloodTypeAnimatedIcon>
                  Blood Group Information
                </SectionTitle>

                <FormControl fullWidth error={!!errors.bloodGroup}>
                  <FormLabel sx={{ mb: 1 }}>Select Blood Group</FormLabel>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (group) => (
                        <Tooltip
                          key={group}
                          title={
                            group === "O-"
                              ? "Universal Donor"
                              : group === "AB+"
                              ? "Universal Recipient"
                              : ""
                          }
                          arrow
                          TransitionComponent={Zoom}
                        >
                          <Box>
                            <BloodTypeButton
                              value={group}
                              control={
                                <Radio
                                  checked={selectedBloodGroup === group}
                                  onChange={(e) =>
                                    setValue("bloodGroup", e.target.value)
                                  }
                                />
                              }
                              label={
                                <BloodTypeChip
                                  label={group}
                                  bloodtype={group}
                                  size="medium"
                                />
                              }
                              checked={selectedBloodGroup === group}
                            />
                          </Box>
                        </Tooltip>
                      )
                    )}
                  </Box>
                  {errors.bloodGroup && (
                    <Typography color="error" fontSize="0.8rem" sx={{ mt: 1 }}>
                      {errors.bloodGroup.message}
                    </Typography>
                  )}
                </FormControl>
              </FormSection>
            </Grid>

            {/* Quantity */}
            <Grid item xs={12}>
              <FormSection>
                <SectionTitle variant="h6">
                  <QuantityAnimatedIcon sx={{ mr: 1 }}>
                    <OpacityIcon />
                  </QuantityAnimatedIcon>
                  Quantity Information
                </SectionTitle>

                <StyledInput
                  fullWidth
                  label="Quantity (Units)"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ mr: 1, opacity: 0.7 }}>
                        Units:
                      </Box>
                    ),
                  }}
                  {...register("quantity", {
                    required: "Quantity is required",
                    min: { value: 1, message: "Minimum quantity is 1" },
                  })}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                />
              </FormSection>
            </Grid>

            {/* Dates Section */}
            <Grid item xs={12}>
              <FormSection>
                <SectionTitle variant="h6">
                  <CalendarAnimatedIcon sx={{ mr: 1 }}>
                    <DateRangeIcon />
                  </CalendarAnimatedIcon>
                  Collection & Expiry Dates
                </SectionTitle>

                <Grid container spacing={3}>
                  {/* Collection Date */}
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <StyledInput
                        fullWidth
                        label="Collection Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <DateRangeIcon
                              sx={{
                                mr: 1,
                                color: "primary.main",
                                opacity: 0.7,
                              }}
                            />
                          ),
                        }}
                        {...register("collectionDate", {
                          required: "Collection date is required",
                        })}
                        error={!!errors.collectionDate}
                        helperText={errors.collectionDate?.message}
                      />
                    </Box>
                  </Grid>

                  {/* Expiry Date */}
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <StyledInput
                        fullWidth
                        label="Expiry Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <EventIcon
                              sx={{ mr: 1, color: "error.main", opacity: 0.7 }}
                            />
                          ),
                        }}
                        {...register("expiryDate", {
                          required: "Expiry date is required",
                        })}
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate?.message}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Shelf life indicator */}
                {shelfLifeDays && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      bgcolor:
                        shelfLifeDays < 7
                          ? alpha(theme.palette.error.light, 0.1)
                          : "background.default",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {shelfLifeDays < 7 && (
                      <ReportIcon color="error" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="body2">
                      <strong>Shelf Life:</strong> {shelfLifeDays} days
                      {shelfLifeDays > 42
                        ? " (Extended)"
                        : shelfLifeDays < 30
                        ? " (Short shelf life)"
                        : " (Standard)"}
                    </Typography>
                  </Box>
                )}
              </FormSection>
            </Grid>

            {/* Location & People Section */}
            <Grid item xs={12}>
              <FormSection>
                <SectionTitle variant="h6">
                  <LocationAnimatedIcon sx={{ mr: 1 }}>
                    <PlaceIcon />
                  </LocationAnimatedIcon>
                  Storage & Personnel Information
                </SectionTitle>

                <Grid container spacing={3}>
                  {/* Storage Location */}
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.storageLocation}>
                      <InputLabel>Storage Location</InputLabel>
                      <StyledSelect
                        label="Storage Location"
                        {...register("storageLocation", {
                          required: "Storage location is required",
                        })}
                        value={watch("storageLocation") || ""}
                        startAdornment={
                          <LocalHospitalIcon
                            sx={{ ml: 1, mr: 1, color: "primary.main" }}
                          />
                        }
                      >
                        <MenuItem value="City Hospital">City Hospital</MenuItem>
                        <MenuItem value="National Blood Bank">
                          National Blood Bank
                        </MenuItem>
                        <MenuItem value="Red Cross Center">
                          Red Cross Center
                        </MenuItem>
                      </StyledSelect>
                      {errors.storageLocation && (
                        <Typography color="error" fontSize="0.8rem" mt={0.5}>
                          {errors.storageLocation.message}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Donor ID */}
                  <Grid item xs={12} sm={6}>
                    <StyledInput
                      fullWidth
                      label="Donor ID"
                      placeholder="e.g. D001"
                      InputProps={{
                        startAdornment: (
                          <BadgeIcon sx={{ mr: 1, color: "primary.main" }} />
                        ),
                      }}
                      {...register("donorID", {
                        required: "Donor ID is required",
                        minLength: { value: 2, message: "Donor ID too short" },
                      })}
                      error={!!errors.donorID}
                      helperText={errors.donorID?.message}
                    />
                  </Grid>

                  {/* Collected By */}
                  <Grid item xs={12} sm={6}>
                    <StyledInput
                      fullWidth
                      label="Collected By"
                      placeholder="Staff name"
                      InputProps={{
                        startAdornment: (
                          <PersonAnimatedIcon sx={{ mr: 1 }}>
                            <PersonIcon />
                          </PersonAnimatedIcon>
                        ),
                      }}
                      {...register("collectedBy", {
                        required: "Collected by is required",
                      })}
                      error={!!errors.collectedBy}
                      helperText={errors.collectedBy?.message}
                    />
                  </Grid>
                </Grid>
              </FormSection>
            </Grid>

            {/* QR Code Section */}
            <Grid item xs={12}>
              <FormSection>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <SectionTitle variant="h6">
                      <QrCodeAnimatedIcon sx={{ mr: 1 }}>
                        <QrCodeIcon />
                      </QrCodeAnimatedIcon>
                      QR Code Tracking
                    </SectionTitle>
                    <QRCodeWrapper>
                      <QRCodeCanvas
                        value={qrCode}
                        size={150}
                        level="H"
                        includeMargin
                      />
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        Scan to verify blood unit details
                      </Typography>
                    </QRCodeWrapper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="medium"
                    >
                      Blood Unit Summary
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "background.default",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body2" gutterBottom>
                        <strong>Blood Type:</strong>{" "}
                        {watch("bloodGroup") || "Not selected"}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Quantity:</strong> {watch("quantity") || "0"}{" "}
                        units
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Collection:</strong>{" "}
                        {watch("collectionDate") || "Not set"}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Expiry:</strong>{" "}
                        {watch("expiryDate") || "Not set"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Storage:</strong>{" "}
                        {watch("storageLocation") || "Not selected"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </FormSection>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          bgcolor: "background.default",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <StyledButton onClick={handleCancel} color="inherit" variant="outlined">
          Cancel
        </StyledButton>
        <StyledButton
          type="submit"
          form="blood-form"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          {defaultValues?._id ? "Update" : "Submit"}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default BloodInventoryForm;
