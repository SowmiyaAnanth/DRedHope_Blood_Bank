import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { getAllInventory } from "../../../api/bloodInventoryApi";

const TestTubeChart = () => {
  const [bloodQuantities, setBloodQuantities] = useState([]);

  const fetchAndCalculate = async () => {
    try {
      const res = await getAllInventory();
      const inventory = res.data;

      // Group by bloodGroup and calculate total quantity
      const totals = inventory.reduce((acc, item) => {
        const group = item.bloodGroup;
        acc[group] = (acc[group] || 0) + item.quantity;
        return acc;
      }, {});

      // Convert to array for chart rendering
      const formattedData = Object.entries(totals).map(([type, quantity]) => ({
        type,
        quantity,
        color: "#FF0000",
      }));

      setBloodQuantities(formattedData);
    } catch (err) {
      console.error("Failed to fetch blood data:", err);
    }
  };

  useEffect(() => {
    fetchAndCalculate();
  }, []);

  return (
    <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center", mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Blood Quantity in Test Tubes
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {bloodQuantities.map((blood, index) => (
          <Grid item key={index}>
            <Box
              sx={{
                width: 80,
                height: 200,
                position: "relative",
                display: "flex",
                flexDirection: "column-reverse",
                alignItems: "center",
              }}
            >
              {/* Tube border */}
              <Box
                sx={{
                  width: "50%",
                  height: "90%",
                  background:
                    "linear-gradient(to bottom,rgb(248, 248, 248),rgb(255, 255, 255))",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  borderBottomLeftRadius: "30px",
                  borderBottomRightRadius: "30px",
                  border: "3px solid black",
                  position: "absolute",
                }}
              />

              {/* Liquid fill */}
              <motion.div
                initial={{ height: "0%" }}
                animate={{
                  height: `${Math.min(blood.quantity, 100)}%`, 
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{
                  width: "50%",
                  backgroundColor: blood.color,
                  borderBottomLeftRadius: "30px",
                  borderBottomRightRadius: "30px",
                  position: "absolute",
                  bottom: 0,
                }}
              />
            </Box>
            <Typography variant="body1" fontWeight="bold" mt={1}>
              {blood.type}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {blood.quantity} units
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TestTubeChart;
