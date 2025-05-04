import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { getAllInventory } from "../../../api/bloodInventoryApi"; // Your API

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Blood Inventory Statistics
      </Typography>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography variant="body1">
          <strong>Total Blood:</strong> {stats.TotalBlood} units
        </Typography>
        <Typography variant="body1">
          <strong>Used Blood:</strong> {stats.UsedBlood} units
        </Typography>
        <Typography variant="body1">
          <strong>Available Blood:</strong> {stats.AvailableBlood} units
        </Typography>
      </Paper>
    </Box>
  );
};

export default BloodInventoryTable;
