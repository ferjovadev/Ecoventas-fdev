import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="text-center text-4xl font-bold mb-4">Bienvenido a EcoVentas</h1>
      <p className="text-center text-lg mb-4">Aquí podrás gestionar tus productos, ventas, ingresos, y más.</p>
      
      <div className="text-center">
        <p className="mb-2">¿Qué deseas hacer?</p>
        <div className="grid grid-cols-2 gap-4">
          {/* Usando Link para hacer las rutas navegables */}
          <Link to="/productos">  {/* Ruta para los productos */}
            <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">Ver productos</button>
          </Link>
          <Link to="/ventas">  {/* Ruta para las ventas */}
            <button className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">Ver ventas</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
