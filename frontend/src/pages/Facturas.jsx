import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiSave, FiFileText, FiUser, FiShoppingCart, FiDollarSign } from 'react-icons/fi';

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturaData, setFacturaData] = useState({
    clienteId: '',
    productos: [{ productoId: '', cantidad: 1, precio: 0 }],
    total: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar datos iniciales
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [facturasRes, clientesRes, productosRes] = await Promise.all([
        axios.get('http://localhost:3000/api/facturas'),
        axios.get('http://localhost:3000/api/clientes'),
        axios.get('http://localhost:3000/api/productos')
      ]);
      
      setFacturas(facturasRes.data);
      setClientes(clientesRes.data);
      setProductos(productosRes.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manejar cambios en los productos de la factura
  const handleProductosChange = (index, field, value) => {
    const newProductos = [...facturaData.productos];
    newProductos[index][field] = value;

    // Si cambia el producto, actualizar el precio
    if (field === 'productoId' && value) {
      const productoSeleccionado = productos.find(p => p._id === value);
      if (productoSeleccionado) {
        newProductos[index].precio = productoSeleccionado.precio;
      }
    }

    // Recalcular el total
    const newTotal = newProductos.reduce((sum, producto) => {
      return sum + (producto.precio * producto.cantidad);
    }, 0);

    setFacturaData({
      ...facturaData,
      productos: newProductos,
      total: newTotal,
    });
  };

  // Agregar nuevo producto a la factura
  const addProducto = () => {
    setFacturaData({
      ...facturaData,
      productos: [...facturaData.productos, { productoId: '', cantidad: 1, precio: 0 }],
    });
  };

  // Eliminar producto de la factura
  const removeProducto = (index) => {
    const newProductos = [...facturaData.productos];
    newProductos.splice(index, 1);
    
    const newTotal = newProductos.reduce((sum, producto) => {
      return sum + (producto.precio * producto.cantidad);
    }, 0);

    setFacturaData({
      ...facturaData,
      productos: newProductos,
      total: newTotal,
    });
  };

  // Crear nueva factura
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!facturaData.clienteId || facturaData.productos.some(p => !p.productoId)) {
      setError('Por favor complete todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/api/facturas', {
        clienteId: facturaData.clienteId,
        productos: facturaData.productos.map(p => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
          precio: p.precio
        }))
      });
      
      setSuccess('Factura creada correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la factura');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reiniciar formulario
  const resetForm = () => {
    setFacturaData({
      clienteId: '',
      productos: [{ productoId: '', cantidad: 1, precio: 0 }],
      total: 0,
    });
  };

  // Formatear monto como moneda
  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
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
          <label><FiUser className="icon" /> Cliente:</label>
          <select
            value={facturaData.clienteId}
            onChange={(e) => setFacturaData({ ...facturaData, clienteId: e.target.value })}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map(cliente => (
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
                onChange={(e) => handleProductosChange(index, 'productoId', e.target.value)}
                required
              >
                <option value="">Seleccione un producto</option>
                {productos.map(prod => (
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
                onChange={(e) => handleProductosChange(index, 'cantidad', parseInt(e.target.value))}
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
                onChange={(e) => handleProductosChange(index, 'precio', parseFloat(e.target.value))}
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
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          <FiSave className="icon" /> {isLoading ? 'Procesando...' : 'Crear Factura'}
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
                  <span className="factura-numero">Factura #{factura.numero}</span>
                  <span className="factura-fecha">
                    {new Date(factura.fecha).toLocaleDateString('es-ES')}
                  </span>
                </div>
                
                <div className="factura-cliente">
                  <strong>Cliente:</strong> {factura.clienteId?.nombre || 'Cliente eliminado'}
                </div>
                
                <div className="factura-productos">
                  <strong>Productos:</strong>
                  <ul>
                    {factura.productos.map((item, idx) => (
                      <li key={idx}>
                        {item.productoId?.nombre || 'Producto eliminado'} - 
                        {item.cantidad} x {formatMonto(item.precio)} = {formatMonto(item.precio * item.cantidad)}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="factura-total">
                  <strong>Total:</strong> {formatMonto(factura.total)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
     
    </div>
  );
}