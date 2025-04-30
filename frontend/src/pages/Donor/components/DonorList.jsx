import { useEffect, useState } from "react";
import {
  Card, CardContent, CardMedia, Typography, Grid, Container, Box,
  IconButton, Tooltip, Button, Modal, TextField, InputAdornment,
  Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "@fontsource/merriweather";
import AddDonorGif from "../../../assets/images/add.gif";

import personIcon from "../../../assets/images/person.png";
import ageIcon from "../../../assets/images/age.png";
import phoneIcon from "../../../assets/images/phone.png";
import locationIcon from "../../../assets/images/location.png";
import bloodIcon from "../../../assets/images/blood.png";
import healthIcon from "../../../assets/images/health.png";
import trackIcon from "../../../assets/images/track.png";
import HealthChecker from "./HealthChecker";
import TrackDonation from "./TrackDonation";
import AIChatBox from "./AIChatBox";

export default function DonorList({ onCreateClick, onEditClick, onDeleteClick }) {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [openHealthModal, setOpenHealthModal] = useState(false);
  const [openTrackModal, setOpenTrackModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [stats, setStats] = useState({
    totalDonors: 0,
    eligibleDonors: 0,
    ineligibleDonors: 0,
    waitingDonors: 0
  });

  const disqualifyingDiseases = ["diabetes", "tuberculosis", "hiv", "aids", "heart disease", "cancer"];
  const apiUrl = "http://localhost:8001/donors";

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setDonors(data);
      setFilteredDonors(data);
      
      // Calculate statistics
      const totalDonors = data.length;
      const eligibleDonors = data.filter(donor => checkEligibility(donor)).length;
      const ineligibleDonors = totalDonors - eligibleDonors;
      const waitingDonors = data.filter(donor => {
        if (!donor.lastDonationDate) return false;
        const nextEligibleDate = new Date(donor.lastDonationDate);
        nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 6);
        return new Date() < nextEligibleDate;
      }).length;

      setStats({
        totalDonors,
        eligibleDonors,
        ineligibleDonors,
        waitingDonors
      });
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = donors.filter((donor) =>
      donor.bloodGroup.toLowerCase().includes(value)
    );
    setFilteredDonors(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        const updated = donors.filter((donor) => donor._id !== id);
        setDonors(updated);
        setFilteredDonors(updated);
        if (onDeleteClick) onDeleteClick(id);
      } catch (error) {
        console.error("Error deleting donor:", error);
      }
    }
  };

  const handleEdit = (id) => {
    const donor = donors.find((donor) => donor._id === id);
    onEditClick(donor);
  };

  const handleHealthClick = (donorId) => {
    const donor = donors.find((d) => d._id === donorId);
    setSelectedDonor(donor);
    setOpenHealthModal(true);
  };

  const handleTrackClick = (donorId) => {
    const donor = donors.find((d) => d._id === donorId);
    setSelectedDonor(donor);
    setOpenTrackModal(true);
  };

  const handleHealthSubmit = () => {
    setOpenHealthModal(false);
    fetchDonors();
  };

  const handleTrackSubmit = () => {
    setOpenTrackModal(false);
    fetchDonors();
  };

  const handleButtonClick = () => {
    setButtonClicked(true);
    setTimeout(() => {
      setButtonClicked(false);
      onCreateClick();
    }, 300);
  };

  // ✅ Corrected Eligibility Check (with Age Check)
  const checkEligibility = (donor) => {
    const weightOK = Number(donor.weight) > 50;
    const heightOK = Number(donor.height) > 150;
    const ageOK = Number(donor.age) >= 18; // ✅ Age check added
    const diseaseText = donor.chronicDiseases?.toLowerCase() || "";
    const hasDisqualifying = disqualifyingDiseases.some((d) => diseaseText.includes(d));
    return weightOK && heightOK && ageOK && !hasDisqualifying;
  };

  const calculateWaitingPeriod = (lastDonationDate) => {
    if (!lastDonationDate) return null;
    
    const nextEligibleDate = new Date(lastDonationDate);
    nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 6);
    const today = new Date();
    
    if (today < nextEligibleDate) {
      const daysLeft = Math.ceil((nextEligibleDate - today) / (1000 * 60 * 60 * 24));
      return {
        daysLeft,
        nextEligibleDate: nextEligibleDate.toISOString().split('T')[0]
      };
    }
    return null;
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: '#f5f5f5', 
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': { transform: 'translateY(-5px)', transition: 'transform 0.3s ease-in-out' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                <Box>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {stats.totalDonors}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Donors
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: '#e8f5e9', 
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': { transform: 'translateY(-5px)', transition: 'transform 0.3s ease-in-out' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
                <Box>
                  <Typography variant="h4" sx={{ color: '#2e7d32' }} fontWeight="bold">
                    {stats.eligibleDonors}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eligible Donors
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: '#ffebee', 
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': { transform: 'translateY(-5px)', transition: 'transform 0.3s ease-in-out' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CancelIcon sx={{ fontSize: 40, color: '#c62828' }} />
                <Box>
                  <Typography variant="h4" sx={{ color: '#c62828' }} fontWeight="bold">
                    {stats.ineligibleDonors}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ineligible Donors
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: '#fff3e0', 
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': { transform: 'translateY(-5px)', transition: 'transform 0.3s ease-in-out' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <PeopleIcon sx={{ fontSize: 40, color: '#ef6c00' }} />
                <Box>
                  <Typography variant="h4" sx={{ color: '#ef6c00' }} fontWeight="bold">
                    {stats.waitingDonors}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Waiting Period
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            {/* You can put title here if needed */}
          </Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search blood group"
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 220 }}
          />
        </Box>

        <Box display="flex" alignItems="center">
          <img src={AddDonorGif} alt="Add Donor" style={{ width: "80px", height: "80px", marginRight: "10px" }} />
          <Button
            variant="contained"
            color="error"
            onClick={handleButtonClick}
            sx={{
              fontWeight: "bold",
              transform: buttonClicked ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            CREATE DONOR
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredDonors.map((donor) => {
          const isFlipped = hoveredCard === donor._id;
          const isEligible = checkEligibility(donor);
          const waitingPeriod = calculateWaitingPeriod(donor.lastDonationDate);

          return (
            <Grid item xs={12} sm={6} md={4} key={donor._id}>
              <Box 
                sx={{ 
                  perspective: "1000px", 
                  width: "100%", 
                  height: "380px", 
                  position: "relative",
                  '&:hover': {
                    '& .donor-card': {
                      transform: 'rotateY(180deg)',
                    }
                  }
                }} 
              >
                <Box 
                  className="donor-card"
                  sx={{ 
                    position: "relative", 
                    width: "100%", 
                    height: "100%", 
                    transition: "transform 0.8s ease-in-out", 
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front Side */}
                  <Box sx={{ 
                    position: "absolute", 
                    width: "100%", 
                    height: "100%", 
                    backfaceVisibility: "hidden",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease-in-out",
                    '&:hover': {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                    }
                  }}>
                    <Card sx={{ height: "100%", borderRadius: "15px" }}>
                      <Box sx={{ position: "relative" }}>
                        <CardMedia 
                          component="img" 
                          height="220" 
                          image={donor.image ? `http://localhost:8001${donor.image}` : "https://via.placeholder.com/150"} 
                          alt="Donor"
                          sx={{
                            objectFit: "cover",
                            transition: "transform 0.3s ease-in-out",
                            '&:hover': {
                              transform: "scale(1.05)",
                            }
                          }}
                        />
                        <Box 
                          sx={{ 
                            position: "absolute", 
                            top: 0, 
                            right: 0, 
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            p: 1
                          }}
                        >
                          {waitingPeriod ? (
                            <Chip
                              icon={<AccessTimeIcon />}
                              label={`${waitingPeriod.daysLeft} days left`}
                              color="warning"
                              sx={{ 
                                fontWeight: "bold",
                                bgcolor: "rgba(255, 152, 0, 0.9)",
                                color: "white"
                              }}
                            />
                          ) : (
                            <Box 
                              sx={{ 
                                bgcolor: isEligible ? "success.main" : "error.main",
                                color: "white",
                                px: 2,
                                py: 0.5,
                                borderBottomLeftRadius: "10px",
                                fontSize: "0.875rem",
                                fontWeight: "bold"
                              }}
                            >
                              {isEligible ? "Eligible" : "Not Eligible"}
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <CardContent sx={{ textAlign: "center", pt: 2 }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontFamily: "Merriweather", 
                            fontWeight: 700,
                            color: "#d32f2f",
                            mb: 1
                          }}
                        >
                          {donor.fullName}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: "#666",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1
                          }}
                        >
                          <img src={bloodIcon} width={24} alt="Blood Group" />
                          {donor.bloodGroup}
                        </Typography>
                        {waitingPeriod && (
                          <Typography 
                            variant="body2" 
                            color="warning.main"
                            sx={{ 
                              mt: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5
                            }}
                          >
                            <AccessTimeIcon fontSize="small" />
                            Next eligible: {waitingPeriod.nextEligibleDate}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Back Side */}
                  <Box sx={{ 
                    position: "absolute", 
                    width: "100%", 
                    height: "100%", 
                    backfaceVisibility: "hidden", 
                    transform: "rotateY(180deg)",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}>
                    <Card sx={{ 
                      height: "100%", 
                      background: "linear-gradient(135deg, #fff5f5 0%, #fff 100%)",
                      borderRadius: "15px",
                      border: "2px solid #ffcdd2",
                      position: "relative"
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ 
                          backgroundColor: "#ffebee", 
                          padding: "12px", 
                          borderRadius: "10px", 
                          marginBottom: "15px", 
                          border: "1px solid #ffcdd2",
                          textAlign: "center"
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontFamily: "Merriweather", 
                              fontWeight: 700, 
                              color: "#d32f2f",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1
                            }}
                          >
                            <img src={personIcon} width={24} alt="Person" />
                            Donor Details
                          </Typography>
                        </Box>

                        <Box sx={{ 
                          display: "flex", 
                          flexDirection: "column", 
                          gap: 2,
                          '& > *': {
                            transition: "transform 0.2s ease-in-out",
                            '&:hover': {
                              transform: "translateX(5px)",
                            }
                          }
                        }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <img src={ageIcon} width={24} alt="Age" />
                            <Typography variant="body1" fontWeight={600}>Age: {donor.age}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <img src={phoneIcon} width={24} alt="Phone" />
                            <Typography variant="body1" fontWeight={600}>Phone: {donor.phoneNumber}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <img src={locationIcon} width={24} alt="Location" />
                            <Typography variant="body1" fontWeight={600}>Address: {donor.address}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <img src={bloodIcon} width={24} alt="Blood" />
                            <Typography variant="body1" fontWeight={600}>Blood Group: {donor.bloodGroup}</Typography>
                          </Box>
                          {waitingPeriod && (
                            <Box 
                              sx={{ 
                                bgcolor: "#fff3e0",
                                p: 1,
                                borderRadius: 1,
                                border: "1px solid #ffe0b2"
                              }}
                            >
                              <Typography variant="body2" color="warning.main" fontWeight={600}>
                                ⏳ Waiting Period: {waitingPeriod.daysLeft} days left
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Next eligible date: {waitingPeriod.nextEligibleDate}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ 
                          position: "absolute", 
                          bottom: "15px", 
                          right: "15px",
                          display: "flex",
                          gap: 1
                        }}>
                          <Tooltip title="Health Check" arrow>
                            <IconButton 
                              onClick={() => handleHealthClick(donor._id)}
                              sx={{ 
                                bgcolor: "#e3f2fd",
                                '&:hover': { bgcolor: "#bbdefb" }
                              }}
                            >
                              <img src={healthIcon} width={24} alt="Health" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Track Donation" arrow>
                            <IconButton 
                              onClick={() => handleTrackClick(donor._id)}
                              sx={{ 
                                bgcolor: "#fff3e0",
                                '&:hover': { bgcolor: "#ffe0b2" }
                              }}
                            >
                              <img src={trackIcon} width={24} alt="Track" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit" arrow>
                            <IconButton 
                              onClick={() => handleEdit(donor._id)}
                              sx={{ 
                                bgcolor: "#e8f5e9",
                                '&:hover': { bgcolor: "#c8e6c9" }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton 
                              onClick={() => handleDelete(donor._id)}
                              sx={{ 
                                bgcolor: "#ffebee",
                                '&:hover': { bgcolor: "#ffcdd2" }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Health Modal */}
      <Modal open={openHealthModal} onClose={() => setOpenHealthModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, p: 4 }}>
          {selectedDonor && <HealthChecker donorId={selectedDonor._id} onSaved={handleHealthSubmit} />}
        </Box>
      </Modal>

      {/* Track Modal */}
      <Modal open={openTrackModal} onClose={() => setOpenTrackModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, p: 4 }}>
          {selectedDonor && <TrackDonation donorId={selectedDonor._id} onSaved={handleTrackSubmit} />}
        </Box>
      </Modal>

      {/* Add AI Chat Box */}
      <AIChatBox />
    </Container>
  );
}
