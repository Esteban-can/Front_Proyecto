// src/pages/CombosCliente.jsx
import React, { useEffect, useState } from "react";
import { getCombosDisponibles } from "../services/comboService";
import { useNavigate } from "react-router-dom";
import "./ComboCliente.css";

export default function CombosCliente() {
  const [combos, setCombos] = useState([]);
  const [rol, setRol] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let rolDetectado = "";

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        rolDetectado =
          userData?.rol ||
          userData?.user?.rol ||
          userData?.usuario?.rol ||
          userData?.data?.rol ||
          "";
      } catch {
        rolDetectado = localStorage.getItem("rol") || "";
      }
    }

    setRol(rolDetectado);
    cargarCombos();
  }, []);

  const cargarCombos = async () => {
    try {
      const res = await getCombosDisponibles();
      setCombos(res.data);
    } catch (error) {
      console.error(" Error al cargar combos:", error);
    }
  };

  const esAdmin =
    rol && ["admin", "administrador", "ADMIN"].includes(rol.trim().toLowerCase());

  return (
    <div className="combos-cliente">
      <div className="header-combos">
        <h2> Combos Disponibles</h2>

        {esAdmin && (
          <button
            className="btn-admin-combos"
            onClick={() => navigate("/admin/combos")}
          >
             Administrar Combos
          </button>
        )}
      </div>

      <div className="combos-grid">
        {combos.length > 0 ? (
          combos.map((combo) => (
            <div className="combo-card" key={combo.id}>
              <img src={combo.imagen} alt={combo.nombre} />
              <h3>{combo.nombre}</h3>
              <p>{combo.descripcion}</p>
              <b>Q{combo.precio.toFixed(2)}</b>
              <button
                className="btn-pagar"
                onClick={() => navigate(`/pagar-combo/${combo.id}`)}
              >
                 Pagar
              </button>
            </div>
          ))
        ) : (
          <p>Cargando combos...</p>
        )}
      </div>
    </div>
  );
}
