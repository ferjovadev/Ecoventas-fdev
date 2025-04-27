import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/ventas')
      .then(res => {
        setVentas(res.data);
        setCargando(false);
      })
      .catch(() => {
        setError('Error al cargar las ventas');
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ventas</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {ventas.map(v => (
          <li key={v._id}>Cliente: {v.cliente?.nombre} - Total: S/. {v.total}</li>
        ))}
      </ul>
    </div>
  );
}
