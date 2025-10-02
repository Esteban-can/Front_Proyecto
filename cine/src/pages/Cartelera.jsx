import { useNavigate } from "react-router-dom";
import './Cartelera.css';
import intensamente from '../assets/4.jpg';
import deadpool from '../assets/4.jpg';
import simios from '../assets/4.jpg';

const peliculas = [
  {
    id: 1,
    titulo: 'Intensamente 2',
    imagen: intensamente,
    horario: ['3:00 PM', '5:30 PM', '8:00 PM']
  },
  {
    id: 2,
    titulo: 'Deadpool & Wolverine',
    imagen: deadpool,
    horario: ['2:00 PM', '6:00 PM', '9:00 PM']
  },
  {
    id: 3,
    titulo: 'El Planeta de los Simios',
    imagen: simios,
    horario: ['1:00 PM', '4:00 PM', '7:30 PM']
  }
];

function Cartelera() {
  const navigate = useNavigate();

  const handleComprar = (id) => {
    navigate(`/comprar/${id}`);
  };

  return (
    <div className="cartelera">
      <h2>Cartelera</h2>
      <div className="peliculas">
        {peliculas.map((peli) => (
          <div className="tarjeta" key={peli.id}>
            <img src={peli.imagen} alt={peli.titulo} />
            <h3>{peli.titulo}</h3>
            <p><strong>Horarios:</strong> {peli.horario.join(", ")}</p>
            <button onClick={() => handleComprar(peli.id)}>Comprar boletos</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cartelera;
