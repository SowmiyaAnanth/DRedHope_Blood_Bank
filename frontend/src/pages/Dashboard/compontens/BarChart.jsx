import React from "react";
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

const bloodData = [
  {
    time: "Jan",
    "A+": 150,
    "A-": 80,
    "B+": 120,
    "B-": 70,
    "O+": 200,
    "O-": 90,
    "AB+": 50,
    "AB-": 30,
  },
  {
    time: "Feb",
    "A+": 160,
    "A-": 85,
    "B+": 130,
    "B-": 75,
    "O+": 190,
    "O-": 85,
    "AB+": 55,
    "AB-": 35,
  },
  {
    time: "Mac",
    "A+": 140,
    "A-": 78,
    "B+": 125,
    "B-": 72,
    "O+": 195,
    "O-": 88,
    "AB+": 60,
    "AB-": 40,
  },
  {
    time: "Api",
    "A+": 155,
    "A-": 82,
    "B+": 135,
    "B-": 74,
    "O+": 180,
    "O-": 80,
    "AB+": 50,
    "AB-": 32,
  },
  {
    time: "May",
    "A+": 145,
    "A-": 79,
    "B+": 128,
    "B-": 71,
    "O+": 185,
    "O-": 83,
    "AB+": 53,
    "AB-": 33,
  },
  {
    time: "Jun",
    "A+": 150,
    "A-": 81,
    "B+": 130,
    "B-": 73,
    "O+": 175,
    "O-": 78,
    "AB+": 57,
    "AB-": 37,
  },
  {
    time: "Jul",
    "A+": 135,
    "A-": 76,
    "B+": 120,
    "B-": 69,
    "O+": 160,
    "O-": 75,
    "AB+": 52,
    "AB-": 31,
  },
  {
    time: "Aug",
    "A+": 135,
    "A-": 76,
    "B+": 120,
    "B-": 69,
    "O+": 160,
    "O-": 75,
    "AB+": 52,
    "AB-": 31,
  },
  {
    time: "Sep",
    "A+": 135,
    "A-": 76,
    "B+": 110,
    "B-": 69,
    "O+": 160,
    "O-": 75,
    "AB+": 52,
    "AB-": 40,
  },
  {
    time: "Oct",
    "A+": 135,
    "A-": 90,
    "B+": 120,
    "B-": 69,
    "O+": 160,
    "O-": 80,
    "AB+": 52,
    "AB-": 31,
  },
  {
    time: "Nov",
    "A+": 135,
    "A-": 76,
    "B+": 120,
    "B-": 55,
    "O+": 200,
    "O-": 75,
    "AB+": 52,
    "AB-": 31,
  },
  {
    time: "Dec",
    "A+": 150,
    "A-": 66,
    "B+": 170,
    "B-": 49,
    "O+": 150,
    "O-": 15,
    "AB+": 92,
    "AB-": 39,
  },
];

const BloodTypeLevelChart = () => {
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
              label={{ value: "Days", position: "insideBottom", offset: -5 }}
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
