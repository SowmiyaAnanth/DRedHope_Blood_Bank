import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Paper } from "@mui/material";
import InvoiceStatistics from "./compontens/PieChart";
import BloodTypeHeartbeatChart from "./compontens/BarChart";
import TestTube from "./compontens/TestingChart";

const BloodInventoryTable = () => {
  const [stats, setStats] = useState({
    TotalDonor: 628,
    TotalBlood: 2434,
    AvailableBlood: 1259,
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(to bottom, #fcf8ee, #fff5e6)",
      }}
    >
      {/* Enhanced Stats Cards with Icons and Animations */}

      {/* Chart Components */}
      

      {/* Donation Impact Section */}
      <Box sx={{ maxWidth: "1200px", width: "100%", mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)",
            mt: 3,
          }}
        >
          <Box sx={{ p: 3 }}>
           
            <EnhancedBloodDonationImpact units={25} />
          </Box>
        </Paper>
      </Box>
      <Box sx={{ maxWidth: "1200px", width: "100%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  background: "linear-gradient(to right, #e53935, #e35d5b)",
                  color: "white",
                }}
              >
               
              </Box>
              <Box sx={{ p: 2 }}>
                <TestTube />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  background: "linear-gradient(to right, #1e88e5, #5e35b1)",
                  color: "white",
                }}
              >
                <Typography variant="h6" fontWeight="bold" align="center">
                  Blood Type Trends
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <BloodTypeHeartbeatChart />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  background: "linear-gradient(to right, #43a047, #2e7d32)",
                  color: "white",
                }}
              >
                <Typography variant="h6" fontWeight="bold" align="center">
                  Blood Distribution
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <InvoiceStatistics />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Enhanced Blood Donation Impact Component
const EnhancedBloodDonationImpact = ({ units = 1 }) => {
  const [animateCount, setAnimateCount] = useState(0);
  const [showImpact, setShowImpact] = useState(false);

  // Impact metrics based on units
  const livesImpacted = units * 3; // Each unit can help up to 3 people
  const surgeries = Math.floor(units * 1.5); // Rough estimate for surgeries supported
  const accidentVictims = Math.floor(units * 0.8); // Rough estimate for accident victims helped

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setShowImpact(true);
    }, 500);

    // Animate count up
    if (showImpact) {
      const interval = setInterval(() => {
        setAnimateCount((prev) => {
          if (prev < livesImpacted) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 100);
      return () => clearInterval(interval);
    }

    return () => clearTimeout(timer);
  }, [livesImpacted, showImpact]);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
          opacity: showImpact ? 1 : 0,
          transform: showImpact ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Impact Visualization */}
        <Box
          sx={{
            position: "relative",
            width: 240,
            height: 240,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
          }}
        >
          {/* Pulsing background */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              bgcolor: "rgba(229, 57, 53, 0.1)",
              animation: "pulse 2s infinite ease-in-out",
            }}
          />

          {/* Main impact circle */}
          <Box
            sx={{
              position: "absolute",
              inset: 20,
              borderRadius: "50%",
              bgcolor: "white",
              boxShadow: "inset 0 0 15px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h2" fontWeight="bold" color="#e53935">
                {animateCount}
              </Typography>
              <Typography variant="body2" color="#c62828" fontWeight="medium">
                Total Donor
              </Typography>
            </Box>
          </Box>

          {/* Orbiting hearts */}
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: 24,
                height: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                animation: `orbit ${6 + i}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#e53935"
                stroke="#e53935"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Box>
          ))}
        </Box>

        {/* Impact Statistics */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
            maxWidth: { xs: "100%", md: "60%" },
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#e53935"
            textAlign="center"
          >
            Blood Details
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {/* Surgeries Card */}
            <Paper
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box sx={{ color: "#e53935", mb: 1 }}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="#e53935">
                {surgeries}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Total Blood
              </Typography>
            </Paper>

            {/* Accident Victims Card */}
            <Paper
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box sx={{ color: "#e53935", mb: 1 }}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="#e53935">
                {accidentVictims}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Available Blood
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(100px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(100px) rotate(-360deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default BloodInventoryTable;
