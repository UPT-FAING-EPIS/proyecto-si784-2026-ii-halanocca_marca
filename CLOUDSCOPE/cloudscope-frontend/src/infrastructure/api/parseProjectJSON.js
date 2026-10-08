const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validId = value => typeof value === 'string' && value.trim().length > 0;

/** Validate before saving, while preserving React Flow styles and UML metadata. */
export function parseProjectJSON(text, fileName = 'Proyecto') {
  let project;
  try {
    project = JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch {
    throw new Error('El archivo no contiene JSON válido.');
  }
  if (!isObject(project) || !Array.isArray(project.nodes) || !Array.isArray(project.edges)) {
    throw new Error('El proyecto debe contener las listas nodes y edges.');
  }
  const ids = new Set();
  const nodeTypes = new Set(['cloudNode', 'default', 'input', 'output', 'group']);
  const nodes = project.nodes.map((node, index) => {
    if (!isObject(node) || !validId(node.id) || ids.has(node.id)) {
      throw new Error(`El nodo ${index + 1} tiene un identificador vacío o repetido.`);
    }
    ids.add(node.id);
    if (!isObject(node.position) || !Number.isFinite(node.position.x) || !Number.isFinite(node.position.y)) {
      throw new Error(`El nodo ${node.id} no tiene una posición válida.`);
    }
    const type = node.type ?? (node.data?.cloudType ? 'cloudNode' : 'default');
    if (!nodeTypes.has(type)) throw new Error(`Tipo de nodo no compatible: ${type}.`);
    const data = isObject(node.data) ? node.data : {};
    if (type === 'cloudNode' && !validId(data.cloudType)) {
      throw new Error(`El nodo ${node.id} no indica su tipo de recurso (cloudType).`);
    }
    return {
      ...node, type, selected: false,
      data: {
        ...data,
        cloudType: typeof data.cloudType === 'string' ? data.cloudType : 'block',
        label: typeof data.label === 'string' ? data.label : node.id,
        config: isObject(data.config) ? data.config : {},
      },
    };
  });
  const edgeIds = new Set();
  const edges = project.edges.map((edge, index) => {
    if (!isObject(edge) || !validId(edge.id) || edgeIds.has(edge.id)) {
      throw new Error(`La conexión ${index + 1} tiene un identificador vacío o repetido.`);
    }
    edgeIds.add(edge.id);
    if (!ids.has(edge.source) || !ids.has(edge.target)) {
      throw new Error(`La conexión ${edge.id} apunta a un nodo inexistente.`);
    }
    if (edge.label != null && typeof edge.label !== 'string' && typeof edge.label !== 'number') {
      throw new Error(`La conexión ${edge.id} tiene una etiqueta inválida.`);
    }
    return { ...edge, selected: false };
  });
  const now = new Date().toISOString();
  return {
    ...project,
    name: typeof project.name === 'string' && project.name.trim()
      ? project.name.trim() : fileName.replace(/\.json$/i, '') || 'Proyecto',
    description: typeof project.description === 'string' ? project.description : '',
    version: typeof project.version === 'string' ? project.version : '1.0',
    createdAt: typeof project.createdAt === 'string' ? project.createdAt : now,
    updatedAt: now, nodes, edges,
  };
}
