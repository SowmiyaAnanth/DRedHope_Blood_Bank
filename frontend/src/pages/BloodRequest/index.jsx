import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  Button,
  TextField,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BloodRequestForm from "./components/CreateRequestForm";
import BloodRequestButton from "./Styles/CreateButton";
import MagicMotionButton from "./Styles/MagicMotionButton";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import deleteIcon from "../../assets/images/delete.jpg";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import { Person, Numbers, Event, LocationOn } from "@mui/icons-material";
import { CardActions, Tooltip } from "@mui/material";
import {
  getAllRequests,
  createRequest,
  updateRequest,
  deleteRequest,
} from "../../api/bloodRequestAPI";

// const mockBloodRequests = [
//   {
//     id: 1,
//     requesterName: "Banu Sundar",
//     requesterType: "Patient",
//     patientOrHospitalId: "P12345",
//     bloodGroup: ["A+"],
//     quantity: 2,
//     reason: "Surgery",
//     emergencyLevel: "Emergency",
//     requestDate: "2025-03-12",
//     requestedBy: "Dr. Smith",
//     location: "City Hospital",
//   },
//   {
//     id: 2,
//     requesterName: "Sowmi Ananth",
//     requesterType: "Hospital",
//     patientOrHospitalId: "H56789",
//     bloodGroup: ["O-"],
//     quantity: 5,
//     reason: "Emergency Stock",
//     emergencyLevel: "Normal",
//     requestDate: "2025-03-12",
//     requestedBy: "Admin Staff",
//     location: "City Blood Bank",
//   },
// ];

const BloodRequestBoard = () => {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState({ bloodGroup: "", emergencyLevel: "" });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const emergencyLevels = ["Normal", "Emergency"];

  useEffect(() => {
    fetchRequests();
  }, []);

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
      req.requestDate,
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
    const bloodGroupMatch =
      !filter.bloodGroup || req.bloodGroup.includes(filter.bloodGroup);
    const emergencyMatch =
      !filter.emergencyLevel || req.emergencyLevel === filter.emergencyLevel;
    return bloodGroupMatch && emergencyMatch;
  });

  const groupedRequests = {
    Patient: filteredRequests.filter((r) => r.requesterType === "Patient"),
    Hospital: filteredRequests.filter((r) => r.requesterType === "Hospital"),
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" mb={6}>
        <BloodRequestButton onClick={() => setOpenForm(true)} />
        <Stack
          direction="row"
          spacing={2}
          sx={{
            //backgroundColor: "#FFB6B6", // light red
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
        </Stack>
      </Grid>

      <Grid container spacing={2}>
        {["Patient", "Hospital"].map((type) => (
          <Grid item xs={12} md={6} key={type}>
            {groupedRequests[type].map((request) => (
              <Card
                key={request._id}
                sx={{
                  mb: 3, // ✅ adds vertical space between cards (like a "row gap")
                  borderRadius: 4,
                  bgcolor: "white",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 6px 25px rgba(152, 0, 234, 0.6)",
                  },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: type === "Patient" ? "#e91e63" : "#3f51b5", // pink for Patient, blue for Hospital
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    {type} Requests
                  </Typography>
                </Box>
                <CardContent sx={{ px: 3, pt: 3, pb: 1 }}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    sx={{
                      background: "white", // or your desired background
                      borderRadius: 3,
                      p: 2,
                      borderWidth: "3px", // ✅ border thickness
                      borderStyle: "solid", // ✅ required to show width
                      borderColor: "rgba(152, 0, 234, 0.6)", // ✅ purple border
                      boxShadow: "inset 0 0 5px rgba(230, 255, 5, 0.2)", // yellow glow inside
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person color="primary" fontSize="small" />
                      <Typography fontWeight="bold" variant="subtitle1">
                        Name:
                      </Typography>
                      <Typography>{request.requesterName}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Numbers color="secondary" fontSize="small" />
                      <Typography fontWeight="bold" variant="subtitle1">
                        ID:
                      </Typography>
                      <Typography>{request.patientOrHospitalId}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <BloodtypeIcon color="error" fontSize="small" />
                      <Typography fontWeight="bold" variant="subtitle1">
                        Blood Group:
                      </Typography>
                      <Typography>{request.bloodGroup.join(", ")}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Numbers fontSize="small" color="warning" />
                      <Typography fontWeight="bold" variant="subtitle1">
                        Quantity:
                      </Typography>
                      <Typography>{request.quantity} Unit(s)</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <WarningAmberIcon
                        fontSize="small"
                        color={
                          request.emergencyLevel === "Emergency"
                            ? "error"
                            : "success"
                        }
                      />
                      <Typography fontWeight="bold" variant="subtitle1">
                        Emergency:
                      </Typography>
                      <Typography>{request.emergencyLevel}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Event fontSize="small" color="secondary" />
                      <Typography fontWeight="bold" variant="subtitle1">
                        Request Date:
                      </Typography>
                      <Typography>{request.requestDate}</Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {/* Location Info */}
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationOn fontSize="small" color="info" />
                        <Typography fontWeight="bold" variant="subtitle1">
                          Location:
                        </Typography>
                        <Typography>{request.location}</Typography>
                      </Box>

                      {/* Edit + Delete Icons */}
                      <Box display="flex" gap={1}>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(request)}
                            sx={{
                              backgroundColor: "#4CAF50",
                              color: "#fff",
                              borderRadius: 2,
                              "&:hover": {
                                backgroundColor: "#45a049",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => setDeleteTarget(request)}
                            sx={{
                              backgroundColor: "#f44336",
                              color: "#fff",
                              borderRadius: 2,
                              "&:hover": {
                                backgroundColor: "#d32f2f",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>

                {/* <CardActions sx={{ justifyContent: "flex-end", px: 2, gap: 1 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleEdit(request)}
                      sx={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "#45a049",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => setDeleteTarget(request)}
                      sx={{
                        backgroundColor: "#f44336",
                        color: "#fff",
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "#d32f2f",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions> */}
              </Card>
            ))}
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
