import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Egresos() {
  const [egresos, setEgresos] = useState([]);
  const [formData, setFormData] = useState({ monto: '', descripcion: '', fecha: '' });
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');

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

  // Función para cargar los egresos
  const fetchEgresos = async () => {
    const data = await apiRequest('get', 'http://localhost:3000/api/egresos');
    if (data) setEgresos(data);
  };

  useEffect(() => {
    fetchEgresos();
  }, []);

  // Manejo del formulario para agregar o editar egresos
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.monto || !formData.descripcion || !formData.fecha) {
      setError('Por favor complete todos los campos');
      return;
    }

    let data;
    if (editData) {
      data = await apiRequest('put', `http://localhost:3000/api/egresos/${editData._id}`, formData);
    } else {
      data = await apiRequest('post', 'http://localhost:3000/api/egresos', formData);
    }

    if (data) {
      setFormData({ monto: '', descripcion: '', fecha: '' });
      setEditData(null);
      fetchEgresos();
    }
  };

  // Eliminar egreso
  const handleDelete = async (id) => {
    const data = await apiRequest('delete', `http://localhost:3000/api/egresos/${id}`);
    if (data) fetchEgresos();
  };

  // Iniciar edición de un egreso
  const startEdit = (egreso) => {
    setEditData(egreso);
    setFormData({ monto: egreso.monto, descripcion: egreso.descripcion, fecha: egreso.fecha });
  };

  // Manejo del cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Egresos</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Mostrar errores */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          name="monto"
          className="border p-2 rounded w-1/4"
          value={formData.monto}
          onChange={handleChange}
          placeholder="Monto"
        />
        <input
          name="descripcion"
          className="border p-2 rounded w-1/4"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
        />
        <input
          name="fecha"
          className="border p-2 rounded w-1/4"
          value={formData.fecha}
          onChange={handleChange}
          placeholder="Fecha"
        />
        <button className="bg-blue-500 text-white px-4 rounded" type="submit">
          {editData ? 'Actualizar' : 'Agregar'}
        </button>
      </form>
      <ul>
        {egresos.map((e) => (
          <li key={e._id} className="mb-2 p-2 border rounded flex justify-between items-center">
            {editData && editData._id === e._id ? (
              <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                <input
                  name="monto"
                  className="border p-1 rounded w-1/4"
                  value={formData.monto}
                  onChange={handleChange}
                />
                <input
                  name="descripcion"
                  className="border p-1 rounded w-1/4"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
                <input
                  name="fecha"
                  className="border p-1 rounded w-1/4"
                  value={formData.fecha}
                  onChange={handleChange}
                />
                <button className="bg-green-500 text-white px-3 rounded" type="submit">
                  Guardar
                </button>
                <button
                  className="bg-gray-400 text-white px-3 rounded"
                  type="button"
                  onClick={() => {
                    setEditData(null);
                    setFormData({ monto: '', descripcion: '', fecha: '' });
                  }}
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                <span>{e.monto} - {e.descripcion} - {e.fecha}</span>
                <div>
                  <button
                    className="bg-yellow-400 text-white px-3 rounded mr-2"
                    onClick={() => startEdit(e)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 rounded"
                    onClick={() => handleDelete(e._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
