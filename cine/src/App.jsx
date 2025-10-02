import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Cartelera from './pages/Cartelera';
import ListaCines from './pages/ListaCines';
import ListaPromos from './pages/ListaPromo'; 
import logo from './assets/logo2.png';
import ComprarBoletos from "./pages/ComprarBoletos";
import './App.css';
import LoginPage from "./pages/Login";

function Home() {
   return (
    <main className="main-content">
      <h2 className="titulo-bienvenida">Bienvenido a Zona 404</h2>
      <p className="texto-bienvenida">
        Consulta la cartelera, compra tus boletos y disfruta del cine.
      </p>
      <Cartelera />
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
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
            <Link to="/Login">Login</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comprar/:id" element={<ComprarBoletos />} />
      
          <Route path="/cines" element={<ListaCines />} />
         <Route path="/promociones" element={<ListaPromos />} />
          <Route path="/Login" element={<LoginPage/>} />
        </Routes>

        <footer className="footer">
          <p>&copy; 2025 Zona 404. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
