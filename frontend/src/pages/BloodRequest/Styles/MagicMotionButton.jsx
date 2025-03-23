import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import DiamondIcon from "@mui/icons-material/Diamond";
import StarIcon from "@mui/icons-material/Star";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory"; // triangle
import CircleIcon from "@mui/icons-material/Circle";

const MagicMotionButton = ({ onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <Box
      component="button" // ✅ changed from <a> to <button>
      onClick={onClick} // ✅ call download function
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        all: "unset", // ✅ removes default button styles
        cursor: "pointer",
        position: "relative",
        display: "inline-block",
        backgroundColor: "hsl(0, 100%, 53.9%)",
        color: "#fff",
        px: "2.2rem",
        py: "0.9rem",
        borderRadius: "3rem",
        fontSize: "1.25rem",
        fontFamily: "'Montserrat Alternates', sans-serif",
        transition: "transform 0.4s",
        transform: hover ? "scale(1.3)" : "scale(1)",
        overflow: "hidden",
        textDecoration: "none",
        "&::after": {
          content: '""',
          width: "80%",
          height: "40%",
          background:
            "linear-gradient(80deg, hsl(341, 79.80%, 55.30%) 10%, hsl(344, 100.00%, 47.50%) 48%)",
          position: "absolute",
          bottom: "-4px",
          left: 0,
          right: 0,
          margin: "0 auto",
          borderRadius: "3rem",
          filter: "blur(12px)",
          zIndex: -1,
          opacity: hover ? 1 : 0,
          transition: "opacity 0.4s",
        },
      }}
    >
      <Typography
        component="span"
        sx={{ position: "relative", zIndex: 10, fontWeight: "bold" }}
      >
        Download
      </Typography>

      {/* Icons */}
      <DiamondIcon
        sx={{
          position: "absolute",
          fontSize: 22,
          color: "white",
          pointerEvents: "none",
          opacity: hover ? 1 : 0,
          transition: "0.6s",
          filter: "blur(0.5px)",
          transform: hover
            ? "translate(-38px, -10px) scale(1.2) rotate(55deg)"
            : "translate(-25px, -6px) rotate(55deg)",
          inset: 0,
          margin: "auto",
        }}
      />
      <StarIcon
        sx={{
          position: "absolute",
          fontSize: 32,
          color: "white",
          pointerEvents: "none",
          opacity: hover ? 1 : 0,
          transition: "0.6s",
          transform: hover
            ? "translate(7px, -32px) scale(1.1) rotate(80deg)"
            : "translate(7px, -14px) rotate(80deg)",
          inset: 0,
          margin: "auto",
        }}
      />
      <ChangeHistoryIcon
        sx={{
          position: "absolute",
          fontSize: 30,
          color: "white",
          pointerEvents: "none",
          opacity: hover ? 1 : 0,
          transition: "0.6s",
          filter: "blur(0.9px)",
          transform: hover
            ? "translate(50px, -20px) scale(1.1) rotate(-45deg)"
            : "translate(34px, -4px) rotate(-45deg)",
          inset: 0,
          margin: "auto",
        }}
      />
      <CircleIcon
        sx={{
          position: "absolute",
          fontSize: 26,
          color: "white",
          pointerEvents: "none",
          opacity: hover ? 1 : 0,
          transition: "0.6s",
          transform: hover
            ? "translate(-14px, 20px) scale(1.1) rotate(40deg)"
            : "translate(-5px, 15px) rotate(40deg)",
          inset: 0,
          margin: "auto",
        }}
      />
    </Box>
  );
};

export default MagicMotionButton;
