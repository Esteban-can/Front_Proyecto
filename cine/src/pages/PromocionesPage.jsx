import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Promos.css";

const API_URL = "https://cine-3b5t.onrender.com/api/promociones";

export default function PromocionesCliente() {
  const [promos, setPromos] = useState([]);
  const [rol, setRol] = useState("");
  const [loading, setLoading] = useState(false);
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
    cargarPromos();
  }, []);

  const cargarPromos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setPromos(res.data);
    } catch (error) {
      console.error("Error al cargar promociones:", error);
    } finally {
      setLoading(false);
    }
  };

  const esAdmin =
    rol && ["admin", "administrador", "ADMIN"].includes(rol.trim().toLowerCase());

  return (
    <div className="promos-cliente">
      <div className="header-promos">
        <h2> Promociones</h2>

        {esAdmin && (
          <button
            className="btn-admin-promos"
            onClick={() => navigate("/admin/promos")}
          >
             Administrar Promociones
          </button>
        )}
      </div>

      <div className="promos-lista">
        {loading ? (
          <p>Cargando promociones...</p>
        ) : promos.length === 0 ? (
          <p>No hay promociones disponibles.</p>
        ) : (
          promos.map((promo) => (
            <div
              key={promo.id}
              className={`promo-card ${promo.activo ? "" : "inactiva"}`}
            >
              <h3>{promo.codigo}</h3>
              <p>{promo.descripcion || "Sin descripción"}</p>
              {/* 🔹 CORRECCIÓN: Mostrar como porcentaje */}
              <b>Descuento: {(promo.descuento * 100).toFixed(0)}%</b>
              <p className={promo.activo ? "activo" : "inactivo"}>
                {promo.activo ? " Activa" : " Inactiva"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}