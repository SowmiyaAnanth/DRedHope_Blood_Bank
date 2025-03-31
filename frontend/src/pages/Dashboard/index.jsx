import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
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
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      p={4}
    >

      <Grid container spacing={4} justifyContent="center" mb={5}>
        {[
          { label: "Total Donor", value: stats.TotalDonor },
          { label: "Total Blood", value: stats.TotalBlood },
          { label: "Available Blood", value: stats.AvailableBlood },
        ].map((stat, i) => (
          <Grid item key={i}>
            <Card
              sx={{
                width: 450,
                textAlign: "center",
                bgcolor: i === 0 ? "#0b3d91" : "white",
                color: i === 0 ? "white" : "black",
              }}
            >
              <CardContent>
                <Typography variant="body1" fontWeight="bold">
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box p={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <TestTube />
          </Grid>
          <Grid item xs={12} md={4}>
            <BloodTypeHeartbeatChart />
          </Grid>
          <Grid item xs={12} md={4}>
            <InvoiceStatistics />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BloodInventoryTable;
