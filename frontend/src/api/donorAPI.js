const apiUrl = "http://localhost:8001/donors"; // Replace with your actual API URL

// Function to fetch all donors
export const fetchDonors = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch donors.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching donors:", error);
    throw error; // Propagate error for handling in components
  }
};

// Function to create or update a donor
export const saveDonor = async (donorData, donorId = null) => {
  const method = donorId ? "PUT" : "POST";
  const url = donorId ? `${apiUrl}/${donorId}` : apiUrl;

  const formData = new FormData();
  formData.append("data", JSON.stringify(donorData));
  if (donorData.image) {
    formData.append("image", donorData.image);
  }

  try {
    const response = await fetch(url, {
      method: method,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add/edit donor: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving donor:", error);
    throw error; // Propagate error for handling in components
  }
};

// Function to delete a donor
export const deleteDonor = async (donorId) => {
  try {
    const response = await fetch(`${apiUrl}/${donorId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete donor.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting donor:", error);
    throw error; // Propagate error for handling in components
  }
};
