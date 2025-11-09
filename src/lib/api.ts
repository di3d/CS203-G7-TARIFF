import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_TARIFFIC_BACKEND_URL;

console.log(process.env.NEXT_PUBLIC_TARRIFIC_BACKEND_URL);

export const api = axios.create({
    baseURL: API_BASE_URL,
});
