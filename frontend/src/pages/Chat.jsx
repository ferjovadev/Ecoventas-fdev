import { useEffect, useRef, useState } from "react";
import { FiSend, FiUser } from "react-icons/fi";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Chat() {
  const [nombre, setNombre] = useState(""); // nombre definitivo
  const [nombreInput, setNombreInput] = useState(""); // input temporal
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const mensajesEndRef = useRef(null);

  useEffect(() => {
    socket.on("mensaje", (msg) => {
      let textoLimpio = msg.texto;

      // Eliminar bloques <think>...</think>
      while (
        textoLimpio.includes("<think>") &&
        textoLimpio.includes("</think>")
      ) {
        const inicio = textoLimpio.indexOf("<think>");
        const fin = textoLimpio.indexOf("</think>") + "</think>".length;
        textoLimpio = textoLimpio.slice(0, inicio) + textoLimpio.slice(fin);
      }

      textoLimpio = textoLimpio.trim();

      // Guardar mensaje limpio
      const mensajeLimpio = { ...msg, texto: textoLimpio };
      setMensajes((prev) => [...prev, mensajeLimpio]);
    });

    return () => {
      socket.off("mensaje");
    };
  }, []);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!nombre || !mensaje) return;

    const nuevoMensaje = {
      nombre,
      texto: mensaje,
      hora: new Date().toLocaleTimeString(),
    };

    socket.emit("mensaje", nuevoMensaje);
    setMensaje("");
  };

  const handleIngresoNombre = (e) => {
    e.preventDefault();
    if (nombreInput.trim()) {
      setNombre(nombreInput.trim());
    }
  };

  return (
    <div className="chat-container">
      <h2 className="clientes-title">
        <FiUser className="icon-title" /> Chat en Tiempo Real
      </h2>

      {!nombre ? (
        <form onSubmit={handleIngresoNombre} className="clientes-form">
          <div className="form-group">
            <label>
              <FiUser className="icon" /> Tu nombre:
            </label>
            <input
              type="text"
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              placeholder="Ingresa tu nombre"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Ingresar al chat
          </button>
        </form>
      ) : (
        <>
          <div className="chat-mensajes">
            {mensajes.map((msg, i) => (
              <div
                key={i}
                className={`chat-mensaje ${
                  msg.nombre === nombre ? "propio" : "otro"
                }`}
              >
                <strong>{msg.nombre}</strong>: {msg.texto}
                <span className="chat-hora">{msg.hora}</span>
              </div>
            ))}
            <div ref={mensajesEndRef} />
          </div>

          <form onSubmit={handleEnviar} className="chat-form">
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe tu mensaje..."
              required
            />
            <button type="submit" className="btn btn-primary">
              <FiSend className="icon" /> Enviar
            </button>
          </form>
        </>
      )}
    </div>
  );
}
