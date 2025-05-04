import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import InvoiceStatistics from "./compontens/PieChart";
import TestTube from "./compontens/TestingChart";
import { getAllInventory } from "../../api/bloodInventoryApi";

const BloodInventoryTable = () => {
  const [stats, setStats] = useState({
    TotalBlood: 0,
    UsedBlood: 0,
    AvailableBlood: 0,
  });

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        const { data } = await getAllInventory();

        let total = 0;
        let used = 0;

        data.forEach((item) => {
          total += item.quantity || 0;
          used += item.used || 0;
        });

        const available = total - used;

        setStats({
          TotalBlood: total,
          UsedBlood: used,
          AvailableBlood: available,
        });
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    };

    fetchInventoryStats();
  }, []);

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
      {/* Impact Summary */}
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
            <EnhancedBloodDonationImpact
              units={stats.TotalBlood}
              available={stats.AvailableBlood}
            />
          </Box>
        </Paper>
      </Box>

      {/* Charts */}
      <Box sx={{ maxWidth: "1200px", width: "100%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ChartCard title="Real-Time Blood" gradient="#e53935, #e35d5b">
              <TestTube />
            </ChartCard>
          </Grid>

         

          <Grid item xs={12} md={4}>
            <ChartCard title="Blood Distribution" gradient="#43a047, #2e7d32">
              <InvoiceStatistics />
            </ChartCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Reusable Chart Card
const ChartCard = ({ title, gradient, children }) => (
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
        background: `linear-gradient(to right, ${gradient})`,
        color: "white",
      }}
    >
      <Typography variant="h6" fontWeight="bold" align="center">
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 2 }}>{children}</Box>
  </Paper>
);

// Enhanced Impact Component
const EnhancedBloodDonationImpact = ({ units, available }) => {
  const [animateCount, setAnimateCount] = useState(0);
  const [showImpact, setShowImpact] = useState(false);

  const livesImpacted = units * 3;
  const surgeries = Math.floor(units * 1.5);
  const accidentVictims = Math.floor(available);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImpact(true);
    }, 500);

    if (showImpact) {
      const interval = setInterval(() => {
        setAnimateCount((prev) => {
          if (prev < livesImpacted) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 50);
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
        {/* Total Units Visualization */}
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
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              bgcolor: "rgba(229, 57, 53, 0.1)",
              animation: "pulse 2s infinite ease-in-out",
            }}
          />
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
                Lives Impacted
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats */}
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
            Blood Inventory Summary
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StatCard value={units} label="Total Blood Units" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard value={available} label="Available Blood" />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <style jsx="true" global="true">{`
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
      `}</style>
    </Box>
  );
};

// Reusable Stat Card
const StatCard = ({ value, label }) => (
  <Paper
    sx={{
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
    <Typography variant="h4" fontWeight="bold" color="#e53935">
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" textAlign="center">
      {label}
    </Typography>
  </Paper>
);

export default BloodInventoryTable;
