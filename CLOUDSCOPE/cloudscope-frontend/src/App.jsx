/**
 * App – Root component de CloudScope.
 * Sprint 2: Agrega rutas /login, /dashboard, /editor con protección de auth.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './presentation/pages/Login.jsx';
import Dashboard from './presentation/pages/Dashboard.jsx';
import Editor from './presentation/pages/Editor.jsx';

/** Guard de autenticación simple (comprueba token en localStorage) */
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
