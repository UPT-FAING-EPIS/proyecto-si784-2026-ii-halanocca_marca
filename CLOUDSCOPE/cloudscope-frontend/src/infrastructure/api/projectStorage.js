/**
 * projectStorage – Persistencia de proyectos en localStorage.
 * Maneja el guardado, cargado, listado y eliminación de proyectos CloudScope.
 */

import { ARCHITECTURE_PRESETS } from '../../domain/models/ArchitecturePresets.js';
import { parseProjectJSON } from './parseProjectJSON.js';

const VERSION = '1.0';

function getStorageKey() {
  const userRaw = localStorage.getItem('cs_user');
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      if (user && user.email) return `cloudscope_projects_${user.email}`;
    } catch {}
  }
  return 'cloudscope_projects';
}

function getCurrentKey() {
  const userRaw = localStorage.getItem('cs_user');
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      if (user && user.email) return `cloudscope_current_project_${user.email}`;
    } catch {}
  }
  return 'cloudscope_current_project';
}

function getLegacyKey() {
  const userRaw = localStorage.getItem('cs_user');
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      if (user && user.email) return `cs_current_project_${user.email}`;
    } catch {}
  }
  return 'cs_current_project';
}

/**
 * @typedef {Object} CloudProject
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} version
 * @property {import('reactflow').Node[]} nodes
 * @property {import('reactflow').Edge[]} edges
 */

/**
 * Genera un ID único para el proyecto.
 */
function generateProjectId() {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtiene todos los proyectos guardados.
 * Si el almacenamiento está vacío, inicializa con las plantillas de referencia.
 * @returns {CloudProject[]}
 */
export function listProjects() {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (raw) {
      const parsed = JSON.parse(raw);
      // Si ya hay un arreglo guardado (incluso vacío), lo devolvemos
      if (Array.isArray(parsed)) return parsed;
    }
    // Inicializar proyectos de ejemplo solo la primera vez que se entra
    const initialProjects = ARCHITECTURE_PRESETS.map((p, idx) => ({
      id: `proj_${p.id}`,
      name: p.name,
      description: p.description,
      createdAt: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - idx * 1800000).toISOString(),
      version: VERSION,
      nodes: p.nodes ?? [],
      edges: p.edges ?? [],
    }));
    localStorage.setItem(getStorageKey(), JSON.stringify(initialProjects));
    return initialProjects;
  } catch {
    return [];
  }
}

/**
 * Guarda (crea o actualiza) un proyecto.
 * @param {string|null} id  - null para crear nuevo
 * @param {string} name
 * @param {string} description
 * @param {import('reactflow').Node[]} nodes
 * @param {import('reactflow').Edge[]} edges
 * @returns {CloudProject} El proyecto guardado
 */
export function saveProject(id, name, description, nodes, edges) {
  const projects = listProjects();
  const now = new Date().toISOString();

  const existing = id ? projects.find(p => p.id === id) : null;

  const project = {
    id: existing?.id ?? generateProjectId(),
    name: name.trim() || 'Untitled Project',
    description: description?.trim() ?? '',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    version: VERSION,
    nodes,
    edges,
  };

  const updated = existing
    ? projects.map(p => p.id === project.id ? project : p)
    : [...projects, project];

  localStorage.setItem(getStorageKey(), JSON.stringify(updated));
  localStorage.setItem(getCurrentKey(), project.id);
  localStorage.setItem(getLegacyKey(), JSON.stringify(project));

  // Sincronización asíncrona no bloqueante con el backend Spring Boot
  try {
    const API_URL = window.location.protocol === 'https:' ? '' : `http://${window.location.hostname}:8080`;
    fetch(`${API_URL}/api/projects/${project.id}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: project.name,
        description: project.description,
        nodes: project.nodes,
        edges: project.edges,
      }),
    }).catch(() => { /* Backend offline: almacenamiento local asegurado */ });
  } catch {
    // Ignorar si el backend no está disponible
  }

  return project;
}

/**
 * Carga un proyecto por ID y lo establece como activo.
 * @param {string} id
 * @returns {CloudProject|null}
 */
export function loadProject(id) {
  const projects = listProjects();
  const project = projects.find(p => p.id === id) ?? null;
  if (project) {
    localStorage.setItem(getCurrentKey(), id);
    localStorage.setItem(getLegacyKey(), JSON.stringify(project));
  }
  return project;
}

/**
 * Elimina un proyecto por ID.
 * @param {string} id
 */
export function deleteProject(id) {
  const projects = listProjects().filter(p => p.id !== id);
  localStorage.setItem(getStorageKey(), JSON.stringify(projects));
  const currentId = localStorage.getItem(getCurrentKey());
  if (currentId === id) {
    localStorage.removeItem(getCurrentKey());
    localStorage.removeItem(getLegacyKey());
  }
}

/**
 * Obtiene el ID del proyecto actualmente activo.
 * @returns {string|null}
 */
export function getCurrentProjectId() {
  return localStorage.getItem(getCurrentKey());
}

/**
 * Obtiene el objeto del proyecto actualmente activo.
 * @returns {CloudProject|null}
 */
export function getCurrentProject() {
  try {
    const raw = localStorage.getItem(getLegacyKey());
    if (raw) {
      const proj = JSON.parse(raw);
      if (proj && proj.id) return proj;
    }
    const curId = localStorage.getItem(getCurrentKey());
    if (curId) {
      const projects = listProjects();
      return projects.find(p => p.id === curId) ?? null;
    }
  } catch (err) {
    console.error('Error fetching current project', err);
  }
  return null;
}

/**
 * Exporta un proyecto como archivo JSON descargable.
 * @param {CloudProject} project
 */
export function exportProjectJSON(project) {
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, '_')}_cloudscope.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Importa un proyecto desde un archivo JSON.
 * @returns {Promise<CloudProject>}
 */
export function importProjectJSON() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.hidden = true;
    let settled = false;
    let reading = false;
    let focusTimer;
    const finish = (error, project = null) => {
      if (settled) return;
      settled = true;
      clearTimeout(focusTimer);
      window.removeEventListener('focus', onFocus);
      input.remove();
      if (error) reject(error);
      else resolve(project);
    };
    const onFocus = () => {
      // Fallback for browsers without the file input cancel event.
      focusTimer = setTimeout(() => {
        if (!reading && !input.files?.length) finish(null);
      }, 500);
    };
    input.oncancel = () => finish(null);
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return finish(null);
      reading = true;
      if (file.size > 10 * 1024 * 1024) {
        return finish(new Error('El archivo supera el límite de 10 MB.'));
      }
      const reader = new FileReader();
      reader.onerror = () => finish(new Error('No se pudo leer el archivo seleccionado.'));
      reader.onabort = () => finish(null);
      reader.onload = (ev) => {
        try {
          const project = parseProjectJSON(ev.target.result, file.name);
          project.id = generateProjectId();
          project.name = `${project.name} (importado)`;
          // Never overwrite unreadable existing storage with an empty list.
          const raw = localStorage.getItem(getStorageKey());
          const projects = raw === null ? listProjects() : JSON.parse(raw);
          if (!Array.isArray(projects)) {
            throw new Error('No se pueden leer los proyectos guardados. No se modificó su contenido.');
          }
          localStorage.setItem(getStorageKey(), JSON.stringify([...projects, project]));
          finish(null, project);
        } catch (err) {
          finish(err?.name === 'QuotaExceededError'
            ? new Error('No hay espacio disponible en el navegador para importar este proyecto.')
            : err);
        }
      };
      try { reader.readAsText(file); } catch (err) { finish(err); }
    };
    document.body.appendChild(input);
    window.addEventListener('focus', onFocus);
    try { input.click(); } catch (err) { finish(err); }
  });
}
