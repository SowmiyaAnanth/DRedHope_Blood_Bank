import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { getAllInventory } from "../../../api/bloodInventoryApi";

const BloodLevelDashboard = () => {
  // State to store blood level data from API
  const [bloodLevels, setBloodLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch blood inventory from API
  const fetchBloodInventory = async () => {
    try {
      const res = await getAllInventory();
      const inventory = res.data;

      // Group by bloodGroup and calculate total quantity
      const totals = inventory.reduce((acc, item) => {
        const group = item.bloodGroup;
        acc[group] = (acc[group] || 0) + item.quantity;
        return acc;
      }, {});

      // Color mapping for blood types
      const colorMap = {
        "A+": "#e53935",
        "A-": "#e53935",
        "B+": "#1e88e5",
        "B-": "#1e88e5",
        "O+": "#43a047",
        "O-": "#43a047",
        "AB+": "#fb8c00",
        "AB-": "#fb8c00"
      };

      // Minimum levels for each blood type
      const minLevelMap = {
        "A+": 30,
        "A-": 30,
        "B+": 30,
        "B-": 30,
        "O+": 40,
        "O-": 40,
        "AB+": 20,
        "AB-": 20
      };

      // Convert to array for rendering with appropriate properties
      const formattedData = Object.entries(totals).map(([type, quantity]) => ({
        type,
        quantity: Math.min(quantity, 100), // Cap at 100 for display
        minLevel: minLevelMap[type] || 25, // Default min level
        critical: quantity < (minLevelMap[type] || 25),
        color: colorMap[type] || "#999999" // Default color if not found
      }));

      setBloodLevels(formattedData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch blood data:", err);
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchBloodInventory();
  }, []);

  // Animation effect for real-time updates (simulated)
  useEffect(() => {
    if (loading) return;
    
    const timer = setInterval(() => {
      setBloodLevels(prevLevels => 
        prevLevels.map(blood => {
          // Random fluctuation to simulate real-time changes
          const newQuantity = Math.max(
            0, 
            Math.min(
              100, 
              blood.quantity + (Math.random() > 0.7 ? -1 : Math.random() > 0.5 ? 1 : 0)
            )
          );
          
          return {
            ...blood,
            quantity: newQuantity,
            critical: newQuantity < blood.minLevel
          };
        })
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [loading]);

  // Loading state
  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h6">Loading blood inventory data...</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ 
      p: 3, 
      borderRadius: 2, 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background pattern */}
      <Box sx={{ 
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        background: 'linear-gradient(to right, #f1f1f1, #e2e2e2)',
        zIndex: 0
      }} />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          textAlign="center" 
          mb={3}
        >
          Real-Time Blood Inventory Levels
        </Typography>
        
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
          justifyItems: 'center'
        }}>
          {bloodLevels.map((blood, index) => (
            <Box 
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'translateY(0)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              {/* Blood group label */}
              <Box 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 10,
                  mb: 1,
                  fontWeight: 'bold',
                  backgroundColor: blood.critical ? 'rgba(239, 68, 68, 0.1)' : 'rgba(229, 231, 235, 1)',
                  color: blood.critical ? 'rgb(220, 38, 38)' : 'inherit',
                  boxShadow: blood.critical ? '0 1px 2px rgba(239, 68, 68, 0.2)' : 'none'
                }}
              >
                <svg 
                  style={{ width: '16px', height: '16px', marginRight: '4px' }}
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 11h-11c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2zm0 9h-11v-7h11v7z"/>
                </svg>
                {blood.type}
              </Box>
              
              {/* Blood tube */}
              <Box 
                sx={{
                  width: '64px',
                  height: '160px',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  position: 'relative',
                  mb: 1
                }}
              >
                {/* Tube container */}
                <Box 
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                    borderBottomLeftRadius: '24px',
                    borderBottomRightRadius: '24px',
                    border: '2px solid #4b5563',
                    background: 'linear-gradient(to right, white, #f3f4f6)',
                    position: 'absolute',
                    overflow: 'hidden'
                  }}
                />
                
                {/* Min level indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '2px',
                    zIndex: 20,
                    backgroundColor: blood.critical ? '#ef4444' : '#6b7280',
                    bottom: `${blood.minLevel}%`
                  }}
                >
                  <Typography 
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      right: '-24px',
                      color: blood.critical ? '#ef4444' : '#6b7280'
                    }}
                  >
                    min
                  </Typography>
                </Box>
                
                {/* Blood fill level with animation */}
                <Box 
                  sx={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    height: `${blood.quantity}%`,
                    backgroundColor: blood.color,
                    borderRadius: blood.quantity >= 99 
                      ? '4px 4px 24px 24px' 
                      : '0 0 24px 24px',
                    transition: 'all 1s ease-in-out'
                  }}
                >
                  {/* Animated wave effect */}
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'white',
                      opacity: 0.3,
                      animation: 'pulse 2s infinite'
                    }}
                  />
                </Box>
                
                {/* Warning icon for critical levels */}
                {blood.critical && (
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      color: '#ef4444',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <svg 
                      style={{ width: '20px', height: '20px' }}
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
                    </svg>
                  </Box>
                )}
              </Box>
              
              {/* Quantity label */}
              <Typography 
                fontWeight="bold"
                variant="body2"
              >
                {blood.quantity} units
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Animation keyframes for global styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </Paper>
  );
};

export default BloodLevelDashboard;