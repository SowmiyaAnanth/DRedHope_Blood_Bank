import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stepper, Step, StepLabel, Button, TextField, Checkbox,
  FormControlLabel, Box, Typography, Card, CardContent,
  InputLabel, FormControl, Select, MenuItem, InputAdornment, Modal, CircularProgress, Chip, Grid
} from "@mui/material";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import * as faceApi from "face-api.js";
import DonorList from "./components/DonorList";
import AddDonorGif from "../../assets/images/add2.gif";
import TrackDonation from './components/TrackDonation';

import { fetchDonors, saveDonor, deleteDonor } from '../../api/donorAPI';

export default function Donor() {
  const [activeStep, setActiveStep] = useState(0);
  const [showList, setShowList] = useState(true);
  const [editingDonor, setEditingDonor] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const navigate = useNavigate();

  const steps = ["Personal Details", "Medical Details", "Donation Details"];
  const [formData, setFormData] = useState({
    fullName: "", dateOfBirth: "", age: "", gender: "", bloodGroup: "",
    phoneNumber: "", countryCode: "", address: "",
    weight: "", height: "", chronicDiseases: "", recentSurgery: false,
    onMedication: false, hadPreviousDonation: false, lastDonationDate: "",
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  const [errors, setErrors] = useState({
    fullName: "", phoneNumber: ""
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/dmodels";
      await faceApi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceApi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceApi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceApi.nets.ageGenderNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "fullName") {
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) {
        setErrors(prev => ({ ...prev, fullName: "Only letters and spaces allowed." }));
      } else {
        setErrors(prev => ({ ...prev, fullName: "" }));
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
      setIsDetecting(true);
      setDetectionResult(null);

      const imageURL = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageURL;

      img.onload = async () => {
        try {
          const detections = await faceApi
            .detectSingleFace(img, new faceApi.TinyFaceDetectorOptions())
            .withAgeAndGender();

          if (detections) {
            const detectedGender = detections.gender === "male" ? "Male" : "Female";
            const estimatedAge = Math.round(detections.age);
            setFormData(prev => ({ ...prev, gender: detectedGender, age: estimatedAge.toString() }));
            setDetectionResult({
              gender: detectedGender,
              age: estimatedAge,
              confidence: detections.genderProbability
            });
          } else {
            setDetectionResult({ error: "No face detected in the image" });
          }
        } catch (error) {
          setDetectionResult({ error: "Error detecting face" });
        } finally {
          setIsDetecting(false);
        }
      };
    }
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const validateForm = () => {
    let valid = true;

    if (!formData.fullName.trim()) {
      setErrors(prev => ({ ...prev, fullName: "Full name is required." }));
      valid = false;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 7) {
      setErrors(prev => ({ ...prev, phoneNumber: "Enter a valid phone number." }));
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!validateForm()) return;

    const data = { ...formData };
    
    // If we're editing and no new image was selected, keep the existing image URL
    if (editingDonor && !data.image) {
      data.image = editingDonor.image;
    }

    try {
      await saveDonor(data, editingDonor ? editingDonor._id : null);

      if (!editingDonor) {
        setShowThankYou(true);
      } else {
        setShowList(true);
      }

      setFormData({
        fullName: "", dateOfBirth: "", age: "", gender: "", bloodGroup: "",
        phoneNumber: "", countryCode: "", address: "",
        weight: "", height: "", chronicDiseases: "", recentSurgery: false,
        onMedication: false, hadPreviousDonation: false, lastDonationDate: "",
        image: null
      });

      setPreviewImage(null);
      setActiveStep(0);
      setEditingDonor(null);
    } catch (error) {
      setError(error.message || "Something went wrong while submitting.");
    }
  };

  const handleEditDonor = (donor) => {
    setEditingDonor(donor);
    setFormData({ ...donor });
    setPreviewImage(donor.image ? donor.image : null);
    setShowList(false);
  };

  const handleDeleteDonor = async (id) => {
    try {
      await deleteDonor(id);
      setMessage("Donor deleted successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError("Failed to delete donor.");
    }
  };

  if (showList) {
    return <DonorList onCreateClick={() => setShowList(false)} onEditClick={handleEditDonor} onDeleteClick={handleDeleteDonor} />;
  }

  return (
    <>
      <Card sx={{ 
        maxWidth: 600, 
        margin: "auto", 
        padding: 3,
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: 'linear-gradient(to bottom right, #fff, #fff5f5)'
      }}>
        <CardContent>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              color: '#d32f2f',
              fontWeight: 700,
              mb: 3,
              fontFamily: 'Merriweather'
            }}
          >
            Donor Registration
          </Typography>
          {message && (
            <Box sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: '#e8f5e9', 
              borderRadius: 2,
              border: '1px solid #c8e6c9'
            }}>
              <Typography color="success.main" align="center">{message}</Typography>
            </Box>
          )}
          {error && (
            <Box sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: '#ffebee', 
              borderRadius: 2,
              border: '1px solid #ffcdd2'
            }}>
              <Typography color="error.main" align="center">{error}</Typography>
            </Box>
          )}

          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: '#666',
                fontWeight: 500
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: '#d32f2f',
                fontWeight: 600
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1 */}
          {activeStep === 0 && (
            <Box sx={{ mt: 4 }}>
              <TextField 
                fullWidth 
                margin="dense" 
                label="Full Name" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                error={!!errors.fullName} 
                helperText={errors.fullName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#d32f2f',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#d32f2f',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#d32f2f'
                  }
                }}
              />
              
              {/* Image Upload Section */}
              <Box sx={{ 
                mt: 3, 
                mb: 4, 
                p: 4, 
                border: '2px dashed #ff1744',
                borderRadius: '20px',
                textAlign: 'center',
                bgcolor: '#fff5f5',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#ffe0e0',
                  cursor: 'pointer',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(211, 47, 47, 0.1)'
                }
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Box sx={{ cursor: 'pointer' }}>
                    {previewImage ? (
                      <Box sx={{ position: 'relative' }}>
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          style={{ 
                            width: '200px', 
                            height: '200px', 
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '3px solid #ff1744',
                            boxShadow: '0 4px 20px rgba(211, 47, 47, 0.2)'
                          }} 
                        />
                        {isDetecting && (
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '200px',
                            height: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(0,0,0,0.7)',
                            borderRadius: '50%',
                            gap: 2
                          }}>
                            <CircularProgress sx={{ color: '#fff' }} />
                            <Typography variant="body1" color="white">
                              Detecting face...
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ p: 4 }}>
                        <Box sx={{ 
                          width: '150px', 
                          height: '150px', 
                          margin: '0 auto 20px',
                          borderRadius: '50%',
                          bgcolor: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px dashed #ff1744'
                        }}>
                          <img 
                            src="https://via.placeholder.com/150?text=Upload"
                            alt="Upload" 
                            style={{ 
                              width: '50px', 
                              height: '50px',
                              opacity: 0.7
                            }} 
                          />
                        </Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#1976d2',
                            fontWeight: 600,
                            mb: 1
                          }}
                        >
                          Click to Upload Photo
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.9rem'
                          }}
                        >
                          Upload a clear photo of your face for age and gender detection
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </label>

                {detectionResult && !detectionResult.error && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    bgcolor: '#e8f5e9',
                    borderRadius: 2,
                    border: '1px solid #c8e6c9'
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      color="success.main" 
                      fontWeight="bold" 
                      sx={{ mb: 2 }}
                    >
                      Face Detected Successfully!
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      gap: 2,
                      flexWrap: 'wrap'
                    }}>
                      <Chip 
                        label={`Age: ${detectionResult.age}`}
                        color="info"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.9rem',
                          padding: '15px 10px',
                          '& .MuiChip-label': { fontWeight: 500 }
                        }}
                      />
                      <Chip 
                        label={`Gender: ${detectionResult.gender}`}
                        color="secondary"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.9rem',
                          padding: '15px 10px',
                          '& .MuiChip-label': { fontWeight: 500 }
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {detectionResult?.error && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    bgcolor: '#ffebee',
                    borderRadius: 2,
                    border: '1px solid #ffcdd2'
                  }}>
                    <Typography color="error" sx={{ fontWeight: 500 }}>
                      {detectionResult.error}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    margin="dense" 
                    type="date" 
                    name="dateOfBirth" 
                    value={formData.dateOfBirth} 
                    onChange={handleChange} 
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#d32f2f',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d32f2f',
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#d32f2f'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    margin="dense" 
                    type="number" 
                    label="Age" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange}
                    InputProps={{
                      readOnly: true,
                      endAdornment: <InputAdornment position="end">years</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#d32f2f',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d32f2f',
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#d32f2f'
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Gender</InputLabel>
                    <Select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange} 
                      label="Gender"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          '&:hover': {
                            borderColor: '#d32f2f',
                          }
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d32f2f',
                        }
                      }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Blood Group</InputLabel>
                    <Select 
                      name="bloodGroup" 
                      value={formData.bloodGroup} 
                      onChange={handleChange} 
                      label="Blood Group"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          '&:hover': {
                            borderColor: '#d32f2f',
                          }
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d32f2f',
                        }
                      }}
                    >
                      {bloodGroups.map(group => (
                        <MenuItem key={group} value={group}>{group}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box mt={2}>
                <PhoneInput 
                  country={formData.countryCode || "lk"} 
                  value={formData.phoneNumber} 
                  onChange={(phone, country) => {
                    setFormData(prev => ({ ...prev, phoneNumber: phone, countryCode: country.dialCode }));
                    setErrors(prev => ({ ...prev, phoneNumber: "" }));
                  }} 
                  inputProps={{ 
                    name: "phoneNumber", 
                    required: true,
                    style: {
                      width: '100%',
                      height: '40px',
                      border: '1px solid #d32f2f',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }
                  }} 
                />
                {errors.phoneNumber && (
                  <Typography color="error" fontSize="0.75rem" sx={{ mt: 0.5 }}>
                    {errors.phoneNumber}
                  </Typography>
                )}
              </Box>

              <TextField 
                fullWidth 
                margin="dense" 
                label="Address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#d32f2f',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#d32f2f',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#d32f2f'
                  }
                }}
              />
            </Box>
          )}

          {/* Step 2 */}
          {activeStep === 1 && (
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    margin="dense" 
                    type="number" 
                    label="Weight" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleChange} 
                    InputProps={{ 
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#d32f2f',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d32f2f',
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#d32f2f'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    margin="dense" 
                    type="number" 
                    label="Height" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleChange} 
                    InputProps={{ 
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#d32f2f',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d32f2f',
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#d32f2f'
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <TextField 
                fullWidth 
                margin="dense" 
                label="Chronic Diseases" 
                name="chronicDiseases" 
                value={formData.chronicDiseases} 
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#d32f2f',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#d32f2f',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#d32f2f'
                  }
                }}
              />

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      name="recentSurgery" 
                      checked={formData.recentSurgery} 
                      onChange={handleChange}
                      sx={{
                        color: '#d32f2f',
                        '&.Mui-checked': {
                          color: '#d32f2f',
                        },
                      }}
                    />
                  } 
                  label="Recent Surgery" 
                />
                <FormControlLabel 
                  control={
                    <Checkbox 
                      name="onMedication" 
                      checked={formData.onMedication} 
                      onChange={handleChange}
                      sx={{
                        color: '#d32f2f',
                        '&.Mui-checked': {
                          color: '#d32f2f',
                        },
                      }}
                    />
                  } 
                  label="On Medication" 
                />
              </Box>
            </Box>
          )}

          {/* Step 3 */}
          {activeStep === 2 && (
            <Box sx={{ mt: 4 }}>
              <FormControlLabel 
                control={
                  <Checkbox 
                    name="hadPreviousDonation" 
                    checked={formData.hadPreviousDonation} 
                    onChange={handleChange}
                    sx={{
                      color: '#d32f2f',
                      '&.Mui-checked': {
                        color: '#d32f2f',
                      },
                    }}
                  />
                } 
                label="Had Previous Donation" 
              />
              {formData.hadPreviousDonation && (
                <Box sx={{ mt: 2 }}>
                  <TextField 
                    fullWidth 
                    type="date" 
                    label="Last Donation Date" 
                    name="lastDonationDate" 
                    value={formData.lastDonationDate} 
                    onChange={(e) => {
                      handleChange(e);
                      // Update donor data if editing
                      if (editingDonor) {
                        fetch(`http://localhost:5000/api/donors/${editingDonor._id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            ...formData,
                            lastDonationDate: e.target.value
                          })
                        });
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        color: '#666',
                        '&.Mui-focused': {
                          color: '#d32f2f'
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#d32f2f',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d32f2f',
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#d32f2f'
                      }
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0], // Prevents future dates
                    }}
                    helperText="Select your last blood donation date"
                  />
                </Box>
              )}

              {/* Show donation tracking after the last donation input */}
              {(formData.hadPreviousDonation && formData.lastDonationDate) && (
                <Box sx={{ mt: 4 }}>
                  <TrackDonation donorId={editingDonor ? editingDonor._id : null} />
                </Box>
              )}
            </Box>
          )}

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button 
              disabled={activeStep === 0} 
              onClick={handleBack} 
              variant="outlined"
              sx={{
                color: '#d32f2f',
                borderColor: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  bgcolor: '#fff5f5'
                }
              }}
            >
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext} 
                variant="contained"
                sx={{
                  bgcolor: '#d32f2f',
                  '&:hover': {
                    bgcolor: '#b71c1c'
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                variant="contained"
                sx={{
                  bgcolor: '#2e7d32',
                  '&:hover': {
                    bgcolor: '#1b5e20'
                  }
                }}
              >
                {editingDonor ? 'Update' : 'Submit'}
              </Button>
            )}
          </Box>

          <Box mt={2}>
            <Button 
              onClick={() => setShowList(true)} 
              variant="outlined"
              fullWidth
              sx={{
                color: '#d32f2f',
                borderColor: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  bgcolor: '#fff5f5'
                }
              }}
            >
              View Donors
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Thank You Popup Modal */}
      <Modal open={showThankYou} onClose={() => setShowThankYou(false)}>
        <Box sx={{ 
          width: 400, 
          bgcolor: "#fff", 
          borderRadius: "25px", 
          p: 4, 
          boxShadow: 10, 
          mx: "auto", 
          my: "20vh", 
          textAlign: "center", 
          border: "4px solid #d32f2f",
          background: 'linear-gradient(to bottom right, #fff, #fff5f5)'
        }}>
          <img src={AddDonorGif} alt="Thank You" width={150} />
          <Typography variant="h4" color="error" fontWeight={700} mt={2}>
            THANK YOU
          </Typography>
          <Typography variant="h4" color="error" fontWeight={700}>
            DONATING
          </Typography>
          <Typography variant="subtitle1" color="error" sx={{ mt: 1 }}>
            Donate blood save a life
          </Typography>
          <Button 
            variant="contained" 
            color="error" 
            fullWidth 
            sx={{ 
              mt: 3,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#b71c1c'
              }
            }} 
            onClick={() => {
              setShowThankYou(false);
              setShowList(true);
            }}
          >
            Continue
          </Button>
        </Box>
      </Modal>
    </>
  );
}
