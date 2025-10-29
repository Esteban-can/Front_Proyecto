import React, { useEffect, useState } from "react";
import {
  getAllCombos,
  createCombo,
  updateCombo,
  deleteCombo,
  changeEstado,
} from "../services/comboService";
import "./AdminCombos.css";

export default function AdminCombos() {
  const [combos, setCombos] = useState([]);
  const [nuevoCombo, setNuevoCombo] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarCombos();
  }, []);

  const cargarCombos = async () => {
    const res = await getAllCombos();
    setCombos(res.data);
  };

  const manejarCambio = (e) => {
    setNuevoCombo({ ...nuevoCombo, [e.target.name]: e.target.value });
  };

  const guardarCombo = async () => {
    if (editando) {
      await updateCombo(editando, nuevoCombo);
    } else {
      await createCombo(nuevoCombo);
    }
    setNuevoCombo({ nombre: "", descripcion: "", precio: "", imagen: "" });
    setEditando(null);
    cargarCombos();
  };

  const editarCombo = (combo) => {
    setNuevoCombo(combo);
    setEditando(combo.id);
  };

  const eliminarCombo = async (id) => {
    if (window.confirm("¿Eliminar este combo?")) {
      await deleteCombo(id);
      cargarCombos();
    }
  };

  const cambiarEstadoCombo = async (id, estado) => {
    const nuevoEstado = estado === "disponible" ? "no_disponible" : "disponible";
    await changeEstado(id, nuevoEstado);
    cargarCombos();
  };

  return (
    <div className="admin-combos-container">
      <h2> Administración de Combos</h2>

      <div className="form-combo">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoCombo.nombre}
          onChange={manejarCambio}
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={nuevoCombo.descripcion}
          onChange={manejarCambio}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={nuevoCombo.precio}
          onChange={manejarCambio}
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de imagen"
          value={nuevoCombo.imagen}
          onChange={manejarCambio}
        />
        <button onClick={guardarCombo}>
          {editando ? " Actualizar" : " Crear Combo"}
        </button>
      </div>

      <table className="tabla-combos">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {combos.map((c) => (
            <tr key={c.id}>
              <td>
                {c.imagen ? (
                  <img src={c.imagen} alt={c.nombre} className="img-combo" />
                ) : (
                  "—"
                )}
              </td>
              <td>{c.nombre}</td>
              <td>{c.descripcion}</td>
              <td>Q{c.precio.toFixed(2)}</td>
              <td>{c.estado}</td>
              <td>
                <button onClick={() => editarCombo(c)}> Editar</button>
                <button onClick={() => eliminarCombo(c.id)}> Eliminar</button>
                <button onClick={() => cambiarEstadoCombo(c.id, c.estado)}>
                   {c.estado === "disponible" ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
