import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Paper } from "@mui/material";
import { getAllInventory } from "../../../api/bloodInventoryApi";
import dayjs from "dayjs";

const BloodTypeLevelChart = () => {
  const [bloodData, setBloodData] = useState([]);

  useEffect(() => {
    const fetchBloodData = async () => {
      try {
        const res = await getAllInventory();
        const rawData = res.data;

        
        const grouped = {};

        rawData.forEach((item) => {
          const month = dayjs(item.collectionDate).format("MMM");
          if (!grouped[month]) {
            grouped[month] = {};
          }
          grouped[month][item.bloodGroup] =
            (grouped[month][item.bloodGroup] || 0) + item.quantity;
        });

        // Convert grouped object into chart data format
        const formattedData = Object.keys(grouped).map((month) => ({
          time: month,
          "A+": grouped[month]["A+"] || 0,
          "A-": grouped[month]["A-"] || 0,
          "B+": grouped[month]["B+"] || 0,
          "B-": grouped[month]["B-"] || 0,
          "O+": grouped[month]["O+"] || 0,
          "O-": grouped[month]["O-"] || 0,
          "AB+": grouped[month]["AB+"] || 0,
          "AB-": grouped[month]["AB-"] || 0,
        }));

        // Sort by month order
        const monthOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        formattedData.sort(
          (a, b) => monthOrder.indexOf(a.time) - monthOrder.indexOf(b.time)
        );

        setBloodData(formattedData);
      } catch (err) {
        console.error("Error fetching blood inventory data:", err);
      }
    };

    fetchBloodData();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 3, textAlign: "center", mb: 3 }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Blood Type Levels Over Time
      </Typography>
      <Box sx={{ width: "100%", height: 525 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={bloodData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <XAxis
              dataKey="time"
              label={{ value: "Month", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              label={{
                value: "Blood Units",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="A+"
              stroke="#ff0000"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="A-"
              stroke="#A31D1D"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="B+"
              stroke="#0000ff"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="B-"
              stroke="#060270"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="O+"
              stroke="#008000"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="O-"
              stroke="#216606"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="AB+"
              stroke="#ff8000"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="AB-"
              stroke="#117D84"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default BloodTypeLevelChart;
