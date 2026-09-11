/**
 * App – Root component de CloudScope.
 * Configura el Router y monta el Editor como página principal.
 * Cuando se agreguen más rutas (login, dashboard) se agregan aquí.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Editor from './presentation/pages/Editor.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: Editor/lienzo interactivo */}
        <Route path="/" element={<Editor />} />
        <Route path="/editor" element={<Editor />} />

        {/* Redirect para rutas no reconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
