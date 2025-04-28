import { FiHome, FiUsers, FiShoppingCart, FiPieChart, FiDollarSign, 
  FiTrendingUp, FiTrendingDown, FiFileText, FiBox } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">EcoVentasExpress</h2>
        <nav>
          <Link to="/" className="nav-item">
            <FiHome className="icon" /> Inicio
          </Link>
          <Link to="/ventas" className="nav-item">
            <FiShoppingCart className="icon" /> Ventas
          </Link>
          <Link to="/productos" className="nav-item">
            <FiBox className="icon" /> Productos
          </Link>
          <Link to="/clientes" className="nav-item">
            <FiUsers className="icon" /> Clientes
          </Link>
          <Link to="/reportes" className="nav-item">
            <FiPieChart className="icon" /> Reportes
          </Link>
          <Link to="/ingresos" className="nav-item">
            <FiTrendingUp className="icon" /> Ingresos
          </Link>
          <Link to="/egresos" className="nav-item">
            <FiTrendingDown className="icon" /> Egresos
          </Link>
          <Link to="/facturas" className="nav-item">
            <FiFileText className="icon" /> Facturas
          </Link>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <h2>Bienvenido al Sistema</h2>
        </header>
        <div className="content">
          {/* Contenido del dashboard */}
        </div>
      </main>
    </div>
  );
}