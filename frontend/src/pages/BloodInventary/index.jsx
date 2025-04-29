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
} from "@mui/material";
import {
  CalendarMonth,
  Bloodtype,
  LocationOn,
  Event,
  Person,
  Numbers,
} from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import BloodInventoryForm from "./compontens/CreateForm";
import MagicButton from "./compontens/MagicButton";
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

const BloodInventoryTable = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [qrDialogData, setQrDialogData] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchInventory = async () => {
    try {
      const res = await getAllInventory();
      setInventoryData(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
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

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedData(null);
            setOpenModal(true);
          }}
        >
          Add Blood Inventory
        </Button>
      </Box>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        Blood Bank Inventory
      </Typography>

      <Grid container spacing={3}>
        {inventoryData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 6px 25px rgba(255,0,0,0.6)",
                },
              }}
            >
              <CardContent>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" gap={1}>
                    <Person />
                    <Typography fontWeight="bold">Donor ID:</Typography>
                    <Typography>{item.donorID}</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <CalendarMonth />
                    <Typography fontWeight="bold">Collected On:</Typography>
                    <Typography>{item.collectionDate}</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Bloodtype />
                    <Typography fontWeight="bold">Blood Group:</Typography>
                    <Typography>{item.bloodGroup}</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Numbers />
                    <Typography fontWeight="bold">Quantity:</Typography>
                    <Typography>{item.quantity} units</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Event />
                    <Typography fontWeight="bold">Expiry Date:</Typography>
                    <Typography>{item.expiryDate}</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <LocationOn />
                    <Typography fontWeight="bold">Location:</Typography>
                    <Typography>{item.storageLocation}</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Person />
                    <Typography fontWeight="bold">Collected By:</Typography>
                    <Typography>{item.collectedBy}</Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Tooltip title="View QR">
                  <IconButton
                    color="primary"
                    onClick={() => setQrDialogData(item)}
                  >
                    <img
                      src={view}
                      alt="view"
                      width={40}
                      style={{ borderRadius: "50%" }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
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
                      style={{ borderRadius: "50%" }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => setConfirmDeleteId(item._id)}
                  >
                    <img
                      src={del}
                      alt="delete"
                      width={40}
                      style={{ borderRadius: "50%" }}
                    />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={6} display="flex" justifyContent="flex-start">
        <MagicButton onClick={handleDownloadPDF} />
      </Box>

      <BloodInventoryForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleSave}
        defaultValues={selectedData}
      />

      <Dialog open={!!qrDialogData} onClose={() => setQrDialogData(null)}>
        <DialogTitle>QR Code Info</DialogTitle>
        <DialogContent>
          <QRCodeCanvas value={JSON.stringify(qrDialogData || {})} size={200} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogData(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this record?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button
            onClick={() => handleDelete(confirmDeleteId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BloodInventoryTable;