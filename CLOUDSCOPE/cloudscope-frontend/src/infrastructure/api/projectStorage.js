/**
 * projectStorage – Persistencia de proyectos en localStorage.
 * Maneja el guardado, cargado, listado y eliminación de proyectos CloudScope.
 */

import { ARCHITECTURE_PRESETS } from '../../domain/models/ArchitecturePresets.js';

const STORAGE_KEY = 'cloudscope_projects';
const CURRENT_KEY = 'cloudscope_current_project';
const LEGACY_KEY = 'cs_current_project';
const VERSION = '1.0';

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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Inicializar proyectos de ejemplo basados en los presets
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  localStorage.setItem(CURRENT_KEY, project.id);
  localStorage.setItem(LEGACY_KEY, JSON.stringify(project));

  // Sincronización asíncrona no bloqueante con el backend Spring Boot
  try {
    fetch(`http://localhost:8080/api/projects/${project.id}/save`, {
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
    localStorage.setItem(CURRENT_KEY, id);
    localStorage.setItem(LEGACY_KEY, JSON.stringify(project));
  }
  return project;
}

/**
 * Elimina un proyecto por ID.
 * @param {string} id
 */
export function deleteProject(id) {
  const projects = listProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  const currentId = localStorage.getItem(CURRENT_KEY);
  if (currentId === id) {
    localStorage.removeItem(CURRENT_KEY);
    localStorage.removeItem(LEGACY_KEY);
  }
}

/**
 * Obtiene el ID del proyecto actualmente activo.
 * @returns {string|null}
 */
export function getCurrentProjectId() {
  return localStorage.getItem(CURRENT_KEY);
}

/**
 * Obtiene el objeto del proyecto actualmente activo.
 * @returns {CloudProject|null}
 */
export function getCurrentProject() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (raw) {
      const proj = JSON.parse(raw);
      if (proj && proj.id) return proj;
    }
    const curId = localStorage.getItem(CURRENT_KEY);
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
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return reject(new Error('No file selected'));
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const project = JSON.parse(ev.target.result);
          // Validación básica
          if (!project.nodes || !project.edges) throw new Error('Invalid project file');
          // Nuevo ID para evitar colisiones
          project.id = generateProjectId();
          project.name = `${project.name} (imported)`;
          const projects = listProjects();
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...projects, project]));
          resolve(project);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    };
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}
