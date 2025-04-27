import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [facturaData, setFacturaData] = useState({
    clienteId: '',
    productos: [{ productoId: '', cantidad: 0, precio: 0 }],
    total: 0,
  });
  const [error, setError] = useState('');

  // Función para cargar las facturas
  const fetchFacturas = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/facturas');
      setFacturas(res.data);
    } catch (err) {
      setError('Error al cargar las facturas.');
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  // Actualizar el total y los productos cuando cambian
  const handleProductosChange = (index, field, value) => {
    const newProductos = [...facturaData.productos];
    newProductos[index][field] = value;

    // Recalcular el total
    let newTotal = 0;
    newProductos.forEach(producto => {
      newTotal += producto.precio * producto.cantidad;
    });

    setFacturaData({
      ...facturaData,
      productos: newProductos,
      total: newTotal,
    });
  };

  // Agregar un nuevo producto al formulario
  const addProducto = () => {
    setFacturaData({
      ...facturaData,
      productos: [...facturaData.productos, { productoId: '', cantidad: 0, precio: 0 }],
    });
  };

  // Enviar el formulario para crear una nueva factura
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!facturaData.clienteId || facturaData.productos.length === 0) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      const nuevaFactura = { clienteId: facturaData.clienteId, productos: facturaData.productos };
      await axios.post('http://localhost:3000/api/facturas', nuevaFactura);
      fetchFacturas();
      setFacturaData({
        clienteId: '',
        productos: [{ productoId: '', cantidad: 0, precio: 0 }],
        total: 0,
      });
    } catch (err) {
      setError('Error al crear la factura.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Facturas</h2>

      {error && <p className="text-red-500">{error}</p>} {/* Mostrar errores */}

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={facturaData.clienteId}
          onChange={(e) => setFacturaData({ ...facturaData, clienteId: e.target.value })}
          placeholder="Cliente ID"
          className="mr-2"
        />
        {facturaData.productos.map((producto, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={producto.productoId}
              onChange={(e) => handleProductosChange(index, 'productoId', e.target.value)}
              placeholder="Producto ID"
              className="mr-2"
            />
            <input
              type="number"
              value={producto.cantidad}
              onChange={(e) => handleProductosChange(index, 'cantidad', e.target.value)}
              placeholder="Cantidad"
              className="mr-2"
            />
            <input
              type="number"
              value={producto.precio}
              onChange={(e) => handleProductosChange(index, 'precio', e.target.value)}
              placeholder="Precio"
              className="mr-2"
            />
          </div>
        ))}
        <button type="button" onClick={addProducto} className="mr-2">
          Agregar Producto
        </button>
        <div>Total: {facturaData.total}</div>
        <button type="submit">Crear Factura</button>
      </form>

      <h3>Lista de Facturas</h3>
      <ul>
        {facturas.map((factura) => (
          <li key={factura._id}>
            Factura {factura.numero} - Cliente: {factura.clienteId.nombre} - Total: {factura.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
