import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api/axios";
import "./Pago.css";

const stripePromise = loadStripe(
  "pk_test_51SDvJy4TRpDLxRKw8NAfwK2FzkwM3jzJUmMLhuk4Re9GoU0XboSbOBL6CwVRPTW9vy0bWMTMJ6UF6qmHDh3TLii500DqZowHn0"
);

function PagoForm({ reservas, total, promocionId, clearCart }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  useEffect(() => {
    if (elements && elements.getElement(CardElement)) {
      setCardReady(true);
    }
  }, [elements]);

  const handlePagar = async (e) => {
    e.preventDefault();

    if (!nombre) {
      setMensaje("⚠ Por favor ingresa el nombre en la tarjeta.");
      return;
    }

    if (!stripe || !elements || !cardReady) {
      setMensaje("Stripe aún no está listo, espera unos segundos.");
      return;
    }

    // 🔹 CORRECCIÓN: Cambiar validación para Stripe (mínimo Q0.01)
    if (!total || total < 0.01) {
      setMensaje("⚠ El monto total debe ser al menos Q0.01");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setMensaje("⚠ El campo de tarjeta no está disponible, recarga la página.");
      return;
    }

    setProcesando(true);
    setMensaje("");

    try {
      const reservaIds = reservas.map((r) => r.id);

      // 🔹 CORRECCIÓN: NO enviar el total al backend - el backend debe calcularlo
      const response = await api.post("/pagos/create", {
        reservaIds,
        metodoPago: "tarjeta",
        promocionId: promocionId || null,
        // ❌ REMOVER: total, // El backend debe calcular el total
      });

      const { clientSecret, pago, tickets } = response.data;

      if (!clientSecret) {
        setMensaje("No se pudo obtener clientSecret de Stripe.");
        setProcesando(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: nombre },
        },
      });

      if (error) {
        setMensaje("Error al procesar el pago: " + error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        await api.put(`/pagos/${pago.id}`, { estado: "confirmado" });
        setMensaje("💳 Pago realizado con éxito!");
        cardElement.clear();
        clearCart && clearCart();

        navigate("/factura", {
          state: {
            pago,
            tickets,
            reservas,
          },
        });
      } else {
        setMensaje("⚠ No se pudo completar el pago, intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error procesando el pago:", err.response?.data || err.message);
      setMensaje("Error al procesar el pago: " + (err.response?.data?.message || err.message));
    } finally {
      setProcesando(false);
    }
  };

  return (
    <form className="pago-form" onSubmit={handlePagar}>
      <label>
        Nombre en la tarjeta:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={procesando}
          required
        />
      </label>

      <label>
        Datos de la tarjeta:
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "5px",
            background: procesando ? "#f9f9f9" : "white",
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#a0a0a0" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
          />
        </div>
      </label>

      <button type="submit" disabled={procesando || !cardReady}>
        {procesando ? "Procesando pago..." : `Pagar Q${total.toFixed(2)}`}
      </button>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </form>
  );
}

// -----------------------------------------------------------
// 🔹 Sección de promociones antes del pago
// -----------------------------------------------------------
export default function PagoTarjeta({ clearCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    reservas = [],
    total: totalInicial = 0,
    pelicula,
    sala,
    funcion,
    asientosSeleccionados = [],
    cantidadSolicitada = 0,
  } = location.state || {};

  const [promocion, setPromocion] = useState(null);
  const [codigoPromo, setCodigoPromo] = useState("");
  const [total, setTotal] = useState(totalInicial);
  const [mensajePromo, setMensajePromo] = useState("");

  const aplicarPromocion = async () => {
    try {
      const res = await api.get("/promociones");
      const promo = res.data.find(
        (p) => p.codigo.toLowerCase() === codigoPromo.toLowerCase() && p.activo
      );

      if (!promo) {
        setMensajePromo("❌ Código de promoción inválido o inactivo.");
        setPromocion(null);
        setTotal(totalInicial);
        return;
      }

      // 🔹 CORRECCIÓN: Convertir el descuento a porcentaje
      // Si en la BD está guardado como 0.15, lo convertimos a 15%
      const porcentajeDescuento = promo.descuento * 100;
      const descuento = (totalInicial * porcentajeDescuento) / 100;
      
      // 🔹 CORRECCIÓN: Mínimo Q0.01 para Stripe en lugar de Q1.00
      const nuevoTotal = Math.max(totalInicial - descuento, 0.01);

      setPromocion(promo);
      setTotal(nuevoTotal);
      setMensajePromo(`✅ Promoción aplicada: -${porcentajeDescuento}% (Q${descuento.toFixed(2)})`);
    } catch (error) {
      console.error("Error obteniendo promociones:", error);
      setMensajePromo("⚠ No se pudo validar la promoción.");
    }
  };

  if (!reservas.length) {
    return <p>No hay información de reserva disponible.</p>;
  }

  return (
    <div className="pago-container">
      <h2>Pago con Tarjeta</h2>

      <div className="resumen">
        <h3>{pelicula?.titulo || "Película"}</h3>
        <p>
          <strong>Sala:</strong> {sala?.nombre} <br />
          <strong>Fecha:</strong> {funcion?.fecha} | <strong>Hora:</strong> {funcion?.hora} <br />
          <strong>Asientos:</strong> {asientosSeleccionados.join(", ")} <br />
          <strong>Cantidad:</strong> {cantidadSolicitada} <br />
          <strong>Total original:</strong> Q{totalInicial.toFixed(2)}
        </p>

        <div className="promo-section">
          <label>
            Código de promoción:
            <input
              type="text"
              value={codigoPromo}
              onChange={(e) => setCodigoPromo(e.target.value)}
              placeholder="Ej: ESTUDIANTE"
            />
          </label>
          <button onClick={aplicarPromocion}>Aplicar</button>
          {mensajePromo && <p className="mensaje">{mensajePromo}</p>}
        </div>

        {promocion && (
          <p className="descuento-info">
            🏷 <strong>Promoción aplicada:</strong> {promocion.descripcion} 
            {/* 🔹 CORRECCIÓN: Mostrar el porcentaje correcto */}
            ({(promocion.descuento * 100).toFixed(0)}%)
          </p>
        )}

        <h3>Total a pagar: Q{total.toFixed(2)}</h3>
      </div>

      <Elements stripe={stripePromise}>
        <PagoForm
          reservas={reservas}
          total={total}
          promocionId={promocion?.id || null}
          clearCart={clearCart}
        />
      </Elements>
    </div>
  );
}