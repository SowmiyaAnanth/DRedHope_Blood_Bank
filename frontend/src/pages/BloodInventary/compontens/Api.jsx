import axios from "axios";

const API_URL = "http://localhost:5000/api/blood-inventory"; 

// Get all blood inventory records
export const getBloodInventory = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching blood inventory:", error);
    throw error;
  }
};

// Add a new blood inventory entry
export const addBloodInventory = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error adding blood inventory:", error);
    throw error;
  }
};

// Update a blood inventory entry
export const updateBloodInventory = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating blood inventory:", error);
    throw error;
  }
};

// Delete a blood inventory entry
export const deleteBloodInventory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting blood inventory:", error);
    throw error;
  }
};
