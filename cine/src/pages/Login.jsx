// src/components/LoginCine.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; //  Importar useNavigate
import "./LoginCine.css";

export default function LoginPage({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); //  Hook para redirigir

  const fakeAuth = ({ email, password }) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "demo@cine.com" && password === "cine123") {
          resolve({ user: { name: "Cliente Demo", email } });
        } else {
          reject(new Error("Correo o contraseña incorrectos"));
        }
      }, 700);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      const res = await fakeAuth({ email, password });
      
      // Guardar usuario o token
      if (remember) localStorage.setItem("cine_token", "fake-token");
      else sessionStorage.setItem("cine_token", "fake-token");

      if (onSuccess) onSuccess(res.user);

      // 🔹 Redirige automáticamente a la página principal
      navigate("/");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Zona 404</h1>
        <p className="login-subtitle">Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="remember-me">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recuérdame
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Entrar</button>
        </form>

        <p className="login-footer">
          ¿No tienes cuenta? <a href="#">Regístrate</a>
        </p>
      </div>
    </div>
  );
}
