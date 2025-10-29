import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo3.png"; // ✅ IMPORTAMOS el logo desde src/assets
import "./Factura.css";

export default function Factura() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pago, tickets = [] } = location.state || {};

  if (!pago || tickets.length === 0) {
    return (
      <div className="factura-container">
        <h2>⚠ No se encontró información de pago</h2>
        <button className="volver-btn" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const generarPDF = () => {
    const doc = new jsPDF();

    // --- 🔹 Agregar el logo (centrado y más arriba)
    const logoWidth = 40;   // ancho del logo
    const logoHeight = 20;  // altura proporcional (ajusta según se vea)
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoX = (pageWidth - logoWidth) / 2; // centrar horizontalmente
    const logoY = 10; // más arriba

    try {
      doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.error("Error al agregar el logo:", error);
    }

    // --- 🔹 Título debajo del logo
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(" Zona 404 - Factura de Compra", pageWidth / 2, 40, { align: "center" });

    // --- 🔹 Datos de pago
    doc.setFontSize(12);
    doc.text(`Factura No: ${pago.id}`, 14, 55);
    doc.text(`Método de Pago: ${pago.metodoPago}`, 14, 62);
    doc.text(`Subtotal: Q${pago.subtotal.toFixed(2)}`, 14, 69);
    doc.text(`IVA (12%): Q${pago.iva.toFixed(2)}`, 14, 76);
    doc.text(`Descuento: Q${pago.descuento.toFixed(2)}`, 14, 83);
    doc.text(`Total Pagado: Q${pago.totalPagar.toFixed(2)}`, 14, 90);
    

    // --- 🔹 Tabla de boletos
    autoTable(doc, {
      startY: 110,
      head: [["Película", "Sala", "Asiento", "Fecha", "Hora"]],
      body: tickets.map((t) => [
        t.pelicula,
        t.sala,
        t.asiento,
        t.fecha,
        t.hora,
      ]),
    });

    // --- 🔹 Pie de página
    doc.setFontSize(10);
    doc.text("Gracias por tu compra en Zona 404 ", 14, doc.lastAutoTable.finalY + 15);
    doc.text("Presenta este documento en taquilla para tu ingreso.", 14, doc.lastAutoTable.finalY + 22);

    // --- Guardar PDF
    doc.save(`Factura_Zona404_${pago.id}.pdf`);
  };

  return (
    <div className="factura-container">
      <h2>Factura de Pago</h2>

      <div className="factura-datos">
        <p><strong>ID de Pago:</strong> {pago.id}</p>
        <p><strong>Método de Pago:</strong> {pago.metodoPago}</p>
        
        <div className="pago-detalles">
          <p><strong>Subtotal:</strong> Q{pago.subtotal.toFixed(2)}</p>
          <p><strong>IVA (12%):</strong> Q{pago.iva.toFixed(2)}</p>
          <p><strong>Descuento:</strong> Q{pago.descuento.toFixed(2)}</p>
          <p className="total-pagado"><strong>Total Pagado:</strong> <b>Q{pago.totalPagar.toFixed(2)}</b></p>
        </div>

       
      </div>

      <div className="separador">_______________________________________________________</div>

      <h3>Boletos de Entrada</h3>
      <div className="tickets-list">
        {tickets.map((t, i) => (
          <div key={i} className="ticket-item">
            <span className="checkbox">[ ]</span>
            <div className="ticket-info">
              <p><strong>{t.pelicula}</strong></p>
              <p><strong>Sala:</strong> {t.sala}</p>
              <p><strong>Asiento:</strong> {t.asiento}</p>
              <p><strong>Fecha:</strong> {t.fecha}</p>
              <p><strong>Hora:</strong> {t.hora}</p>
              <p><strong>Formato:</strong> {t.formato}</p>
              <p><strong>Idioma:</strong> {t.idioma}</p>
              <p><strong>Subtítulos:</strong> {t.subtitulos || ""}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="factura-botones">
        <button className="btn-descargar" onClick={generarPDF}>Descargar PDF</button>
        <button className="btn-volver" onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    </div>
  );
}