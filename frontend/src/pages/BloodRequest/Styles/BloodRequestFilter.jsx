import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  useTheme,
  Typography,
  IconButton,
  Slide,
  Fade,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Tooltip,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import OpacityIcon from "@mui/icons-material/Opacity";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

const BloodRequestFilter = ({ filter, setFilter, bloodGroups }) => {
  const theme = useTheme();
  const [showFilter, setShowFilter] = useState(false);

  const emergencyLevels = ["Normal", "Emergency"];

  const handleBloodGroupChange = (event, newBloodGroup) => {
    setFilter({ ...filter, bloodGroup: newBloodGroup || "" });
  };

  const handleEmergencyChange = (event, newEmergency) => {
    setFilter({ ...filter, emergencyLevel: newEmergency || "" });
  };

  const handleClearFilters = () => {
    setFilter({ bloodGroup: "", emergencyLevel: "" });
  };

  const getBloodTypeColor = (type) => {
    if (!type) return "#d32f2f";

    switch (type.charAt(0)) {
      case "A":
        return "#d32f2f";
      case "B":
        return "#c2185b";
      case "O":
        return "#7b1fa2";
      case "AB":
        return "#512da8";
      default:
        return "#d32f2f";
    }
  };

  const activeFiltersCount =
    (filter.bloodGroup ? 1 : 0) + (filter.emergencyLevel ? 1 : 0);

  return (
    <Box sx={{ position: "relative", mb: 4, mt: 2 }}>
      {/* Filter Toggle Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Chip
          icon={<FilterAltIcon />}
          label={`Filters ${
            activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""
          }`}
          onClick={() => setShowFilter(!showFilter)}
          color={activeFiltersCount > 0 ? "error" : "default"}
          variant={showFilter ? "filled" : "outlined"}
          sx={{
            fontWeight: 500,
            "& .MuiChip-icon": {
              color:
                activeFiltersCount > 0
                  ? "inherit"
                  : theme.palette.action.active,
            },
          }}
        />
      </Box>

      {/* Filter Panel */}
      <Slide direction="down" in={showFilter} mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f5f5f5 0%, #ffeeee 100%)",
            position: "relative",
            overflow: "hidden",
            mb: 2,
          }}
        >
          {/* Decorative blood droplet */}
          <Box
            sx={{
              position: "absolute",
              right: -20,
              top: -20,
              opacity: 0.1,
              transform: "rotate(45deg)",
              zIndex: 0,
            }}
          >
            <OpacityIcon sx={{ fontSize: 160, color: "#d32f2f" }} />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
                color: "#b71c1c",
              }}
            >
              <SearchIcon /> Find Blood Requests
            </Typography>
            <Tooltip title="Clear all filters">
              <IconButton
                size="small"
                onClick={handleClearFilters}
                sx={{ opacity: activeFiltersCount > 0 ? 1 : 0.3 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {/* Blood Group Filter */}
            <Box sx={{ flex: 1, minWidth: 280 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BloodtypeIcon fontSize="small" color="error" />
                Blood Group
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 1, borderRadius: 2, bgcolor: "white" }}
              >
                <ToggleButtonGroup
                  value={filter.bloodGroup}
                  exclusive
                  onChange={handleBloodGroupChange}
                  aria-label="blood group filter"
                  size="small"
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    "& .MuiToggleButtonGroup-grouped": {
                      m: 0.5,
                      borderRadius: "50%!important",
                      textTransform: "none",
                      width: 36,
                      height: 36,
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      color: "white",
                      "&.Mui-selected": {
                        boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                      },
                    },
                  }}
                >
                  {bloodGroups.map((group) => (
                    <ToggleButton
                      key={group}
                      value={group}
                      sx={{
                        bgcolor: getBloodTypeColor(group),
                        "&:hover": {
                          bgcolor: getBloodTypeColor(group),
                          opacity: 0.9,
                        },
                        "&.Mui-selected": { bgcolor: getBloodTypeColor(group) },
                        "&.Mui-selected:hover": {
                          bgcolor: getBloodTypeColor(group),
                          opacity: 0.9,
                        },
                      }}
                    >
                      {group}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Paper>
            </Box>

            {/* Emergency Level Filter */}
            <Box sx={{ flex: 1, minWidth: 280 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocalHospitalIcon fontSize="small" color="error" />
                Emergency Level
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 1, borderRadius: 2, bgcolor: "white" }}
              >
                <ToggleButtonGroup
                  value={filter.emergencyLevel}
                  exclusive
                  onChange={handleEmergencyChange}
                  aria-label="emergency level filter"
                  size="small"
                  sx={{ width: "100%" }}
                >
                  <ToggleButton
                    value="Emergency"
                    sx={{
                      flex: 1,
                      display: "flex",
                      gap: 1,
                      p: 1,
                      color: "#d32f2f",
                      "&.Mui-selected": {
                        bgcolor: "#ffebee",
                        color: "#d32f2f",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <WarningAmberIcon fontSize="small" />
                    Emergency
                  </ToggleButton>
                  <ToggleButton
                    value="Normal"
                    sx={{
                      flex: 1,
                      display: "flex",
                      gap: 1,
                      p: 1,
                      color: "#2e7d32",
                      "&.Mui-selected": {
                        bgcolor: "#e8f5e9",
                        color: "#2e7d32",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <CheckCircleIcon fontSize="small" />
                    Normal
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>
            </Box>
          </Box>

          {/* Active filters display */}
          <Fade in={activeFiltersCount > 0}>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Active filters:
              </Typography>
              {filter.bloodGroup && (
                <Chip
                  icon={<BloodtypeIcon fontSize="small" />}
                  label={filter.bloodGroup}
                  onDelete={() => setFilter({ ...filter, bloodGroup: "" })}
                  size="small"
                  sx={{
                    bgcolor: getBloodTypeColor(filter.bloodGroup),
                    color: "white",
                    fontWeight: "bold",
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                    },
                    "& .MuiChip-icon": {
                      color: "white",
                    },
                  }}
                />
              )}
              {filter.emergencyLevel && (
                <Chip
                  icon={
                    filter.emergencyLevel === "Emergency" ? (
                      <WarningAmberIcon fontSize="small" />
                    ) : (
                      <CheckCircleIcon fontSize="small" />
                    )
                  }
                  label={filter.emergencyLevel}
                  onDelete={() => setFilter({ ...filter, emergencyLevel: "" })}
                  size="small"
                  color={
                    filter.emergencyLevel === "Emergency" ? "error" : "success"
                  }
                />
              )}
            </Box>
          </Fade>
        </Paper>
      </Slide>

      {/* Show active filters when panel is closed */}
      {!showFilter && activeFiltersCount > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Filtered by:
          </Typography>
          {filter.bloodGroup && (
            <Chip
              icon={<BloodtypeIcon fontSize="small" />}
              label={filter.bloodGroup}
              onDelete={() => setFilter({ ...filter, bloodGroup: "" })}
              size="small"
              sx={{
                bgcolor: getBloodTypeColor(filter.bloodGroup),
                color: "white",
                fontWeight: "bold",
                "& .MuiChip-deleteIcon": {
                  color: "white",
                },
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          )}
          {filter.emergencyLevel && (
            <Chip
              icon={
                filter.emergencyLevel === "Emergency" ? (
                  <WarningAmberIcon fontSize="small" />
                ) : (
                  <CheckCircleIcon fontSize="small" />
                )
              }
              label={filter.emergencyLevel}
              onDelete={() => setFilter({ ...filter, emergencyLevel: "" })}
              size="small"
              color={
                filter.emergencyLevel === "Emergency" ? "error" : "success"
              }
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default BloodRequestFilter;
