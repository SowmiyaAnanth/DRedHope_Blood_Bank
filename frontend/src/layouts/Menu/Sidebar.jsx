import React, {useState} from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import {
  Home,
  Dashboard,
  People,
  Settings,
  Lock,
  ExitToApp,
  Menu,
  LocalHospital,
  Bloodtype,
  Event,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { appColors } from "../../theme/appColors";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const menuItems = [
    { name: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { name: "Donor", icon: <People />, path: "/donor" },
    { name: "Blood Bank", icon: <LocalHospital />, path: "/blood-bank" }, 
    { name: "Blood Request", icon: <Bloodtype />, path: "/blood-request" }, 
    { name: "Event Campaign", icon: <Event />, path: "/event-campaign" }, 
    { name: "Settings", icon: <Settings />, path: "/settings" },
    { name: "Sign Out", icon: <ExitToApp />, path: "/logout" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? 100 : 60,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isOpen ? 300 : 60,
          transition: "width 0.3s",
          bgcolor: "darkred",
          color: "#FEF9E1",
        },
      }}
    >
      <Box display="flex" justifyContent="flex-start" my={2}>
        <IconButton
          onClick={toggleSidebar}
          sx={{ color: "#FEF9E1", fontSize: "24px" }}
        >
          <Menu fontSize="large" />
        </IconButton>
      </Box>

      {/* Profile Section */}
      {isOpen && (
        <Box display="flex" flexDirection="column" alignItems="center" my={2}>
          <Avatar sx={{ width: 80, height: 80, mb: 2 }} src="/profile.jpg" />
          <Typography variant="h6" fontWeight="bold">
            John Doe
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            johndoe@email.com
          </Typography>
        </Box>
      )}

      <List sx={{ width: "100%" }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            sx={{
              py: 2,
              justifyContent: isOpen ? "flex-start" : "center",
              px: isOpen ? 3 : 5,
              bgcolor: hoveredIndex === index ? "#FFF5E1" : "transparent", 
              color:
                hoveredIndex === index
                  ? appColors.darkRed[100]
                  : appColors.brand[100],
              borderRadius: hoveredIndex === index ? "20px" : "0px",
              transition: "background 0.3s, color 0.3s",
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  hoveredIndex === index
                    ? appColors.darkRed[100]
                    : appColors.brand[100],
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {isOpen && (
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontSize: "22px" }}>
                    {item.name}
                  </Typography>
                }
              />
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
