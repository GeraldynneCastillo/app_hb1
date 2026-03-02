import React, { useState } from "react";
import {
  Ban,
  Loader2,
  CheckCircle,
  XCircle,
  Mail,
  MessageSquare,
} from "lucide-react";

// Usa la misma lógica de URL dinámica que App.jsx
const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "http://172.19.7.106:8000";

const FormularioExclusion = ({ onExclusionExitosa }) => {
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState(null); // { tipo: 'exito' | 'error', mensaje: '' }

  const inputStyles =
    "w-full bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-10 pr-3 py-2.5";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setAlerta(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/excluidos/agregar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), motivo: motivo.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlerta({
          tipo: "exito",
          mensaje: data.mensaje || "Usuario excluido exitosamente.",
        });
        setEmail("");
        setMotivo("");
        // Notifica al padre para que recargue la lista de trabajadores
        if (onExclusionExitosa) {
          onExclusionExitosa();
        }
      } else {
        setAlerta({
          tipo: "error",
          mensaje: data.error || "Ocurrió un error al procesar la solicitud.",
        });
      }
    } catch (err) {
      setAlerta({
        tipo: "error",
        mensaje:
          "No se pudo conectar con el servidor. Verifica que el backend esté activo.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      {/* Encabezado de la sección */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
          <Ban className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 leading-tight">
            Excluir de Envíos Automáticos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            El correo ingresado no recibirá felicitaciones de cumpleaños.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 items-end"
      >
        {/* Input: Email */}
        <div className="relative flex-[2] w-full">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
            Correo electrónico <span className="text-red-400">*</span>
          </label>
          <div className="absolute bottom-0 left-0 pl-3 flex items-center h-[42px] pointer-events-none">
            <Mail className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="email"
            required
            className={inputStyles}
            placeholder="correo@cmf.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={cargando}
          />
        </div>

        {/* Input: Motivo */}
        <div className="relative flex-[2] w-full">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
            Motivo{" "}
            <span className="text-slate-300 font-normal">(opcional)</span>
          </label>
          <div className="absolute bottom-0 left-0 pl-3 flex items-center h-[42px] pointer-events-none">
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className={inputStyles}
            placeholder="Ej: Ya no trabaja en la empresa"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            disabled={cargando}
          />
        </div>

        {/* Botón de Submit */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          {/* Spacer para alinear el botón con los inputs */}
          <div className="hidden sm:block h-[22px]" />
          <button
            type="submit"
            disabled={cargando}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            {cargando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Excluyendo...
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                Excluir
              </>
            )}
          </button>
        </div>
      </form>

      {/* Alerta de resultado */}
      {alerta && (
        <div
          className={`mt-4 flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium border transition-all ${
            alerta.tipo === "exito"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {alerta.tipo === "exito" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <span>{alerta.mensaje}</span>
        </div>
      )}
    </div>
  );
};

export default FormularioExclusion;
