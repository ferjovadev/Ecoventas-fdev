import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Clientes from './pages/Clientes';
import Egresos from './pages/Egresos';
import Facturas from './pages/Facturas'; // Importa el componente de Facturas
import Home from './pages/Home';
import Ingresos from './pages/Ingresos';
import Productos from './pages/Productos';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';
import Ventas from './pages/Ventas';

export default function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4 flex gap-4">
          <Link to="/">Inicio</Link>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/clientes">Clientes</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/ventas">Ventas</Link>
          <Link to="/ingresos">Ingresos</Link>
          <Link to="/egresos">Egresos</Link>
          <Link to="/reportes">Reportes</Link>
          <Link to="/facturas">Facturas</Link>  {/* Añadir el enlace para facturas */}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/ingresos" element={<Ingresos />} />
          <Route path="/egresos" element={<Egresos />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/facturas" element={<Facturas />} />  {/* Ruta para facturas */}
        </Routes>
      </div>
    </Router>
  );
}
