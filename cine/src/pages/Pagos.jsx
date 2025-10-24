import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Pago.css";

function PagoTarjeta() {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [cvv, setCvv] = useState("");
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const cargarReserva = async () => {
      try {
        const res = await api.get(`/reservas/${reservaId}`);
        setReserva(res.data);
      } catch (err) {
        console.error("❌ Error al cargar la reserva:", err);
      }
    };
    cargarReserva();
  }, [reservaId]);

  const handlePagar = async (e) => {
    e.preventDefault();
    if (!nombre || !numero || !cvv) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setProcesando(true);
    try {
      // Ejemplo de llamada a tu API de pagos
      await api.post("/pagos/create", {
        reservaIds: [parseInt(reservaId)],
        metodoPago: "tarjeta",
        datosTarjeta: { nombre, numero, cvv },
      });

      alert("💳 Pago realizado con éxito!");
      navigate("/"); // redirige al inicio o a otra página
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pago.");
    } finally {
      setProcesando(false);
    }
  };

  if (!reserva) return <p>Cargando información de la reserva...</p>;

  return (
    <div className="pago-container">
      <h2>💳 Pago con Tarjeta</h2>
      <p>
        <strong>Reserva #{reserva.id}</strong><br />
        Función: {reserva.funcionId}<br />
        Asiento: {reserva.asientoId}
      </p>

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
