import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiDollarSign, FiEdit, FiPackage, FiPlus, FiSave, FiTrash2, FiX } from 'react-icons/fi';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    descripcion: ''
  });
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/productos');
      setProductos(res.data);
      setError('');
    } catch (error) {
      setError('Error al cargar los productos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleNuevoProductoChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (isNaN(nuevoProducto.precio) || nuevoProducto.precio <= 0) {
      setError('El precio debe ser un número positivo');
      return;
    }

    if (isNaN(nuevoProducto.stock) || nuevoProducto.stock < 0) {
      setError('El stock debe ser un número positivo');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/api/productos', nuevoProducto);
      setNuevoProducto({ nombre: '', precio: '', stock: '' });
      setError('');
      setSuccess('Producto agregado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchProductos();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al agregar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este producto?')) return;

    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/productos/${id}`);
      setSuccess('Producto eliminado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchProductos();
    } catch (error) {
      setError('Error al eliminar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (producto) => {
    setEditandoProducto({ ...producto });
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { nombre, descripcion, precio, stock } = editandoProducto;
    
    if (!nombre || !precio || !stock) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (isNaN(precio) || precio <= 0) {
      setError('El precio debe ser un número positivo');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError('El stock debe ser un número positivo');
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/productos/${editandoProducto._id}`, { nombre, descripcion, precio, stock });
      setEditandoProducto(null);
      setSuccess('Producto actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchProductos();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="productos-container">
      <h2 className="productos-title">
        <FiPackage className="icon-title" /> Gestión de Productos
      </h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="productos-form">
        <div className="form-group">
          <label><FiPackage className="icon" /> Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={nuevoProducto.nombre}
            onChange={handleNuevoProductoChange}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="form-group">
          <label><FiPackage className="icon" /> Descripcion:</label>
          <input
            type="text"
            name="descripcion"
            value={nuevoProducto.descripcion}
            onChange={handleNuevoProductoChange}
            placeholder="Nombre del producto"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiDollarSign className="icon" /> Precio:</label>
          <input
            type="number"
            name="precio"
            min="0.01"
            step="0.01"
            value={nuevoProducto.precio}
            onChange={handleNuevoProductoChange}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiPackage className="icon" /> Stock:</label>
          <input
            type="number"
            name="stock"
            min="0"
            value={nuevoProducto.stock}
            onChange={handleNuevoProductoChange}
            placeholder="Cantidad en stock"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <FiPlus className="icon" /> {isLoading ? 'Procesando...' : 'Agregar Producto'}
        </button>
      </form>

      <div className="productos-list">
        {isLoading && productos.length === 0 ? (
          <div className="loading">Cargando productos...</div>
        ) : productos.length === 0 ? (
          <p className="empty-message">No hay productos registrados</p>
        ) : (
          <ul>
            {productos.map(p => (
              <li key={p._id} className="producto-item">
                {editandoProducto && editandoProducto._id === p._id ? (
                  <form onSubmit={handleUpdate} className="edit-form">
                    <div className="form-group">
                      <input
                        type="text"
                        name="nombre"
                        value={editandoProducto.nombre}
                        onChange={e => setEditandoProducto({ ...editandoProducto, nombre: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        name="descripcion"
                        value={editandoProducto.descripcion}
                        onChange={e => setEditandoProducto({ ...editandoProducto, descripcion: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="number"
                        name="precio"
                        min="0.01"
                        step="0.01"
                        value={editandoProducto.precio}
                        onChange={e => setEditandoProducto({ ...editandoProducto, precio: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        value={editandoProducto.stock}
                        onChange={e => setEditandoProducto({ ...editandoProducto, stock: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="action-buttons">
                      <button type="submit" className="btn btn-success" disabled={isLoading}>
                        <FiSave className="icon" /> {isLoading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-cancel"
                        onClick={() => setEditandoProducto(null)}
                        disabled={isLoading}
                      >
                        <FiX className="icon" /> Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="producto-info">
                      <h3>{p.nombre}</h3>
                      <div className="producto-detalles">
                        <span className="producto-precio">${parseFloat(p.precio).toFixed(2)}</span>
                        <span className={`producto-stock ${p.stock <= 5 ? 'bajo-stock' : ''}`}>
                          {p.stock} en stock
                        </span>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn btn-edit"
                        onClick={() => startEdit(p)}
                        disabled={isLoading}
                      >
                        <FiEdit className="icon" /> Editar
                      </button>
                      <button 
                        className="btn btn-delete"
                        onClick={() => handleDelete(p._id)}
                        disabled={isLoading}
                      >
                        <FiTrash2 className="icon" /> Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
        
      
    </div>
  );
}