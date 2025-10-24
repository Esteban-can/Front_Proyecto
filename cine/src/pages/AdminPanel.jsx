import React, { useEffect, useState } from "react";
import api from "../api/axios";

function AdminPanel() {
  const [carteleras, setCarteleras] = useState([]);
  const [nuevaCartelera, setNuevaCartelera] = useState({ titulo: "", descripcion: "" });

  const token = localStorage.getItem("token");

  const getCarteleras = async () => {
    const res = await api.get("/carteleras");
    setCarteleras(res.data);
  };

  const crearCartelera = async () => {
    await api.post("/carteleras", nuevaCartelera, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getCarteleras();
  };

  const eliminarCartelera = async (id) => {
    await api.delete(`/carteleras/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getCarteleras();
  };

  useEffect(() => {
    getCarteleras();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Administrar Carteleras</h2>

      <div className="crear-cartelera">
        <input
          type="text"
          placeholder="Título"
          value={nuevaCartelera.titulo}
          onChange={(e) => setNuevaCartelera({ ...nuevaCartelera, titulo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevaCartelera.descripcion}
          onChange={(e) => setNuevaCartelera({ ...nuevaCartelera, descripcion: e.target.value })}
        />
        <button onClick={crearCartelera}>Agregar</button>
      </div>

      <ul>
        {carteleras.map((c) => (
          <li key={c.id}>
            {c.titulo} — {c.descripcion}
            <button onClick={() => eliminarCartelera(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
