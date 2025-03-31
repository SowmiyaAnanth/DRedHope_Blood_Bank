import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
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
  Visibility,
  Edit,
  Delete,
  Bloodtype,
  LocationOn,
  Event,
  Person,
  CalendarMonth,
  Numbers,
} from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import BloodInventoryForm from "./compontens/CreateForm";
import MagicButton from "./compontens/MagicButton";
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

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    const dummyData = [
      {
        _id: 1,
        donorID: "D001",
        collectionDate: "2025-03-20",
        bloodGroup: "A+",
        quantity: 5,
        expiryDate: "2025-04-30",
        storageLocation: "City Hospital",
        collectedBy: "Staff A",
      },
      {
        _id: 2,
        donorID: "D002",
        collectionDate: "2025-03-18",
        bloodGroup: "B+",
        quantity: 3,
        expiryDate: "2025-04-28",
        storageLocation: "National Blood Bank",
        collectedBy: "Staff B",
      },
    ];
    setInventoryData(dummyData);
  };

  const handleSave = (data) => {
    if (data._id) {
      setInventoryData((prev) =>
        prev.map((item) => (item._id === data._id ? data : item))
      );
    } else {
      const newItem = { ...data, _id: Date.now() };
      setInventoryData((prev) => [...prev, newItem]);
    }
    setOpenModal(false);
  };

  const handleDelete = (id) => {
    setInventoryData((prev) => prev.filter((item) => item._id !== id));
    setConfirmDeleteId(null);
  };

 const handleDownloadPDF = () => {
   const doc = new jsPDF();

   doc.setFontSize(18);
   doc.text("Blood Bank Inventory Report", 14, 22);

   const tableColumn = [
     "Donor ID",
     "Collection Date",
     "Blood Group",
     "Quantity",
     "Expiry Date",
     "Location",
     "Collected By",
   ];

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
     head: [tableColumn],
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
                bgcolor: item.bgColor || "white",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 6px 25px rgba(255,0,0,0.6)",
                },
              }}
            >
              <CardContent sx={{ px: 3, pt: 3, pb: 1 }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  sx={{
                    background: "#fff5f5",
                    borderRadius: 3,
                    p: 2,
                    boxShadow: "inset 0 0 5px rgba(255,0,0,0.2)",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" color="primary" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Donor ID:
                    </Typography>
                    <Typography>{item.donorID}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarMonth fontSize="small" color="success" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Collected On:
                    </Typography>
                    <Typography>{item.collectionDate}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Bloodtype fontSize="small" color="error" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Blood Group:
                    </Typography>
                    <Typography>{item.bloodGroup}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Numbers fontSize="small" color="warning" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Quantity:
                    </Typography>
                    <Typography>{item.quantity} units</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Event fontSize="small" color="secondary" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Expiry Date:
                    </Typography>
                    <Typography>{item.expiryDate}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOn fontSize="small" color="info" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Location:
                    </Typography>
                    <Typography>{item.storageLocation}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" color="success" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Collected By:
                    </Typography>
                    <Typography>{item.collectedBy}</Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
                {/* View QR Code */}
                <Tooltip title="View QR">
                  <IconButton
                    color="primary"
                    onClick={() => setQrDialogData(item)} 
                  >
                    <img
                      src={view}
                      alt="View QR"
                      width={40}
                      height={40}
                      style={{
                        pointerEvents: "none",
                        borderRadius: "50%",
                        border: "3px solid #F0E68C", 
                        background: "#e1f5fe", 
                        padding: "4px", 
                      }}
                    />
                  </IconButton>
                </Tooltip>

                {/* Edit Item */}
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
                      alt="Edit"
                      width={40}
                      height={40}
                      style={{
                        pointerEvents: "none",
                        borderRadius: "50%", 
                        border: "3px solid #018749", 
                        background: "#e1f5fe", 
                        padding: "4px", 
                      }}
                    />
                  </IconButton>
                </Tooltip>

                {/* Delete Item */}
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => setConfirmDeleteId(item._id)} 
                  >
                    <img
                      src={del}
                      alt="Delete"
                      width={40}
                      height={40}
                      style={{
                        pointerEvents: "none",
                        borderRadius: "50%", 
                        border: "3px solid #DC143C", 
                        background: "#e1f5fe", 
                        padding: "4px", 
                      }}
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

      {/* Form Dialog */}
      <BloodInventoryForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleSave}
        defaultValues={selectedData}
      />

      {/* QR Dialog */}
      <Dialog open={!!qrDialogData} onClose={() => setQrDialogData(null)}>
        <DialogTitle>QR Code Info</DialogTitle>
        <DialogContent>
          <QRCodeCanvas value={JSON.stringify(qrDialogData || {})} size={200} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogData(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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
