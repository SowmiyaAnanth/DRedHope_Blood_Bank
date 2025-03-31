import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Menu/Sidebar";
import Header from "./Header/Header";
import Dashboard from "../pages/Dashboard";
import Donor from "../pages/Donor";
import BloodRequest from "../pages/BloodRequest";
import { Box } from "@mui/material";
import { appColors } from "../theme/appColors";
import BloodInventary from "../pages/BloodInventary/index";

const AppRoutes = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box display="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: isSidebarOpen ? "200px" : 0,
          transition: "margin-left 0.3s",
          p: 2,
          mt: "64px",
          bgcolor: appColors.brand[100],
          //borderRadius: "30px",
          minHeight: "100vh",
        }}
      >
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donor" element={<Donor />} />
          <Route path="/blood-bank" element={<BloodInventary />} />
          <Route path="/blood-request" element={<BloodRequest />} />
          <Route path="/event-campaign" element={<Dashboard />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AppRoutes;
