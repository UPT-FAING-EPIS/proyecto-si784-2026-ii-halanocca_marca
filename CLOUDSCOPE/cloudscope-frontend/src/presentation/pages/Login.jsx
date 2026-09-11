/**
 * Login – Página de autenticación de CloudScope.
 * UI completa con validación de formulario.
 * En local usa mock auth; en VPS conectará al backend Spring Boot con JWT.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Mock Auth (reemplazar por llamada real al backend en VPS) ────────────────
const MOCK_USERS = [
  { email: 'admin@cloudscope.io', password: 'admin123', name: 'Admin User', role: 'admin' },
  { email: 'demo@cloudscope.io', password: 'demo123', name: 'Demo User', role: 'viewer' },
];

function mockLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        const token = btoa(JSON.stringify({ sub: email, name: user.name, role: user.role, exp: Date.now() + 3600000 }));
        localStorage.setItem('cs_token', token);
        localStorage.setItem('cs_user', JSON.stringify({ email: user.email, name: user.name, role: user.role }));
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800); // simula latencia de red
  });
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
      await mockLogin(email.trim(), password);
      navigate('/editor');
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
      await mockLogin('demo@cloudscope.io', 'demo123');
      navigate('/editor');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#080d18', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Panel izquierdo: branding ───────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0a0f1e 100%)' }}
      >
        {/* Grid decorativo de fondo */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 0 20px rgba(245,158,11,0.4)' }}
            >
              <span style={{ color: '#080d18' }}>CS</span>
            </div>
            <span className="font-black text-xl" style={{ color: '#f8fafc' }}>
              Cloud<span style={{ color: '#f59e0b' }}>Scope</span>
            </span>
          </div>

          <h1 className="text-5xl font-black leading-tight mb-6" style={{ color: '#f8fafc' }}>
            Design cloud<br />
            <span style={{ color: '#f59e0b' }}>infrastructure</span><br />
            with confidence
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: '#64748b' }}>
            Diseña, audita y exporta arquitecturas AWS con validación de seguridad en tiempo real y estimación de costos FinOps.
          </p>
        </div>

        {/* Features bullets */}
        <div className="relative z-10 space-y-4">
          {[
            { icon: '⬡', text: 'Lienzo interactivo basado en grafos' },
            { icon: '🛡️', text: 'Auditoría CIS Benchmarks en tiempo real' },
            { icon: '💰', text: 'Estimación FinOps dinámica (AWS Pricing)' },
            { icon: '📦', text: 'Exportación automática a Terraform HCL' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-lg">{icon}</span>
              <span className="text-sm" style={{ color: '#94a3b8' }}>{text}</span>
            </div>
          ))}
        </div>

        <p className="text-xs relative z-10" style={{ color: '#334155' }}>
          © 2026 CloudScope · Universidad Privada de Tacna · SI-784
        </p>
      </div>

      {/* ── Panel derecho: formulario ───────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Logo móvil */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
              <span style={{ color: '#080d18' }}>CS</span>
            </div>
            <span className="font-black text-xl" style={{ color: '#f8fafc' }}>
              Cloud<span style={{ color: '#f59e0b' }}>Scope</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black mb-2" style={{ color: '#f8fafc' }}>Bienvenido</h2>
            <p className="text-sm" style={{ color: '#64748b' }}>Inicia sesión en tu cuenta CloudScope Studio</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
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
                  background: '#0f172a',
                  border: `1px solid ${focusField === 'email' ? '#f59e0b' : '#1e293b'}`,
                  color: '#f8fafc',
                  boxShadow: focusField === 'email' ? '0 0 0 3px rgba(245,158,11,0.1)' : 'none',
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
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
                    background: '#0f172a',
                    border: `1px solid ${focusField === 'password' ? '#f59e0b' : '#1e293b'}`,
                    color: '#f8fafc',
                    boxShadow: focusField === 'password' ? '0 0 0 3px rgba(245,158,11,0.1)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#475569' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#94a3b8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
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
                background: loading ? '#334155' : 'linear-gradient(135deg, #f59e0b, #f97316)',
                color: loading ? '#64748b' : '#080d18',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(245,158,11,0.3)',
                transform: loading ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : 'Iniciar sesión →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: '#1e293b' }} />
            <span className="text-xs" style={{ color: '#334155' }}>o continúa con</span>
            <div className="flex-1 h-px" style={{ background: '#1e293b' }} />
          </div>

          {/* Demo access */}
          <button
            id="login-demo"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: 'transparent',
              border: '1px solid #1e293b',
              color: '#94a3b8',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#e2e8f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            🚀 Acceso Demo (sin cuenta)
          </button>

          {/* Hint credentials */}
          <div className="mt-6 p-3 rounded-xl text-xs space-y-1"
            style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#475569' }}>
            <div className="font-semibold text-slate-500 mb-1">Credenciales de prueba:</div>
            <div>📧 admin@cloudscope.io · 🔑 admin123</div>
            <div>📧 demo@cloudscope.io &nbsp; · 🔑 demo123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
