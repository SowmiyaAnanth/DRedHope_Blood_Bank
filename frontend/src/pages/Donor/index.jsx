import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Card,
  CardContent,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useParams } from "react-router-dom";

export default function Donor() {
  const { id } = useParams();
  const isEditModeFromURL = !!id;
  const [view, setView] = useState(isEditModeFromURL ? "edit" : "list");
  const [donors, setDonors] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const [formData, setFormData] = useState({
    id: null,
    fullName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    email: "",
    phoneNumber: "",
    countryCode: "",
    address: "",
    city: "",
    province: "",
    weight: "",
    height: "",
    chronicDiseases: "",
    recentSurgery: false,
    onMedication: false,
    hadPreviousDonation: false,
    lastDonationDate: "",
    preferredCenter: "",
    image: "",
  });

  // Load Merriweather font
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Merriweather&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("donors")) || [];
    setDonors(stored);

    if (isEditModeFromURL) {
      const donor = stored.find((d) => d.id.toString() === id);
      if (donor) {
        setFormData(donor);
        setPreviewImage(donor.image || null);
        setView("edit");
      } else {
        setError("Donor not found");
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "fullName") {
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) {
        setNameError("Only letters and spaces are allowed in the name.");
        return;
      } else {
        setNameError("");
      }
    }

    if (name === "email") {
      let updatedEmail = value;
      if (!updatedEmail.endsWith("@gmail.com")) {
        updatedEmail = updatedEmail.split("@")[0] + "@gmail.com";
      }
      setFormData((prev) => ({ ...prev, email: updatedEmail }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setPreviewImage(base64Image);
        setFormData((prev) => ({ ...prev, image: base64Image }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePhoneNumber = (phone) => {
    const fullPhoneNumber = formData.countryCode + phone;
    const regex = /^[0-9]{3}[0-9]{9}$/;
    if (!regex.test(fullPhoneNumber)) {
      setPhoneError(
        "Phone number must be exactly 12 digits (3 for country code + 9 for number)."
      );
      return false;
    }
    setPhoneError("");
    return true;
  };

  const getFullContactNo = () =>
    `${formData.countryCode}${formData.phoneNumber}`;

  const handleSubmit = () => {
    const isPhoneValid = validatePhoneNumber(formData.phoneNumber);
    if (!isPhoneValid || nameError) return;

    const updatedDonors = [...donors];
    const contactNumber = getFullContactNo();

    if (formData.id) {
      const index = updatedDonors.findIndex((d) => d.id === formData.id);
      if (index !== -1) {
        updatedDonors[index] = {
          ...formData,
          phoneNumber: contactNumber,
        };
      }
    } else {
      updatedDonors.push({
        ...formData,
        phoneNumber: contactNumber,
        id: Date.now(),
      });
    }

    const lightweightDonors = updatedDonors.map(({ image, ...rest }) => rest);
    localStorage.setItem("donors", JSON.stringify(lightweightDonors));

    setDonors(updatedDonors);
    setMessage(
      formData.id ? "Donor updated successfully!" : "Donor added successfully!"
    );

    setTimeout(() => {
      setMessage("");
      setView("list");
      setFormData({
        id: null,
        fullName: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        email: "",
        phoneNumber: "",
        countryCode: "",
        address: "",
        city: "",
        province: "",
        weight: "",
        height: "",
        chronicDiseases: "",
        recentSurgery: false,
        onMedication: false,
        hadPreviousDonation: false,
        lastDonationDate: "",
        preferredCenter: "",
        image: "",
      });
      setPreviewImage(null);
    }, 1000);
  };

  const handleDelete = (id) => {
    const updated = donors.filter((d) => d.id !== id);
    localStorage.setItem("donors", JSON.stringify(updated));
    setDonors(updated);
  };

  const handleEditClick = (donor) => {
    setFormData(donor);
    setPreviewImage(donor.image || null);
    setView("edit");
  };

  if (view === "list") {
    return (
      <Box mt={3}>
        <Typography variant="h5" align="center">
          Donor List
        </Typography>
        {donors.length === 0 ? (
          <Typography align="center" mt={2}>
            No donors found.
          </Typography>
        ) : (
          <Grid container spacing={2} mt={2}>
            {donors.map((donor) => (
              <Grid item xs={12} sm={6} md={4} key={donor.id}>
                <Box
                  sx={{
                    perspective: 1000,
                    "&:hover .flip-card-inner": {
                      transform: "rotateY(180deg)",
                    },
                  }}
                >
                  <Box
                    className="flip-card-inner"
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "340px",
                      textAlign: "center",
                      transition: "transform 0.6s",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* FRONT SIDE */}
                    <Card
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <CardContent>
                        {donor.image && (
                          <img
                            src={donor.image}
                            alt="Donor"
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                        <Typography mt={1} fontWeight="bold">
                          {donor.fullName}
                        </Typography>
                      </CardContent>
                    </Card>

                    {/* BACK SIDE */}
                    <Card
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <CardContent
                        sx={{
                          textAlign: "left",
                          fontFamily: "Merriweather, serif",
                        }}
                      >
                        <Typography fontWeight="bold">{donor.fullName}</Typography>
                        <Typography>Blood Group: {donor.bloodGroup}</Typography>
                        <Typography>City: {donor.city}</Typography>
                        <Typography>
                          Preferred Center: {donor.preferredCenter || "None"}
                        </Typography>
                        <Box mt={2} display="flex" gap={2}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEditClick(donor)}
                          >
                            ✏️
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(donor.id)}
                          >
                            🗑️
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            onClick={() => {
              setFormData({
                id: null,
                fullName: "",
                dateOfBirth: "",
                gender: "",
                bloodGroup: "",
                email: "",
                phoneNumber: "",
                countryCode: "",
                address: "",
                city: "",
                province: "",
                weight: "",
                height: "",
                chronicDiseases: "",
                recentSurgery: false,
                onMedication: false,
                hadPreviousDonation: false,
                lastDonationDate: "",
                preferredCenter: "",
                image: "",
              });
              setPreviewImage(null);
              setView("form");
            }}
          >
            Add New Donor
          </Button>
        </Box>
      </Box>
    );
  }

  // FORM VIEW
  return (
    <Card sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <CardContent>
        <Typography variant="h5" align="center">
          {formData.id ? "Edit Donor" : "Donor Registration"}
        </Typography>
        {message && (
          <Typography color="success.main" align="center">
            {message}
          </Typography>
        )}
        {error && (
          <Typography color="error.main" align="center">
            {error}
          </Typography>
        )}
        {phoneError && (
          <Typography color="error.main" align="center">
            {phoneError}
          </Typography>
        )}
        {nameError && (
          <Typography color="error.main" align="center">
            {nameError}
          </Typography>
        )}

        <Box>
          <TextField
            fullWidth
            margin="dense"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Blood Group</InputLabel>
            <Select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              label="Blood Group"
            >
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <PhoneInput
            country={formData.countryCode || "lk"}
            value={formData.phoneNumber}
            onChange={(phone, country) =>
              setFormData({
                ...formData,
                phoneNumber: phone,
                countryCode: country.dialCode,
              })
            }
            inputProps={{ name: "phoneNumber", required: true }}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Province"
            name="province"
            value={formData.province}
            onChange={handleChange}
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              width="100"
              style={{ marginTop: "10px" }}
            />
          )}

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
          />
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
          />

          <TextField
            fullWidth
            margin="dense"
            label="Chronic Diseases"
            name="chronicDiseases"
            value={formData.chronicDiseases}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="recentSurgery"
                checked={formData.recentSurgery}
                onChange={handleChange}
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
              />
            }
            label="On Medication"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="hadPreviousDonation"
                checked={formData.hadPreviousDonation}
                onChange={handleChange}
              />
            }
            label="Had Previous Donation"
          />
          {formData.hadPreviousDonation && (
            <TextField
              fullWidth
              margin="dense"
              type="date"
              label="Last Donation Date"
              name="lastDonationDate"
              value={formData.lastDonationDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          )}
          <TextField
            fullWidth
            margin="dense"
            label="Preferred Center"
            name="preferredCenter"
            value={formData.preferredCenter}
            onChange={handleChange}
          />

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              onClick={() => setView("list")}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              {formData.id ? "Update" : "Submit"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
