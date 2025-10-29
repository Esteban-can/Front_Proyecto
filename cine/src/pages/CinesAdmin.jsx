import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./Sucursales.css";
import CinesUsuario from "./ListaCines"; //  Importar correctamente

const CinesAdmin = () => {
  const [sucursales, setSucursales] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
  });
  
  const user = JSON.parse(localStorage.getItem("user"));
  const adminRoles = ["admin", "administrador", "ADMIN"];
  const esAdmin = adminRoles.includes(user?.rol?.toLowerCase());

  useEffect(() => {
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    try {
      const res = await api.get("/sucursales");
      setSucursales(res.data);
    } catch (error) {
      console.error("Error al cargar cines:", error);
    }
  };

  const abrirModal = () => {
    setFormData({
      nombre: "",
      direccion: "",
    });
    setModalAbierto(true);
  };

  const guardarCine = async () => {
    try {
      if (!formData.nombre || !formData.direccion) {
        alert("Por favor completa todos los campos");
        return;
      }

      await api.post("/sucursales/create", formData);
      alert("Cine creado correctamente");
      
      cargarSucursales();
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al guardar cine:", error);
      alert("Error al guardar cine");
    }
  };

  if (!esAdmin) {
    return <CinesUsuario />; //  Ahora está definido
  }

  return (
    <div className="cines-admin">
      <div className="admin-header">
        <h2>Administrar Cines</h2>
        <button className="btn-agregar" onClick={abrirModal}>
           Crear Nuevo Cine
        </button>
      </div>

      <div className="cines-grid">
        {sucursales.map((cine) => (
          <div key={cine.id} className="cine-card">
            <div className="cine-info">
              <h3>{cine.nombre}</h3>
              <p className="cine-direccion">📍 {cine.direccion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear cine */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Crear Nuevo Cine</h3>
            
            <div className="form-group">
              <label>Nombre del Cine:</label>
              <input
                type="text"
                placeholder="Ej: Cine Centro, Cine Plaza, etc."
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Dirección:</label>
              <input
                type="text"
                placeholder="Dirección completa"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              />
            </div>
            
            <div className="modal-buttons">
              <button className="btn-guardar" onClick={guardarCine}>
                 Crear Cine
              </button>
              <button 
                className="btn-cancelar"
                onClick={() => setModalAbierto(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinesAdmin;