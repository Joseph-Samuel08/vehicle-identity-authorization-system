// Reusable frontend API client for the FastAPI backend.
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function createOwner(payload) {
  const response = await apiClient.post("/owners", payload);
  return response.data;
}

export async function createVehicle(payload) {
  const response = await apiClient.post("/vehicles", payload);
  return response.data;
}

export async function createInsurance(payload) {
  const response = await apiClient.post("/insurance", payload);
  return response.data;
}

export async function checkAuthorization(vehicleId) {
  const response = await apiClient.get(`/vehicles/${vehicleId}/authorization`);
  return response.data;
}

export function getApiErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong while talking to the backend."
  );
}
