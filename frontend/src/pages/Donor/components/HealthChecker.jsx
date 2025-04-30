import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  Box,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const HealthChecker = ({ donorId }) => {
  const [healthData, setHealthData] = useState(null);
  const [eligibilityStatus, setEligibilityStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [eligibilityReasons, setEligibilityReasons] = useState([]);

  const disqualifyingDiseases = ["diabetes", "tuberculosis", "hiv", "aids", "heart disease", "cancer"];

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await fetch(`http://localhost:8001/donors/${donorId}`);
        const data = await res.json();

        if (res.ok) {
          const chronicDiseases = data.chronicDiseases?.toLowerCase() || "";

          setHealthData({
            age: data.age || "",
            weight: data.weight || "",
            height: data.height || "",
            chronicDiseases: data.chronicDiseases || "",
            recentSurgery: data.recentSurgery || false,
            onMedication: data.onMedication || false,
            hadPreviousDonation: data.hadPreviousDonation || false,
            lastDonationDate: data.lastDonationDate || "",
          });

          // Check eligibility criteria
          const reasons = [];
          const weightOK = Number(data.weight) > 50;
          const heightOK = Number(data.height) > 150;
          const ageOK = Number(data.age) >= 18;
          const hasDisqualifyingDisease = disqualifyingDiseases.some(disease =>
            chronicDiseases.includes(disease)
          );

          if (!weightOK) reasons.push("Weight must be more than 50kg");
          if (!heightOK) reasons.push("Height must be more than 150cm");
          if (!ageOK) reasons.push("Age must be 18 or above");
          if (hasDisqualifyingDisease) {
            const foundDiseases = disqualifyingDiseases.filter(disease => 
              chronicDiseases.includes(disease)
            );
            reasons.push(`Has disqualifying disease(s): ${foundDiseases.join(", ")}`);
          }
          if (data.recentSurgery) reasons.push("Recent surgery");
          if (data.onMedication) reasons.push("Currently on medication");

          setEligibilityReasons(reasons);

          if (reasons.length === 0) {
            setEligibilityStatus("✅ Eligible for Donation");
          } else {
            setEligibilityStatus("❌ Not Eligible for Donation");
          }
        } else {
          throw new Error("Failed to load donor.");
        }
      } catch (err) {
        console.error("❌ Error loading donor:", err);
        setError("❌ Failed to load donor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, [donorId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Health Checker
      </Typography>

      {eligibilityStatus && (
        <Alert 
          severity={eligibilityStatus.includes("Eligible") ? "success" : "error"} 
          sx={{ mb: 2 }}
        >
          {eligibilityStatus}
        </Alert>
      )}

      {eligibilityReasons.length > 0 && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 2, border: '1px solid #ffe0b2' }}>
          <Typography variant="subtitle1" fontWeight="bold" color="#ef6c00" gutterBottom>
            Reasons for Ineligibility:
          </Typography>
          <List>
            {eligibilityReasons.map((reason, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText primary={reason} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 2, border: '1px solid #c8e6c9' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="#2e7d32" gutterBottom>
          Health Requirements:
        </Typography>
        <List>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Weight must be more than 50kg" />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Height must be more than 150cm" />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Age must be 18 or above" />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="No disqualifying diseases" />
          </ListItem>
        </List>
      </Box>

      <TextField
        fullWidth
        margin="dense"
        type="number"
        label="Age"
        value={healthData.age}
        InputProps={{
          endAdornment: <InputAdornment position="end">years</InputAdornment>,
          readOnly: true,
        }}
      />
      <TextField
        fullWidth
        margin="dense"
        type="number"
        label="Weight"
        value={healthData.weight}
        InputProps={{
          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          readOnly: true,
        }}
      />
      <TextField
        fullWidth
        margin="dense"
        type="number"
        label="Height"
        value={healthData.height}
        InputProps={{
          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
          readOnly: true,
        }}
      />
      <TextField
        fullWidth
        margin="dense"
        label="Chronic Diseases"
        value={healthData.chronicDiseases}
        InputProps={{ readOnly: true }}
      />
      <TextField
        fullWidth
        margin="dense"
        label="Recent Surgery"
        value={healthData.recentSurgery ? "Yes" : "No"}
        InputProps={{ readOnly: true }}
      />
      <TextField
        fullWidth
        margin="dense"
        label="On Medication"
        value={healthData.onMedication ? "Yes" : "No"}
        InputProps={{ readOnly: true }}
      />
      <TextField
        fullWidth
        margin="dense"
        label="Had Previous Donation"
        value={healthData.hadPreviousDonation ? "Yes" : "No"}
        InputProps={{ readOnly: true }}
      />
      {healthData.hadPreviousDonation && (
        <TextField
          fullWidth
          margin="dense"
          type="date"
          label="Last Donation Date"
          value={healthData.lastDonationDate}
          InputLabelProps={{ shrink: true }}
          InputProps={{ readOnly: true }}
        />
      )}
    </Box>
  );
};

export default HealthChecker;
