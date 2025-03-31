import React from "react";
import { Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

// Styled Button Component
const AnimatedButton = styled(Button)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: "4rem",
  padding: "1.25rem 3rem",
  fontWeight: "700",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "1rem",
  background:
    "linear-gradient(90deg, hsl(48, 100%, 50%) 0%, hsl(28, 100%, 54%))",
  color: "hsl(225, 15%, 6%)",
  border: "3px solid hsl(225, 15%, 6%)",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "transform 0.4s",
  "&:hover": {
    transform: "rotate(-4deg) scale(1.1)",
  },
  "&:hover .button-shadow": {
    transform: "translate(-0.5rem, 0.5rem)",
  },
  "&:hover .reflection-1": {
    left: "120%",
  },
  "&:hover .reflection-2": {
    left: "-70%",
  },
}));

const Reflection = styled(Box)(({ delay }) => ({
  position: "absolute",
  width: "8px",
  height: "120px",
  backgroundColor: "hsla(48, 30%, 95%, .3)",
  rotate: "30deg",
  top: "0",
  left: "-180%",
  transition: `left 0.6s cubic-bezier(.2, .5, .2, 1.2) ${delay}`,
  "&::after": {
    content: '""',
    position: "absolute",
    width: "26px",
    height: "100%",
    backgroundColor: "hsla(48, 30%, 95%, .3)",
    top: "-1rem",
    left: "1.25rem",
  },
}));

const Shadow = styled(Box)({
  position: "absolute",
  width: "100%",
  height: "100%",
  background:
    "linear-gradient(90deg, hsl(48, 100%, 50%) 0%, hsl(28, 100%, 54%))",
  borderRadius: "4rem",
  border: "3px solid hsl(225, 15%, 6%)",
  zIndex: "-1",
  transition: "transform .3s",
});

// ✅ Add `onClick` prop here
const MagicButton = ({ onClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      <AnimatedButton variant="contained" onClick={onClick}>
        <span className="button-text">Download</span>
        <CloudDownloadIcon className="button-icon" />

        {/* Reflections */}
        <Reflection className="reflection-1" delay="0.1s" />
        <Reflection className="reflection-2" delay="0.2s" />

        {/* Shadow */}
        <Shadow className="button-shadow" />
      </AnimatedButton>
    </Box>
  );
};

export default MagicButton;
