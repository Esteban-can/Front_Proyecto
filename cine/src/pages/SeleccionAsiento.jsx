import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./SeleccionAsiento.css";

function SeleccionAsientos() {
  const { funcionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const cantidadSolicitada = parseInt(searchParams.get("cantidad")) || 1;

  const [funcion, setFuncion] = useState(null);
  const [sala, setSala] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const usuarioId = 1;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resFuncion = await api.get(`/funciones/${funcionId}`);
        setFuncion(resFuncion.data);

        const salaId = resFuncion.data.salaId;
        const resSala = await api.get(`/salas/${salaId}`);
        setSala(resSala.data);

        const resAsientos = await api.get(`/asientos`);
        const dataAsientos = Array.isArray(resAsientos.data)
          ? resAsientos.data
          : resAsientos.data.asientos || [];
        setAsientos(dataAsientos.filter((a) => a.salaId === salaId));

        const resReservas = await api.get(`/reservas`);
        setReservas(resReservas.data.filter((r) => r.funcionId === parseInt(funcionId)));
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, [funcionId]);

  const estaReservado = (asientoId) =>
    reservas.some(
      (r) => r.asientoId === asientoId && r.funcionId === parseInt(funcionId)
    );

  const toggleAsiento = (asientoId) => {
    if (estaReservado(asientoId)) return;

    if (asientosSeleccionados.includes(asientoId)) {
      setAsientosSeleccionados((prev) => prev.filter((id) => id !== asientoId));
    } else {
      if (asientosSeleccionados.length >= cantidadSolicitada) {
        alert(`Solo puedes seleccionar ${cantidadSolicitada} asiento(s).`);
        return;
      }
      setAsientosSeleccionados((prev) => [...prev, asientoId]);
    }
  };

  const confirmarReserva = async () => {
    if (asientosSeleccionados.length !== cantidadSolicitada) {
      alert(`Debes seleccionar exactamente ${cantidadSolicitada} asiento(s).`);
      return;
    }

    try {
      let nuevaReserva = null;
      for (const asientoId of asientosSeleccionados) {
        const res = await api.post("/reservas/create", {
          usuarioId,
          funcionId,
          asientoId,
        });
        nuevaReserva = res.data; // Tomamos la última reserva creada
      }

      alert("✅ Reserva realizada con éxito!");
      navigate(`/pagos/${nuevaReserva.id}`); // 👉 Redirige a pago individual
    } catch (err) {
      console.error(err);
      alert("Error al realizar la reserva.");
    }
  };

  if (!funcion || !sala) return <p className="cargando">Cargando datos...</p>;

  return (
    <div className="seleccion-container">
      <h2>🎟️ Selección de Asientos</h2>
      <p>
        Película: <b>{funcion.pelicula?.titulo || "Sin título"}</b> <br />
        Sala: <b>{sala.nombre}</b> <br />
        Fecha: {funcion.fecha} | Hora: {funcion.hora}
      </p>

      <p className="contador">
        Asientos seleccionados: <b>{asientosSeleccionados.length}</b> / {cantidadSolicitada}
      </p>

      <div className="sala-grid">
        {Array.from({ length: sala.filas }).map((_, fila) => (
          <div key={fila} className="fila">
            {Array.from({ length: sala.columnas }).map((_, col) => {
              const numero = `${String.fromCharCode(65 + fila)}${col + 1}`;
              const asiento = asientos.find((a) => a.numero === numero);
              const reservado = asiento && estaReservado(asiento.id);
              const seleccionado = asiento && asientosSeleccionados.includes(asiento.id);

              return (
                <button
                  key={col}
                  className={`asiento ${
                    reservado
                      ? "reservado"
                      : seleccionado
                      ? "seleccionado"
                      : "disponible"
                  }`}
                  onClick={() => asiento && toggleAsiento(asiento.id)}
                  disabled={reservado}
                >
                  {numero}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="acciones">
        <button className="confirmar-btn" onClick={confirmarReserva}>
          Confirmar Reserva
        </button>
      </div>
    </div>
  );
}

export default SeleccionAsientos;
