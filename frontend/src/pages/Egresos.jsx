import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiSave, FiX, FiPlus, FiDollarSign, FiCalendar, FiFileText } from 'react-icons/fi';

export default function Egresos() {
  const [egresos, setEgresos] = useState([]);
  const [formData, setFormData] = useState({ 
    monto: '', 
    descripcion: '', 
    fecha: new Date().toISOString().split('T')[0] // Fecha actual por defecto
  });
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función centralizada para manejar las solicitudes HTTP
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

  // Cargar egresos
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const egresosData = await apiRequest('get', 'http://localhost:3000/api/egresos');
      if (egresosData) setEgresos(egresosData);
      setError('');
    } catch (error) {
      setError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manejo del formulario para agregar o editar egresos
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.monto || !formData.descripcion || !formData.fecha) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (isNaN(formData.monto)) {
      setError('El monto debe ser un número válido');
      return;
    }

    setIsLoading(true);
    try {
      let data;
      if (editData) {
        data = await apiRequest('put', `http://localhost:3000/api/egresos/${editData._id}`, formData);
        setSuccess('Egreso actualizado correctamente');
      } else {
        data = await apiRequest('post', 'http://localhost:3000/api/egresos', formData);
        setSuccess('Egreso agregado correctamente');
      }

      if (data) {
        setFormData({ 
          monto: '', 
          descripcion: '', 
          fecha: new Date().toISOString().split('T')[0]
        });
        setEditData(null);
        setTimeout(() => setSuccess(''), 3000);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar egreso
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este egreso?')) return;

    setIsLoading(true);
    try {
      const data = await apiRequest('delete', `http://localhost:3000/api/egresos/${id}`);
      if (data) {
        setSuccess('Egreso eliminado correctamente');
        setTimeout(() => setSuccess(''), 3000);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar edición de un egreso
  const startEdit = (egreso) => {
    setEditData(egreso);
    setFormData({ 
      monto: egreso.monto, 
      descripcion: egreso.descripcion, 
      fecha: egreso.fecha.split('T')[0]
    });
    setError('');
  };

  // Manejo del cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Formatear fecha para mostrar
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  // Formatear monto como moneda
  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  return (
    <div className="egresos-container">
      <h2 className="egresos-title">
        <FiDollarSign className="icon-title" /> Gestión de Egresos
      </h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="egresos-form">
        <div className="form-group">
          <label><FiDollarSign className="icon" /> Monto:</label>
          <input
            type="number"
            name="monto"
            min="0.01"
            step="0.01"
            value={formData.monto}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiFileText className="icon" /> Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del egreso"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FiCalendar className="icon" /> Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading}
        >
          {editData ? (
            <><FiSave className="icon" /> {isLoading ? 'Actualizando...' : 'Actualizar'}</>
          ) : (
            <><FiPlus className="icon" /> {isLoading ? 'Agregando...' : 'Agregar'}</>
          )}
        </button>
        
        {editData && (
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => {
              setEditData(null);
              setFormData({ 
                monto: '', 
                descripcion: '', 
                fecha: new Date().toISOString().split('T')[0]
              });
            }}
            disabled={isLoading}
          >
            <FiX className="icon" /> Cancelar
          </button>
        )}
      </form>

      <div className="egresos-list">
        {isLoading && egresos.length === 0 ? (
          <div className="loading">Cargando egresos...</div>
        ) : egresos.length === 0 ? (
          <p className="empty-message">No hay egresos registrados</p>
        ) : (
          <ul>
            {egresos.map(e => (
              <li key={e._id} className="egreso-item">
                {editData && editData._id === e._id ? (
                  <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                      <input
                        type="number"
                        name="monto"
                        min="0.01"
                        step="0.01"
                        value={formData.monto}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="text"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
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
                        onClick={() => {
                          setEditData(null);
                          setFormData({ 
                            monto: '', 
                            descripcion: '', 
                            fecha: new Date().toISOString().split('T')[0]
                          });
                        }}
                        disabled={isLoading}
                      >
                        <FiX className="icon" /> Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="egreso-info">
                      <h3>{formatMonto(e.monto)}</h3>
                      <p className="egreso-descripcion">{e.descripcion}</p>
                      <div className="egreso-detalles">
                        <span className="egreso-fecha">{formatFecha(e.fecha)}</span>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn btn-edit"
                        onClick={() => startEdit(e)}
                        disabled={isLoading}
                      >
                        <FiEdit className="icon" /> Editar
                      </button>
                      <button 
                        className="btn btn-delete"
                        onClick={() => handleDelete(e._id)}
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
