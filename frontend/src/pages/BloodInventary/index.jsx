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
} from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import BloodInventoryForm from "./compontens/CreateForm";
import MagicButton from "./compontens/MagicButton";
import { styled } from "@mui/material/styles";
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

// Styled components for enhanced UI
const PageHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4, 4, 6, 4),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, rgba(255,255,255,0) 50%, rgba(255,255,255,0.15) 100%)",
  },
}));

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
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    border: `1px solid ${alpha(color, 0.2)}`,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "6px",
      width: "100%",
      background: color,
    },
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: `0 12px 30px ${alpha(color, 0.2)}`,
    },
  };
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  transition: "all 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: "50%",
  padding: theme.spacing(1),
  transition: "all 0.2s",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const DataRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 0),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
  "&:last-child": {
    borderBottom: "none",
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
      0.1
    ),
    color: bloodColors[bloodgroup] || theme.palette.primary.main,
    fontWeight: "bold",
    border: `1px solid ${
      bloodColors[bloodgroup] || theme.palette.primary.main
    }`,
  };
});

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const QRWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  "& canvas": {
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#ffffff",
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(8),
  textAlign: "center",
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${theme.palette.divider}`,
}));

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

    const tableRows = inventoryData.map((item) => [
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

  // Filter data based on search query
  const filteredData = inventoryData.filter((item) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      item.donorID.toLowerCase().includes(searchLower) ||
      item.bloodGroup.toLowerCase().includes(searchLower) ||
      item.storageLocation.toLowerCase().includes(searchLower) ||
      item.collectedBy.toLowerCase().includes(searchLower)
    );
  });

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

  return (
    <Box
      sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.4),
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <PageHeader>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Blood Bank Inventory
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
                Manage and track blood units across your facilities
              </Typography>
            </Box>
            <Box>
              <ActionButton
                variant="contained"
                color="secondary"
                startIcon={<Add />}
                onClick={() => {
                  setSelectedData(null);
                  setOpenModal(true);
                }}
              >
                Add New Blood Unit
              </ActionButton>
            </Box>
          </Box>

          {/* Search & Filter Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 0.5,
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: "60%", md: "40%" },
              borderRadius: 6,
              mt: 2,
              background: alpha("#ffffff", 0.9),
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
                    <Search sx={{ color: "text.secondary", ml: 1 }} />
                  </InputAdornment>
                ),
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ px: 1 }}
            />
          </Paper>
        </PageHeader>

        {/* Loading State */}
        {loading && (
          <Box sx={{ width: "100%", mt: 2, mb: 4 }}>
            <LinearProgress color="primary" />
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredData.length === 0 && (
          <EmptyStateContainer>
            <NoAccounts sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
            {searchQuery ? (
              <>
                <Typography variant="h6" gutterBottom>
                  No matching blood units found
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 3 }}
                >
                  Try adjusting your search or clearing filters
                </Typography>
                <Button variant="outlined" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  No blood units in inventory
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 3 }}
                >
                  Add your first blood inventory item to get started
                </Typography>
                <ActionButton
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => {
                    setSelectedData(null);
                    setOpenModal(true);
                  }}
                >
                  Add Blood Inventory
                </ActionButton>
              </>
            )}
          </EmptyStateContainer>
        )}

        {/* Blood Inventory Cards */}
        {!loading && filteredData.length > 0 && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Showing {filteredData.length}{" "}
                {filteredData.length === 1 ? "item" : "items"}
                {searchQuery && ` for "${searchQuery}"`}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {filteredData.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Zoom in={true} style={{ transitionDelay: "100ms" }}>
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
                            icon={<Bloodtype />}
                          />

                          {isExpired(item.expiryDate) ? (
                            <Chip
                              label="Expired"
                              color="error"
                              size="small"
                              variant="outlined"
                            />
                          ) : isExpiringSoon(item.expiryDate) ? (
                            <Chip
                              label="Expiring Soon"
                              color="warning"
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Chip
                              label="Active"
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Info Rows */}
                        <Box sx={{ px: 1 }}>
                          <DataRow>
                            <Person fontSize="small" color="action" />
                            <Typography
                              fontWeight="bold"
                              variant="body2"
                              width={100}
                            >
                              Donor ID:
                            </Typography>
                            <Typography variant="body2">
                              {item.donorID}
                            </Typography>
                          </DataRow>

                          <DataRow>
                            <CalendarMonth fontSize="small" color="action" />
                            <Typography
                              fontWeight="bold"
                              variant="body2"
                              width={100}
                            >
                              Collected On:
                            </Typography>
                            <Typography variant="body2">
                              {new Date(
                                item.collectionDate
                              ).toLocaleDateString()}
                            </Typography>
                          </DataRow>

                          <DataRow>
                            <Numbers fontSize="small" color="action" />
                            <Typography
                              fontWeight="bold"
                              variant="body2"
                              width={100}
                            >
                              Quantity:
                            </Typography>
                            <Typography variant="body2">
                              {item.quantity} units
                            </Typography>
                          </DataRow>

                          <DataRow>
                            <Event fontSize="small" color="action" />
                            <Typography
                              fontWeight="bold"
                              variant="body2"
                              width={100}
                            >
                              Expiry Date:
                            </Typography>
                            <Typography
                              variant="body2"
                              color={
                                isExpired(item.expiryDate)
                                  ? "error.main"
                                  : isExpiringSoon(item.expiryDate)
                                  ? "warning.main"
                                  : "inherit"
                              }
                            >
                              {new Date(item.expiryDate).toLocaleDateString()}
                            </Typography>
                          </DataRow>

                          <DataRow>
                            <LocationOn fontSize="small" color="action" />
                            <Typography
                              fontWeight="bold"
                              variant="body2"
                              width={100}
                            >
                              Location:
                            </Typography>
                            <Typography variant="body2">
                              {item.storageLocation}
                            </Typography>
                          </DataRow>

                          <DataRow>
                            <Person fontSize="small" color="action" />
                            <Typography
                              fontWeight="bold"
                              variant="body2"
                              width={100}
                            >
                              Collected By:
                            </Typography>
                            <Typography variant="body2">
                              {item.collectedBy}
                            </Typography>
                          </DataRow>
                        </Box>
                      </CardContent>

                      <CardActions
                        sx={{
                          justifyContent: "flex-end",
                          p: 2,
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                        }}
                      >
                        <Tooltip title="View QR Code" arrow>
                          <StyledIconButton
                            color="primary"
                            onClick={() => setQrDialogData(item)}
                          >
                            <img
                              src={view}
                              alt="view"
                              width={40}
                              style={{
                                borderRadius: "50%",
                                border: `2px solid ${alpha(
                                  theme.palette.primary.main,
                                  0.3
                                )}`,
                                padding: 4,
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.05
                                ),
                              }}
                            />
                          </StyledIconButton>
                        </Tooltip>
                        <Tooltip title="Edit Unit" arrow>
                          <StyledIconButton
                            color="info"
                            onClick={() => {
                              setSelectedData(item);
                              setOpenModal(true);
                            }}
                          >
                            <img
                              src={edit}
                              alt="edit"
                              width={40}
                              style={{
                                borderRadius: "50%",
                                border: `2px solid ${alpha(
                                  theme.palette.info.main,
                                  0.3
                                )}`,
                                padding: 4,
                                backgroundColor: alpha(
                                  theme.palette.info.main,
                                  0.05
                                ),
                              }}
                            />
                          </StyledIconButton>
                        </Tooltip>
                        <Tooltip title="Delete Unit" arrow>
                          <StyledIconButton
                            color="error"
                            onClick={() => setConfirmDeleteId(item._id)}
                          >
                            <img
                              src={del}
                              alt="delete"
                              width={40}
                              style={{
                                borderRadius: "50%",
                                border: `2px solid ${alpha(
                                  theme.palette.error.main,
                                  0.3
                                )}`,
                                padding: 4,
                                backgroundColor: alpha(
                                  theme.palette.error.main,
                                  0.05
                                ),
                              }}
                            />
                          </StyledIconButton>
                        </Tooltip>
                      </CardActions>
                    </BloodCard>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Export Button */}
        <Box mt={6} display="flex" justifyContent="flex-start">
          <MagicButton onClick={handleDownloadPDF} />
        </Box>

        {/* Form Modal */}
        <BloodInventoryForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={handleSave}
          defaultValues={selectedData}
        />

        {/* QR Code Dialog */}
        <Dialog
          open={!!qrDialogData}
          onClose={() => setQrDialogData(null)}
          maxWidth="xs"
        >
          <StyledDialogTitle sx={{ display: "flex", alignItems: "center" }}>
            <QrCode sx={{ mr: 1 }} /> QR Code Information
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
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Blood Unit Details
                </Typography>
                <Box
                  sx={{
                    bgcolor: "background.default",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2" gutterBottom>
                    <strong>Donor ID:</strong> {qrDialogData.donorID}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Blood Type:</strong> {qrDialogData.bloodGroup}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Quantity:</strong> {qrDialogData.quantity} units
                  </Typography>
                  <Typography variant="body2">
                    <strong>Expiry:</strong>{" "}
                    {new Date(qrDialogData.expiryDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: "background.default" }}>
            <Button
              onClick={() => setQrDialogData(null)}
              variant="outlined"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog
          open={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
          maxWidth="xs"
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <StyledDialogTitle
            sx={{
              bgcolor: "error.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Delete sx={{ mr: 1 }} /> Confirm Deletion
          </StyledDialogTitle>
          <DialogContent sx={{ p: 3, mt: 2 }}>
            <Typography
              color="error"
              variant="subtitle1"
              fontWeight="medium"
              gutterBottom
            >
              This action cannot be undone.
            </Typography>
            <Typography>
              Are you sure you want to permanently delete this blood unit record
              from inventory?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: "background.default" }}>
            <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
            <Button
              onClick={() => handleDelete(confirmDeleteId)}
              color="error"
              variant="contained"
              startIcon={<Delete />}
            >
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BloodInventoryTable;
