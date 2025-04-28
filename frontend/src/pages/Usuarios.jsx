import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiSave, FiX, FiUserPlus, FiMail, FiUser, FiKey } from 'react-icons/fi';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'usuario' // Valor por defecto
  });
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Roles disponibles
  const rolesDisponibles = ['administrador', 'editor', 'usuario'];

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/usuarios');
      setUsuarios(res.data);
      setError('');
    } catch (error) {
      setError('Error al cargar los usuarios');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleNuevoUsuarioChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.rol) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(nuevoUsuario.email)) {
      setError('Por favor ingrese un email válido');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/api/usuarios', nuevoUsuario);
      setNuevoUsuario({ nombre: '', email: '', rol: 'usuario' });
      setError('');
      setSuccess('Usuario agregado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchUsuarios();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al agregar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este usuario?')) return;

    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`);
      setSuccess('Usuario eliminado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchUsuarios();
    } catch (error) {
      setError('Error al eliminar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (usuario) => {
    setEditandoUsuario({ ...usuario });
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { nombre, email, rol } = editandoUsuario;
    
    if (!nombre || !email || !rol) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Por favor ingrese un email válido');
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/usuarios/${editandoUsuario._id}`, { nombre, email, rol });
      setEditandoUsuario(null);
      setSuccess('Usuario actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchUsuarios();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="usuarios-container">
      <h2 className="usuarios-title">
        <FiUser className="icon-title" /> Gestión de Usuarios
      </h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="usuarios-form">
        <div className="form-group">
          <label><FiUser className="icon" /> Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={nuevoUsuario.nombre}
            onChange={handleNuevoUsuarioChange}
            placeholder="Nombre completo"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiMail className="icon" /> Email:</label>
          <input
            type="email"
            name="email"
            value={nuevoUsuario.email}
            onChange={handleNuevoUsuarioChange}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiKey className="icon" /> Rol:</label>
          <select
            name="rol"
            value={nuevoUsuario.rol}
            onChange={handleNuevoUsuarioChange}
            required
          >
            {rolesDisponibles.map(rol => (
              <option key={rol} value={rol}>
                {rol.charAt(0).toUpperCase() + rol.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <FiUserPlus className="icon" /> {isLoading ? 'Procesando...' : 'Agregar Usuario'}
        </button>
      </form>

      <div className="usuarios-list">
        {isLoading && usuarios.length === 0 ? (
          <div className="loading">Cargando usuarios...</div>
        ) : usuarios.length === 0 ? (
          <p className="empty-message">No hay usuarios registrados</p>
        ) : (
          <ul>
            {usuarios.map(u => (
              <li key={u._id} className="usuario-item">
                {editandoUsuario && editandoUsuario._id === u._id ? (
                  <form onSubmit={handleUpdate} className="edit-form">
                    <div className="form-group">
                      <input
                        type="text"
                        name="nombre"
                        value={editandoUsuario.nombre}
                        onChange={e => setEditandoUsuario({ ...editandoUsuario, nombre: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        value={editandoUsuario.email}
                        onChange={e => setEditandoUsuario({ ...editandoUsuario, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <select
                        name="rol"
                        value={editandoUsuario.rol}
                        onChange={e => setEditandoUsuario({ ...editandoUsuario, rol: e.target.value })}
                        required
                      >
                        {rolesDisponibles.map(rol => (
                          <option key={rol} value={rol}>
                            {rol.charAt(0).toUpperCase() + rol.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="action-buttons">
                      <button type="submit" className="btn btn-success" disabled={isLoading}>
                        <FiSave className="icon" /> {isLoading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-cancel"
                        onClick={() => setEditandoUsuario(null)}
                        disabled={isLoading}
                      >
                        <FiX className="icon" /> Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="usuario-info">
                      <h3>{u.nombre}</h3>
                      <p className="usuario-email">{u.email}</p>
                      <span className={`usuario-rol ${u.rol}`}>
                        {u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}
                      </span>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn btn-edit"
                        onClick={() => startEdit(u)}
                        disabled={isLoading}
                      >
                        <FiEdit className="icon" /> Editar
                      </button>
                      <button 
                        className="btn btn-delete"
                        onClick={() => handleDelete(u._id)}
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