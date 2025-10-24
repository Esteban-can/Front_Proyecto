import axios from "axios";

// Detecta si estás en desarrollo o producción
const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api" // 👉 Usa el proxy de Vite en localhost
      : "https://cine-3b5t.onrender.com/api", // 👉 Usa la URL real en producción
});

export default api;
