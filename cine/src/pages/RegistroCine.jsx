// src/components/RegisterCine.jsx
import "./LoginCine.css";
import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function RegisterCine() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/usuario/create", {
        nombre,
        email,
        password,
        rol: "cliente", 
      });

      if (res.status === 201) {
        alert("Usuario creado exitosamente. Ahora puedes iniciar sesión.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error al crear usuario:", err);
      alert("Error al crear el usuario. Intenta nuevamente.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Crear cuenta</h2>
        <p className="login-subtitle">Únete a nuestra comunidad de cine</p>

        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Crear usuario</button>
        </form>

        <div className="login-footer">
          ¿Ya tienes una cuenta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </div>
  );
}

export default RegisterCine;
