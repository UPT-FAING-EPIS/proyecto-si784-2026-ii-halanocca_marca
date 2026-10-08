import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { parseProjectJSON } from '../src/infrastructure/api/parseProjectJSON.js';

const sample = JSON.parse(readFileSync(new URL('./fixtures/uml-project.json', import.meta.url), 'utf8'));
const source = readFileSync(new URL('../src/infrastructure/api/projectStorage.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?\n/gm, '').replace(/export function /g, 'function ');
function browser({ failure, stored = '[{"id":"existing","name":"Original"}]' } = {}) {
  const storage = new Map([['cloudscope_projects', stored]]);
  let input;
  let attached = false;
  const listeners = new Set();
  const context = vm.createContext({
    parseProjectJSON, ARCHITECTURE_PRESETS: [], setTimeout, clearTimeout,
    window: { addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) },
    document: {
      createElement: () => (input = { files: [], click() {}, remove() { attached = false; } }),
      body: { appendChild() { attached = true; } },
    },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => {
        if (failure === 'quota') throw Object.assign(new Error(), { name: 'QuotaExceededError' });
        storage.set(key, value);
      },
    },
    FileReader: class {
      readAsText(file) {
        if (failure === 'read') this.onerror();
        else this.onload({ target: { result: file.text } });
      }
    },
  });
  vm.runInContext(source, context);
  return { storage, listeners, get input() { return input; }, get attached() { return attached; },
    import: () => vm.runInContext('importProjectJSON()', context),
    select(text = JSON.stringify(sample)) {
      input.files = [{ text, name: 'classes.json', size: text.length }];
      input.onchange({ target: input });
    },
  };
}

test('UML export keeps labels, styles, metadata and connections; BOM is accepted', () => {
  const result = parseProjectJSON('\uFEFF' + JSON.stringify(sample));
  assert.equal(result.nodes.length, 7);
  assert.deepEqual(result.nodes[0].style, sample.nodes[0].style);
  assert.deepEqual(result.nodes[0].data.uml, sample.nodes[0].data.uml);
  assert.equal(result.nodes[0].type, 'default');
  assert.equal(result.edges.length, 5);
});
test('rejects malformed graphs before persistence', () => {
  for (const value of [null, {}, { nodes: {}, edges: [] },
    { ...sample, nodes: [...sample.nodes, sample.nodes[0]] },
    { ...sample, edges: [{ id: 'bad', source: 'missing', target: sample.nodes[0].id }] },
    { ...sample, nodes: [{ ...sample.nodes[0], position: {} }] }]) {
    assert.throws(() => parseProjectJSON(JSON.stringify(value)));
  }
  assert.throws(() => parseProjectJSON('{bad'), /JSON válido/);
});
test('picker stays attached until selection, adds a new project without overwriting existing', async () => {
  const b = browser(); const pending = b.import();
  assert.equal(b.attached, true);
  b.select(); const result = await pending;
  assert.notEqual(result.id, sample.id);
  assert.equal(JSON.parse(b.storage.get('cloudscope_projects'))[0].id, 'existing');
  assert.equal(JSON.parse(b.storage.get('cloudscope_projects')).length, 2);
  assert.equal(b.attached, false); assert.equal(b.listeners.size, 0);
});
test('cancel closes cleanly without changing saved projects', async () => {
  const b = browser(); const before = b.storage.get('cloudscope_projects');
  const pending = b.import(); b.input.oncancel();
  assert.equal(await pending, null); assert.equal(b.attached, false);
  assert.equal(b.storage.get('cloudscope_projects'), before);
});
test('read errors settle the promise and remove picker', async () => {
  const b = browser({ failure: 'read' }); const pending = b.import(); b.select();
  await assert.rejects(pending, /leer el archivo/); assert.equal(b.attached, false);
});
test('quota error preserves existing projects', async () => {
  const b = browser({ failure: 'quota' }); const before = b.storage.get('cloudscope_projects');
  const pending = b.import(); b.select(); await assert.rejects(pending, /espacio/);
  assert.equal(b.storage.get('cloudscope_projects'), before);
});
test('invalid file and corrupt existing storage are never persisted', async () => {
  for (const stored of ['not json', '{}']) {
    const b = browser({ stored }); const pending = b.import(); b.select();
    await assert.rejects(pending); assert.equal(b.storage.get('cloudscope_projects'), stored);
  }
  const b = browser(); const pending = b.import(); b.select('{"nodes":{}}');
  await assert.rejects(pending, /listas nodes y edges/);
  assert.equal(JSON.parse(b.storage.get('cloudscope_projects')).length, 1);
});
test('cloud node defaults and unnamed files are normalized', () => {
  const result = parseProjectJSON(JSON.stringify({ nodes: [{ id: 'a', position: { x: 1, y: 2 }, data: { cloudType: 'ec2' } }], edges: [] }), 'demo.json');
  assert.equal(result.nodes[0].type, 'cloudNode');
  assert.equal(result.nodes[0].data.label, 'a');
  assert.equal(result.name, 'demo');
});
