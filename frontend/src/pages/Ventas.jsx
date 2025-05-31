import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: '',
    productos: [{ producto: '', cantidad: 1 }],
    total: 0,
  });
  const [clienteManual, setClienteManual] = useState({
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
  });
  const [editandoVentaId, setEditandoVentaId] = useState(null);
  const [ventanaVentaAbierta, setVentanaVentaAbierta] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventasRes, clientesRes, productosRes] = await Promise.all([
          axios.get('http://localhost:3000/api/ventas'),
          axios.get('http://localhost:3000/api/clientes'),
          axios.get('http://localhost:3000/api/productos'),
        ]);
        setVentas(ventasRes.data);
        setClientes(clientesRes.data);
        setProductos(productosRes.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos');
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  const toggleVentanaVenta = () => {
    setVentanaVentaAbierta(!ventanaVentaAbierta);
    if (!ventanaVentaAbierta) {
      setNuevaVenta({ cliente: '', productos: [{ producto: '', cantidad: 1 }], total: 0 });
      setClienteManual({ nombre: '', direccion: '', email: '', telefono: '' });
      setEditandoVentaId(null);
    }
  };

  const agregarProducto = () => {
    setNuevaVenta((prev) => ({
      ...prev,
      productos: [...prev.productos, { producto: '', cantidad: 1 }],
    }));
  };

  const handleProductoChange = (index, field, value) => {
    const productosActualizados = [...nuevaVenta.productos];
    productosActualizados[index][field] = value;
    setNuevaVenta({ ...nuevaVenta, productos: productosActualizados });
  };

  const calcularTotal = () => {
    const total = nuevaVenta.productos.reduce((acc, item) => {
      const prod = productos.find((p) => p._id === item.producto);
      return acc + (prod ? prod.precio * item.cantidad : 0);
    }, 0);
    setNuevaVenta((prev) => ({ ...prev, total }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let clienteId = nuevaVenta.cliente;

    if (!clienteId) {
      // Crear cliente manual si no existe
      const resCliente = await axios.post('http://localhost:3000/api/clientes', clienteManual);
      clienteId = resCliente.data._id;
      setClientes((prev) => [...prev, resCliente.data]);
    }

    const ventaData = {
      cliente_id: clienteId,
      productos: nuevaVenta.productos,
      total: nuevaVenta.total,
    };

    // Verificar stock antes de proceder con la venta
    for (const item of nuevaVenta.productos) {
      const producto = productos.find((p) => p._id === item.producto);
      if (producto && producto.stock < item.cantidad) {
        throw new Error(`No hay suficiente stock para el producto: ${producto.nombre}`);
      }
    }

    let ventaRes;
    if (editandoVentaId) {
      // Editar Venta
      ventaRes = await axios.put(`http://localhost:3000/api/ventas/${editandoVentaId}`, ventaData);
      alert('Venta actualizada correctamente');
    } else {
      // Nueva Venta
      ventaRes = await axios.post('http://localhost:3000/api/ventas', ventaData);
      alert('Venta registrada correctamente');
    }

    // Actualizar el stock de los productos después de la venta
    for (const item of nuevaVenta.productos) {
      const producto = productos.find((p) => p._id === item.producto);
      if (producto) {
        const nuevoStock = producto.stock - item.cantidad;
        await axios.put(`http://localhost:3000/api/productos/${producto._id}`, {
          stock: nuevoStock,
        });
      }
    }

    // Crear ingreso asociado a la venta
    await axios.post('http://localhost:3000/api/ingresos', {
      fecha: new Date(),
      monto: nuevaVenta.total,
      tipo: 'venta',
      descripcion: `Ingreso por venta ${ventaRes.data._id}`,
      venta_id: ventaRes.data._id,
      usuario_id: null, // Pon aquí el usuario si lo tienes disponible
    });

    toggleVentanaVenta();
    cargarVentas();
  } catch (err) {
    console.error(err);
    setError('Error al procesar la venta');
  }
};

  const cargarVentas = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/ventas');
      setVentas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminarVenta = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta venta?')) {
      try {
        await axios.delete(`http://localhost:3000/api/ventas/${id}`);
        alert('Venta eliminada correctamente');
        cargarVentas();
      } catch (err) {
        console.error(err);
        alert('Error al eliminar la venta');
      }
    }
  };

  const handleEditarVenta = (venta) => {
    setNuevaVenta({
      cliente: venta.cliente?._id || '',
      productos: venta.productos.map((p) => ({
        producto: p.producto._id,
        cantidad: p.cantidad,
      })),
      total: venta.total,
    });
    setEditandoVentaId(venta._id);
    setVentanaVentaAbierta(true);
  };

  if (cargando) return <div>Cargando...</div>;

  return (
    <div className="main-content">
      <h2 className="text-xl font-bold mb-4">Ventas</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Modal para registrar o editar venta */}
      {ventanaVentaAbierta && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={toggleVentanaVenta}>X</button>
            <h3 className="mt-4">{editandoVentaId ? 'Editar Venta' : 'Registrar Venta'}</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <h4 className="font-semibold">Datos del Cliente</h4>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={clienteManual.nombre}
                  onChange={(e) => setClienteManual({ ...clienteManual, nombre: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={clienteManual.direccion}
                  onChange={(e) => setClienteManual({ ...clienteManual, direccion: e.target.value })}
                  className="input-field"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={clienteManual.email}
                  onChange={(e) => setClienteManual({ ...clienteManual, email: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={clienteManual.telefono}
                  onChange={(e) => setClienteManual({ ...clienteManual, telefono: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="mb-4">
                <h4 className="font-semibold">Productos</h4>
                {nuevaVenta.productos.map((prod, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <select
                      value={prod.producto}
                      onChange={(e) => handleProductoChange(index, 'producto', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Selecciona un producto</option>
                      {productos.filter(p => p.stock > 0).map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.nombre} - S/. {p.precio} (Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={prod.cantidad}
                      min="1"
                      onChange={(e) => handleProductoChange(index, 'cantidad', e.target.value)}
                      onBlur={calcularTotal}
                      className="input-field w-20 ml-2"
                    />
                  </div>
                ))}
                <button type="button" onClick={agregarProducto} className="btn-small">Agregar Producto</button>
              </div>

              <div className="mb-4">
                <strong>Total: S/. {nuevaVenta.total.toFixed(2)}</strong>
              </div>

              <button type="submit" className="btn-primary">
                {editandoVentaId ? 'Actualizar Venta' : 'Registrar Venta'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Botón para nueva venta */}
      <button onClick={toggleVentanaVenta} className="btn-primary mb-4">
        Nueva Venta
      </button>

      {/* Lista de Ventas */}
      <div className="ventas-list">
        {ventas.map((venta) => {
          const cliente = clientes.find(c => c._id === venta.cliente_id);
          return (
            <div key={venta._id} className="venta-item">
              <p><strong>Cliente:</strong> {cliente ? cliente.nombre : 'Cliente no encontrado'}</p>
              <p><strong>Total:</strong> S/. {venta.total.toFixed(2)}</p>
              <div className="flex mt-2">
                <button className="btn-small" onClick={() => handleEditarVenta(venta)}>Editar</button>
                <button className="btn-small ml-2" onClick={() => handleEliminarVenta(venta._id)}>Eliminar</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}