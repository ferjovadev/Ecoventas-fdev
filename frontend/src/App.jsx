import { useEffect, useState } from "react";
import {
  FiBox,
  FiFileText,
  FiLogOut,
  FiMessageCircle,
  FiPieChart,
  FiSettings,
  FiShoppingCart,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import {
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import "./index.css";
import Chat from "./pages/Chat";
import Clientes from "./pages/Clientes";
import Egresos from "./pages/Egresos";
import Facturas from "./pages/Facturas";
import Ingresos from "./pages/Ingresos";
import Productos from "./pages/Productos";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";
import Ventas from "./pages/Ventas";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <Router>
      {user ? (
        <MainAppLayout user={user} setUser={setUser} />
      ) : (
        <Routes>
          <Route path="/login" element={<Login setAuth={setUser} />} />
          <Route path="*" element={<NavigateToLogin />} />
        </Routes>
      )}
    </Router>
  );
}

function NavigateToLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, [navigate]);
  return null;
}

function MainAppLayout({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <h1 className="app-logo">
            EcoVentas<span>Express</span>
          </h1>
        </div>

        <nav className="main-nav">
          <NavMenuItem to="/ventas" icon={<FiShoppingCart size={20} />}>
            Ventas
          </NavMenuItem>
          <NavMenuItem to="/productos" icon={<FiBox size={20} />}>
            Productos
          </NavMenuItem>
          <NavMenuItem to="/clientes" icon={<FiUsers size={20} />}>
            Clientes
          </NavMenuItem>
          <NavMenuItem to="/reportes" icon={<FiPieChart size={20} />}>
            Reportes
          </NavMenuItem>
          <NavMenuItem to="/chat" icon={<FiMessageCircle size={20} />}>
            Chat
          </NavMenuItem>
        </nav>

        <div className="sidebar-divider"></div>

        <nav className="admin-nav">
          <h3 className="nav-section-title">Administración</h3>
          <NavMenuItem to="/ingresos" icon={<FiTrendingUp size={20} />}>
            Ingresos
          </NavMenuItem>
          <NavMenuItem to="/egresos" icon={<FiTrendingDown size={20} />}>
            Egresos
          </NavMenuItem>
          <NavMenuItem to="/facturas" icon={<FiFileText size={20} />}>
            Facturas
          </NavMenuItem>
          {user?.rol === "administrador" && (
            <NavMenuItem to="/usuarios" icon={<FiSettings size={20} />}>
              Usuarios
            </NavMenuItem>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        {/* Top Bar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <h2 className="page-title">Dashboard</h2>
          </div>
          <div className="topbar-right">
            <div className="user-profile">
              <span className="user-name">{user?.nombre}</span>
              <span className="user-rol">{user?.rol}</span>
              <button
                onClick={handleLogout}
                className="logout-btn"
                title="Cerrar sesión"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="app-content">
          <Routes>
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/ingresos" element={<Ingresos />} />
            <Route path="/egresos" element={<Egresos />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/facturas" element={<Facturas />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// Componente personalizado para items del menú
function NavMenuItem({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-menu-item ${isActive ? "active" : ""}`}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{children}</span>
    </NavLink>
  );
}
