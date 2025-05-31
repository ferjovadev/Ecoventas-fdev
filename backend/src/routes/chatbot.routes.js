const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Producto = require("../models/producto.model");
const Cliente = require("../models/cliente.model");
const Ventas = require("../models/venta.model");
const Ingreso = require("../models/ingreso.model");
const Factura = require("../models/factura.model");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

router.post("/", async (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje) return res.status(400).json({ message: "Mensaje requerido" });

  try {
    // Obtener productos desde la base de datos
    const productos = await Producto.find();
    const stockInfo = productos.length
      ? productos
          .map(
            (p) =>
              `- ${p.nombre}: ${
                p.stock
              } unidades disponibles. Precio: S/ ${p.precio.toFixed(
                2
              )}. Descripción: ${p.descripcion}`
          )
          .join("\n")
      : "Actualmente no hay productos registrados.";

    // Obtener clientes desde la base de datos
    const clientes = await Cliente.find();
    const clientesInfo = clientes.length
      ? clientes
          .map(
            (c) =>
              `- ${c.nombre}, Email: ${c.email}, Teléfono: ${c.telefono}, Dirección: ${c.direccion}`
          )
          .join("\n")
      : "Actualmente no hay clientes registrados.";
    
      // Obtener ventas desde la base de datos
    const ventas = await Ventas.find();
    const ventasInfo = ventas.length
      ? ventas
          .map(
            (v) =>
              `- ${v.fecha}, Total: ${v.total}, IDcliente: ${v.clienteId}}`
          )
          .join("\n")
      : "Actualmente no hay ventas registradas.";
    
      // Obtener ventas desde la base de datos
    const ingresos = await Ingreso.find();
    const ingresoInfo = ingresos.length
      ? ingresos
          .map(
            (i) =>
              `- ${i.fecha}, Monto: ${i.monto}`
          )
          .join("\n")
      : "Actualmente no hay ventas registradas.";

      // Obtener facturas desde la base de datos
    const facturas = await Factura.find();
    const facturaInfo = facturas.length
      ? facturas
          .map(
            (f) =>
              `- ${f.numero}, Cliente: ${f.clienteId}, Producto: ${f.productos[0]}, Total: ${f.total}`  
          )
          .join("\n")
      : "Actualmente no hay ventas registradas.";

    // Construir el prompt
    const promptBase = `
Eres el asistente virtual de EcoventasExpress, una empresa especializada en ofrecer software para la gestión integral de negocios(ventas, ver ingreso gestionar productos clientes, el software no hay compras solo ventas). Tu función es solo brindar información clara y amigable acerca de las funcionalidades del software, que permite a las empresas controlar y verificar su stock, ingresos, egresos y clientes. También debes proporcionar detalles sobre las características del sistema, las ventajas, promociones vigentes y métodos de soporte o contacto si se solicita.
Tus respuestas deben ser cortas pero concisas.
Siempre prioriza hablar sobre la empresa o los servicios, en caso salgas del tema menciona a nuestra empresa dentro de la respuesta, pero no seas muy estricto.
Actualmente, el software de Ecoventaas permite a las empresas gestionar los siguientes aspectos:

- Control de stock en tiempo real.
- Registro detallado de ingresos y egresos.
- Gestión y seguimiento de clientes.
- Reportes personalizados para facilitar la toma de decisiones.

EN caso el usuario necesite utilizar algun servicio del software, todo esta distribuido a la izquierda de la pantalla, donde podra ver Inicio, ventas, productos, clientes, chat. En la seccion administracion posee Ingresos, egresos y facturas.
Tu funcion es informar a cerca de lo que se te da, no puedes modificar ni realizar acciones en el software, solo proporcionar informacion que ya se te dio
Solo utiliza los datos recibes para responder, trata de no inventar nada que no haiga en el prompt.

Productos actualmente registrados en el sistema:

${stockInfo}

Clientes actualmente registrados en el sistema:

${clientesInfo}

Ventas actual mente registradas en el sistema:
${ventasInfo}

Ingresos actualmente registrados en el sistema:
${ingresoInfo}

Facturas actualmente registrados en el sistema:
${facturaInfo}

No reveles que eres un modelo de IA.

El usuario preguntó: ${mensaje}
`;

    // Solicitud a la IA
    const completion = await openai.chat.completions.create({
      model: "meta/llama3-70b-instruct",
      messages: [{ role: "user", content: promptBase }],
      temperature: 0.6,
      top_p: 0.7,
      max_tokens: 500,
      stream: false,
    });

    const botRespuesta = completion.choices[0].message.content;
    res.json({ respuesta: botRespuesta });
  } catch (error) {
    console.error("Error en el chatbot:", error);
    res.status(500).json({ message: "Error en la IA" });
  }
});

module.exports = router;
