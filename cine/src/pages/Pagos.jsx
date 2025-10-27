import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Pago.css";

function PagoTarjeta() {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibe la info enviada desde SeleccionAsientos
  const {
    funcion,
    pelicula,
    sala,
    reservas,
    asientosSeleccionados,
    cantidadSolicitada,
    total,
  } = location.state || {};

  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [cvv, setCvv] = useState("");
  const [procesando, setProcesando] = useState(false);

  if (!reservas || reservas.length === 0) {
    return <p>No hay información de reserva disponible.</p>;
  }

  const handlePagar = async (e) => {
    e.preventDefault();
    if (!nombre || !numero || !cvv) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setProcesando(true);
    try {
      const reservaIds = reservas.map((r) => r.id);

      // 🔹 Llamada al backend para registrar el pago
      await api.post("/pagos/create", {
        reservaIds,
        metodoPago: "tarjeta",
        datosTarjeta: { nombre, numero, cvv },
      });

      alert("💳 Pago realizado con éxito!");
      navigate("/"); // Redirige al inicio o donde quieras
    } catch (error) {
      console.error("❌ Error al procesar el pago:", error);
      alert("Error al procesar el pago.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="pago-container">
      <h2>💳 Pago con Tarjeta</h2>

      <div className="resumen">
        <h3>🎬 {pelicula?.titulo || "Película"}</h3>
        <p>
          <strong>Sala:</strong> {sala?.nombre} <br />
          <strong>Fecha:</strong> {funcion?.fecha} | <strong>Hora:</strong> {funcion?.hora} <br />
          <strong>Asientos:</strong>{" "}
          {asientosSeleccionados.join(", ")} <br />
          <strong>Cantidad:</strong> {cantidadSolicitada} <br />
          <strong>Total:</strong> ${total.toFixed(2)}
        </p>
      </div>

      <form className="pago-form" onSubmit={handlePagar}>
        <label>
          Nombre en la tarjeta:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label>
          Número de tarjeta:
          <input
            type="text"
            maxLength="16"
            value={numero}
            onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))}
            required
          />
        </label>

        <label>
          CVV:
          <input
            type="password"
            maxLength="3"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            required
          />
        </label>

        <button type="submit" disabled={procesando}>
          {procesando ? "Procesando..." : "Pagar ahora"}
        </button>
      </form>
    </div>
  );
}

export default PagoTarjeta;
