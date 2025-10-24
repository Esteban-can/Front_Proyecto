// src/components/LoginCine.jsx
import "./LoginCine.css";
import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get("/usuario");
      const usuarios = res.data;

      const user = usuarios.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        alert("Credenciales incorrectas");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      alert(`Bienvenido ${user.nombre}!`);
      navigate("/");
    } catch (err) {
      console.error("Error al conectar con la API:", err);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Iniciar sesión</h2>
        <p className="login-subtitle">Bienvenido al Cine Zona 404</p>

        <form className="login-form" onSubmit={handleLogin}>
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
          <button type="submit">Ingresar</button>
        </form>

        <div className="login-footer">
          ¿No tienes cuenta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Crear usuario
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
