const apiUrl = "http://localhost:5000/api/donors";

// Function to fetch all donors
export const fetchDonors = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch donors.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching donors:", error);
    throw error;
  }
};

// Function to create or update a donor
export const saveDonor = async (donorData, donorId = null) => {
  const method = donorId ? "PUT" : "POST";
  const url = donorId ? `${apiUrl}/${donorId}` : apiUrl;

  try {
    const formData = new FormData();
    
    // Add all donor data as JSON string
    const donorDataToSend = { ...donorData };
    if (donorDataToSend.image && typeof donorDataToSend.image === 'object') {
      formData.append("image", donorDataToSend.image);
      delete donorDataToSend.image; // Remove image from JSON data
    }
    formData.append("data", JSON.stringify(donorDataToSend));

    const response = await fetch(url, {
      method: method,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to save donor data.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving donor:", error);
    throw error;
  }
};

// Function to delete a donor
export const deleteDonor = async (donorId) => {
  try {
    const response = await fetch(`${apiUrl}/${donorId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete donor.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting donor:", error);
    throw error;
  }
};
