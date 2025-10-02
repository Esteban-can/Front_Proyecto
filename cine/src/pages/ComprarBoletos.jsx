import { useParams } from "react-router-dom";
import SeleccionAsientos from "./SeleccionAsientos";

const peliculas = [
  {
    id: 1,
    titulo: 'Intensamente 2',
    horario: ['3:00 PM', '5:30 PM', '8:00 PM']
  },
  {
    id: 2,
    titulo: 'Deadpool & Wolverine',
    horario: ['2:00 PM', '6:00 PM', '9:00 PM']
  },
  {
    id: 3,
    titulo: 'El Planeta de los Simios',
    horario: ['1:00 PM', '4:00 PM', '7:30 PM']
  }
];

function ComprarBoletos() {
  const { id } = useParams();
  const peli = peliculas.find(p => p.id === parseInt(id));

  if (!peli) return <h2>Película no encontrada</h2>;

  return (
    <div>
      <h2>Comprar boletos para: {peli.titulo}</h2>
      
      {/* Selección de horario */}
      <div>
        <label>Selecciona horario:</label>
        <select>
          {peli.horario.map((h, index) => (
            <option key={index} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {/* Selección de cantidad */}
      <div>
        <label>Cantidad de boletos:</label>
        <input type="number" min="1" max="10" defaultValue="1" />
      </div>

      {/* Aquí insertas el selector visual de asientos */}
      <SeleccionAsientos />

      <button>Confirmar compra</button>
    </div>
  );
}

export default ComprarBoletos;
