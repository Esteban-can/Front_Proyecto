// src/pages/FacturaCombo.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo3.png";
import "./Factura.css";

export default function FacturaCombo() {
  const location = useLocation();
  const navigate = useNavigate();

  const { venta, ticket, combo, total, factura } = location.state || {};

  if (!venta || !combo) {
    return (
      <div className="factura-container">
        <h2>⚠ No se encontró información de la compra</h2>
        <button className="volver-btn" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- 🔹 Logo centrado
    const logoWidth = 40;
    const logoHeight = 20;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = 10;

    try {
      doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.error("Error al agregar el logo:", error);
    }

    // --- 🔹 Encabezado
    doc.setFontSize(18);
    doc.text("Zona 404 - Factura de Combos", pageWidth / 2, 40, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Factura No: ${venta.id}`, 14, 55);
    doc.text(`Ticket: ${venta.ticketCodigo}`, 14, 62);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 14, 69);

    // --- 🔹 Datos del cliente si hay factura
    if (factura) {
      doc.text("Datos de Facturación:", 14, 80);
      doc.text(`NIT: ${factura.nit || "-"}`, 20, 87);
      doc.text(`Nombre: ${factura.nombre || "-"}`, 20, 94);
      doc.text(`Dirección: ${factura.direccion || "-"}`, 20, 101);
    }

    // --- 🔹 Tabla del combo
    autoTable(doc, {
      startY: factura ? 110 : 85,
      head: [["Combo", "Descripción", "Cantidad", "Precio (Q)", "Subtotal (Q)"]],
      body: [
        [
          combo.nombre,
          combo.descripcion,
          1,
          combo.precio.toFixed(2),
          combo.precio.toFixed(2),
        ],
      ],
    });

    // --- 🔹 Totales
    const iva = (combo.precio * 0.12).toFixed(2);
    const subtotal = (combo.precio - iva).toFixed(2);

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: Q${subtotal}`, 140, finalY);
    doc.text(`IVA (12%): Q${iva}`, 140, finalY + 7);
    doc.text(`Total: Q${combo.precio.toFixed(2)}`, 140, finalY + 14);

    // --- 🔹 Pie de página
    doc.setFontSize(10);
    doc.text("Gracias por tu compra en Zona 404 ", 14, finalY + 30);
    doc.text("Presenta este ticket en dulcería para reclamar tu combo.", 14, finalY + 37);

    doc.save(`FacturaCombo_Zona404_${venta.id}.pdf`);
  };

  return (
    <div className="factura-container">
      <h2>Factura de Combo</h2>

      <div className="factura-datos">
        <p><strong>Factura No:</strong> {venta.id}</p>
        <p><strong>Código de Ticket:</strong> {venta.ticketCodigo}</p>
        <p><strong>Fecha:</strong> {new Date().toLocaleString()}</p>
        <p><strong>Total Pagado:</strong> <b>Q{combo.precio.toFixed(2)}</b></p>
      </div>

      <h3>Detalle del Combo</h3>
      <div className="ticket-card">
        <img src={combo.imagen} alt={combo.nombre} className="combo-img" />
        <h4>{combo.nombre}</h4>
        <p>{combo.descripcion}</p>
        <p><strong>Precio:</strong> Q{combo.precio.toFixed(2)}</p>
      </div>

      {factura && (
        <div className="factura-datos">
          <h3>Datos de Facturación</h3>
          <p><strong>NIT:</strong> {factura.nit}</p>
          <p><strong>Nombre:</strong> {factura.nombre}</p>
          <p><strong>Dirección:</strong> {factura.direccion}</p>
        </div>
      )}

      <div className="factura-botones">
        <button onClick={generarPDF}> Descargar PDF</button>
        <button onClick={() => navigate("/")}> Volver al inicio</button>
      </div>
    </div>
  );
}
