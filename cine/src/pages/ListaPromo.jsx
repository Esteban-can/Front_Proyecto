import React from "react";
import './Promos.css';
import simios from '../assets/4.jpg';
const promos = [
  {
    id: 1,
    nombre: "Combo Familiar",
    descripcion: "2 palomitas grandes, 2 refrescos y 2 boletos al cine.",
    precio : "$25.00",
    imagen: simios, 
  },
  {
    id: 2,
    nombre: "combo Pareja",
    descripcion: "1 palomita grande, 2 refrescos y 2 boletos al cine.",
    precio : "$20.00",
    imagen: simios,
  },
  {
    id: 3,
    nombre: "combo Individual",
    descripcion: "1 palomita grande, 1 refresco y 1 boleto al cine.",
    precio : "$10.00",
    imagen: simios,
  },
];
function ListaPromos() {
  return (
    <div className="ListaPromos">
      <h2>Nuestras Promociones</h2>
      <div className="promos">
        {promos.map((promo) => (
          <div className="tarjeta" key={promo.id}>
            <img src={promo.imagen} alt={promo.nombre} />
            <h3>{promo.nombre}</h3>
            <p><strong>Descripcion:</strong> {promo.descripcion}</p>
            <p><strong>Precio:</strong> {promo.precio}</p>
            <button>Comprar combo</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ListaPromos;