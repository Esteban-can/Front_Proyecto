import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Compra.css";

function Comprar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pelicula, setPelicula] = useState(null);
  const [funciones, setFunciones] = useState([]);
  const [funcionesFiltradas, setFuncionesFiltradas] = useState([]);
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);
  const [cantidadAsientos, setCantidadAsientos] = useState(1);

  // 🔹 Función para filtrar funciones futuras
  const filtrarFuncionesFuturas = (funcionesList) => {
    const ahora = new Date();
    console.log("Fecha actual:", ahora);
    
    const funcionesFuturas = funcionesList.filter((funcion) => {
      console.log("Procesando función:", funcion);
      
      try {
        // Verificar el formato de fecha que viene de la API
        console.log("Fecha de la función:", funcion.fecha);
        console.log("Hora de la función:", funcion.hora);
        
        // Intentar diferentes formatos de fecha
        let fechaFuncion;
        
        // Si la fecha viene en formato ISO (YYYY-MM-DD)
        if (funcion.fecha.includes('-')) {
          const [anio, mes, dia] = funcion.fecha.split('-');
          const [horas, minutos] = funcion.hora.split(':');
          fechaFuncion = new Date(
            parseInt(anio),
            parseInt(mes) - 1,
            parseInt(dia),
            parseInt(horas),
            parseInt(minutos)
          );
        }
        // Si la fecha viene en formato DD/MM/YYYY
        else if (funcion.fecha.includes('/')) {
          const [dia, mes, anio] = funcion.fecha.split('/');
          const [horas, minutos] = funcion.hora.split(':');
          fechaFuncion = new Date(
            parseInt(anio),
            parseInt(mes) - 1,
            parseInt(dia),
            parseInt(horas),
            parseInt(minutos)
          );
        }
        // Si no reconocemos el formato, asumimos que es válida
        else {
          console.warn("Formato de fecha no reconocido:", funcion.fecha);
          return true; // Mostrar la función por si acaso
        }
        
        console.log("Fecha convertida:", fechaFuncion);
        console.log("¿Es futura?", fechaFuncion > ahora);
        
        return fechaFuncion > ahora;
      } catch (error) {
        console.error("Error al procesar fecha:", error, funcion);
        return true; // En caso de error, mostrar la función
      }
    });
    
    console.log("Funciones futuras encontradas:", funcionesFuturas.length);
    return funcionesFuturas;
  };

  // 🔹 Cargar datos de la película y sus funciones
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resPeli = await api.get(`/peliculas/${id}`);
        setPelicula(resPeli.data);

        const resFuncs = await api.get(`/funciones`);
        const funcionesDePelicula = resFuncs.data.filter(
          (f) => f.pelicula.id === parseInt(id)
        );

        console.log("Todas las funciones de esta película:", funcionesDePelicula);
        
        // Filtrar solo funciones futuras
        const funcionesFuturas = filtrarFuncionesFuturas(funcionesDePelicula);
        
        setFunciones(funcionesDePelicula);
        setFuncionesFiltradas(funcionesFuturas);
        
        console.log("Funciones filtradas:", funcionesFuturas);
        
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

    navigate(`/asientos/${funcionSeleccionada.id}?cantidad=${cantidadAsientos}`);
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
              {funcionesFiltradas.length > 0 ? (
                funcionesFiltradas.map((f) => (
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
                <div>
                  <p>No hay horarios disponibles.</p>
                  {funciones.length > 0 && (
                    <p style={{fontSize: '0.9em', color: '#666'}}>
                      (Hay {funciones.length} funciones pero están en el pasado)
                    </p>
                  )}
                </div>
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