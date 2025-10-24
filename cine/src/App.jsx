import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Cartelera from './pages/Cartelera';
import ListaCines from './pages/ListaCines';
import ListaPromos from './pages/ListaPromo'; 
import logo from './assets/logo2.png';
import Comprar from './pages/Comprar';
import Registrocine from './pages/RegistroCine';
import Funciones from './pages/Funciones';
import SeleccionAsientos from './pages/SeleccionAsiento';
import PromocionesPage from "./pages/PromocionesPage";
import PagoPage from "./pages/Pagos";
import './App.css';
import LoginPage from "./pages/Login";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/Login");
  };

  return (
    <header className="header">
      <h1 className="logo-link">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>
      </h1>

      <nav>
        <Link to="/">Cartelera</Link>
        <Link to="/cines">Cines</Link>
        <Link to="/promociones">Promociones</Link>

        {!user ? (
          <Link to="/Login">Login</Link>
        ) : (
          <>
            <span>Hola, {user.nombre}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<Funciones />} />
        
          <Route path="/cines" element={<ListaCines />} />
          <Route path="/Login" element={<LoginPage />} />
         <Route path="/agregar" element={<Cartelera />} />
          <Route path="/comprar/:id" element={<Comprar />} />
           <Route path="/asientos/:funcionId" element={<SeleccionAsientos />}></Route>
          <Route path="/register" element={<Registrocine />} />
             <Route path="/promociones" element={<PromocionesPage />} />
          <Route path="/pago/:reservaId" element={<PagoPage />} />
        </Routes>

        <footer className="footer">
          <p>&copy; 2025 Zona 404. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
