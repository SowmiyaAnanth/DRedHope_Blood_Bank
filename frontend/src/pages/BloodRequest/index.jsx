import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Dialog,
  Button,
  TextField,
  MenuItem,
  Stack,
  Paper,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditNoteIcon from "@mui/icons-material/EditNote"; // Changed to different edit icon
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import OpacityIcon from "@mui/icons-material/Opacity";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Person, Numbers, Event, LocationOn } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import BloodRequestForm from "./components/CreateRequestForm";
import BloodRequestButton from "./Styles/CreateButton";
import MagicMotionButton from "./Styles/MagicMotionButton";
import BloodRequestFilter from "./Styles/BloodRequestFilter";
import deleteIcon from "../../assets/images/delete.jpg";
import {
  getAllRequests,
  createRequest,
  updateRequest,
  deleteRequest,
} from "../../api/bloodRequestAPI";

// Custom styled components for blood bag
const TopConnector = styled(Box)(({ theme, requesterType }) => ({
  width: 64,
  height: 24,
  borderRadius: "8px 8px 0 0",
  // Changed colors based on request type
  backgroundColor: requesterType === "Patient" ? "#3f51b5" : "#e91e63",
  border: `2px solid ${requesterType === "Patient" ? "#303f9f" : "#c2185b"}`,
  margin: "0 auto",
}));

const Tube = styled(Box)(({ theme, requesterType }) => ({
  width: 16,
  height: 64,
  // Changed colors based on request type
  backgroundColor: requesterType === "Patient" ? "#7986cb" : "#f06292",
  borderLeft: `2px solid ${requesterType === "Patient" ? "#303f9f" : "#c2185b"}`,
  borderRight: `2px solid ${requesterType === "Patient" ? "#303f9f" : "#c2185b"}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "4px 0",
  margin: "0 auto",
  position: "relative",
}));

const BottomConnector = styled(Box)(({ theme, requesterType }) => ({
  width: 32,
  height: 16,
  borderRadius: "0 0 8px 8px",
  // Changed colors based on request type
  backgroundColor: requesterType === "Patient" ? "#3f51b5" : "#e91e63",
  border: `2px solid ${requesterType === "Patient" ? "#303f9f" : "#c2185b"}`,
  borderTop: 0,
  margin: "0 auto",
}));

// Changed from circle to rectangle with radius
const ActionButton = styled(Button)(({ theme, color }) => ({
  minWidth: 28,
  height: 20,
  borderRadius: 4,
  padding: "0 4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:
    color === "edit" ? theme.palette.success.main : theme.palette.error.light,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor:
      color === "edit" ? theme.palette.success.dark : theme.palette.error.dark,
    transform: "scale(1.05)",
  },
  transition: "all 0.3s",
}));

const BloodDrop = styled(Box)(({ theme, color }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: color,
  animation: "bounce 1s infinite",
}));

const EmergencySiren = styled(Box)(({ theme, blinking }) => ({
  position: "absolute",
  top: -32,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 4,
  borderRadius: "50%",
  backgroundColor: blinking
    ? theme.palette.error.main
    : theme.palette.common.white,
  color: blinking ? theme.palette.common.white : theme.palette.error.main,
}));

const AlertBadge = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 16,
  right: 16,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  padding: "8px 16px",
  borderRadius: 24,
  display: "flex",
  alignItems: "center",
  animation: "pulse 2s infinite",
}));

// Blood Cell for animation
const BloodCell = styled(Box)(({ size, delay, duration }) => ({
  position: "absolute",
  width: size,
  height: size * 1.3,
  backgroundColor: "rgba(255, 255, 255, 0.25)",
  borderRadius: "50%",
  animation: `float ${duration}s infinite`,
  animationDelay: `${delay}s`,
  opacity: 0.4,
}));

const formatDate = (dateString) => {
  if (!dateString) return "";
  // Extract just the date part from the ISO string (YYYY-MM-DD)
  return dateString.split("T")[0];
};

const BloodBagCard = ({ request, onEdit, onDelete }) => {
  const theme = useTheme();
  const [isBlinking, setIsBlinking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dripping, setDripping] = useState(false);

  // Set up blinking effect for emergency requests
  useEffect(() => {
    if (request.emergencyLevel === "Emergency") {
      const interval = setInterval(() => {
        setIsBlinking((prev) => !prev);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [request.emergencyLevel]);

  // Start dripping animation on hover
  useEffect(() => {
    if (isExpanded) {
      setDripping(true);
      const timeout = setTimeout(() => setDripping(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isExpanded]);

  // Define blood bag color based on blood type
  const getBloodColor = (bloodType) => {
    if (Array.isArray(bloodType) && bloodType.length > 0) {
      bloodType = bloodType[0]; // Use the first blood type if it's an array
    }

    if (typeof bloodType !== "string") return "#b71c1c"; // Default dark red

    // Darker blood red colors
    switch (bloodType.charAt(0)) {
      case "A":
        return "#8b0000"; // Dark red
      case "B":
        return "#a70000"; // Darker red
      case "O":
        return "#9b0000"; // Medium dark red
      case "AB":
        return "#800000"; // Very dark red
      default:
        return "#b71c1c"; // Default dark red
    }
  };

  // Status properties based on emergency level
  const getStatusInfo = (status) => {
    switch (status) {
      case "Emergency":
        return {
          color: theme.palette.error.main,
          bgColor: theme.palette.error.light,
          icon: (
            <WarningAmberIcon
              sx={{ fontSize: 16, mr: 0.5, color: theme.palette.error.main }}
            />
          ),
        };
      case "Normal":
        return {
          color: theme.palette.success.main,
          bgColor: theme.palette.success.light,
          icon: (
            <CheckCircleIcon
              sx={{ fontSize: 16, mr: 0.5, color: theme.palette.success.main }}
            />
          ),
        };
      default:
        return {
          color: theme.palette.grey[500],
          bgColor: theme.palette.grey[100],
          icon: (
            <CloseIcon
              sx={{ fontSize: 16, mr: 0.5, color: theme.palette.grey[500] }}
            />
          ),
        };
    }
  };

  const statusInfo = getStatusInfo(request.emergencyLevel);

  // Format blood groups for display
  const formatBloodGroups = (groups) => {
    if (Array.isArray(groups)) {
      return groups.join(", ");
    }
    return groups || "";
  };

  // Format ID based on requester type
  const formatId = (id, type) => {
    if (!id) return "";
    if (type === "Patient" && !id.startsWith("PT")) {
      return `PT${id.padStart(3, "0")}`;
    }
    return id;
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: 256,
        margin: "24px auto",
        transform: isExpanded ? "scale(1.05)" : "scale(1)",
        transition: "all 0.3s",
        boxShadow:
          request.emergencyLevel === "Emergency" && isBlinking
            ? "0 0 15px 5px rgba(244, 67, 54, 0.5)"
            : "none",
        cursor: "pointer",
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Emergency siren */}
      {request.emergencyLevel === "Emergency" && (
        <EmergencySiren blinking={isBlinking}>
          <LocalHospitalIcon sx={{ fontSize: 20 }} />
        </EmergencySiren>
      )}

      {/* Blood bag top connector */}
      <TopConnector requesterType={request.requesterType} />

      {/* Tube area with buttons */}
      <Tube requesterType={request.requesterType}>
        <ActionButton
          color="edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(request);
          }}
          size="small"
        >
          <EditNoteIcon sx={{ fontSize: 16 }} />
        </ActionButton>
        <ActionButton
          color="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(request);
          }}
          size="small"
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </ActionButton>

        {/* Dripping animation */}
        {dripping && (
          <Box
            sx={{
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <BloodDrop color={getBloodColor(request.bloodGroup)} />
          </Box>
        )}
      </Tube>

      {/* Blood bag main container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `2px solid ${
            request.emergencyLevel === "Emergency"
              ? theme.palette.error.main
              : theme.palette.grey[400]
          }`,
          overflow: "hidden",
          transition: "all 0.3s",
          outline: isExpanded
            ? `2px solid ${theme.palette.primary.light}`
            : "none",
          display: "flex",
          flexDirection: "column",
          height: 240, // Fixed height for all blood bags
        }}
      >
        {/* Blood bag center white content area - Moved to center */}
        <Box
          sx={{
            bgcolor: "white",
            p: 1.5,
            height: "70%", // Takes 70% of the container
            zIndex: 2, // Above the blood cells
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {request.requesterName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: getBloodColor(request.bloodGroup),
                color: "white",
                px: 1,
                py: 0.5,
                borderRadius: 10,
                transform: "scale(1)",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                transition: "transform 0.3s",
              }}
            >
              <OpacityIcon
                sx={{
                  mr: 0.5,
                  fontSize: 14,
                  animation: "pulse 2s infinite",
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {formatBloodGroups(request.bloodGroup)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ "& > div": { mb: 0.5 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                {request.requesterType} ID:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatId(request.patientOrHospitalId, request.requesterType)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Quantity:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {request.quantity} Unit(s)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Date:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatDate(request.requestDate)}
              </Typography>
            </Box>
           
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Emergency:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: statusInfo.bgColor,
                  color: statusInfo.color,
                  px: 1,
                  py: 0.25,
                  borderRadius: 10,
                }}
              >
                {statusInfo.icon}
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {request.emergencyLevel}
                </Typography>
              </Box>
            </Box>

            {/* Expanded details */}
            {isExpanded && (
              <Box
                sx={{
                  mt: 1,
                  pt: 1,
                  borderTop: `1px solid ${theme.palette.grey[200]}`,
                  className: "animate-fadeIn",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Reason:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  {request.reason}
                </Typography>
                </Box>
            )}
          </Box>
        </Box>

        {/* Dark red blood content area with blood cells */}
        <Box
          sx={{
            bgcolor: getBloodColor(request.bloodGroup),
            flexGrow: 1, // Takes the remaining space
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Blood cells animation */}
          {[...Array(12)].map((_, i) => (
            <BloodCell
              key={i}
              size={8 + Math.random() * 8}
              delay={Math.random() * 5}
              duration={4 + Math.random() * 6}
              sx={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
            />
          ))}

          {/* Emergency indicator */}
          {request.emergencyLevel === "Emergency" && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "50%",
                  p: 1,
                  animation: isBlinking ? "pulse 2s infinite" : "none",
                }}
              >
                <WarningAmberIcon
                  sx={{ fontSize: 24, color: theme.palette.error.main }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Blood bag bottom connector */}
      <BottomConnector requesterType={request.requesterType} />
    </Box>
  );
};

const BloodRequestBoard = () => {
  const theme = useTheme();
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState({ bloodGroup: "", emergencyLevel: "" });
  const [playSound, setPlaySound] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const emergencyLevels = ["Normal", "Emergency"];

  // Custom animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0); opacity: 0.2; }
        50% { transform: translateY(-10px); opacity: 0.5; }
        100% { transform: translateY(-20px); opacity: 0; }
      }
      .animate-float {
        animation: float 4s infinite;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }

      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    // Check if there are any emergency requests
    const hasEmergency = bloodRequests.some(
      (item) => item.emergencyLevel === "Emergency"
    );
    setPlaySound(hasEmergency);
  }, [bloodRequests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllRequests();
      setBloodRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch blood requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async (formData) => {
    try {
      if (editData) {
        await updateRequest(editData._id, formData);
      } else {
        await createRequest(formData);
      }
      fetchRequests();
      setOpenForm(false);
      setEditData(null);
    } catch (error) {
      console.error("Failed to save request", error);
    }
  };

  const handleEdit = (request) => {
    setEditData(request);
    setOpenForm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRequest(deleteTarget._id);
      fetchRequests();
      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Blood Request Report", 14, 22);

    const tableColumn = [
      "#",
      "Requester Name",
      "Type",
      "Blood Group",
      "Qty",
      "Emergency",
      "Date",
      "Location",
    ];

    const tableRows = filteredRequests.map((req, index) => [
      index + 1,
      req.requesterName,
      req.requesterType,
      Array.isArray(req.bloodGroup)
        ? req.bloodGroup.join(", ")
        : req.bloodGroup,
      req.quantity,
      req.emergencyLevel,
      formatDate(req.requestDate),
      req.location,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("filtered-blood-requests.pdf");
  };

  const filteredRequests = bloodRequests.filter((req) => {
    let bloodGroupMatch = true;

    if (filter.bloodGroup) {
      if (Array.isArray(req.bloodGroup)) {
        bloodGroupMatch = req.bloodGroup.includes(filter.bloodGroup);
      } else {
        bloodGroupMatch = req.bloodGroup === filter.bloodGroup;
      }
    }

    const emergencyMatch =
      !filter.emergencyLevel || req.emergencyLevel === filter.emergencyLevel;
    return bloodGroupMatch && emergencyMatch;
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <OpacityIcon
          sx={{ mr: 1, fontSize: 24, color: theme.palette.error.main }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: theme.palette.error.main,
            textAlign: "center",
          }}
        >
          Blood Request Management System
        </Typography>
      </Box>

      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <BloodRequestButton onClick={() => setOpenForm(true)} />
        {/* <Stack
          direction="row"
          spacing={2}
          sx={{
            borderRadius: 2,
            p: 2,
          }}
        >
          <TextField
            select
            label="Blood Group"
            size="small"
            value={filter.bloodGroup}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, bloodGroup: e.target.value }))
            }
            sx={{
              minWidth: 250,
              backgroundColor: "#fff0f0", // soft field background
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#f28b82", // border color
                },
                "&:hover fieldset": {
                  borderColor: "#e53935", // darker red on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d32f2f", // red when focused
                },
              },
              "& .MuiInputLabel-root": {
                color: "#c62828", // label color
              },
            }}
          >
            <MenuItem value="">
              <BloodtypeIcon fontSize="small" sx={{ mr: 1 }} />
              All
            </MenuItem>
            {bloodGroups.map((group) => (
              <MenuItem key={group} value={group}>
                <BloodtypeIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                {group}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Emergency"
            size="small"
            value={filter.emergencyLevel}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, emergencyLevel: e.target.value }))
            }
            sx={{
              minWidth: 250,
              backgroundColor: "#fff0f0", // same soft background
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#f28b82",
                },
                "&:hover fieldset": {
                  borderColor: "#e53935",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#d32f2f",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#c62828",
              },
            }}
          >
            <MenuItem value="">
              <Typography>All</Typography>
            </MenuItem>
            <MenuItem value="Emergency">
              <WarningAmberIcon color="error" sx={{ mr: 1 }} />
              <Typography color="error.main">Emergency</Typography>
            </MenuItem>
            <MenuItem value="Normal">
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography color="green">Normal</Typography>
            </MenuItem>
          </TextField>
        </Stack> */}

          {/* New Filter Component */}
        <BloodRequestFilter
          filter={filter}
          setFilter={setFilter}
          bloodGroups={bloodGroups}
        />
      </Grid>



      {/* Audio for emergency alert */}
      {playSound && (
        <AlertBadge className="animate-pulse">
          <LocalHospitalIcon sx={{ mr: 1, fontSize: 18 }} />
          <Typography sx={{ fontWeight: 500 }}>Emergency Alert!</Typography>
        </AlertBadge>
      )}

      {/* Blood Bag Grid */}
      <Grid container spacing={2}>
        {filteredRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={request._id}>
            <BloodBagCard
              request={request}
              onEdit={handleEdit}
              onDelete={() => setDeleteTarget(request)}
            />
          </Grid>
        ))}
      </Grid>

      <Box mt={3} display="flex" justifyContent="left">
        <MagicMotionButton onClick={handleDownloadPDF} />
      </Box>

      <BloodRequestForm
        title={editData ? "Edit Blood Request" : "Add New Blood Request"}
        openModel={openForm}
        handleCloseDialog={() => {
          setOpenForm(false);
          setEditData(null);
        }}
        data={editData}
        handleFormSubmit={handleAddOrUpdate}
      />

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ textAlign: "center", p: 4 }}>
          <Box>
            <img src={deleteIcon} alt="Delete Icon" width={250} />
          </Box>
          <Typography fontSize={16} color="text.secondary" mb={3}>
            Are you sure you want to delete the request by{" "}
            <strong>{deleteTarget?.requesterName}</strong>?
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
              sx={{ textTransform: "none", px: 3 }}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              onClick={() => setDeleteTarget(null)}
              sx={{ textTransform: "none", px: 3 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BloodRequestBoard;