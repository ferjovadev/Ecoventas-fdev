import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [nuevoIngreso, setNuevoIngreso] = useState({
    monto: '',
    descripcion: '',
    fecha: ''
  });
  const [editandoIngreso, setEditandoIngreso] = useState(null);
  const [error, setError] = useState('');

  const fetchIngresos = () => {
    axios.get('http://localhost:3000/api/ingresos').then(res => {
      setIngresos(res.data);
    }).catch(() => {
      setError('Error al cargar los ingresos.');
    });
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  const handleNuevoIngresoChange = (e) => {
    const { name, value } = e.target;
    setNuevoIngreso({ ...nuevoIngreso, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoIngreso.monto || !nuevoIngreso.descripcion || !nuevoIngreso.fecha) {
      setError('Por favor complete todos los campos');
      return;
    }

    axios.post('http://localhost:3000/api/ingresos', nuevoIngreso)
      .then(() => {
        setNuevoIngreso({ monto: '', descripcion: '', fecha: '' });
        fetchIngresos();
        setError('');
      })
      .catch(() => {
        setError('Error al agregar el ingreso.');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/api/ingresos/${id}`)
      .then(() => {
        fetchIngresos();
      })
      .catch(() => {
        setError('Error al eliminar el ingreso.');
      });
  };

  const startEdit = (ingreso) => {
    setEditandoIngreso(ingreso);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const { monto, descripcion, fecha } = editandoIngreso;
    if (!monto || !descripcion || !fecha) {
      setError('Por favor complete todos los campos');
      return;
    }

    axios.put(`http://localhost:3000/api/ingresos/${editandoIngreso._id}`, { monto, descripcion, fecha })
      .then(() => {
        setEditandoIngreso(null);
        fetchIngresos();
        setError('');
      })
      .catch(() => {
        setError('Error al actualizar el ingreso.');
      });
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Ingresos</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-1/4"
          name="monto"
          value={nuevoIngreso.monto}
          onChange={handleNuevoIngresoChange}
          placeholder="Monto"
        />
        <input
          className="border p-2 rounded w-1/4"
          name="descripcion"
          value={nuevoIngreso.descripcion}
          onChange={handleNuevoIngresoChange}
          placeholder="Descripción"
        />
        <input
          className="border p-2 rounded w-1/4"
          name="fecha"
          value={nuevoIngreso.fecha}
          onChange={handleNuevoIngresoChange}
          placeholder="Fecha"
        />
        <button className="bg-blue-500 text-white px-4 rounded" type="submit">Agregar</button>
      </form>

      <ul>
        {ingresos.map(i => (
          <li key={i._id} className="mb-2 p-2 border rounded flex justify-between items-center">
            {editandoIngreso && editandoIngreso._id === i._id ? (
              <form onSubmit={handleUpdate} className="flex gap-2 w-full">
                <input
                  className="border p-1 rounded w-1/4"
                  name="monto"
                  value={editandoIngreso.monto}
                  onChange={e => setEditandoIngreso({ ...editandoIngreso, monto: e.target.value })}
                />
                <input
                  className="border p-1 rounded w-1/4"
                  name="descripcion"
                  value={editandoIngreso.descripcion}
                  onChange={e => setEditandoIngreso({ ...editandoIngreso, descripcion: e.target.value })}
                />
                <input
                  className="border p-1 rounded w-1/4"
                  name="fecha"
                  value={editandoIngreso.fecha}
                  onChange={e => setEditandoIngreso({ ...editandoIngreso, fecha: e.target.value })}
                />
                <button className="bg-green-500 text-white px-3 rounded" type="submit">Guardar</button>
                <button
                  className="bg-gray-400 text-white px-3 rounded"
                  type="button"
                  onClick={() => setEditandoIngreso(null)}
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                <span>{i.monto} - {i.descripcion} - {i.fecha}</span>
                <div>
                  <button className="bg-yellow-400 text-white px-3 rounded mr-2" onClick={() => startEdit(i)}>Editar</button>
                  <button className="bg-red-500 text-white px-3 rounded" onClick={() => handleDelete(i._id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
