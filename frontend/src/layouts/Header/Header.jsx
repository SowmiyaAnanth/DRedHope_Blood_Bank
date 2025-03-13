import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import {
  Notifications,
  Brightness4,
  Brightness7,
  Menu,
} from "@mui/icons-material";
import MarqueeText from "./components/Marquee"

const Header = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? "#fff" : "#222";
    document.body.style.color = darkMode ? "#000" : "#fff";
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: "darkred", color: "white" }}>
      <Toolbar>
        <IconButton
          edge="start"
          onClick={toggleSidebar}
          sx={{ color: "white" }}
        >
          <Menu />
        </IconButton>

        <Box flexGrow={1} display="flex" justifyContent="center">
          <Typography
            variant="h4"
            sx={{ textShadow: "0 0 10px #ff4444, 0 0 20px #ff2222" }}
          >
            <MarqueeText />
          </Typography>
        </Box>

        <IconButton sx={{ color: "white" }}>
          <Notifications />
        </IconButton>
        <IconButton sx={{ color: "white" }} onClick={toggleDarkMode}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
