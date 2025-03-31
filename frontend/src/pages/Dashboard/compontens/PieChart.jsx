import React, { useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

const data = [
  { name: "A+", value: 234, color: "#ff0000" },
  { name: "A-", value: 514, color: "#A31D1D" },
  { name: "B+", value: 345, color: "#0000ff" },
  { name: "B-", value: 567, color: "#060270" },
  { name: "O+", value: 324, color: "#008000" },
  { name: "O-", value: 846, color: "#216606" },
  { name: "AB+", value: 420, color: "#ff8000" },
  { name: "AB-", value: 156, color: "#117D84" },
];

const totalBlood = data.reduce((sum, entry) => sum + entry.value, 0);

export default function BloodStatistics() {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, width: 400 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
          Blood Inventory Statistics
        </Typography>

        {/* Centered Chart and Legends */}
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Pie Chart */}
          <Box sx={{ width: 350, height: 415, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={140}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  activeIndex={activeIndex}
                  activeShape={(props) => (
                    <Sector
                      {...props}
                      outerRadius={160}
                      fill={props.fill}
                      stroke="white"
                      strokeWidth={2}
                    />
                  )}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2,
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                Total: {totalBlood}
              </Typography>
            </Box>
          </Box>

          {/* Legends */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {data.map((entry, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                mx={1}
                my={0.5}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: entry.color,
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  {entry.name}: <strong>{entry.value}</strong>
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
