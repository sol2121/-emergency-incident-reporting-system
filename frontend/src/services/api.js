import axios from "axios";

const API_URL =
  "http://localhost/Emerjency-practice/backend/api";

export const api = axios.create({
  baseURL: API_URL,
});