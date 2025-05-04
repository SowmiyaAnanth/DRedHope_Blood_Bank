import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Paper,
  Chip,
  Divider,
  Avatar,
  alpha,
  useTheme,
  LinearProgress,
  Container,
  Zoom,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Slide,
  Badge,
  Fab,
  Backdrop,
  Collapse,
} from "@mui/material";
import {
  CalendarMonth,
  Bloodtype,
  LocationOn,
  Event,
  Person,
  Numbers,
  Add,
  Search,
  FileDownload,
  QrCode,
  Edit,
  Delete,
  ArrowDownward,
  NoAccounts,
  FilterList,
  SortByAlpha,
  KeyboardArrowDown,
  MoreVert,
  Notifications,
  WaterDrop,
  Close,
  Celebration,
} from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import BloodInventoryForm from "./compontens/CreateForm";
import MagicButton from "./compontens/MagicButton";
import { styled, keyframes } from "@mui/material/styles";
import {
  getAllInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../../api/bloodInventoryApi";

import edit from "../../assets/images/edit.gif";
import del from "../../assets/images/delete.gif";
import view from "../../assets/images/view.gif";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";


// Keyframe Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 0, 93, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 0, 93, 0.8), 0 0 30px rgba(255, 0, 93, 0.5); }
  100% { box-shadow: 0 0 5px rgba(255, 0, 93, 0.5); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Enhanced Styled Components
const PageHeader = styled(Box)(({ theme }) => ({
  // Changed from primary/blue to error/red colors
  background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 50%, ${theme.palette.secondary.main} 100%)`,
  backgroundSize: "300% 300%",
  animation: `${gradientFlow} 15s ease infinite`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6, 4, 8, 4),
  borderRadius: "0 0 40px 40px",
  marginBottom: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
    transform: "rotate(30deg)",
  },
}));

const HeaderBubble = styled(Box)(
  ({ theme, size = 80, top = "20%", left = "10%", delay = 0 }) => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    top,
    left,
    animation: `${float} 6s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    zIndex: 0,
    backdropFilter: "blur(5px)",
  })
);

const BloodCard = styled(Card)(({ theme, bloodGroup }) => {
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

  const color = bloodColors[bloodGroup] || theme.palette.primary.main;

  return {
    borderRadius: 24,
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    position: "relative",
    overflow: "hidden",
    background: `linear-gradient(135deg, #ffffff 0%, ${alpha(
      color,
      0.05
    )} 100%)`,
    border: `2px solid ${alpha(color, 0.2)}`,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "8px",
      width: "100%",
      background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
    },
    "&:hover": {
      transform: "translateY(-15px) scale(1.02) rotateY(2deg)",
      boxShadow: `0 20px 40px ${alpha(color, 0.3)}`,
      "&::before": {
        animation: `${glow} 2s infinite`,
      },
    },
  };
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  fontWeight: 700,
  padding: theme.spacing(1.5, 4),
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
  textTransform: "none",
  transition: "all 0.3s",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: "-100%",
    background: `linear-gradient(90deg, transparent, ${alpha(
      "#fff",
      0.2
    )}, transparent)`,
    transition: "all 0.6s",
  },
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.18)",
    "&::after": {
      left: "100%",
    },
  },
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: 40,
  right: 40,
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.25)",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: "50%",
  padding: theme.spacing(1.5),
  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  "&:hover": {
    transform: "scale(1.2) rotate(10deg)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  },
}));

const DataRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  transition: "all 0.3s",
  "&:last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    background: alpha(theme.palette.background.paper, 0.4),
    transform: "translateX(5px)",
    borderRadius: 8,
  },
}));


const BloodTypeChip = styled(Chip)(({ theme, bloodgroup }) => {
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
      bloodColors[bloodgroup] || theme.palette.primary.main,
      0.15
    ),
    color: bloodColors[bloodgroup] || theme.palette.primary.main,
    fontWeight: "bold",
    border: `2px solid ${
      bloodColors[bloodgroup] || theme.palette.primary.main
    }`,
    backdropFilter: "blur(5px)",
    transition: "all 0.3s",
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: `0 5px 15px ${alpha(
        bloodColors[bloodgroup] || theme.palette.primary.main,
        0.3
      )}`,
    },
  };
});

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
  borderRadius: "16px 16px 0 0",
  fontWeight: "bold",
}));

const QRWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  borderRadius: theme.shape.borderRadius * 2,
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  backdropFilter: "blur(10px)",
  "& canvas": {
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#ffffff",
    animation: `${pulse} 2s infinite ease-in-out`,
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(10),
  textAlign: "center",
  backgroundColor: alpha(theme.palette.background.default, 0.9),
  borderRadius: 24,
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
  backdropFilter: "blur(10px)",
  animation: `${pulse} 3s infinite ease-in-out`,
}));

const FilterPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  marginBottom: theme.spacing(4),
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.7)})`,
  backdropFilter: "blur(10px)",
  borderTop: `3px solid ${theme.palette.primary.main}`,
  animation: `${pulse} 5s infinite ease-in-out`,
}));

const FilterChip = styled(Chip)(({ theme, active }) => ({
  margin: theme.spacing(0.5),
  transition: "all 0.3s",
  fontWeight: active ? 700 : 400,
  boxShadow: active ? "0 5px 15px rgba(0, 0, 0, 0.1)" : "none",
  transform: active ? "scale(1.05)" : "scale(1)",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const BloodDropIcon = styled(WaterDrop)(({ theme, color }) => ({
  animation: `${pulse} 2s infinite ease-in-out`,
  color: color || theme.palette.error.main,
}));

const ConfettiWrapper = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1300,
}));

const Confetti = styled(Box)(
  ({ theme, delay = 0, size = 10, left = "50%" }) => ({
    position: "absolute",
    width: size,
    height: size,
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    top: "-10px",
    left,
    opacity: 0.8,
    animation: `${bounce} 3s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  })
);

// Main component
const BloodInventoryTable = () => {
  const theme = useTheme();
  const [inventoryData, setInventoryData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [qrDialogData, setQrDialogData] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [bloodTypeFilter, setBloodTypeFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Show confetti when adding new blood unit
  useEffect(() => {
    if (openModal === false && selectedData === null) {
      // This means we just closed the add form
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  }, [openModal, selectedData]);

  // Simulate initial loading animation
  useEffect(() => {
    setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);
  }, []);

  // All the original functions
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await getAllInventory();
      setInventoryData(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSave = async (data) => {
    try {
      if (data._id) {
        await updateInventory(data._id, data);
      } else {
        await createInventory(data);
      }
      fetchInventory();
      setOpenModal(false);
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInventory(id);
      fetchInventory();
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Blood Bank Inventory Report", 14, 22);

    const tableRows = filteredData.map((item) => [
      item.donorID,
      item.collectionDate,
      item.bloodGroup,
      `${item.quantity} units`,
      item.expiryDate,
      item.storageLocation,
      item.collectedBy,
    ]);

    autoTable(doc, {
      head: [
        [
          "Donor ID",
          "Collection Date",
          "Blood Group",
          "Quantity",
          "Expiry Date",
          "Location",
          "Collected By",
        ],
      ],
      body: tableRows,
      startY: 30,
    });

    doc.save("blood_inventory.pdf");
  };

  // Toggle blood type filter
  const handleBloodTypeFilter = (type) => {
    if (bloodTypeFilter.includes(type)) {
      setBloodTypeFilter(bloodTypeFilter.filter((t) => t !== type));
    } else {
      setBloodTypeFilter([...bloodTypeFilter, type]);
    }
  };

  // Check if blood is expiring soon (within 14 days)
  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14 && diffDays > 0;
  };

  // Check if blood is expired
  const isExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return today > expiry;
  };

  // Enhanced filtering logic
  const filteredData = inventoryData
    .filter((item) => {
      // Search filter
      const matchesSearch = !searchQuery
        ? true
        : item.donorID.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.storageLocation
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.collectedBy.toLowerCase().includes(searchQuery.toLowerCase());

      // Blood type filter
      const matchesBloodType =
        bloodTypeFilter.length === 0 ||
        bloodTypeFilter.includes(item.bloodGroup);

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus =
          !isExpired(item.expiryDate) && !isExpiringSoon(item.expiryDate);
      } else if (statusFilter === "expiring") {
        matchesStatus = isExpiringSoon(item.expiryDate);
      } else if (statusFilter === "expired") {
        matchesStatus = isExpired(item.expiryDate);
      }

      return matchesSearch && matchesBloodType && matchesStatus;
    })
    .sort((a, b) => {
      // Sorting logic
      if (sortBy === "newest") {
        return new Date(b.collectionDate) - new Date(a.collectionDate);
      } else if (sortBy === "expiring") {
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      } else if (sortBy === "quantity") {
        return b.quantity - a.quantity;
      }
      return 0;
    });

  // Blood types for filter
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const navigate = useNavigate(); 

  return (
    <>
      {/* Confetti effect */}
      {showConfetti && (
        <ConfettiWrapper>
          {Array.from({ length: 50 }).map((_, index) => (
            <Confetti
              key={index}
              delay={Math.random() * 2}
              size={Math.random() * 15 + 5}
              left={`${Math.random() * 100}%`}
              sx={{
                backgroundColor:
                  index % 5 === 0
                    ? theme.palette.secondary.main
                    : index % 4 === 0
                    ? theme.palette.primary.main
                    : index % 3 === 0
                    ? theme.palette.error.main
                    : index % 2 === 0
                    ? theme.palette.success.main
                    : theme.palette.warning.main,
              }}
            />
          ))}
        </ConfettiWrapper>
      )}

      <Box
        sx={{
          // Changed background to red tints
          background:
            "linear-gradient(135deg, rgba(255,240,240,0.8) 0%, rgba(255,235,235,0.8) 100%)",
          minHeight: "100vh",
          pt: 2,
          pb: 10,
        }}
      >
        <Container maxWidth="xl">
          {/* Enhanced Header Section */}
          <Zoom in={animationComplete} timeout={300}>
            <PageHeader>
              {/* Decorative bubbles */}
              <HeaderBubble size={120} top="10%" left="5%" delay={0.5} />
              <HeaderBubble size={80} top="60%" left="15%" delay={1.2} />
              <HeaderBubble size={100} top="30%" left="80%" delay={0.8} />
              <HeaderBubble size={60} top="70%" left="70%" delay={0.3} />

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                position="relative"
                zIndex={1}
              >
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      textShadow: "2px 2px 8px rgba(0,0,0,0.2)",
                      letterSpacing: "-1px",
                    }}
                  >
                    Blood Bank Inventory
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      opacity: 0.9,
                      mb: 3,
                      fontWeight: 300,
                      maxWidth: "70%",
                    }}
                  >
                    Advanced tracking and management system for your blood units
                  </Typography>
                </Box>
                <Box>
                  <ActionButton
                    variant="contained"
                    color="secondary"
                    // startIcon={<Add />}
                    onClick={() => {
                      setSelectedData(null);
                      setOpenModal(true);
                      navigate("/dashboard"); // ✅ Step 3
                    }}
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      animation: `${pulse} 2s infinite ease-in-out`,
                    }}
                  >
                    Blood Units
                  </ActionButton>
                </Box>
              </Box>

              {/* Enhanced Search Bar */}
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  width: { xs: "100%", sm: "70%", md: "50%" },
                  borderRadius: 50,
                  mt: 4,
                  background: alpha("#ffffff", 0.95),
                  backdropFilter: "blur(10px)",
                  border: "2px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search by donor ID, blood group, location..."
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          sx={{
                            color: "primary.main",
                            ml: 2,
                            animation: searchQuery
                              ? `${pulse} 1s infinite`
                              : "none",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ px: 1 }}
                />
              </Paper>

              {/* Filter buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 4,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <ActionButton
                  variant="contained"
                  startIcon={<FilterList />}
                  color="inherit"
                  sx={{
                    backgroundColor: alpha("#ffffff", 0.9),
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: alpha("#ffffff", 1),
                    },
                  }}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </ActionButton>

                <ActionButton
                  variant="contained"
                  startIcon={<SortByAlpha />}
                  endIcon={<KeyboardArrowDown />}
                  color="inherit"
                  sx={{
                    backgroundColor: alpha("#ffffff", 0.9),
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: alpha("#ffffff", 1),
                    },
                  }}
                  onClick={(e) => setSortAnchorEl(e.currentTarget)}
                >
                  {sortBy === "newest"
                    ? "Newest First"
                    : sortBy === "expiring"
                    ? "Expiring Soon"
                    : "Quantity"}
                </ActionButton>

                <Menu
                  anchorEl={sortAnchorEl}
                  open={Boolean(sortAnchorEl)}
                  onClose={() => setSortAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: 4,
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setSortBy("newest");
                      setSortAnchorEl(null);
                    }}
                    sx={{
                      borderRadius: 2,
                      m: 0.5,
                      fontWeight: sortBy === "newest" ? 700 : 400,
                      bgcolor:
                        sortBy === "newest"
                          ? alpha(theme.palette.primary.main, 0.1)
                          : "transparent",
                    }}
                  >
                    Newest First
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortBy("expiring");
                      setSortAnchorEl(null);
                    }}
                    sx={{
                      borderRadius: 2,
                      m: 0.5,
                      fontWeight: sortBy === "expiring" ? 700 : 400,
                      bgcolor:
                        sortBy === "expiring"
                          ? alpha(theme.palette.primary.main, 0.1)
                          : "transparent",
                    }}
                  >
                    Expiring Soon
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortBy("quantity");
                      setSortAnchorEl(null);
                    }}
                    sx={{
                      borderRadius: 2,
                      m: 0.5,
                      fontWeight: sortBy === "quantity" ? 700 : 400,
                      bgcolor:
                        sortBy === "quantity"
                          ? alpha(theme.palette.primary.main, 0.1)
                          : "transparent",
                    }}
                  >
                    Highest Quantity
                  </MenuItem>
                </Menu>
              </Box>
            </PageHeader>
          </Zoom>

          {/* Advanced Filters Panel */}
          <Collapse in={showFilters}>
            <Slide direction="down" in={showFilters} mountOnEnter unmountOnExit>
              <FilterPanel elevation={0}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Advanced Filters
                  </Typography>
                  <IconButton onClick={() => setShowFilters(false)}>
                    <Close />
                  </IconButton>
                </Box>

                <Grid container spacing={3}>
                  {/* Blood Type Filter */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Blood Types
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {bloodTypes.map((type) => (
                        <FilterChip
                          key={type}
                          label={type}
                          icon={<Bloodtype />}
                          onClick={() => handleBloodTypeFilter(type)}
                          active={bloodTypeFilter.includes(type)}
                          color={
                            bloodTypeFilter.includes(type)
                              ? "primary"
                              : "default"
                          }
                          variant={
                            bloodTypeFilter.includes(type)
                              ? "filled"
                              : "outlined"
                          }
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* Status Filter */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Status
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <FilterChip
                        label="All"
                        onClick={() => setStatusFilter("all")}
                        active={statusFilter === "all"}
                        color={statusFilter === "all" ? "primary" : "default"}
                        variant={statusFilter === "all" ? "filled" : "outlined"}
                      />
                      <FilterChip
                        label="Active"
                        icon={<Notifications color="success" />}
                        onClick={() => setStatusFilter("active")}
                        active={statusFilter === "active"}
                        color={
                          statusFilter === "active" ? "success" : "default"
                        }
                        variant={
                          statusFilter === "active" ? "filled" : "outlined"
                        }
                      />
                      <FilterChip
                        label="Expiring Soon"
                        icon={<Notifications color="warning" />}
                        onClick={() => setStatusFilter("expiring")}
                        active={statusFilter === "expiring"}
                        color={
                          statusFilter === "expiring" ? "warning" : "default"
                        }
                        variant={
                          statusFilter === "expiring" ? "filled" : "outlined"
                        }
                      />
                      <FilterChip
                        label="Expired"
                        icon={<Notifications color="error" />}
                        onClick={() => setStatusFilter("expired")}
                        active={statusFilter === "expired"}
                        color={statusFilter === "expired" ? "error" : "default"}
                        variant={
                          statusFilter === "expired" ? "filled" : "outlined"
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Selected filters summary */}
                {(bloodTypeFilter.length > 0 || statusFilter !== "all") && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.4),
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <strong>Active Filters:</strong>{" "}
                      {bloodTypeFilter.length > 0 &&
                        `Blood Types: ${bloodTypeFilter.join(", ")}`}
                      {bloodTypeFilter.length > 0 &&
                        statusFilter !== "all" &&
                        " | "}
                      {statusFilter !== "all" && `Status: ${statusFilter}`}
                    </Typography>
                  </Box>
                )}
              </FilterPanel>
            </Slide>
          </Collapse>

          {/* Loading State - Enhanced */}
          {loading && (
            <Box sx={{ width: "100%", mt: 4, mb: 6, position: "relative" }}>
              <LinearProgress
                color="primary"
                sx={{
                  height: 12,
                  borderRadius: 6,
                  background: alpha(theme.palette.primary.main, 0.1),
                  overflow: "hidden",
                  "::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `linear-gradient(90deg, transparent, ${alpha(
                      theme.palette.primary.light,
                      0.4
                    )}, transparent)`,
                    backgroundSize: "200% 100%",
                    animation: `${shimmer} 2s infinite`,
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    animation: `${pulse} 1.5s infinite`,
                  }}
                >
                  Loading blood inventory data...
                </Typography>
              </Box>
            </Box>
          )}

          {/* Empty State - Enhanced */}
          {!loading && filteredData.length === 0 && (
            <Slide direction="up" in={true} timeout={800}>
              <EmptyStateContainer>
                <NoAccounts
                  sx={{
                    fontSize: 100,
                    color: alpha(theme.palette.primary.main, 0.3),
                    mb: 3,
                  }}
                />
                {searchQuery ||
                bloodTypeFilter.length > 0 ||
                statusFilter !== "all" ? (
                  <>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      No matching blood units found
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mb: 4, maxWidth: 600 }}
                    >
                      We couldn't find any blood units that match your current
                      filters. Try adjusting your search criteria or clearing
                      filters to see more results.
                    </Typography>
                    <ActionButton
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSearchQuery("");
                        setBloodTypeFilter([]);
                        setStatusFilter("all");
                      }}
                      startIcon={<FilterList />}
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      }}
                    >
                      Clear All Filters
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Your Blood Inventory is Empty
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mb: 4, maxWidth: 600 }}
                    >
                      Start building your inventory by adding your first blood
                      unit. Track donations, manage storage, and monitor expiry
                      dates all in one place.
                    </Typography>
                    <ActionButton
                      variant="contained"
                      color="secondary"
                      startIcon={<Add />}
                      onClick={() => {
                        setSelectedData(null);
                        setOpenModal(true);
                      }}
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                        animation: `${pulse} 2s infinite ease-in-out`,
                        minWidth: 200,
                      }}
                    >
                      Add Your First Blood Unit
                    </ActionButton>
                  </>
                )}
              </EmptyStateContainer>
            </Slide>
          )}

          {/* Blood Inventory Cards - Enhanced */}
          {!loading && filteredData.length > 0 && (
            <>
              <Slide direction="up" in={true} timeout={500}>
                <Box sx={{ mb: 4, mt: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                        gutterBottom
                      >
                        Inventory Overview
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Showing {filteredData.length}{" "}
                        {filteredData.length === 1 ? "unit" : "units"}
                        {(searchQuery ||
                          bloodTypeFilter.length > 0 ||
                          statusFilter !== "all") &&
                          " with applied filters"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Badge
                        badgeContent={
                          filteredData.filter((item) =>
                            isExpiringSoon(item.expiryDate)
                          ).length
                        }
                        color="warning"
                        max={99}
                        sx={{
                          animation:
                            filteredData.filter((item) =>
                              isExpiringSoon(item.expiryDate)
                            ).length > 0
                              ? `${pulse} 2s infinite`
                              : "none",
                        }}
                      >
                        <Chip
                          label="Expiring Soon"
                          color="warning"
                          variant="outlined"
                          icon={<Event />}
                        />
                      </Badge>

                      <Badge
                        badgeContent={
                          filteredData.filter((item) =>
                            isExpired(item.expiryDate)
                          ).length
                        }
                        color="error"
                        max={99}
                      >
                        <Chip
                          label="Expired"
                          color="error"
                          variant="outlined"
                          icon={<Event />}
                        />
                      </Badge>

                      <ActionButton
                        variant="outlined"
                        color="primary"
                        startIcon={<FileDownload />}
                        onClick={handleDownloadPDF}
                      >
                        Export
                      </ActionButton>
                    </Box>
                  </Box>
                </Box>
              </Slide>

              <Grid container spacing={3}>
                {filteredData.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Slide
                      direction="up"
                      in={true}
                      timeout={300 + index * 100}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <BloodCard bloodGroup={item.bloodGroup}>
                        <CardContent sx={{ p: 3 }}>
                          {/* Blood Group Header */}
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                          >
                            <BloodTypeChip
                              label={item.bloodGroup}
                              bloodgroup={item.bloodGroup}
                              size="medium"
                              icon={
                                <BloodDropIcon
                                  color={
                                    item.bloodGroup === "O+"
                                      ? "#43a047"
                                      : undefined
                                  }
                                />
                              }
                            />

                            {isExpired(item.expiryDate) ? (
                              <Chip
                                label="Expired"
                                color="error"
                                size="small"
                                variant="outlined"
                                sx={{
                                  animation: `${pulse} 1.5s infinite`,
                                  fontWeight: "bold",
                                }}
                              />
                            ) : isExpiringSoon(item.expiryDate) ? (
                              <Chip
                                label="Expiring Soon"
                                color="warning"
                                size="small"
                                variant="outlined"
                                sx={{
                                  animation: `${pulse} 1.5s infinite`,
                                  fontWeight: "bold",
                                }}
                              />
                            ) : (
                              <Chip
                                label="Active"
                                color="success"
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: "bold" }}
                              />
                            )}
                          </Box>

                          <Divider
                            sx={{
                              mb: 2,
                              borderColor: alpha(theme.palette.divider, 0.6),
                            }}
                          />

                          {/* Info Rows - Enhanced */}
                          <Box sx={{ px: 1 }}>
                            <DataRow>
                              <Person fontSize="small" color="primary" />
                              <Typography
                                fontWeight="bold"
                                variant="body2"
                                width={100}
                                color="text.primary"
                              >
                                Donor ID:
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.donorID}
                              </Typography>
                            </DataRow>

                            <DataRow>
                              <CalendarMonth fontSize="small" color="primary" />
                              <Typography
                                fontWeight="bold"
                                variant="body2"
                                width={100}
                                color="text.primary"
                              >
                                Collected:
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {new Date(
                                  item.collectionDate
                                ).toLocaleDateString()}
                              </Typography>
                            </DataRow>

                            <DataRow>
                              <Numbers fontSize="small" color="primary" />
                              <Typography
                                fontWeight="bold"
                                variant="body2"
                                width={100}
                                color="text.primary"
                              >
                                Quantity:
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontWeight:
                                    item.quantity > 3 ? "bold" : "normal",
                                  color:
                                    item.quantity > 3
                                      ? "success.main"
                                      : "text.secondary",
                                }}
                              >
                                {item.quantity} units
                              </Typography>
                            </DataRow>

                            <DataRow>
                              <Event fontSize="small" color="primary" />
                              <Typography
                                fontWeight="bold"
                                variant="body2"
                                width={100}
                                color="text.primary"
                              >
                                Expires:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: isExpired(item.expiryDate)
                                    ? "error.main"
                                    : isExpiringSoon(item.expiryDate)
                                    ? "warning.main"
                                    : "text.secondary",
                                  fontWeight:
                                    isExpired(item.expiryDate) ||
                                    isExpiringSoon(item.expiryDate)
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                {new Date(item.expiryDate).toLocaleDateString()}
                              </Typography>
                            </DataRow>

                            <DataRow>
                              <LocationOn fontSize="small" color="primary" />
                              <Typography
                                fontWeight="bold"
                                variant="body2"
                                width={100}
                                color="text.primary"
                              >
                                Location:
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.storageLocation}
                              </Typography>
                            </DataRow>

                            <DataRow>
                              <Person fontSize="small" color="primary" />
                              <Typography
                                fontWeight="bold"
                                variant="body2"
                                width={100}
                                color="text.primary"
                              >
                                Collected By:
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.collectedBy}
                              </Typography>
                            </DataRow>
                          </Box>
                        </CardContent>

                        <CardActions
                          sx={{
                            justifyContent: "flex-end",
                            p: 2,
                            background: `linear-gradient(to bottom, transparent, ${alpha(
                              theme.palette.background.default,
                              0.7
                            )})`,
                            backdropFilter: "blur(5px)",
                            borderBottomLeftRadius: 24,
                            borderBottomRightRadius: 24,
                          }}
                        >
                          <Tooltip title="View QR Code" arrow placement="top">
                            <StyledIconButton
                              color="primary"
                              onClick={() => setQrDialogData(item)}
                              sx={{
                                background: alpha(
                                  theme.palette.primary.main,
                                  0.05
                                ),
                                "&:hover": {
                                  background: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                },
                              }}
                            >
                              <img
                                src={view}
                                alt="view"
                                width={42}
                                style={{
                                  borderRadius: "50%",
                                  border: `2px solid ${alpha(
                                    theme.palette.primary.main,
                                    0.4
                                  )}`,
                                  padding: 6,
                                  transition: "transform 0.3s",
                                }}
                              />
                            </StyledIconButton>
                          </Tooltip>
                          <Tooltip title="Edit Unit" arrow placement="top">
                            <StyledIconButton
                              color="info"
                              onClick={() => {
                                setSelectedData(item);
                                setOpenModal(true);
                              }}
                              sx={{
                                background: alpha(
                                  theme.palette.info.main,
                                  0.05
                                ),
                                "&:hover": {
                                  background: alpha(
                                    theme.palette.info.main,
                                    0.1
                                  ),
                                },
                              }}
                            >
                              <img
                                src={edit}
                                alt="edit"
                                width={42}
                                style={{
                                  borderRadius: "50%",
                                  border: `2px solid ${alpha(
                                    theme.palette.info.main,
                                    0.4
                                  )}`,
                                  padding: 6,
                                  transition: "transform 0.3s",
                                }}
                              />
                            </StyledIconButton>
                          </Tooltip>
                          <Tooltip title="Delete Unit" arrow placement="top">
                            <StyledIconButton
                              color="error"
                              onClick={() => setConfirmDeleteId(item._id)}
                              sx={{
                                background: alpha(
                                  theme.palette.error.main,
                                  0.05
                                ),
                                "&:hover": {
                                  background: alpha(
                                    theme.palette.error.main,
                                    0.1
                                  ),
                                },
                              }}
                            >
                              <img
                                src={del}
                                alt="delete"
                                width={42}
                                style={{
                                  borderRadius: "50%",
                                  border: `2px solid ${alpha(
                                    theme.palette.error.main,
                                    0.4
                                  )}`,
                                  padding: 6,
                                  transition: "transform 0.3s",
                                }}
                              />
                            </StyledIconButton>
                          </Tooltip>
                        </CardActions>
                      </BloodCard>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {/* Float Button for Add */}
          <FloatingActionButton
            color="secondary"
            onClick={() => {
              setSelectedData(null);
              setOpenModal(true);
            }}
          >
            <Add />
          </FloatingActionButton>

          {/* Form Modal - Enhanced */}
          <BloodInventoryForm
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSuccess={handleSave}
            defaultValues={selectedData}
          />

          {/* QR Code Dialog - Enhanced */}
          <Dialog
            open={!!qrDialogData}
            onClose={() => setQrDialogData(null)}
            maxWidth="xs"
            PaperProps={{
              sx: {
                borderRadius: 4,
                background: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: "blur(10px)",
                overflow: "hidden",
              },
            }}
            TransitionComponent={Zoom}
          >
            <StyledDialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <QrCode sx={{ mr: 1 }} /> QR Code Information
              </Box>
              <IconButton
                onClick={() => setQrDialogData(null)}
                sx={{ color: "white" }}
              >
                <Close />
              </IconButton>
            </StyledDialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <QRWrapper>
                <QRCodeCanvas
                  value={JSON.stringify(qrDialogData || {})}
                  size={220}
                  level="H"
                  includeMargin
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 2 }}
                >
                  Scan to verify blood unit details
                </Typography>
              </QRWrapper>

              {qrDialogData && (
                <Box mt={4}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Blood Unit Details
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          gutterBottom
                          color="text.secondary"
                        >
                          <strong>Donor ID:</strong>
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          fontWeight="medium"
                        >
                          {qrDialogData.donorID}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          gutterBottom
                          color="text.secondary"
                        >
                          <strong>Blood Type:</strong>
                        </Typography>
                        <BloodTypeChip
                          label={qrDialogData.bloodGroup}
                          bloodgroup={qrDialogData.bloodGroup}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          gutterBottom
                          color="text.secondary"
                        >
                          <strong>Quantity:</strong>
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          fontWeight="medium"
                        >
                          {qrDialogData.quantity} units
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          gutterBottom
                          color="text.secondary"
                        >
                          <strong>Expiry:</strong>
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          fontWeight="medium"
                          color={
                            isExpired(qrDialogData.expiryDate)
                              ? "error.main"
                              : isExpiringSoon(qrDialogData.expiryDate)
                              ? "warning.main"
                              : "inherit"
                          }
                        >
                          {new Date(
                            qrDialogData.expiryDate
                          ).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                bgcolor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <ActionButton
                onClick={() => setQrDialogData(null)}
                variant="outlined"
                color="primary"
              >
                Close
              </ActionButton>
            </DialogActions>
          </Dialog>

          {/* Confirm Delete Dialog - Enhanced */}
          <Dialog
            open={!!confirmDeleteId}
            onClose={() => setConfirmDeleteId(null)}
            maxWidth="xs"
            PaperProps={{
              sx: {
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 15px 50px rgba(0, 0, 0, 0.2)",
              },
            }}
            TransitionComponent={Zoom}
          >
            <StyledDialogTitle
              sx={{
                bgcolor: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Delete sx={{ mr: 1 }} /> Confirm Deletion
              </Box>
              <IconButton
                onClick={() => setConfirmDeleteId(null)}
                sx={{ color: "white" }}
              >
                <Close />
              </IconButton>
            </StyledDialogTitle>
            <DialogContent sx={{ p: 4, mt: 1 }}>
              <Typography
                color="error"
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Bloodtype sx={{ mr: 1 }} /> Warning: Permanent Action
              </Typography>
              <Typography variant="body1" paragraph>
                You are about to permanently delete this blood unit record from
                the inventory database. This action cannot be undone.
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.error.light, 0.1),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Are you absolutely sure you want to delete this blood unit
                  record from inventory?
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                bgcolor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <Button
                onClick={() => setConfirmDeleteId(null)}
                sx={{
                  borderRadius: 30,
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <ActionButton
                onClick={() => handleDelete(confirmDeleteId)}
                color="error"
                variant="contained"
                startIcon={<Delete />}
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                }}
              >
                Delete Permanently
              </ActionButton>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default BloodInventoryTable;