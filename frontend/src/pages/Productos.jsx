import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: ''
  });
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [error, setError] = useState('');

  const fetchProductos = () => {
    axios.get('http://localhost:3000/api/productos')
      .then(res => setProductos(res.data))
      .catch(() => setError('Error al cargar los productos.'));
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleNuevoProductoChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      setError('Por favor complete todos los campos');
      return;
    }

    axios.post('http://localhost:3000/api/productos', nuevoProducto)
      .then(() => {
        setNuevoProducto({ nombre: '', precio: '' });
        fetchProductos();
        setError('');
      })
      .catch(() => {
        setError('Error al agregar el producto.');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/api/productos/${id}`)
      .then(() => fetchProductos())
      .catch(() => setError('Error al eliminar el producto.'));
  };

  const startEdit = (producto) => {
    setEditandoProducto(producto);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const { nombre, precio } = editandoProducto;
    if (!nombre || !precio) {
      setError('Por favor complete todos los campos');
      return;
    }

    axios.put(`http://localhost:3000/api/productos/${editandoProducto._id}`, { nombre, precio })
      .then(() => {
        setEditandoProducto(null);
        fetchProductos();
        setError('');
      })
      .catch(() => setError('Error al actualizar el producto.'));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Productos</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="mr-2"
          name="nombre"
          value={nuevoProducto.nombre}
          onChange={handleNuevoProductoChange}
          placeholder="Nombre"
        />
        <input
          className="mr-2"
          name="precio"
          value={nuevoProducto.precio}
          onChange={handleNuevoProductoChange}
          placeholder="Precio"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Agregar</button>
      </form>

      <ul>
        {productos.map(p => (
          <li key={p._id} className="mb-2">
            {editandoProducto && editandoProducto._id === p._id ? (
              <form onSubmit={handleUpdate} className="inline">
                <input
                  className="mr-1"
                  name="nombre"
                  value={editandoProducto.nombre}
                  onChange={e => setEditandoProducto({ ...editandoProducto, nombre: e.target.value })}
                />
                <input
                  className="mr-1"
                  name="precio"
                  value={editandoProducto.precio}
                  onChange={e => setEditandoProducto({ ...editandoProducto, precio: e.target.value })}
                />
                <button type="submit" className="mr-1 bg-green-500 text-white px-4 py-2">Guardar</button>
                <button type="button" onClick={() => setEditandoProducto(null)} className="bg-gray-500 text-white px-4 py-2">Cancelar</button>
              </form>
            ) : (
              <>
                {p.nombre} - ${p.precio}
                <button className="ml-2 bg-yellow-500 text-white px-4 py-2" onClick={() => startEdit(p)}>Editar</button>
                <button className="ml-2 bg-red-500 text-white px-4 py-2" onClick={() => handleDelete(p._id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
