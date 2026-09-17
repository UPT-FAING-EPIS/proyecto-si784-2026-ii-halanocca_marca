/**
 * Register – Módulo de Registro de Usuarios para CloudScope.
 * Basado en el diseño solicitado: selector de región, nombre, apellido, email, contraseña y Google Sign-up.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CloudScopeLogo } from '../components/icons/CloudIcons.jsx';

function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    region: 'US1',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const { region, firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      // Intentar registro en el backend Spring Boot / PostgreSQL
      let response;
      try {
        response = await axios.post('http://localhost:8080/api/auth/register', {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password: password.trim(),
          region,
        });
      } catch (backendErr) {
        // Fallback local si el backend está desconectado
        console.warn('Backend no disponible, guardando en sesión local:', backendErr.message);
        const devPayload = btoa(JSON.stringify({ sub: email, name: `${firstName} ${lastName}`, role: 'user', exp: Date.now() + 86400000 }));
        response = {
          data: {
            token: devPayload,
            user: { name: `${firstName} ${lastName}`, email, region },
          },
        };
      }

      // Guardar sesión
      if (response.data.token) {
        localStorage.setItem('cs_token', response.data.token);
        localStorage.setItem('cs_user', JSON.stringify(response.data.user));
      }

      // Guardar en la lista de usuarios locales registrados
      const existingUsersRaw = localStorage.getItem('cs_registered_users');
      const registeredUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
      registeredUsers.push({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        name: `${firstName} ${lastName}`,
        region,
      });
      localStorage.setItem('cs_registered_users', JSON.stringify(registeredUsers));

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Error durante el registro.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      const googleUser = {
        name: 'Google Cloud User',
        email: 'user.google@cloudscope.io',
        role: 'user',
        region: formData.region,
      };
      const token = btoa(JSON.stringify({ sub: googleUser.email, name: googleUser.name, exp: Date.now() + 86400000 }));
      localStorage.setItem('cs_token', token);
      localStorage.setItem('cs_user', JSON.stringify(googleUser));
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950 font-sans text-slate-100 selection:bg-purple-500 selection:text-white">
      
      {/* Tarjeta principal estilo Brainboard / CloudScope */}
      <div
        className="w-full max-w-[480px] rounded-2xl p-8 sm:p-10 shadow-2xl transition-all"
        style={{
          background: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Encabezado */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <CloudScopeLogo className="w-8 h-8" />
            <span className="font-black text-xl tracking-tight text-slate-900">
              Cloud<span className="text-amber-500">Scope</span>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            Welcome to CloudScope
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Lets get started with your 21-day free trial. Select your sign-up method
          </p>
        </div>

        {/* Botón de Google */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-150 shadow-sm"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>Google</span>
        </button>

        {/* Separador */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
            or continue with email
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Mensaje de error o éxito */}
        {error && (
          <div className="mb-4 p-3 rounded-xl text-xs font-medium text-red-600 bg-red-50 border border-red-200 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-2">
            <span>✓</span>
            <span>¡Cuenta creada con éxito! Redirigiendo...</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Selector de Región */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Choose the region where you would like your data to be stored.
            </label>
            <div className="relative">
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none cursor-pointer"
              >
                <option value="US1">US1 (United States - East)</option>
                <option value="EU1">EU1 (Europe - Frankfurt)</option>
                <option value="SA1">SA1 (South America - Perú / Sao Paulo)</option>
                <option value="AP1">AP1 (Asia Pacific - Tokyo)</option>
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* First name */}
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          {/* Last name */}
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          {/* Confirm password */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          {/* Botón Register */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            style={{
              background: loading ? '#a855f7' : '#8b5cf6',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#7c3aed')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#8b5cf6')}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
}
