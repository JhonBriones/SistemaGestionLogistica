"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SendHorizontal, X, Minus, MessageCircle } from "lucide-react"

const ChatFloating = () => {
  const [mensajes, setMensajes] = useState([])
  const [entrada, setEntrada] = useState("")
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const chatRef = useRef(null)

  // Mensaje inicial de bienvenida
  useEffect(() => {
    setMensajes([
      {
        tipo: "bot",
        texto:
          "¡Hola! ¿En qué puedo ayudarte hoy? 🚛 Puedes preguntarme sobre camiones, conductores, rutas, entregas o tareas.",
      },
    ])
  }, [])

  // Scroll automático cuando llegan nuevos mensajes
  useEffect(() => {
    if (abierto) {
      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
    }
  }, [mensajes, abierto])

  // Envía mensaje al backend y actualiza estado
  const manejarEnvio = async (e) => {
    e.preventDefault()
    if (!entrada.trim()) return

    // Agregar mensaje del usuario
    const textoUsuario = entrada
    setMensajes((prev) => [...prev, { tipo: "usuario", texto: textoUsuario }])
    setEntrada("")
    setCargando(true)

    try {
      // Mostrar indicador de escritura
      setMensajes((prev) => [...prev, { tipo: "bot", texto: "Escribiendo...", temporal: true }])

      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: textoUsuario }),
      })
      const data = await res.json()

      // Eliminar el mensaje temporal de "Escribiendo..."
      setMensajes((prev) => prev.filter((m) => !m.temporal))

      // Agregar la respuesta real del bot
      setMensajes((prev) => [...prev, { tipo: "bot", texto: data.respuesta }])
    } catch (error) {
      console.error("Error al conectar con el backend:", error)
      // Eliminar el mensaje temporal de "Escribiendo..."
      setMensajes((prev) => prev.filter((m) => !m.temporal))
      setMensajes((prev) => [...prev, { tipo: "bot", texto: "⚠️ Error al conectar con el servidor." }])
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Ventana de chat arrastrable */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            className="mb-2 w-80 max-w-[95vw]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            drag
            dragMomentum={false}
            dragConstraints={{ top: -200, left: -200, right: 200, bottom: 200 }}
          >
            <div
              ref={chatRef}
              className="flex flex-col h-[70vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-teal-900 to-teal-700 px-4 py-3">
                <h2 className="text-lg font-semibold text-white">Asistente Virtual</h2>
                <div className="flex gap-2">
                  <button onClick={() => setAbierto(false)} className="p-1 rounded-full hover:bg-white/20 transition">
                    <Minus size={16} className="text-white" />
                  </button>
                  <button onClick={() => setAbierto(false)} className="p-1 rounded-full hover:bg-white/20 transition">
                    <X size={16} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Burbujas de mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-teal-50">
                <AnimatePresence initial={false}>
                  {mensajes.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className={`flex ${m.tipo === "bot" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                          m.tipo === "bot"
                            ? m.temporal
                              ? "bg-gray-100 text-gray-500 italic"
                              : "bg-teal-100 text-teal-800"
                            : "bg-teal-700 text-white"
                        }`}
                      >
                        <strong className="block mb-1">{m.tipo === "bot" ? "Asistente" : "Tú"}</strong>
                        <span>{m.texto}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input y botón de envío */}
              <form onSubmit={manejarEnvio} className="flex items-center p-3 bg-teal-50">
                <input
                  type="text"
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-grow px-4 py-2 border border-teal-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  disabled={cargando}
                />
                <button
                  type="submit"
                  className={`ml-2 p-2 rounded-full ${
                    cargando ? "bg-gray-400" : "bg-teal-700 hover:bg-teal-800"
                  } text-white shadow transition`}
                  disabled={cargando}
                >
                  <SendHorizontal size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante con icono de chat */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 bg-teal-900 text-white px-4 py-3 rounded-full shadow-lg hover:bg-teal-700 transition"
      >
        <MessageCircle size={24} className="text-white" />
        <span className="font-medium">Pregúntale al Asistente</span>
      </button>
    </div>
  )
}

export default ChatFloating
