import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Cartelera.css";

function Funciones() {
  const [funciones, setFunciones] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const cargarFuncion = async () => {
    try {
      const res = await api.get("/funciones");
      console.log("Funciones cargadas:", res.data);

      // ✅ Agrupar funciones por película
      const agrupadas = Object.values(
        res.data.reduce((acc, f) => {
          const peliculaId = f.pelicula?.id;
          if (!peliculaId) return acc;

          if (!acc[peliculaId]) {
            acc[peliculaId] = {
              pelicula: f.pelicula,
              funciones: [],
            };
          }

          acc[peliculaId].funciones.push({
            id: f.id,
            fecha: f.fecha,
            hora: f.hora,
            idioma: f.idioma,
            sala: f.sala,
            precio: f.precio, // 👈 incluimos el precio aquí
          });

          return acc;
        }, {})
      );

      setFunciones(agrupadas);
    } catch (error) {
      console.error("Error al cargar funciones:", error);
    }
  };

  useEffect(() => {
    cargarFuncion();
  }, []);

  const handleComprar = (peliculaId) => {
    navigate(`/comprar/${peliculaId}`);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta función?")) return;
    try {
      await api.delete(`/funciones/delete/${id}`);
      cargarFuncion();
    } catch {
      alert("Error al eliminar función");
    }
  };

  const esAdmin =
    user?.rol === "administrador" || user?.rol === "admin" || user?.rol === "ADMIN";

  return (
    <div className="cartelera">
      <h2>Cartelera</h2>

      {esAdmin && (
        <div className="admin-header">
          <button onClick={() => navigate("/agregar")} className="btn-agregar">
            ➕ Agregar Película
          </button>
        </div>
      )}

      <div className="peliculas">
        {funciones.length > 0 ? (
          funciones.map((grupo) => {
            // ✅ Tomamos el precio de la primera función (todas suelen tener el mismo)
            const precio = grupo.funciones[0]?.precio;

            return (
              <div className="tarjeta" key={grupo.pelicula.id}>
                <img
                  src={grupo.pelicula?.carteleraUrl || "/default.jpg"}
                  alt={grupo.pelicula?.titulo || "Sin título"}
                  onError={(e) => (e.target.src = "/default.jpg")}
                />

                <h3>{grupo.pelicula?.titulo || "Sin título"}</h3>
                <p><strong>Género:</strong> {grupo.pelicula?.genero || "N/A"}</p>
                <p><strong>Duración:</strong> {grupo.pelicula?.duracion || "N/A"} min</p>
                <p><strong>Calificación:</strong> {grupo.pelicula?.calificacion || "N/A"}</p>
                <p><strong>Precio:</strong>  Q{precio?.toLocaleString() || "N/A"}</p>

                <button
                  className="btn-comprar"
                  onClick={() => handleComprar(grupo.pelicula.id)}
                >
                  🎟️ Comprar boletos
                </button>

                {esAdmin && (
                  <div className="admin-buttons">
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(grupo.pelicula.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>Cargando cartelera...</p>
        )}
      </div>
    </div>
  );
}

export default Funciones;
