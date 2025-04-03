import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { QRCodeCanvas } from "qrcode.react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  InputLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNotifier } from "../../../components/Notification/Notifications";

// GIFs
import bloodGif from "../../../assets/images/bloodGif.gif";
import quantity from "../../../assets/images/quantity.gif";
import collection from "../../../assets/images/collection.gif";
import exit from "../../../assets/images/exit.gif";
import id from "../../../assets/images/id.gif";
import staff from "../../../assets/images/staff.gif";
import tag from "../../../assets/images/tag.gif";

const BloodInventoryForm = ({ open, onClose, onSuccess, defaultValues }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const { notifySuccess, notifyError } = useNotifier(); 
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset({
        bloodGroup: "",
        quantity: "",
        collectionDate: "",
        expiryDate: "",
        storageLocation: "",
        donorID: "",
        collectedBy: "",
      });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      setQrCode(JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data) => {
    try {
      if (defaultValues && defaultValues._id) {
        data._id = defaultValues._id;
      }
      onSuccess(data);
      notifySuccess("Blood inventory saved successfully.");
      reset();
    } catch (error) {
      notifyError("Error saving inventory.");
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Blood Bank Inventory Management</DialogTitle>
      <DialogContent dividers>
        <form id="blood-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Blood Group */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.bloodGroup}>
                <FormLabel>
                  <Box display="flex" alignItems="center">
                    <img
                      src={bloodGif}
                      alt="Blood Group"
                      width="30"
                      style={{ marginRight: 10 }}
                    />
                    Blood Group
                  </Box>
                </FormLabel>
                <RadioGroup
                  row
                  value={watch("bloodGroup") || ""}
                  onChange={(e) => setValue("bloodGroup", e.target.value)}
                >
                  <Grid container>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (group) => (
                        <Grid item xs={3} key={group}>
                          <FormControlLabel
                            value={group}
                            control={<Radio />}
                            label={group}
                          />
                        </Grid>
                      )
                    )}
                  </Grid>
                </RadioGroup>
                {errors.bloodGroup && (
                  <Typography color="error" fontSize="0.8rem">
                    {errors.bloodGroup.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Quantity */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <img src={quantity} alt="Quantity" width="30" />
                <TextField
                  fullWidth
                  label="Quantity (Units)"
                  type="number"
                  {...register("quantity", {
                    required: "Quantity is required",
                    min: { value: 1, message: "Minimum quantity is 1" },
                  })}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                />
              </Box>
            </Grid>

            {/* Collection Date */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <img src={collection} alt="Collection Date" width="30" />
                <TextField
                  fullWidth
                  label="Collection Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("collectionDate", {
                    required: "Collection date is required",
                  })}
                  error={!!errors.collectionDate}
                  helperText={errors.collectionDate?.message}
                />
              </Box>
            </Grid>

            {/* Expiry Date */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <img src={exit} alt="Expiry Date" width="30" />
                <TextField
                  fullWidth
                  label="Expiry Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("expiryDate", {
                    required: "Expiry date is required",
                  })}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate?.message}
                />
              </Box>
            </Grid>

            {/* Storage Location */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <img src={tag} alt="Storage Location" width="30" />
                <FormControl fullWidth error={!!errors.storageLocation}>
                  <InputLabel>Storage Location</InputLabel>
                  <Select
                    label="Storage Location"
                    {...register("storageLocation", {
                      required: "Storage location is required",
                    })}
                    value={watch("storageLocation") || ""}
                  >
                    <MenuItem value="City Hospital">City Hospital</MenuItem>
                    <MenuItem value="National Blood Bank">
                      National Blood Bank
                    </MenuItem>
                    <MenuItem value="Red Cross Center">
                      Red Cross Center
                    </MenuItem>
                  </Select>
                  {errors.storageLocation && (
                    <Typography color="error" fontSize="0.8rem" mt={0.5}>
                      {errors.storageLocation.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Grid>

            {/* Donor ID */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <img src={id} alt="Donor ID" width="30" />
                <TextField
                  fullWidth
                  label="Donor ID"
                  {...register("donorID", {
                    required: "Donor ID is required",
                    minLength: { value: 2, message: "Donor ID too short" },
                  })}
                  error={!!errors.donorID}
                  helperText={errors.donorID?.message}
                />
              </Box>
            </Grid>

            {/* Collected By */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <img src={staff} alt="Collected By" width="30" />
                <TextField
                  fullWidth
                  label="Collected By"
                  {...register("collectedBy", {
                    required: "Collected by is required",
                  })}
                  error={!!errors.collectedBy}
                  helperText={errors.collectedBy?.message}
                />
              </Box>
            </Grid>

            {/* QR Code */}
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Typography fontWeight="bold">QR Code</Typography>
              <Box sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1 }}>
                <QRCodeCanvas value={qrCode} size={100} />
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          type="submit"
          form="blood-form"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BloodInventoryForm;
