import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"; // Heart-hand icon

const Container = styled(Box)({
  display: "flex",
  alignItems: "center",
  position: "relative",
  width: "fit-content",
  marginTop: "26px",
});

// Styled Sliding Box
const SlidingBox = styled(Box)(({ open }) => ({
  position: "absolute",
  left: open ? "50px" : "-100%",
  opacity: open ? 1 : 0,
  backgroundColor: "#FFB6B6",
  borderRadius: "20px",
  padding: "12px 20px",
  minWidth: "180px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "left 0.4s ease-in-out, opacity 0.3s ease-in-out",
  cursor: "pointer",
}));

const IconButton = styled(Button)(({ hover }) => ({
  minWidth: "auto",
  padding: "10px",
  borderRadius: "50%",
  backgroundColor: hover ? "#A31D1D" : "#FFB6B6", 
  transition: "transform 0.3s, background-color 0.3s",

  "&:hover": {
    backgroundColor: "#A31D1D",
    transform: "scale(1.1)",

    "& svg": {
      color: "#FFB6B6",
    },
  },
}));

const BloodRequestButton = ({ onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <Container
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Sliding Text */}
      <SlidingBox open={hover} onClick={onClick}>
        <Typography variant="body1" fontWeight="bold" color="#A31D1D">
          BLOOD REQUEST
        </Typography>
      </SlidingBox>

      {/* Icon Button with MUI Icon */}
      <IconButton onClick={onClick} hover={hover}>
        <VolunteerActivismIcon
          sx={{ fontSize: 40, color: hover ? "#FFF" : "#A31D1D" }} 
        />
      </IconButton>
    </Container>
  );
};

export default BloodRequestButton;
