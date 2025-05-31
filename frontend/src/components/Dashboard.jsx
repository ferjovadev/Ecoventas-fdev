import { FiHome, FiUsers, FiShoppingCart, FiPieChart, FiDollarSign, 
  FiTrendingUp, FiTrendingDown, FiFileText, FiBox } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Datos de ejemplo
  const ventasTotales = 3;
  const ingresosTotales = 2100;
  const egresosTotales = 1000;

  return (
    <div className="dashboard-container">
    

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h2>Bienvenido al Sistema</h2>
        </header>

        <div className="content">
          <div className="dashboard-cards">
            <div className="card">
              <h3>Ventas Totales</h3>
              <p>{`${ventasTotales.toLocaleString()}`}</p>
            </div>
            <div className="card">
              <h3>Ingresos Totales</h3>
              <p>{`S/${ingresosTotales.toLocaleString()}`}</p>
            </div>
            <div className="card">
              <h3>Egresos Totales</h3>
              <p>{`S/${egresosTotales.toLocaleString()}`}</p>
            </div>
          </div>

          <div className="stats">
            <h3>Estadísticas Rápidas</h3>
            <div className="stat-card">
              <FiTrendingUp className="stat-icon" />
              <h4>Ingresos de Este Mes</h4>
              <p>{`$${ingresosTotales.toLocaleString()}`}</p>
            </div>
            <div className="stat-card">
              <FiTrendingDown className="stat-icon" />
              <h4>Egresos de Este Mes</h4>
              <p>{`$${egresosTotales.toLocaleString()}`}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
