import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Función para hacer peticiones a la API
  const apiRequest = async (method, url, data = null) => {
    try {
      const response = await axios({ method, url, data });
      return response.data;
    } catch (error) {
      setError('Ocurrió un error. Por favor intente más tarde.');
      console.error(error);
    }
  };

  // Función para cargar los clientes
  const fetchClientes = async () => {
    const data = await apiRequest('get', 'http://localhost:3000/api/clientes');
    if (data) setClientes(data);
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Crear cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !email) {
      setError('Por favor complete todos los campos');
      return;
    }

    const cliente = { nombre, email };
    const data = await apiRequest('post', 'http://localhost:3000/api/clientes', cliente);
    if (data) {
      setNombre('');
      setEmail('');
      fetchClientes();
    }
  };

  // Eliminar cliente
  const handleDelete = async (id) => {
    const data = await apiRequest('delete', `http://localhost:3000/api/clientes/${id}`);
    if (data) fetchClientes();
  };

  // Iniciar edición de cliente
  const startEdit = (cliente) => {
    setEditandoId(cliente._id);
    setEditNombre(cliente.nombre);
    setEditEmail(cliente.email);
  };

  // Actualizar cliente
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editNombre || !editEmail) {
      setError('Por favor complete todos los campos');
      return;
    }

    const updatedCliente = { nombre: editNombre, email: editEmail };
    const data = await apiRequest('put', `http://localhost:3000/api/clientes/${editandoId}`, updatedCliente);
    if (data) {
      setEditandoId(null);
      setEditNombre('');
      setEditEmail('');
      fetchClientes();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Clientes</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Mostrar errores */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="mr-2"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre"
        />
        <input
          className="mr-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Agregar</button>
      </form>
      <ul>
        {clientes.map(c => (
          <li key={c._id} className="mb-2">
            {editandoId === c._id ? (
              <form onSubmit={handleUpdate} className="inline">
                <input
                  className="mr-1"
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                />
                <input
                  className="mr-1"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                />
                <button type="submit" className="mr-1 bg-green-500 text-white px-4 py-2">Guardar</button>
                <button type="button" onClick={() => setEditandoId(null)} className="bg-gray-500 text-white px-4 py-2">Cancelar</button>
              </form>
            ) : (
              <>
                {c.nombre} - {c.email}
                <button className="ml-2 bg-yellow-500 text-white px-4 py-2" onClick={() => startEdit(c)}>Editar</button>
                <button className="ml-2 bg-red-500 text-white px-4 py-2" onClick={() => handleDelete(c._id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
