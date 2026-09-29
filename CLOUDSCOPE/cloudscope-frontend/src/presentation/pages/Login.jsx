/**
 * Login – Página de autenticación de CloudScope.
 * UI completa con validación de formulario.
 * En local usa mock auth; en VPS conectará al backend Spring Boot con JWT.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CloudScopeLogo, AwsLogo, AzureLogo, OracleLogo, GcpLogo, TerraformLogo, HexagonIcon, ShieldIcon, DollarIcon, PDFIcon, WarningIcon, ArrowRightIcon } from '../components/icons/CloudIcons.jsx';

// ─── Mock Auth + Backend Auth ────────────────
const MOCK_USERS = [
  { email: 'admin@cloudscope.io', password: 'admin123', name: 'Admin User', role: 'admin' },
  { email: 'demo@cloudscope.io', password: 'demo123', name: 'Demo User', role: 'viewer' },
];

async function authenticateUser(email, password) {
  try {
    const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('cs_token', res.data.token);
      localStorage.setItem('cs_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error('Correo electrónico o contraseña incorrectos.');
    }
  }

  // Fallback a usuarios locales o mock
  const registeredRaw = localStorage.getItem('cs_registered_users');
  const registered = registeredRaw ? JSON.parse(registeredRaw) : [];
  const allUsers = [...MOCK_USERS, ...registered];
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (user) {
    const token = btoa(JSON.stringify({ sub: email, name: user.name, role: user.role ?? 'user', exp: Date.now() + 3600000 }));
    localStorage.setItem('cs_token', token);
    localStorage.setItem('cs_user', JSON.stringify({ email: user.email, name: user.name, role: user.role ?? 'user' }));
    return user;
  }
  throw new Error('Correo electrónico o contraseña incorrectos.');
}

// ─── Icono de ojo ──────────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusField, setFocusField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await authenticateUser(email.trim(), password);
      sessionStorage.removeItem('cs_logout');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@cloudscope.io');
    setPassword('demo123');
    setLoading(true);
    setError('');
    try {
      await authenticateUser('demo@cloudscope.io', 'demo123');
      sessionStorage.removeItem('cs_logout');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Panel izquierdo: branding ───────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden border-r border-slate-200"
        style={{ background: '#ffffff' }}
      >
        {/* Grid decorativo de fondo */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Marca de agua de la imagen subida por el usuario */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "url('/bg-pattern.png')",
            backgroundSize: '300px',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #0084ff, transparent)' }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <CloudScopeLogo className="w-10 h-10 shadow-sm" />
            <span className="font-black text-2xl" style={{ color: '#0f172a' }}>
              Cloud<span style={{ color: '#0084ff' }}>Scope</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ml-1"
              style={{ background: 'rgba(0,132,255,0.1)', color: '#0084ff', border: '1px solid rgba(0,132,255,0.2)' }}>
              Studio
            </span>
          </div>

          <h1 className="text-5xl font-black leading-tight mb-6" style={{ color: '#0f172a' }}>
            Design cloud<br />
            <span style={{ color: '#0084ff' }}>infrastructure</span><br />
            with confidence
          </h1>
          <p className="text-lg leading-relaxed mb-6" style={{ color: '#475569' }}>
            Diseña, audita y exporta arquitecturas multi-cloud (AWS, Azure, Oracle, Google Cloud) con validación de seguridad CIS Benchmarks en tiempo real y FinOps.
          </p>

          {/* Logos oficiales proveedores en banner */}
          <div className="flex items-center gap-3 p-3 rounded-2xl w-fit"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
            <span className="text-xs text-slate-500 font-semibold">Plataformas soportadas:</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-bold text-amber-500 shadow-sm">
                <AwsLogo className="w-3.5 h-3.5" /> AWS
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-bold text-sky-500 shadow-sm">
                <AzureLogo className="w-3.5 h-3.5" /> Azure
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-bold text-red-600 shadow-sm">
                <OracleLogo className="w-3.5 h-3.5" /> Oracle
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-bold text-rose-500 shadow-sm">
                <GcpLogo className="w-3.5 h-3.5" /> Google Cloud
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-bold text-purple-500 shadow-sm">
                <TerraformLogo className="w-3.5 h-3.5" /> IaC
              </div>
            </div>
          </div>
        </div>

        {/* Features bullets */}
        <div className="relative z-10 space-y-4">
          {[
            { icon: <HexagonIcon className="w-4 h-4" />, text: 'Lienzo interactivo multi-cloud basado en grafos (ReactFlow)', color: '#0084ff' },
            { icon: <ShieldIcon className="w-4 h-4" />, text: 'Auditoría CIS Benchmarks y Blast Radius en tiempo real', color: '#10b981' },
            { icon: <DollarIcon className="w-4 h-4" />, text: 'Estimación FinOps dinámica y análisis What-If comparativo', color: '#10b981' },
            { icon: <PDFIcon className="w-4 h-4" />, text: 'Exportación automática a Terraform HCL multi-proveedor', color: '#8b5cf6' },
          ].map(({ icon, text, color }) => (
            <div key={text} className="flex items-center gap-3">
              <span style={{ color }}>{icon}</span>
              <span className="text-sm font-medium" style={{ color: '#475569' }}>{text}</span>
            </div>
          ))}
        </div>

        <p className="text-xs relative z-10" style={{ color: '#94a3b8' }}>
          © 2026 CloudScope · Universidad Privada de Tacna · SI-784
        </p>
      </div>

      {/* ── Panel derecho: formulario ───────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm border border-slate-200">

          {/* Logo móvil */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <CloudScopeLogo className="w-8 h-8" />
            <span className="font-black text-xl" style={{ color: '#0f172a' }}>
              Cloud<span style={{ color: '#0084ff' }}>Scope</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black mb-2" style={{ color: '#0f172a' }}>Bienvenido</h2>
            <p className="text-sm" style={{ color: '#64748b' }}>Inicia sesión en tu cuenta CloudScope Studio</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
              <WarningIcon className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: '#475569' }}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: '#f8fafc',
                  border: `1px solid ${focusField === 'email' ? '#0084ff' : '#e2e8f0'}`,
                  color: '#0f172a',
                  boxShadow: focusField === 'email' ? '0 0 0 3px rgba(0,132,255,0.15)' : 'none',
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: '#475569' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: '#f8fafc',
                    border: `1px solid ${focusField === 'password' ? '#0084ff' : '#e2e8f0'}`,
                    color: '#0f172a',
                    boxShadow: focusField === 'password' ? '0 0 0 3px rgba(0,132,255,0.15)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#94a3b8' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#475569'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: loading ? '#e2e8f0' : '#0084ff',
                color: loading ? '#94a3b8' : '#ffffff',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(0,132,255,0.3)',
                transform: loading ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>Iniciar sesión</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>o continúa con</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          {/* Demo access */}
          <button
            id="login-demo"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#64748b',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = '#f1f5f9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#f8fafc'; }}
          >
            Acceso Demo (sin cuenta)
          </button>

          {/* Enlace al registro */}
          <div className="mt-6 text-center text-xs text-slate-500">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Regístrate aquí
            </Link>
          </div>

          {/* Hint credentials */}
          <div className="mt-6 p-3 rounded-xl text-xs space-y-1"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <div className="font-bold text-slate-700 mb-1">Credenciales de prueba:</div>
            <div className="font-mono">admin@cloudscope.io · admin123</div>
            <div className="font-mono">demo@cloudscope.io&nbsp;&nbsp; · demo123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
