import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import {
  FiFileText,
  FiPlus,
  FiSave,
  FiShoppingCart,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturaData, setFacturaData] = useState({
    clienteId: "",
    productos: [{ productoId: "", cantidad: 1, precio: 0 }],
    total: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [facturasRes, clientesRes, productosRes] = await Promise.all([
        axios.get("http://localhost:3000/api/facturas"),
        axios.get("http://localhost:3000/api/clientes"),
        axios.get("http://localhost:3000/api/productos"),
      ]);
      setFacturas(facturasRes.data);
      setClientes(clientesRes.data);
      setProductos(productosRes.data);
      setError("");
    } catch (err) {
      setError("Error al cargar los datos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductosChange = (index, field, value) => {
    const newProductos = [...facturaData.productos];
    newProductos[index][field] = value;
    if (field === "productoId" && value) {
      const productoSeleccionado = productos.find((p) => p._id === value);
      if (productoSeleccionado) {
        newProductos[index].precio = productoSeleccionado.precio;
      }
    }
    const newTotal = newProductos.reduce(
      (sum, producto) => sum + producto.precio * producto.cantidad,
      0
    );
    setFacturaData({
      ...facturaData,
      productos: newProductos,
      total: newTotal,
    });
  };

  const addProducto = () => {
    setFacturaData({
      ...facturaData,
      productos: [
        ...facturaData.productos,
        { productoId: "", cantidad: 1, precio: 0 },
      ],
    });
  };

  const removeProducto = (index) => {
    const newProductos = [...facturaData.productos];
    newProductos.splice(index, 1);
    const newTotal = newProductos.reduce(
      (sum, producto) => sum + producto.precio * producto.cantidad,
      0
    );
    setFacturaData({
      ...facturaData,
      productos: newProductos,
      total: newTotal,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !facturaData.clienteId ||
      facturaData.productos.some((p) => !p.productoId)
    ) {
      setError("Por favor complete todos los campos");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("http://localhost:3000/api/facturas", {
        clienteId: facturaData.clienteId,
        productos: facturaData.productos.map((p) => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
          precio: p.precio,
        })),
      });
      setSuccess("Factura creada correctamente");
      setTimeout(() => setSuccess(""), 3000);
      fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la factura");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFacturaData({
      clienteId: "",
      productos: [{ productoId: "", cantidad: 1, precio: 0 }],
      total: 0,
    });
  };

  const formatMonto = (monto) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(monto);
  };

  const generatePDF = async (factura) => {
    // Creo un contenedor para el PDF con estilo agradable
    const element = document.createElement("div");
    element.style.width = "800px";
    element.style.padding = "20px";
    element.style.background = "white";
    element.style.fontFamily =
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    element.style.color = "#333";
    element.style.border = "1px solid #ccc";
    element.style.borderRadius = "8px";
    element.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
    element.innerHTML = `
      <div style="text-align:center; margin-bottom: 20px;">
        <h1 style="color:#4a90e2; margin: 0;">Factura #${factura.numero}</h1>
        <p style="margin: 5px 0 0; font-size: 14px; color: #777;">
          Fecha: ${new Date(factura.fecha).toLocaleDateString("es-ES")}
        </p>
      </div>
      <div style="margin-bottom: 20px;">
        <strong>Cliente:</strong> ${
          factura.clienteId?.nombre || "Cliente eliminado"
        }<br/>
        <strong>Email:</strong> ${factura.clienteId?.email || "No disponible"}
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #4a90e2; color: white;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align:left;">Producto</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align:right;">Cantidad</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align:right;">Precio Unitario</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${factura.productos
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                item.productoId?.nombre || "Producto eliminado"
              }</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align:right;">${
                item.cantidad
              }</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align:right;">${formatMonto(
                item.precio
              )}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align:right;">${formatMonto(
                item.precio * item.cantidad
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align:right; font-weight:bold;">Total</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align:right; font-weight:bold;">${formatMonto(
              factura.total
            )}</td>
          </tr>
        </tfoot>
      </table>
      <div style="margin-top: 30px; font-size: 12px; color: #999; text-align:center;">
        Gracias por su compra.
      </div>
    `;
    document.body.appendChild(element);
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Factura_${factura.numero}.pdf`);
    document.body.removeChild(element);
  };

  return (
    <div className="facturas-container">
      <h2 className="facturas-title">
        <FiFileText className="icon-title" /> Gestión de Facturas
      </h2>
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="factura-form">
        <div className="form-group">
          <label>
            <FiUser className="icon" /> Cliente:
          </label>
          <select
            value={facturaData.clienteId}
            onChange={(e) =>
              setFacturaData({ ...facturaData, clienteId: e.target.value })
            }
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre} - {cliente.email}
              </option>
            ))}
          </select>
        </div>
        <h3 className="productos-title">
          <FiShoppingCart className="icon" /> Productos
        </h3>
        {facturaData.productos.map((producto, index) => (
          <div key={index} className="producto-row">
            <div className="form-group">
              <label>Producto:</label>
              <select
                value={producto.productoId}
                onChange={(e) =>
                  handleProductosChange(index, "productoId", e.target.value)
                }
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.nombre} - {formatMonto(prod.precio)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cantidad:</label>
              <input
                type="number"
                min="1"
                value={producto.cantidad}
                onChange={(e) =>
                  handleProductosChange(
                    index,
                    "cantidad",
                    parseInt(e.target.value)
                  )
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Precio Unitario:</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={producto.precio}
                onChange={(e) =>
                  handleProductosChange(
                    index,
                    "precio",
                    parseFloat(e.target.value)
                  )
                }
                required
              />
            </div>
            <button
              type="button"
              className="btn btn-delete"
              onClick={() => removeProducto(index)}
              disabled={facturaData.productos.length <= 1}
            >
              <FiTrash2 className="icon" />
            </button>
          </div>
        ))}
        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addProducto}
          >
            <FiPlus className="icon" /> Agregar Producto
          </button>
        </div>
        <div className="total-container">
          <span className="total-label">Total:</span>
          <span className="total-amount">{formatMonto(facturaData.total)}</span>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <FiSave className="icon" />{" "}
          {isLoading ? "Procesando..." : "Crear Factura"}
        </button>
      </form>

      <div className="facturas-list">
        <h3>
          <FiFileText className="icon" /> Lista de Facturas
        </h3>
        {isLoading && facturas.length === 0 ? (
          <div className="loading">Cargando facturas...</div>
        ) : facturas.length === 0 ? (
          <p className="empty-message">No hay facturas registradas</p>
        ) : (
          <ul>
            {facturas.map((factura) => (
              <li key={factura._id} className="factura-item">
                <div className="factura-header">
                  <span className="factura-numero">
                    Factura #{factura.numero}
                  </span>
                  <span className="factura-fecha">
                    {new Date(factura.fecha).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <div className="factura-cliente">
                  <strong>Cliente:</strong>{" "}
                  {factura.clienteId?.nombre || "Cliente eliminado"}
                </div>
                <div className="factura-productos">
                  <strong>Productos:</strong>
                  <ul>
                    {factura.productos.map((item, idx) => (
                      <li key={idx}>
                        {item.productoId?.nombre || "Producto eliminado"} -{" "}
                        {item.cantidad} x {formatMonto(item.precio)} ={" "}
                        {formatMonto(item.precio * item.cantidad)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="factura-total">
                  <strong>Total:</strong> {formatMonto(factura.total)}
                </div>
                <button
                  onClick={() => generatePDF(factura)}
                  className="btn btn-secondary"
                >
                  <FiFileText /> Generar PDF
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
