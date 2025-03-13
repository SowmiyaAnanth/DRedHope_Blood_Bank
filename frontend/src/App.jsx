import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./layouts/Menu/Sidebar";
import AppRoutes from "./layouts/AppRoutes";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
