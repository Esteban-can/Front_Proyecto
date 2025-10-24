// src/services/carteleraService.js
import api from "../api/axios";

// Obtener todas las carteleras
export const getCarteleras = async () => {
  const response = await api.get("/carteleras");
  return response.data;
};

// Crear una cartelera (solo admin o empleado)
export const crearCartelera = async (data, token) => {
  const response = await api.post("/carteleras", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Eliminar cartelera
export const eliminarCartelera = async (id, token) => {
  const response = await api.delete(`/carteleras/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
