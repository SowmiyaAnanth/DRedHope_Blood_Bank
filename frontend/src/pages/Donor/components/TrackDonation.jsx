import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Grid
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const TrackDonation = ({ donorId }) => {
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextDonationInfo, setNextDonationInfo] = useState(null);

  useEffect(() => {
    const fetchDonor = async () => {
      if (!donorId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8001/donors/${donorId}`);
        const data = await response.json();
        
        if (response.ok) {
          setDonorData(data);
          if (data.lastDonationDate) {
            calculateNextDonation(data.lastDonationDate);
          }
        } else {
          throw new Error("Failed to load donor data");
        }
      } catch (err) {
        setError("Failed to load donor information");
      } finally {
        setLoading(false);
      }
    };
    fetchDonor();
  }, [donorId]);

  const calculateNextDonation = (lastDonationDate) => {
    const lastDonation = new Date(lastDonationDate);
    const nextDonation = new Date(lastDonation);
    nextDonation.setMonth(nextDonation.getMonth() + 6);
    
    const today = new Date();
    const daysUntilNextDonation = Math.ceil((nextDonation - today) / (1000 * 60 * 60 * 24));
    
    setNextDonationInfo({
      nextDate: nextDonation.toISOString().split('T')[0],
      daysLeft: daysUntilNextDonation,
      isEligible: today >= nextDonation
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!donorData?.lastDonationDate) {
    return (
      <Box>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            color: '#d32f2f',
            fontWeight: 700,
            textAlign: 'center',
            mb: 3
          }}
        >
          Donation Tracking
        </Typography>
        <Alert severity="info">No donation history available.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          color: '#d32f2f',
          fontWeight: 700,
          textAlign: 'center',
          mb: 3
        }}
      >
        Donation Tracking
      </Typography>

      {nextDonationInfo && (
        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              bgcolor: nextDonationInfo.isEligible ? '#e8f5e9' : '#fff3e0',
              border: `1px solid ${nextDonationInfo.isEligible ? '#c8e6c9' : '#ffe0b2'}`,
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {nextDonationInfo.isEligible ? (
                <EventAvailableIcon color="success" />
              ) : (
                <AccessTimeIcon color="warning" />
              )}
              <Typography 
                variant="h6" 
                color={nextDonationInfo.isEligible ? 'success.main' : 'warning.main'}
              >
                Next Donation Status
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={nextDonationInfo.isEligible ? "Eligible to Donate" : "Waiting Period"}
                  color={nextDonationInfo.isEligible ? "success" : "warning"}
                  variant="outlined"
                  sx={{ 
                    fontSize: '1rem',
                    padding: '20px 10px',
                    '& .MuiChip-label': { fontWeight: 600 }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                  <strong>Next Eligible Date:</strong> {nextDonationInfo.nextDate}
                </Typography>
                {!nextDonationInfo.isEligible && (
                  <Typography variant="body1">
                    <strong>Days Remaining:</strong> {nextDonationInfo.daysLeft} days
                  </Typography>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {nextDonationInfo.isEligible 
                  ? "You are now eligible to donate blood again! Thank you for your commitment to saving lives."
                  : "Please wait until the next eligible date to ensure safe blood donation."}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      )}
    </Box>
  );
};

export default TrackDonation; 