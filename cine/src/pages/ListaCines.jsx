import React from "react";

const cines = [
  {
    id: 1,
    nombre: "Zona 404 Centro",
    direccion: "Av. Reforma 10-10, Ciudad de Guatemala",
  },
  {
    id: 2,
    nombre: "Zona 404 Norte",
    direccion: "Zona 4, Blvd. Vista Hermosa, Guatemala",
  },
  {
    id: 3,
    nombre: "Zona 404 Sur",
    direccion: "Zona 11, Plaza Miraflores, Guatemala",
  },
];

function ListaCines() {
  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "20px" }}>
  Ubicaciones de nuestros Cines
</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {cines.map((cine) => (
          <li
            key={cine.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", color: "#007BFF" }}>{cine.nombre}</h3>
            <p style={{ margin: 0 }}>{cine.direccion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaCines;
