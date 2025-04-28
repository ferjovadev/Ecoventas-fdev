import { useState } from 'react';
import { FiLock, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Login({ setAuth }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Datos del usuario predeterminado
  const defaultUser = {
    email: 'admin@ecoventas.com',
    password: 'admin123'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para autocompletar con el usuario predeterminado
  const fillDefaultUser = () => {
    setFormData(defaultUser);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulación de login (solo frontend)
    if (formData.email === defaultUser.email && formData.password === defaultUser.password) {
      setTimeout(() => {
        const mockAuthData = {
          token: 'mock-token-123456789',
          user: {
            id: 1,
            name: 'Administrador',
            email: defaultUser.email,
            role: 'admin'
          }
        };
        
        localStorage.setItem('token', mockAuthData.token);
        localStorage.setItem('user', JSON.stringify(mockAuthData.user));
        setAuth(mockAuthData.user);
        navigate('/');
      }, 1000); // Simulamos 1 segundo de delay como si fuera una API real
    } else {
      setError('Credenciales incorrectas. Usa el botón "Usuario de prueba" o ingresa los datos correctos.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">EcoVentasExpress</h2>
        <p className="login-subtitle">Inicia sesión en tu cuenta</p>
        
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label><FiMail className="icon" /> Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label><FiLock className="icon" /> Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <button 
            type="button" 
            className="btn btn-default" 
            onClick={fillDefaultUser}
            style={{ 
              marginTop: '10px', 
              backgroundColor: '#f0f0f0',
              color: '#333'
            }}
          >
            Usuario de prueba
          </button>
        </form>
      </div>
    </div>
  );
}