import React from "react";
import { Box, Typography } from "@mui/material";

const MarqueeText = () => {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          display: "inline-block",
          animation: "scrollText 10s linear infinite",
          color: "white",
          fontWeight: "bold",
        }}
      >
        🚑 Blood Donation Saves Lives! Register Today! 🤍❤️
      </Typography>

      {/* CSS Keyframes for Scrolling */}
      <style>
        {`
          @keyframes scrollText {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default MarqueeText;
