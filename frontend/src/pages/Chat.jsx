// src/pages/Chat.jsx
import { useEffect, useRef, useState } from "react";
import { FiSend, FiUser } from "react-icons/fi";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Asegúrate de que tu servidor WebSocket esté aquí

export default function Chat() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const mensajesEndRef = useRef(null);

  useEffect(() => {
    socket.on("mensaje", (msg) => {
      setMensajes((prev) => [...prev, msg]);
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

  return (
    <div className="chat-container">
      <h2 className="clientes-title">
        <FiUser className="icon-title" /> Chat en Tiempo Real
      </h2>

      {!nombre ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (nombre.trim()) setNombre(nombre.trim());
          }}
          className="clientes-form"
        >
          <div className="form-group">
            <label>
              <FiUser className="icon" /> Tu nombre:
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
