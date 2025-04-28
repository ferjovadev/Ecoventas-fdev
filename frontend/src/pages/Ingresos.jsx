import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiSave, FiX, FiPlus, FiDollarSign, FiCalendar, FiFileText } from 'react-icons/fi';

export default function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [nuevoIngreso, setNuevoIngreso] = useState({
    monto: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    fuente: 'venta'
  });
  const [editandoIngreso, setEditandoIngreso] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fuentesIngreso = ['venta', 'servicio', 'inversión', 'otro'];

  const apiRequest = async (method, url, data = null) => {
    try {
      const response = await axios({ method, url, data });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Ocurrió un error. Por favor intente más tarde.');
      console.error(error);
      return null;
    }
  };

  const fetchIngresos = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('get', 'http://localhost:3000/api/ingresos');
      if (data) setIngresos(data);
      setError('');
    } catch (error) {
      setError('Error al cargar los ingresos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  const handleNuevoIngresoChange = (e) => {
    const { name, value } = e.target;
    setNuevoIngreso({ ...nuevoIngreso, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { monto, descripcion, fecha, fuente } = nuevoIngreso;

    if (!monto || !descripcion || !fecha || !fuente) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (isNaN(monto)) {
      setError('El monto debe ser un número válido');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest('post', 'http://localhost:3000/api/ingresos', nuevoIngreso);
      if (data) {
        setNuevoIngreso({ 
          monto: '', 
          descripcion: '', 
          fecha: new Date().toISOString().split('T')[0],
          fuente: 'venta'
        });
        setError('');
        setSuccess('Ingreso agregado correctamente');
        setTimeout(() => setSuccess(''), 3000);
        fetchIngresos();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este ingreso?')) return;

    setIsLoading(true);
    try {
      const data = await apiRequest('delete', `http://localhost:3000/api/ingresos/${id}`);
      if (data) {
        setSuccess('Ingreso eliminado correctamente');
        setTimeout(() => setSuccess(''), 3000);
        fetchIngresos();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (ingreso) => {
    setEditandoIngreso({ ...ingreso });
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { monto, descripcion, fecha, fuente } = editandoIngreso;

    if (!monto || !descripcion || !fecha || !fuente) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (isNaN(monto)) {
      setError('El monto debe ser un número válido');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest('put', `http://localhost:3000/api/ingresos/${editandoIngreso._id}`, 
        { monto, descripcion, fecha, fuente });
      if (data) {
        setEditandoIngreso(null);
        setSuccess('Ingreso actualizado correctamente');
        setTimeout(() => setSuccess(''), 3000);
        fetchIngresos();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const formatMonto = (monto) => {
    if (isNaN(monto)) return '$0.00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  const formatFuente = (fuente) => {
    return typeof fuente === 'string'
      ? fuente.charAt(0).toUpperCase() + fuente.slice(1)
      : 'Desconocida';
  };

  return (
    <div className="ingresos-container">
      <h2 className="ingresos-title">
        <FiDollarSign className="icon-title" /> Gestión de Ingresos
      </h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="ingresos-form">
        <div className="form-group">
          <label><FiDollarSign className="icon" /> Monto:</label>
          <input
            type="number"
            name="monto"
            min="0.01"
            step="0.01"
            value={nuevoIngreso.monto}
            onChange={handleNuevoIngresoChange}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiFileText className="icon" /> Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={nuevoIngreso.descripcion}
            onChange={handleNuevoIngresoChange}
            placeholder="Descripción del ingreso"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiCalendar className="icon" /> Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={nuevoIngreso.fecha}
            onChange={handleNuevoIngresoChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiFileText className="icon" /> Fuente:</label>
          <select
            name="fuente"
            value={nuevoIngreso.fuente}
            onChange={handleNuevoIngresoChange}
            required
          >
            {fuentesIngreso.map(fuente => (
              <option key={fuente} value={fuente}>
                {formatFuente(fuente)}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading}
        >
          <FiPlus className="icon" /> {isLoading ? 'Agregando...' : 'Agregar'}
        </button>
      </form>

      <div className="ingresos-list">
        {isLoading && ingresos.length === 0 ? (
          <div className="loading">Cargando ingresos...</div>
        ) : ingresos.length === 0 ? (
          <p className="empty-message">No hay ingresos registrados</p>
        ) : (
          <ul>
            {ingresos.map(i => (
              <li key={i._id} className="ingreso-item">
                {editandoIngreso && editandoIngreso._id === i._id ? (
                  <form onSubmit={handleUpdate} className="edit-form">
                    <div className="form-group">
                      <input
                        type="number"
                        name="monto"
                        min="0.01"
                        step="0.01"
                        value={editandoIngreso.monto}
                        onChange={e => setEditandoIngreso({ ...editandoIngreso, monto: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="text"
                        name="descripcion"
                        value={editandoIngreso.descripcion}
                        onChange={e => setEditandoIngreso({ ...editandoIngreso, descripcion: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="date"
                        name="fecha"
                        value={editandoIngreso.fecha?.split('T')[0]}
                        onChange={e => setEditandoIngreso({ ...editandoIngreso, fecha: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <select
                        name="fuente"
                        value={editandoIngreso.fuente}
                        onChange={e => setEditandoIngreso({ ...editandoIngreso, fuente: e.target.value })}
                        required
                      >
                        {fuentesIngreso.map(fuente => (
                          <option key={fuente} value={fuente}>
                            {formatFuente(fuente)}
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
                        onClick={() => setEditandoIngreso(null)}
                        disabled={isLoading}
                      >
                        <FiX className="icon" /> Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="ingreso-info">
                      <h3>{formatMonto(i.monto)}</h3>
                      <p className="ingreso-descripcion">{i.descripcion}</p>
                      <div className="ingreso-detalles">
                        <span className="ingreso-fecha">{formatFecha(i.fecha)}</span>
                        <span className={`ingreso-fuente ${i.fuente || 'desconocida'}`}>
                          {formatFuente(i.fuente)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn btn-edit"
                        onClick={() => startEdit(i)}
                        disabled={isLoading}
                      >
                        <FiEdit className="icon" /> Editar
                      </button>
                      <button 
                        className="btn btn-delete"
                        onClick={() => handleDelete(i._id)}
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