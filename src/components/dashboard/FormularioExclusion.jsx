import React, { useState, useEffect, useCallback } from 'react';
import { Ban, Loader2, CheckCircle, XCircle, Mail, Trash2, RefreshCw, Users, ShieldOff } from 'lucide-react';

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : 'http://172.19.7.106:8000';

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${value ? 'bg-blue-600' : 'bg-slate-200'}`}
    role="switch"
    aria-checked={value}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// ─── Badge Vigencia ───────────────────────────────────────────────────────────
const BadgeVigencia = ({ vigente }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${vigente
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    : 'bg-slate-100 text-slate-500 border border-slate-200'
    }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${vigente ? 'bg-emerald-500' : 'bg-slate-400'}`} />
    {vigente ? 'Sí' : 'No'}
  </span>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map(t => (
      <div
        key={t.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${t.tipo === 'exito' ? 'bg-emerald-500' : 'bg-red-500'}`}
      >
        {t.tipo === 'exito'
          ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
          : <XCircle className="w-4 h-4 flex-shrink-0" />}
        <span>{t.mensaje}</span>
      </div>
    ))}
  </div>
);

// ─── Formulario ───────────────────────────────────────────────────────────────
const Formulario = ({ onExito, excluidos }) => {
  const [email, setEmail] = useState('');
  const [vigente, setVigente] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');

  const inputBase =
    'w-full bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all pl-10 pr-3 py-3';

  const handleEmailChange = (val) => {
    setEmail(val);
    const yaExiste = excluidos.some(e => e.email.toLowerCase() === val.toLowerCase().trim());
    setErrorEmail(yaExiste ? 'Este correo ya está en la lista de exclusión.' : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorEmail) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/excluidos/agregar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), vigente }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmail('');
        setVigente(true);
        onExito('exito', data.mensaje || 'Exclusión guardada exitosamente.');
      } else {
        onExito('error', data.error || 'Ocurrió un error al procesar la solicitud.');
      }
    } catch {
      onExito('error', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Encabezado integrado con border-b */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <ShieldOff className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">
              Gestión de Exclusiones
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Agrega las cuentas que deben ser omitidas en los procesos de notificación automática.
            </p>
          </div>
        </div>
      </div>

      {/* Campos */}
      <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Correo electrónico <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="email"
              required
              className={`${inputBase} ${errorEmail ? 'border-red-300 focus:border-red-400' : ''}`}
              placeholder="correo@cmf.cl"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={cargando}
            />
          </div>
          {errorEmail && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {errorEmail}
            </p>
          )}
        </div>

        {/* Vigencia */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <div>
            <p className="text-xs font-semibold text-slate-600">Vigencia</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {vigente ? 'Exclusión activa — no recibirá correos' : 'Exclusión inactiva — recibirá correos'}
            </p>
          </div>
          <Toggle value={vigente} onChange={setVigente} />
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={cargando || !!errorEmail}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            {cargando
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
              : <><Ban className="w-4 h-4" /> Guardar exclusión</>
            }
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Tabla ────────────────────────────────────────────────────────────────────
const TablaExcluidos = ({ excluidos, cargandoTabla, onEliminar }) => {
  if (cargandoTabla) {
    return (
      <div className="flex justify-center items-center py-14">
        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
      </div>
    );
  }

  if (excluidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
          <Users className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-400">Lista de exclusión vacía</p>
        <p className="text-xs text-slate-300 mt-1">Los correos que agregues aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            <th className="text-left text-xs font-semibold text-slate-500 py-3 px-5">Correo electrónico</th>
            <th className="text-left text-xs font-semibold text-slate-500 py-3 px-5">Vigencia</th>
            <th className="text-left text-xs font-semibold text-slate-500 py-3 px-5">Fecha de registro</th>
            <th className="text-right text-xs font-semibold text-slate-500 py-3 px-5">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {excluidos.map((e) => (
            <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td className="py-3.5 px-5 font-medium text-slate-700">{e.email}</td>
              <td className="py-3.5 px-5">
                <BadgeVigencia vigente={e.vigente} />
              </td>
              <td className="py-3.5 px-5 text-slate-400 text-xs whitespace-nowrap">{e.fecha_registro}</td>
              <td className="py-3.5 px-5 text-right">
                <button
                  onClick={() => onEliminar(e.id, e.email)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-transparent px-3 py-1.5 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reincorporar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Componente raíz ──────────────────────────────────────────────────────────
const FormularioExclusion = ({ onExclusionExitosa }) => {
  const [excluidos, setExcluidos] = useState([]);
  const [cargandoTabla, setCargandoTabla] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = (tipo, mensaje) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, tipo, mensaje }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const cargarExcluidos = useCallback(async () => {
    setCargandoTabla(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/excluidos/`);
      const data = await res.json();
      setExcluidos(data.excluidos || []);
    } catch {
      addToast('error', 'No se pudo cargar la lista de exclusión.');
    } finally {
      setCargandoTabla(false);
    }
  }, []);

  useEffect(() => { cargarExcluidos(); }, [cargarExcluidos]);

  const handleExito = (tipo, mensaje) => {
    addToast(tipo, mensaje);
    if (tipo === 'exito') {
      cargarExcluidos();
      if (onExclusionExitosa) onExclusionExitosa();
    }
  };

  const handleEliminar = async (id, email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/excluidos/${id}/eliminar/`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        addToast('exito', `${email} ha sido reincorporado.`);
        cargarExcluidos();
        if (onExclusionExitosa) onExclusionExitosa();
      } else {
        addToast('error', data.error || 'No se pudo reincorporar el correo.');
      }
    } catch {
      addToast('error', 'Error de conexión. Intenta de nuevo.');
    }
  };

  return (
    <>
      <Toast toasts={toasts} />
      <Formulario onExito={handleExito} excluidos={excluidos} />
      <div className="mt-5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-700">Lista de exclusión</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {excluidos.length} {excluidos.length === 1 ? 'registro' : 'registros'}
            </p>
          </div>
          <button
            onClick={cargarExcluidos}
            title="Actualizar lista"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <TablaExcluidos excluidos={excluidos} cargandoTabla={cargandoTabla} onEliminar={handleEliminar} />
      </div>
    </>
  );
};

export default FormularioExclusion;
