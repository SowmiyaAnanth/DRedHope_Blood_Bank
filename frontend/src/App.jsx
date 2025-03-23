import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./layouts/Menu/Sidebar";
import AppRoutes from "./layouts/AppRoutes";

// Import your loading gif
import loadingGif from "./assets/images/loading.gif";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay (e.g., fetch, assets loading, etc.)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 2 seconds delay (you can reduce this if needed)

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <img src={loadingGif} alt="Loading..." style={{ width: "400px" }} />
      </div>
    );
  }

  return (
    <Router>
      {/* Optional: show sidebar always */}
      <Sidebar />
      <AppRoutes />
    </Router>
  );
}

export default App;
