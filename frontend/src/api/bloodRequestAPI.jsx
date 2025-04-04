import axios from "axios";

const API_URL = "http://localhost:5000/api/blood-requests"; // or your deployed URL

export const getAllRequests = () => axios.get(API_URL);
export const createRequest = (data) => axios.post(API_URL, data);
export const updateRequest = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteRequest = (id) => axios.delete(`${API_URL}/${id}`);
