import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion"; 

const bloodLevels = [
  { type: "A+", quantity: 40, color: "#FF0000" },
  { type: "A-", quantity: 40, color: "#FF0000" }, 
  { type: "B+", quantity: 80, color: "#FF0000" }, 
  { type: "B-", quantity: 40, color: "#FF0000" },
  { type: "O+", quantity: 70, color: "#FF0000" }, 
  { type: "O-", quantity: 40, color: "#FF0000" },
  { type: "AB+", quantity: 60, color: "#FF0000" },
  { type: "AB-", quantity: 40, color: "#FF0000" }, 
];

const TestTubeChart = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center", mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Blood Quantity in Test Tubes
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {bloodLevels.map((blood, index) => (
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
              
              <Box
                sx={{
                  width: "50%",
                  height: "90%",
                  background: "linear-gradient(to bottom,rgb(248, 248, 248),rgb(255, 255, 255))",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  borderBottomLeftRadius: "30px",
                  borderBottomRightRadius: "30px",
                  border: "3px solid black",
                  position: "absolute",
                }}
              ></Box>

             
              <motion.div
                initial={{ height: "0%" }} 
                animate={{ height: `${blood.quantity}%` }} 
                transition={{ duration: 1.5, ease: "easeInOut" }} 
                style={{
                  width: "50%",
                  backgroundColor: blood.color,
                  borderBottomLeftRadius: "30px",
                  borderBottomRightRadius: "30px",
                  position: "absolute",
                  bottom: 0,
                }}
              ></motion.div>
            </Box>
            <Typography variant="body1" fontWeight="bold" mt={1}>
              {blood.type}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {blood.quantity}%
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TestTubeChart;
