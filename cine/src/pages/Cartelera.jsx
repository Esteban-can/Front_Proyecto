import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./Cartelera.css";

const CarteleraAdmin = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalFuncionAbierto, setModalFuncionAbierto] = useState(false);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  const [salas, setSalas] = useState([]);

  // Estado de película
  const [formData, setFormData] = useState({
    titulo: "",
    genero: "",
    duracion: "",
    calificacion: "",
    sinopsis: "",
    carteleraUrl: "",
    pais: "",
    anio: "",
  });

  //  Estado de función 
  const [funcionData, setFuncionData] = useState({
    fechas: [""],
    horas: [""],
    idioma: "",
    subtitulos: false,
    formato: "2D",
    salaId: "",
    precio: "", 
  });

  useEffect(() => {
    cargarPeliculas();
    cargarSalas();
  }, []);

  const cargarPeliculas = async () => {
    try {
      const res = await api.get("/peliculas");
      setPeliculas(res.data);
    } catch (error) {
      console.error("Error al cargar películas:", error);
    }
  };

  const cargarSalas = async () => {
    try {
      const res = await api.get("/salas");
      setSalas(res.data);
    } catch (error) {
      console.error("Error al cargar salas:", error);
    }
  };

  
  const abrirModal = (pelicula = null) => {
    setPeliculaSeleccionada(pelicula);
    if (pelicula) {
      // Modo edición - llena el formulario con los datos de la película
      setFormData({
        titulo: pelicula.titulo,
        genero: pelicula.genero,
        duracion: pelicula.duracion,
        calificacion: pelicula.calificacion,
        sinopsis: pelicula.sinopsis,
        carteleraUrl: pelicula.carteleraUrl,
        pais: pelicula.pais,
        anio: pelicula.anio,
      });
    } else {
      // Modo agregar - limpia el formulario
      setFormData({
        titulo: "",
        genero: "",
        duracion: "",
        calificacion: "",
        sinopsis: "",
        carteleraUrl: "",
        pais: "",
        anio: "",
      });
    }
    setModalAbierto(true);
  };

  
  const eliminarPelicula = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta película?")) {
      try {
        await api.delete(`/peliculas/delete/${id}`);
        cargarPeliculas(); // Recargar la lista
        alert("Película eliminada correctamente");
      } catch (error) {
        console.error("Error al eliminar película:", error);
        alert("Error al eliminar película");
      }
    }
  };

  
  const guardarPelicula = async () => {
    try {
      if (peliculaSeleccionada) {
        // Modo edición - RUTA CORREGIDA
        await api.put(`/peliculas/update/${peliculaSeleccionada.id}`, formData);
        alert("Película actualizada correctamente");
      } else {
        // Modo agregar - RUTA CORREGIDA
        await api.post("/peliculas/create", formData);
        alert("Película agregada correctamente");
      }
      cargarPeliculas(); // Recargar la lista
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al guardar película:", error);
      alert("Error al guardar película");
    }
  };

  const abrirModalFuncion = (pelicula) => {
    setPeliculaSeleccionada(pelicula);
    setFuncionData({
      fechas: [""],
      horas: [""],
      idioma: "",
      subtitulos: false,
      formato: "2D",
      salaId: "",
      precio: "", 
    });
    setModalFuncionAbierto(true);
  };

  const guardarFuncion = async () => {
    try {
      const payload = {
        fechas: funcionData.fechas.filter((f) => f),
        horas: funcionData.horas.filter((h) => h),
        idioma: funcionData.idioma,
        subtitulos: funcionData.subtitulos,
        formato: funcionData.formato,
        peliculaId: peliculaSeleccionada.id,
        salaId: funcionData.salaId,
        precio: funcionData.precio, 
      };

      const res = await api.post("/funciones/create", payload);
      console.log("Funciones creadas:", res.data);
      alert("Funciones creadas correctamente 🎬");
      setModalFuncionAbierto(false);
    } catch (error) {
      console.error("Error al crear funciones:", error);
      alert("Error al crear funciones.");
    }
  };

  return (
    <div className="cartelera">
      <h2>Administrar Cartelera</h2>

      <button className="btn-agregar" onClick={() => abrirModal()}>
       Crear Película
      </button>

      <div className="peliculas">
        {peliculas.map((peli) => (
          <div key={peli.id} className="tarjeta">
            <img src={peli.carteleraUrl} alt={peli.titulo} />
            <h3>{peli.titulo}</h3>
            <p>{peli.genero}</p>
            <button onClick={() => abrirModal(peli)}> Editar</button>
            <button onClick={() => eliminarPelicula(peli.id)}> Eliminar</button>
            <button onClick={() => abrirModalFuncion(peli)}>Asignar Función</button>
          </div>
        ))}
      </div>

      {/* ================= MODAL PELÍCULA ================= */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{peliculaSeleccionada ? "Editar Película" : "Agregar Película"}</h3>
            
            <input
              type="text"
              placeholder="Título"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            />
            <input
              type="text"
              placeholder="Género"
              value={formData.genero}
              onChange={(e) => setFormData({...formData, genero: e.target.value})}
            />
            <input
              type="text"
              placeholder="Duración (minutos)"
              value={formData.duracion}
              onChange={(e) => setFormData({...formData, duracion: e.target.value})}
            />
            <input
              type="text"
              placeholder="Calificación"
              value={formData.calificacion}
              onChange={(e) => setFormData({...formData, calificacion: e.target.value})}
            />
            <textarea
              placeholder="Sinopsis"
              value={formData.sinopsis}
              onChange={(e) => setFormData({...formData, sinopsis: e.target.value})}
            />
            <input
              type="text"
              placeholder="URL del cartel"
              value={formData.carteleraUrl}
              onChange={(e) => setFormData({...formData, carteleraUrl: e.target.value})}
            />
            <input
              type="text"
              placeholder="País"
              value={formData.pais}
              onChange={(e) => setFormData({...formData, pais: e.target.value})}
            />
            <input
              type="text"
              placeholder="Año"
              value={formData.anio}
              onChange={(e) => setFormData({...formData, anio: e.target.value})}
            />
            
            <div className="modal-buttons">
              <button className="guardar" onClick={guardarPelicula}>
                 {peliculaSeleccionada ? "Actualizar" : "Guardar"}
              </button>
              <button onClick={() => setModalAbierto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL FUNCIÓN ================= */}
      {modalFuncionAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Asignar Función a {peliculaSeleccionada?.titulo}</h3>

            {/* Fechas */}
            <label><strong>Fechas:</strong></label>
            {funcionData.fechas.map((fecha, index) => (
              <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => {
                    const nuevasFechas = [...funcionData.fechas];
                    nuevasFechas[index] = e.target.value;
                    setFuncionData({ ...funcionData, fechas: nuevasFechas });
                  }}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const nuevasFechas = funcionData.fechas.filter((_, i) => i !== index);
                      setFuncionData({ ...funcionData, fechas: nuevasFechas });
                    }}
                  >
                    
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFuncionData({ ...funcionData, fechas: [...funcionData.fechas, ""] })
              }
            >
               Agregar fecha
            </button>

            {/* Horas */}
            <label><strong>Horas:</strong></label>
            {funcionData.horas.map((hora, index) => (
              <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => {
                    const nuevasHoras = [...funcionData.horas];
                    nuevasHoras[index] = e.target.value;
                    setFuncionData({ ...funcionData, horas: nuevasHoras });
                  }}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const nuevasHoras = funcionData.horas.filter((_, i) => i !== index);
                      setFuncionData({ ...funcionData, horas: nuevasHoras });
                    }}
                  >
                    
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFuncionData({ ...funcionData, horas: [...funcionData.horas, ""] })
              }
            >
               Agregar hora
            </button>

            {/* Otros campos */}
            <input
              type="text"
              placeholder="Idioma"
              value={funcionData.idioma}
              onChange={(e) => setFuncionData({ ...funcionData, idioma: e.target.value })}
            />

            <label>
              <input
                type="checkbox"
                checked={funcionData.subtitulos}
                onChange={(e) =>
                  setFuncionData({ ...funcionData, subtitulos: e.target.checked })
                }
              />
              Subtitulada
            </label>

            <select
              value={funcionData.formato}
              onChange={(e) =>
                setFuncionData({ ...funcionData, formato: e.target.value })
              }
            >
              <option value="2D">2D</option>
              <option value="3D">3D</option>
            </select>

            <select
              value={funcionData.salaId}
              onChange={(e) =>
                setFuncionData({ ...funcionData, salaId: e.target.value })
              }
            >
              <option value="">Selecciona una sala</option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>

            {/*  Campo de precio */}
            <input
              type="number"
              placeholder="Precio del boleto"
              value={funcionData.precio}
              onChange={(e) =>
                setFuncionData({ ...funcionData, precio: e.target.value })
              }
              min="0"
              step="0.01"
            />

            <div className="modal-buttons">
              <button className="guardar" onClick={guardarFuncion}>
                 Guardar Función
              </button>
              <button onClick={() => setModalFuncionAbierto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarteleraAdmin;