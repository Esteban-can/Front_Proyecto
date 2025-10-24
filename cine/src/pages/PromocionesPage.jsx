import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://cine-3b5t.onrender.com/api/promociones";

export default function PromocionesPage() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ codigo: "", descripcion: "", descuento: "", activo: true });
  const [totalCompra, setTotalCompra] = useState("");
  const [codigoAplicar, setCodigoAplicar] = useState("");
  const [resultadoPromo, setResultadoPromo] = useState(null);

  // 🔹 Leer rol desde localStorage
  const userRole = localStorage.getItem("rol"); // o el campo que uses en tu app

  const cargarPromos = async () => {
    const res = await axios.get(API_URL);
    setPromos(res.data);
  };

  useEffect(() => {
    cargarPromos();
  }, []);

  const crearPromo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/create`, form);
      setForm({ codigo: "", descripcion: "", descuento: "", activo: true });
      cargarPromos();
    } catch (err) {
      alert(err.response?.data?.message || "Error al crear promoción");
    }
  };

  const eliminarPromo = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta promoción?")) {
      await axios.delete(`${API_URL}/${id}`);
      cargarPromos();
    }
  };

  const aplicarPromo = async () => {
    try {
      const res = await axios.post(`${API_URL}/aplicar`, {
        codigo: codigoAplicar,
        total: parseFloat(totalCompra)
      });
      setResultadoPromo(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error al aplicar promoción");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🎟️ Promociones</h1>

      {/* 🟦 SOLO ADMIN: formulario de creación */}
      {userRole === "admin" && (
        <form onSubmit={crearPromo} className="space-y-3 bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold">Crear nueva promoción</h2>
          <input
            type="text"
            placeholder="Código"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Descuento (0.2 = 20%)"
            value={form.descuento}
            onChange={(e) => setForm({ ...form, descuento: e.target.value })}
            className="border p-2 w-full"
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Crear promoción
          </button>
        </form>
      )}

      {/* Lista de promociones */}
      <h2 className="text-xl font-semibold mt-8 mb-2">📋 Lista de promociones</h2>
      <ul className="space-y-2">
        {promos.map((promo) => (
          <li key={promo.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <strong>{promo.codigo}</strong> — {promo.descripcion}
              <br />
              <span className="text-sm text-gray-600">
                Descuento: {(promo.descuento * 100).toFixed(0)}%
              </span>
            </div>

            {/* 🟥 SOLO ADMIN: botón eliminar */}
            {userRole === "admin" && (
              <button
                onClick={() => eliminarPromo(promo.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Aplicar promoción */}
      <div className="mt-10 bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Aplicar promoción</h2>
        <input
          type="text"
          placeholder="Código de promoción"
          value={codigoAplicar}
          onChange={(e) => setCodigoAplicar(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Total de compra"
          value={totalCompra}
          onChange={(e) => setTotalCompra(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={aplicarPromo}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 w-full"
        >
          Aplicar promoción
        </button>

        {resultadoPromo && (
          <div className="mt-4 p-3 border rounded bg-green-50">
            <p><strong>Código:</strong> {resultadoPromo.codigo}</p>
            <p><strong>Descuento:</strong> {(resultadoPromo.descuento * 100).toFixed(0)}%</p>
            <p><strong>Total original:</strong> ${resultadoPromo.totalOriginal}</p>
            <p><strong>Total con descuento:</strong> ${resultadoPromo.totalConDescuento.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
