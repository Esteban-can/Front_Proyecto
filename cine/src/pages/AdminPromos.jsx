// src/pages/AdminPromos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://cine-3b5t.onrender.com/api/promociones";

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ codigo: "", descripcion: "", descuento: "" });
  const [editando, setEditando] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  const cargarPromos = async () => {
    const res = await axios.get(API_URL);
    setPromos(res.data);
  };

  useEffect(() => {
    cargarPromos();
  }, []);

  const crearPromo = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/create`, {
      ...form,
      descuento: parseFloat(form.descuento),
    });
    setForm({ codigo: "", descripcion: "", descuento: "" });
    cargarPromos();
  };

  const eliminarPromo = async (id) => {
    if (!window.confirm("¿Eliminar esta promoción?")) return;
    await axios.delete(`${API_URL}/${id}`);
    cargarPromos();
  };

  const togglePromo = async (promo) => {
    await axios.put(`${API_URL}/${promo.id}`, { activo: !promo.activo });
    cargarPromos();
  };

  const guardarEdicion = async (id) => {
    await axios.put(`${API_URL}/${id}`, {
      ...editForm,
      descuento: parseFloat(editForm.descuento),
    });
    setEditando(null);
    cargarPromos();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
         Administración de Promociones
      </h1>

      <button
        onClick={() => navigate("/promociones")}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-4"
      >
        ← Volver
      </button>

      {/* Crear promoción */}
      <form
        onSubmit={crearPromo}
        className="bg-gray-100 p-4 rounded-lg shadow-md mb-6 space-y-3"
      >
        <h2 className="font-semibold text-lg mb-2"> Crear nueva promoción</h2>
        <input
          type="text"
          placeholder="Código"
          value={form.codigo}
          onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Descuento (ej: 0.15 = 15%)"
          value={form.descuento}
          onChange={(e) => setForm({ ...form, descuento: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-full"
        >
          Crear
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4"> Lista de promociones</h2>

      <ul className="space-y-3">
        {promos.map((promo) => (
          <li
            key={promo.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            {editando === promo.id ? (
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  value={editForm.codigo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, codigo: e.target.value })
                  }
                  className="border p-1 rounded"
                />
                <input
                  type="text"
                  value={editForm.descripcion}
                  onChange={(e) =>
                    setEditForm({ ...editForm, descripcion: e.target.value })
                  }
                  className="border p-1 rounded"
                />
                <input
                  type="number"
                  step="0.01"
                  value={editForm.descuento}
                  onChange={(e) =>
                    setEditForm({ ...editForm, descuento: e.target.value })
                  }
                  className="border p-1 rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => guardarEdicion(promo.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <strong>{promo.codigo}</strong> — {promo.descripcion}
                  <br />
                  <span className="text-sm text-gray-600">
                    Descuento: {(promo.descuento * 100).toFixed(0)}%
                  </span>
                  <br />
                  <span
                    className={`text-sm font-semibold ${
                      promo.activo ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {promo.activo ? " Activa" : " Inactiva"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditando(promo.id);
                      setEditForm({
                        codigo: promo.codigo,
                        descripcion: promo.descripcion,
                        descuento: promo.descuento,
                      });
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => togglePromo(promo)}
                    className={`${
                      promo.activo
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white px-3 py-1 rounded`}
                  >
                    {promo.activo ? "Deshabilitar" : "Habilitar"}
                  </button>
                  <button
                    onClick={() => eliminarPromo(promo.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
