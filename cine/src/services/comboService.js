// src/services/comboService.js
import axios from "axios";

const API_URL = "https://cine-3b5t.onrender.com/api/combos";

export const getAllCombos = () => axios.get(API_URL);
export const getCombosDisponibles = () => axios.get(`${API_URL}/disponibles`);
export const getComboById = (id) => axios.get(`${API_URL}/${id}`);
export const createCombo = (data) => axios.post(`${API_URL}/create`, data);
export const updateCombo = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const changeEstado = (id, estado) =>
  axios.put(`${API_URL}/${id}/estado`, { estado });
export const deleteCombo = (id) => axios.delete(`${API_URL}/${id}`);
