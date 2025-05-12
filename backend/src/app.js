const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chat.model"); // 👈 importar modelo de chat
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Rutas API REST
app.use("/api/usuarios", require("./routes/usuario.routes"));
app.use("/api/clientes", require("./routes/cliente.routes"));
app.use("/api/productos", require("./routes/producto.routes"));
app.use("/api/proveedores", require("./routes/proveedor.routes"));
app.use("/api/ventas", require("./routes/venta.routes"));
app.use("/api/ingresos", require("./routes/ingreso.routes"));
app.use("/api/egresos", require("./routes/egreso.routes"));
app.use("/api/facturas", require("./routes/factura.routes"));
app.use("/api/itemventas", require("./routes/itemVenta.routes"));
app.use("/api/categorias-egreso", require("./routes/categoriaEgreso.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/chat", require("./routes/chat.routes")); // 👈 nueva ruta para mensajes

// Servidor HTTP + WebSocket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// WebSocket: Chat
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");

  socket.on("mensaje", async (msg) => {
    try {
      const nuevo = new Chat(msg);
      await nuevo.save();
      io.emit("mensaje", msg);
    } catch (error) {
      console.error("❌ Error al guardar mensaje:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

// Puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
