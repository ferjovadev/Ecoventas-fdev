const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./routes/usuario.routes'));
app.use('/api/clientes', require('./routes/cliente.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/proveedores', require('./routes/proveedor.routes'));
app.use('/api/ventas', require('./routes/venta.routes'));
app.use('/api/ingresos', require('./routes/ingreso.routes'));
app.use('/api/egresos', require('./routes/egreso.routes'));
app.use('/api/facturas', require('./routes/factura.routes'));
app.use('/api/itemventas', require('./routes/itemVenta.routes'));
app.use('/api/categorias-egreso', require('./routes/categoriaEgreso.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
