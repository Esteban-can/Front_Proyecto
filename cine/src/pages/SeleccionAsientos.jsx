import { useState } from "react";
import "./SeleccionAsientos.css";

function SeleccionAsientos() {
  // Crear una matriz de asientos ejemplo (5 filas x 8 columnas)
  const filas = ["A", "B", "C", "D", "E"];
  const columnas = 8;

  const generarAsientos = () => {
    let seats = [];
    filas.forEach((fila) => {
      for (let num = 1; num <= columnas; num++) {
        seats.push({
          id: `${fila}${num}`,
          fila,
          numero: num,
          estado: "disponible", // todos empiezan disponibles
        });
      }
    });
    return seats;
  };

  const [asientos, setAsientos] = useState(generarAsientos);
  const [seleccionados, setSeleccionados] = useState([]);

  const toggleAsiento = (id) => {
    setAsientos((prev) =>
      prev.map((seat) =>
        seat.id === id
          ? {
              ...seat,
              estado: seat.estado === "disponible" ? "reservado" : "disponible",
            }
          : seat
      )
    );

    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="asientos-container">
      <h2>Selecciona tus asientos</h2>
      <div className="grid">
        {asientos.map((seat) => (
          <div
            key={seat.id}
            className={`asiento ${seat.estado}`}
            onClick={() =>
              seat.estado !== "ocupado" && seat.estado !== "bloqueado"
                ? toggleAsiento(seat.id)
                : null
            }
          >
            {seat.fila}
            {seat.numero}
          </div>
        ))}
      </div>

      <div className="resumen">
        <h3>Asientos seleccionados:</h3>
        <p>{seleccionados.join(", ") || "Ninguno"}</p>
      </div>
    </div>
  );
}

export default SeleccionAsientos;
