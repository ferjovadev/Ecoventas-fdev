import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiSave, FiX, FiPlus } from 'react-icons/fi';

export default function CategoriasEgreso() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      return null;
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
      setError('');
      setSuccess('Categoría agregada correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchCategoriasEgreso();
    }
  };

  // Eliminar categoría de egreso
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta categoría?')) {
      const data = await apiRequest('delete', `http://localhost:3000/api/categoriasEgreso/${id}`);
      if (data) {
        setSuccess('Categoría eliminada correctamente');
        setTimeout(() => setSuccess(''), 3000);
        fetchCategoriasEgreso();
      }
    }
  };

  // Iniciar edición de categoría de egreso
  const startEdit = (categoria) => {
    setEditandoId(categoria._id);
    setEditNombre(categoria.nombre);
    setEditDescripcion(categoria.descripcion);
    setError('');
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
      setSuccess('Categoría actualizada correctamente');
      setTimeout(() => setSuccess(''), 3000);
      fetchCategoriasEgreso();
    }
  };

  return (
    <div className="categorias-container">
      <h2 className="categorias-title">Gestión de Categorías de Egreso</h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="categorias-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej: Alquiler"
          />
        </div>
        
        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Ej: Pago mensual de local"
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          <FiPlus className="icon" /> Agregar Categoría
        </button>
      </form>

      <div className="categorias-list">
        {categorias.length === 0 ? (
          <p className="empty-message">No hay categorías registradas</p>
        ) : (
          <ul>
            {categorias.map(c => (
              <li key={c._id} className="categoria-item">
                {editandoId === c._id ? (
                  <form onSubmit={handleUpdate} className="edit-form">
                    <div className="form-group">
                      <input
                        type="text"
                        value={editNombre}
                        onChange={e => setEditNombre(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <input
                        type="text"
                        value={editDescripcion}
                        onChange={e => setEditDescripcion(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="action-buttons">
                      <button type="submit" className="btn btn-success">
                        <FiSave className="icon" /> Guardar
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-cancel"
                        onClick={() => setEditandoId(null)}
                      >
                        <FiX className="icon" /> Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="categoria-info">
                      <h3>{c.nombre}</h3>
                      <p>{c.descripcion}</p>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn btn-edit"
                        onClick={() => startEdit(c)}
                      >
                        <FiEdit2 className="icon" /> Editar
                      </button>
                      <button 
                        className="btn btn-delete"
                        onClick={() => handleDelete(c._id)}
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

      <style jsx>{`
        .categorias-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .categorias-title {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 2rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f1f3f5;
        }
        
        .alert {
          padding: 0.8rem 1rem;
          border-radius: 5px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        
        .error {
          background-color: #ffebee;
          color: #c62828;
          border-left: 4px solid #ef5350;
        }
        
        .success {
          background-color: #e8f5e9;
          color: #2e7d32;
          border-left: 4px solid #4caf50;
        }
        
        .categorias-form {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #495057;
        }
        
        .form-group input {
          padding: 0.7rem;
          border: 1px solid #dee2e6;
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #4dabf7;
          box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.7rem 1.2rem;
          border-radius: 5px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.3s;
        }
        
        .btn-primary {
          background-color: #4dabf7;
          color: white;
          height: 42px;
        }
        
        .btn-primary:hover {
          background-color: #339af0;
        }
        
        .categorias-list {
          margin-top: 2rem;
        }
        
        .empty-message {
          text-align: center;
          color: #868e96;
          font-style: italic;
        }
        
        .categoria-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem;
          margin-bottom: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          transition: transform 0.2s;
        }
        
        .categoria-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .categoria-info h3 {
          font-size: 1.1rem;
          color: #2c3e50;
          margin-bottom: 0.3rem;
        }
        
        .categoria-info p {
          color: #868e96;
          font-size: 0.9rem;
        }
        
        .edit-form {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          width: 100%;
          align-items: center;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-edit {
          background-color: #ffd43b;
          color: #2b2b2b;
        }
        
        .btn-edit:hover {
          background-color: #fcc419;
        }
        
        .btn-delete {
          background-color: #ff6b6b;
          color: white;
        }
        
        .btn-delete:hover {
          background-color: #fa5252;
        }
        
        .btn-success {
          background-color: #40c057;
          color: white;
        }
        
        .btn-success:hover {
          background-color: #37b24d;
        }
        
        .btn-cancel {
          background-color: #adb5bd;
          color: white;
        }
        
        .btn-cancel:hover {
          background-color: #868e96;
        }
        
        .icon {
          margin-right: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .categorias-form,
          .edit-form {
            grid-template-columns: 1fr;
          }
          
          .categoria-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .action-buttons {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}