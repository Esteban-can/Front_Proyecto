import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Sucursales.css";

const CinesUsuario = () => {
  const [sucursales, setSucursales] = useState([]);
  const navigate = useNavigate();
  
  // Obtener usuario del localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Verificar si es admin
  const esAdmin = user?.rol === "administrador" || user?.rol === "admin" || user?.rol === "ADMIN";

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

  const handleAdminCines = () => {
    navigate("/admincines");
  };

  return (
    <div className="cines-usuario">
      <div className="cines-header">
        <h2>Nuestros Cines</h2>
        
        {esAdmin && (
          <button onClick={handleAdminCines} className="btn-admin">
             Administrar Cines
          </button>
        )}
      </div>
      
      <div className="cines-grid">
        {sucursales.map((cine) => (
          <div key={cine.id} className="cine-card">
            <div className="cine-info">
              <h3>{cine.nombre}</h3>
              <p className="cine-direccion"> {cine.direccion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CinesUsuario;