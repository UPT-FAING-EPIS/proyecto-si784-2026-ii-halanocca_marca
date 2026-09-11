/**
 * App – Root component de CloudScope.
 * Sprint 2: Agrega rutas /login, /dashboard, /editor con protección de auth.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './presentation/pages/Login.jsx';
import Dashboard from './presentation/pages/Dashboard.jsx';
import Editor from './presentation/pages/Editor.jsx';

// Auto-inject dev token ONLY if running locally and user hasn't explicitly logged out
// (remove this block when the real backend is ready)
const explicitLogout = sessionStorage.getItem('cs_logout');
if (!localStorage.getItem('cs_token') && !explicitLogout) {
  const devPayload = btoa(JSON.stringify({ sub: 'dev@cloudscope.io', name: 'Dev User', role: 'admin', exp: Date.now() + 86400000 }));
  localStorage.setItem('cs_token', devPayload);
  localStorage.setItem('cs_user', JSON.stringify({ email: 'dev@cloudscope.io', name: 'Dev User', role: 'admin' }));
}

/** Guard de autenticación */
function PrivateRoute({ children }) {
  const token = localStorage.getItem('cs_token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/editor" element={
          <PrivateRoute><Editor /></PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
