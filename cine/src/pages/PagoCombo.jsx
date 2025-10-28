// src/pages/PagoCombo.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api/axios";
import { getComboById } from "../services/comboService";
import "./PagoCombo.css";

// ✅ Clave pública de Stripe
const stripePromise = loadStripe(
  "pk_test_51SDvJy4TRpDLxRKw8NAfwK2FzkwM3jzJUmMLhuk4Re9GoU0XboSbOBL6CwVRPTW9vy0bWMTMJ6UF6qmHDh3TLii500DqZowHn0"
);

function PagoForm({ combo }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [datosFactura, setDatosFactura] = useState({
    nit: "",
    nombre: "",
    direccion: "",
  });
  const [procesando, setProcesando] = useState(false);

  const handlePagar = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      Swal.fire("Error", "Stripe aún no está listo. Intenta nuevamente.", "error");
      return;
    }

    if (!nombre.trim()) {
      Swal.fire("Atención", "Ingresa el nombre del titular de la tarjeta.", "warning");
      return;
    }

    if (!datosFactura.nit || !datosFactura.nombre || !datosFactura.direccion) {
      Swal.fire("Atención", "Debes completar todos los datos de factura.", "warning");
      return;
    }

    setProcesando(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const usuarioId =
        storedUser?.id ||
        storedUser?.user?.id ||
        storedUser?.usuario?.id ||
        storedUser?.data?.id ||
        1;

      // ✅ Crear token de tarjeta con Stripe
      const cardElement = elements.getElement(CardElement);
      const { token, error: tokenError } = await stripe.createToken(cardElement, {
        name: nombre,
      });

      if (tokenError) {
        Swal.fire("Error", tokenError.message, "error");
        setProcesando(false);
        return;
      }

      console.log("✅ Token generado:", token.id);

      // ✅ Enviar al backend para crear la venta con factura obligatoria
      const response = await api.post("/ventacomida/create", {
        usuarioId,
        combos: [{ comboId: combo.id, cantidad: 1 }],
        token,
        factura: datosFactura,
      });

      if (response.status === 200 || response.status === 201) {
        Swal.fire("✅ Pago exitoso", "Tu compra fue registrada correctamente.", "success");
        navigate("/factura-combo", {
          state: {
            venta: response.data.venta,
            ticket: response.data.ticket,
            combo,
            total: combo.precio,
            factura: datosFactura,
          },
        });
      }
    } catch (error) {
      console.error("❌ Error en el pago:", error);
      Swal.fire("Error", "No se pudo procesar el pago.", "error");
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
          required
          disabled={procesando}
        />
      </label>

      <label>
        Datos de la tarjeta:
        <div className="card-element-box">
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

      {/* 🔹 Sección de factura (obligatoria) */}
      <div className="form-factura">
        <h4>Datos de Factura</h4>
        <input
          type="text"
          placeholder="NIT"
          value={datosFactura.nit}
          onChange={(e) => setDatosFactura({ ...datosFactura, nit: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Nombre"
          value={datosFactura.nombre}
          onChange={(e) => setDatosFactura({ ...datosFactura, nombre: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={datosFactura.direccion}
          onChange={(e) =>
            setDatosFactura({ ...datosFactura, direccion: e.target.value })
          }
          required
        />
      </div>

      <button type="submit" disabled={!stripe || procesando}>
        {procesando ? "Procesando..." : `💳 Pagar Q${combo.precio.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function PagoCombo() {
  const { id } = useParams();
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCombo = async () => {
      try {
        const res = await getComboById(id);
        setCombo(res.data);
      } catch (error) {
        console.error("❌ Error al cargar combo:", error);
        Swal.fire("Error", "No se pudo cargar el combo.", "error");
      } finally {
        setLoading(false);
      }
    };
    cargarCombo();
  }, [id]);

  if (loading) return <p>Cargando combo...</p>;
  if (!combo) return <p>No se encontró el combo.</p>;

  return (
    <div className="pago-container">
      <div className="resumen">
        <h3>Resumen del Combo</h3>
        <img src={combo.imagen} alt={combo.nombre} className="combo-img" />
        <h2>{combo.nombre}</h2>
        <p>{combo.descripcion}</p>
        <h3>Total: Q{combo.precio.toFixed(2)}</h3>
      </div>

      <Elements stripe={stripePromise}>
        <PagoForm combo={combo} />
      </Elements>
    </div>
  );
}
