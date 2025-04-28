import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiEdit, FiKey, FiMail, FiSave, FiTrash2, FiUser, FiUserPlus, FiX } from 'react-icons/fi';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    email: '',
    direccion: '',
    telefono: '', // Agregué un campo teléfono
  });
  const [editandoCliente, setEditandoCliente] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/clientes');
      setClientes(res.data);
      setError('');
    } catch (error) {
      setError('Error al cargar los clientes');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleNuevoClienteChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente({ ...nuevoCliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoCliente.nombre || !nuevoCliente.email || !nuevoCliente.direccion || !nuevoCliente.telefono) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(nuevoCliente.email)) {
      setError('Por favor ingrese un email válido');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/api/clientes', nuevoCliente);
      setNuevoCliente({ nombre: '', email: '', direccion: '', telefono: '' });
      setError('');
      setSuccess('Cliente agregado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchClientes();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al agregar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este cliente?')) return;

    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/clientes/${id}`);
      setSuccess('Cliente eliminado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchClientes();
    } catch (error) {
      setError('Error al eliminar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (cliente) => {
    setEditandoCliente({ ...cliente });
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { nombre, email, direccion, telefono } = editandoCliente;
    
    if (!nombre || !email || !direccion || !telefono) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Por favor ingrese un email válido');
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/clientes/${editandoCliente._id}`, { nombre, email, direccion, telefono });
      setEditandoCliente(null);
      setSuccess('Cliente actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchClientes();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clientes-container">
      <h2 className="clientes-title">
        <FiUser className="icon-title" /> Gestión de Clientes
      </h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="clientes-form">
        <div className="form-group">
          <label><FiUser className="icon" /> Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={nuevoCliente.nombre}
            onChange={handleNuevoClienteChange}
            placeholder="Nombre completo"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiMail className="icon" /> Email:</label>
          <input
            type="email"
            name="email"
            value={nuevoCliente.email}
            onChange={handleNuevoClienteChange}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="form-group">
          <label><FiUser className="icon" /> Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={nuevoCliente.direccion}
            onChange={handleNuevoClienteChange}
            placeholder="Dirección completa"
            required
          />
        </div>

        <div className="form-group">
          <label><FiKey className="icon" /> Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={nuevoCliente.telefono}
            onChange={handleNuevoClienteChange}
            placeholder="Teléfono de contacto"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <FiUserPlus className="icon" /> {isLoading ? 'Procesando...' : 'Agregar Cliente'}
        </button>
      </form>

      <div className="clientes-list">
        {isLoading && clientes.length === 0 ? (
          <div className="loading">Cargando clientes...</div>
        ) : clientes.length === 0 ? (
          <p className="empty-message">No hay clientes registrados</p>
        ) : (
          <ul>
            {clientes.map(c => (
              <li key={c._id} className="cliente-item">
                {editandoCliente && editandoCliente._id === c._id ? (
                  <form onSubmit={handleUpdate} className="edit-form">
                    <div className="form-group">
                      <input
                        type="text"
                        name="nombre"
                        value={editandoCliente.nombre}
                        onChange={e => setEditandoCliente({ ...editandoCliente, nombre: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        value={editandoCliente.email}
                        onChange={e => setEditandoCliente({ ...editandoCliente, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        name="direccion"
                        value={editandoCliente.direccion}
                        onChange={e => setEditandoCliente({ ...editandoCliente, direccion: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        name="telefono"
                        value={editandoCliente.telefono}
                        onChange={e => setEditandoCliente({ ...editandoCliente, telefono: e.target.value })}
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
                        onClick={() => setEditandoCliente(null)}
                        disabled={isLoading}
                      >
                        <FiX className="icon" /> Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="cliente-info">
                      <h3>{c.nombre}</h3>
                      <p className="cliente-email">{c.email}</p>
                      <p className="cliente-direccion">{c.direccion}</p>
                      <p className="cliente-telefono">{c.telefono}</p>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn btn-edit"
                        onClick={() => startEdit(c)}
                        disabled={isLoading}
                      >
                        <FiEdit className="icon" /> Editar
                      </button>
                      <button 
                        className="btn btn-delete"
                        onClick={() => handleDelete(c._id)}
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
