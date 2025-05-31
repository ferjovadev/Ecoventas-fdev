const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chat.model");
const OpenAI = require("openai");
const axios = require("axios");
require("dotenv").config();

// Configurar Express y DB
const app = express();
connectDB();
app.use(cors({ origin: "*" })); // Cambiar en producción
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
app.use("/api/chat", require("./routes/chat.routes"));
app.use("/api/chatbot", require("./routes/chatbot.routes")); // Solo si usas un endpoint REST para IA

// Configurar OpenAI si lo usas directamente (opcional)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1", // cambia según tu proveedor
});

// Crear servidor HTTP + WebSocket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Cambiar en producción
});

// WebSocket: Chat en tiempo real con IA
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");

  socket.on("mensaje", async (msg) => {
    try {
      // Guardar mensaje del usuario
      const nuevo = new Chat(msg);
      await nuevo.save();
      io.emit("mensaje", msg);

      // Si no es el bot, obtener respuesta
      if (msg.nombre !== "ChatBot") {
        const { data } = await axios.post(
          "http://localhost:3000/api/chatbot", // Cambiar por dominio real en prod
          { mensaje: msg.texto }
        );

        const mensajeBot = {
          nombre: "ChatBot",
          texto: data.respuesta,
          hora: new Date().toLocaleTimeString(),
        };

        const nuevoBot = new Chat(mensajeBot);
        await nuevoBot.save();
        io.emit("mensaje", mensajeBot);
      }
    } catch (error) {
      console.error("❌ Error en socket mensaje:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

// Puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
);
