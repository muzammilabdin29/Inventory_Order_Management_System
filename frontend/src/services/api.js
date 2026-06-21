import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Normalizes backend error payloads ({ detail: ... }) into a single string
// so every component can show errors the same way without re-parsing.
function extractErrorMessage(error) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || JSON.stringify(d)).join("; ");
  }
  return error.message || "Something went wrong. Please try again.";
}

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(extractErrorMessage(error)))
);

// ---------- Products ----------
export const getProducts = () => client.get("/products").then((r) => r.data);
export const getProduct = (id) => client.get(`/products/${id}`).then((r) => r.data);
export const createProduct = (payload) => client.post("/products", payload).then((r) => r.data);
export const updateProduct = (id, payload) => client.put(`/products/${id}`, payload).then((r) => r.data);
export const deleteProduct = (id) => client.delete(`/products/${id}`);

// ---------- Customers ----------
export const getCustomers = () => client.get("/customers").then((r) => r.data);
export const getCustomer = (id) => client.get(`/customers/${id}`).then((r) => r.data);
export const createCustomer = (payload) => client.post("/customers", payload).then((r) => r.data);
export const deleteCustomer = (id) => client.delete(`/customers/${id}`);

// ---------- Orders ----------
export const getOrders = () => client.get("/orders").then((r) => r.data);
export const getOrder = (id) => client.get(`/orders/${id}`).then((r) => r.data);
export const createOrder = (payload) => client.post("/orders", payload).then((r) => r.data);
export const deleteOrder = (id) => client.delete(`/orders/${id}`);

// ---------- Dashboard ----------
export const getDashboardSummary = () => client.get("/dashboard/summary").then((r) => r.data);

export default client;
