import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Compra.css";

function Comprar() {
  const { id } = useParams(); // id de la película
  const navigate = useNavigate();

  const [pelicula, setPelicula] = useState(null);
  const [funciones, setFunciones] = useState([]);
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);
  const [cantidadAsientos, setCantidadAsientos] = useState(1);

  // 🔹 Cargar datos de la película y sus funciones
 useEffect(() => {
  const cargarDatos = async () => {
    try {
      const resPeli = await api.get(`/peliculas/${id}`);
      setPelicula(resPeli.data);

      // Cargar todas las funciones y filtrar por película.id
      const resFuncs = await api.get(`/funciones`);
      const funcionesDePelicula = resFuncs.data.filter(
        (f) => f.pelicula.id === parseInt(id)
      );

      console.log("Funciones de esta película:", funcionesDePelicula);
      setFunciones(funcionesDePelicula);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  cargarDatos();
}, [id]);

  // 🔹 Confirmar la selección y pasar a la pantalla de asientos
  const handleSeleccionarAsientos = () => {
    if (!funcionSeleccionada) {
      alert("Selecciona un horario primero.");
      return;
    }

    if (cantidadAsientos < 1) {
      alert("Selecciona al menos un asiento.");
      return;
    }

    // Redirigir al usuario a la pantalla de selección de asientos
    navigate(
      `/asientos/${funcionSeleccionada.id}?cantidad=${cantidadAsientos}`
    );
  };

  return (
    <div className="comprar">
      {pelicula ? (
        <div className="compra-container">
          <img
            src={pelicula.carteleraUrl}
            alt={pelicula.titulo}
            className="compra-img"
            onError={(e) => (e.target.src = "/default.jpg")}
          />
          <div className="compra-info">
            <h2>{pelicula.titulo}</h2>
            <p>{pelicula.sinopsis}</p>

            <h3>Selecciona un horario:</h3>
            <div className="horarios">
              {funciones.length > 0 ? (
                funciones.map((f) => (
                  <button
                    key={f.id}
                    className={`horario-btn ${
                      funcionSeleccionada?.id === f.id ? "seleccionado" : ""
                    }`}
                    onClick={() => setFuncionSeleccionada(f)}
                  >
                    📅 {f.fecha} ⏰ {f.hora} — {f.sala?.nombre}
                  </button>
                ))
              ) : (
                <p>No hay horarios disponibles.</p>
              )}
            </div>

            {funcionSeleccionada && (
              <div className="asientos">
                <h3>Selecciona cantidad de asientos:</h3>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={cantidadAsientos}
                  onChange={(e) => setCantidadAsientos(Number(e.target.value))}
                />

                <button className="confirmar" onClick={handleSeleccionarAsientos}>
                   Seleccionar asientos
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Cargando detalles...</p>
      )}
    </div>
  );
}

export default Comprar;
