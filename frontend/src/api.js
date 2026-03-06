// Reusable frontend API client for the FastAPI backend.
import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

export async function getHealth() {
  const response = await apiClient.get("/health");
  return response.data;
}

export async function listOwners() {
  const response = await apiClient.get("/owners");
  return response.data;
}

export async function listVehicles() {
  const response = await apiClient.get("/vehicles");
  return response.data;
}

export async function listInsurance() {
  const response = await apiClient.get("/insurance");
  return response.data;
}

export function getApiErrorMessage(error) {
  if (error?.code === "ERR_NETWORK") {
    return `Cannot reach backend at ${API_BASE_URL}. Start FastAPI on port 8000 and refresh the page.`;
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong while talking to the backend."
  );
}
