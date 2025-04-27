import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CategoriasEgreso() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  // Función centralizada para manejar las solicitudes HTTP
  const apiRequest = async (method, url, data = null) => {
    try {
      const response = await axios({ method, url, data });
      return response.data;
    } catch (error) {
      setError('Ocurrió un error. Por favor intente más tarde.');
      console.error(error);
    }
  };

  // Función para cargar las categorías de egreso
  const fetchCategoriasEgreso = async () => {
    const data = await apiRequest('get', 'http://localhost:3000/api/categoriasEgreso');
    if (data) setCategorias(data);
  };

  useEffect(() => {
    fetchCategoriasEgreso();
  }, []);

  // Crear nueva categoría de egreso
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      setError('Por favor complete todos los campos');
      return;
    }

    const categoriaEgreso = { nombre, descripcion };
    const data = await apiRequest('post', 'http://localhost:3000/api/categoriasEgreso', categoriaEgreso);
    if (data) {
      setNombre('');
      setDescripcion('');
      fetchCategoriasEgreso();
    }
  };

  // Eliminar categoría de egreso
  const handleDelete = async (id) => {
    const data = await apiRequest('delete', `http://localhost:3000/api/categoriasEgreso/${id}`);
    if (data) fetchCategoriasEgreso();
  };

  // Iniciar edición de categoría de egreso
  const startEdit = (categoria) => {
    setEditandoId(categoria._id);
    setEditNombre(categoria.nombre);
    setEditDescripcion(categoria.descripcion);
  };

  // Actualizar categoría de egreso
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editNombre || !editDescripcion) {
      setError('Por favor complete todos los campos');
      return;
    }

    const updatedCategoriaEgreso = { nombre: editNombre, descripcion: editDescripcion };
    const data = await apiRequest('put', `http://localhost:3000/api/categoriasEgreso/${editandoId}`, updatedCategoriaEgreso);
    if (data) {
      setEditandoId(null);
      setEditNombre('');
      setEditDescripcion('');
      fetchCategoriasEgreso();
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Categorías de Egreso</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Mostrar errores */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-1/4"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre"
        />
        <input
          className="border p-2 rounded w-1/4"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción"
        />
        <button className="bg-blue-500 text-white px-4 rounded" type="submit">Agregar</button>
      </form>
      <ul>
        {categorias.map(c => (
          <li key={c._id} className="mb-2 p-2 border rounded flex justify-between items-center">
            {editandoId === c._id ? (
              <form onSubmit={handleUpdate} className="flex gap-2 w-full">
                <input
                  className="border p-1 rounded w-1/4"
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                />
                <input
                  className="border p-1 rounded w-1/4"
                  value={editDescripcion}
                  onChange={e => setEditDescripcion(e.target.value)}
                />
                <button className="bg-green-500 text-white px-3 rounded" type="submit">Guardar</button>
                <button className="bg-gray-400 text-white px-3 rounded" type="button" onClick={() => setEditandoId(null)}>Cancelar</button>
              </form>
            ) : (
              <>
                <span>{c.nombre} - {c.descripcion}</span>
                <div>
                  <button className="bg-yellow-400 text-white px-3 rounded mr-2" onClick={() => startEdit(c)}>Editar</button>
                  <button className="bg-red-500 text-white px-3 rounded" onClick={() => handleDelete(c._id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
