import { useEffect, useState, useRef } from "react";
import {
  Card, CardContent, CardMedia, Typography, Grid, Container, Box,
  IconButton, Tooltip, Button, Modal, TextField, InputAdornment,
  Chip, Divider, Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from '@mui/icons-material/Description';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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
import { fetchDonors as apiFetchDonors, deleteDonor as apiDeleteDonor } from "../../../api/donorAPI";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [error, setError] = useState("");
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectedDonorReport, setSelectedDonorReport] = useState(null);
  const reportTemplateRef = useRef(null);

  const disqualifyingDiseases = ["diabetes", "tuberculosis", "hiv", "aids", "heart disease", "cancer"];

  useEffect(() => {
    fetchDonorsList();
  }, []);

  const fetchDonorsList = async () => {
    try {
      setError("");
      const data = await apiFetchDonors();
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
      setError("Failed to load donors. Please try again later.");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = donors.filter((donor) =>
      donor.bloodGroup?.toLowerCase().includes(value) ||
      donor.fullName?.toLowerCase().includes(value)
    );
    setFilteredDonors(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      try {
        await apiDeleteDonor(id);
        const updated = donors.filter((donor) => donor._id !== id);
        setDonors(updated);
        setFilteredDonors(updated);
        if (onDeleteClick) onDeleteClick(id);
      } catch (error) {
        console.error("Error deleting donor:", error);
        setError("Failed to delete donor. Please try again.");
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
    fetchDonorsList();
  };

  const handleTrackSubmit = () => {
    setOpenTrackModal(false);
    fetchDonorsList();
  };

  const handleButtonClick = () => {
    setButtonClicked(true);
    setTimeout(() => {
      setButtonClicked(false);
      onCreateClick();
    }, 300);
  };

  const handleGenerateReport = (donor) => {
    setSelectedDonorReport(donor);
    setOpenReportModal(true);
  };

  const downloadReport = async () => {
    if (!selectedDonorReport) return;

    const input = reportTemplateRef.current;
    
    // Wait for images to load
    const images = input.getElementsByTagName('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    try {
      const canvas = await html2canvas(input, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // If content height is greater than page height, create multiple pages
      while (position < imgHeight) {
        // Add new page if it's not the first page
        if (position > 0) {
          pdf.addPage();
        }
        
        // Calculate remaining height for this page
        const heightLeft = imgHeight - position;
        const pageHeightToUse = Math.min(pageHeight, heightLeft);
        
        // Add portion of the image to this page
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position > 0 ? -position : 0, // Adjust y position for subsequent pages
          imgWidth,
          imgHeight
        );
        
        position += pageHeight;
      }

      pdf.save(`${selectedDonorReport.fullName}_donor_report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You might want to show an error message to the user here
    }
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
                          image={donor.image || "https://via.placeholder.com/150?text=No+Image"} 
                          alt={donor.fullName}
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
                          <Tooltip title="Generate Report" arrow>
                            <IconButton 
                              onClick={() => handleGenerateReport(donor)}
                              sx={{ 
                                bgcolor: "#e3f2fd",
                                '&:hover': { bgcolor: "#bbdefb" }
                              }}
                            >
                              <DescriptionIcon />
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

      {/* Report Modal */}
      <Modal 
        open={openReportModal} 
        onClose={() => setOpenReportModal(false)}
        aria-labelledby="donor-report-modal"
      >
        <Paper sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '1000px',
          height: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {selectedDonorReport && (
            <>
              {/* Fixed Header */}
              <Box sx={{ 
                p: 3, 
                borderBottom: '1px solid #e0e0e0',
                bgcolor: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h5" component="h2" fontWeight="bold" color="primary">
                  Donor Report Preview
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={downloadReport}
                    sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenReportModal(false)}
                    color="primary"
                  >
                    Close
                  </Button>
                </Box>
              </Box>

              {/* Scrollable Content */}
              <Box sx={{ 
                flex: 1,
                overflow: 'auto',
                p: 3,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#555',
                }
              }}>
                {/* Report Template */}
                <Box ref={reportTemplateRef} sx={{ 
                  p: 2, 
                  bgcolor: '#fff',
                  width: '210mm',  // A4 width
                  margin: '0 auto',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  borderRadius: 1
                }}>
                  {/* Header */}
                  <Box sx={{ 
                    textAlign: 'center', 
                    mb: 2
                  }}>
                    <Typography variant="h4" sx={{ 
                      color: '#d32f2f', 
                      fontWeight: 700, 
                      mb: 0.5,
                      fontSize: '1.5rem'
                    }}>
                      Red Hope Blood Bank
                    </Typography>
                    <Typography variant="subtitle1" sx={{ 
                      color: '#666',
                      fontWeight: 500,
                      mb: 1,
                      fontSize: '0.9rem'
                    }}>
                      Donor Information Report
                    </Typography>
                    <Divider sx={{ borderColor: '#d32f2f' }} />
                  </Box>

                  {/* Donor Info Card */}
                  <Box sx={{ 
                    bgcolor: '#fff5f5',
                    borderRadius: '8px',
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start'
                  }}>
                    {/* Donor Image */}
                    <Box sx={{ 
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      border: '2px solid #d32f2f',
                      overflow: 'hidden',
                      flexShrink: 0,
                      bgcolor: '#fff'
                    }}>
                      <img 
                        src={selectedDonorReport.image || "https://via.placeholder.com/100"}
                        alt={selectedDonorReport.fullName}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>

                    {/* Donor Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        color: '#d32f2f',
                        fontWeight: 700,
                        mb: 1,
                        fontSize: '1.1rem'
                      }}>
                        {selectedDonorReport.fullName}
                      </Typography>

                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Blood Group
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {selectedDonorReport.bloodGroup}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Age
                          </Typography>
                          <Typography variant="body1">
                            {selectedDonorReport.age} years
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Gender
                          </Typography>
                          <Typography variant="body1">
                            {selectedDonorReport.gender}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Phone
                          </Typography>
                          <Typography variant="body1">
                            {selectedDonorReport.phoneNumber}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* Medical Information */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#d32f2f',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1rem'
                    }}>
                      Medical Information
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Weight
                          </Typography>
                          <Typography variant="body1">
                            {selectedDonorReport.weight || 'N/A'} kg
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Height
                          </Typography>
                          <Typography variant="body1">
                            {selectedDonorReport.height || 'N/A'} cm
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Chronic Diseases
                          </Typography>
                          <Typography variant="body1">
                            {selectedDonorReport.chronicDiseases || 'None'}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ 
                          p: 1, 
                          bgcolor: selectedDonorReport.recentSurgery ? '#ffebee' : '#e8f5e9'
                        }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Recent Surgery
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            color: selectedDonorReport.recentSurgery ? '#d32f2f' : '#2e7d32',
                            fontWeight: 'bold'
                          }}>
                            {selectedDonorReport.recentSurgery ? 'YES' : 'NO'}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ 
                          p: 1, 
                          bgcolor: selectedDonorReport.onMedication ? '#ffebee' : '#e8f5e9'
                        }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            On Medication
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            color: selectedDonorReport.onMedication ? '#d32f2f' : '#2e7d32',
                            fontWeight: 'bold'
                          }}>
                            {selectedDonorReport.onMedication ? 'YES' : 'NO'}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Donation History */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#d32f2f',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1rem'
                    }}>
                      Donation History
                    </Typography>

                    <Paper sx={{ 
                      p: 2,
                      bgcolor: selectedDonorReport.hadPreviousDonation ? '#fff3e0' : '#f5f5f5',
                      border: `1px solid ${selectedDonorReport.hadPreviousDonation ? '#ffe0b2' : '#e0e0e0'}`
                    }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Previous Donation Status
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedDonorReport.hadPreviousDonation ? 'Has Previous Donations' : 'No Previous Donations'}
                          </Typography>
                        </Grid>

                        {selectedDonorReport.hadPreviousDonation && (
                          <>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                Last Donation Date
                              </Typography>
                              <Typography variant="body1" sx={{ color: '#f57c00' }}>
                                {selectedDonorReport.lastDonationDate 
                                  ? new Date(selectedDonorReport.lastDonationDate).toLocaleDateString()
                                  : 'N/A'
                                }
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                Next Eligible Date
                              </Typography>
                              <Typography variant="body1" sx={{ color: '#2e7d32' }}>
                                {selectedDonorReport.lastDonationDate 
                                  ? (() => {
                                      const nextDate = new Date(selectedDonorReport.lastDonationDate);
                                      nextDate.setMonth(nextDate.getMonth() + 6);
                                      return nextDate.toLocaleDateString();
                                    })()
                                  : 'N/A'
                                }
                              </Typography>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Paper>
                  </Box>

                  {/* Footer */}
                  <Box sx={{ 
                    mt: 'auto', 
                    pt: 1, 
                    borderTop: '1px solid #d32f2f', 
                    textAlign: 'center' 
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      Report Generated: {new Date().toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block' }}>
                      Red Hope Blood Bank - Saving Lives Together
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Modal>

      {/* Add AI Chat Box */}
      <AIChatBox />
    </Container>
  );
}
