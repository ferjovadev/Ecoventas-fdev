import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    rol: ''
  });
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [error, setError] = useState('');

  const fetchUsuarios = () => {
    axios.get('http://localhost:3000/api/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(() => setError('Error al cargar los usuarios.'));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleNuevoUsuarioChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.rol) {
      setError('Por favor complete todos los campos');
      return;
    }

    axios.post('http://localhost:3000/api/usuarios', nuevoUsuario)
      .then(() => {
        setNuevoUsuario({ nombre: '', email: '', rol: '' });
        fetchUsuarios();
        setError('');
      })
      .catch(() => setError('Error al agregar el usuario.'));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/api/usuarios/${id}`)
      .then(() => fetchUsuarios())
      .catch(() => setError('Error al eliminar el usuario.'));
  };

  const startEdit = (usuario) => {
    setEditandoUsuario(usuario);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const { nombre, email, rol } = editandoUsuario;
    if (!nombre || !email || !rol) {
      setError('Por favor complete todos los campos');
      return;
    }

    axios.put(`http://localhost:3000/api/usuarios/${editandoUsuario._id}`, { nombre, email, rol })
      .then(() => {
        setEditandoUsuario(null);
        fetchUsuarios();
        setError('');
      })
      .catch(() => setError('Error al actualizar el usuario.'));
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-1/4"
          name="nombre"
          value={nuevoUsuario.nombre}
          onChange={handleNuevoUsuarioChange}
          placeholder="Nombre"
        />
        <input
          className="border p-2 rounded w-1/4"
          name="email"
          value={nuevoUsuario.email}
          onChange={handleNuevoUsuarioChange}
          placeholder="Email"
        />
        <input
          className="border p-2 rounded w-1/4"
          name="rol"
          value={nuevoUsuario.rol}
          onChange={handleNuevoUsuarioChange}
          placeholder="Rol"
        />
        <button className="bg-blue-500 text-white px-4 rounded" type="submit">Agregar</button>
      </form>

      <ul>
        {usuarios.map(u => (
          <li key={u._id} className="mb-2 p-2 border rounded flex justify-between items-center">
            {editandoUsuario && editandoUsuario._id === u._id ? (
              <form onSubmit={handleUpdate} className="flex gap-2 w-full">
                <input
                  className="border p-1 rounded w-1/4"
                  name="nombre"
                  value={editandoUsuario.nombre}
                  onChange={e => setEditandoUsuario({ ...editandoUsuario, nombre: e.target.value })}
                />
                <input
                  className="border p-1 rounded w-1/4"
                  name="email"
                  value={editandoUsuario.email}
                  onChange={e => setEditandoUsuario({ ...editandoUsuario, email: e.target.value })}
                />
                <input
                  className="border p-1 rounded w-1/4"
                  name="rol"
                  value={editandoUsuario.rol}
                  onChange={e => setEditandoUsuario({ ...editandoUsuario, rol: e.target.value })}
                />
                <button className="bg-green-500 text-white px-3 rounded" type="submit">Guardar</button>
                <button className="bg-gray-400 text-white px-3 rounded" type="button" onClick={() => setEditandoUsuario(null)}>Cancelar</button>
              </form>
            ) : (
              <>
                <span>{u.nombre} - {u.email} - {u.rol}</span>
                <div>
                  <button className="bg-yellow-400 text-white px-3 rounded mr-2" onClick={() => startEdit(u)}>Editar</button>
                  <button className="bg-red-500 text-white px-3 rounded" onClick={() => handleDelete(u._id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
