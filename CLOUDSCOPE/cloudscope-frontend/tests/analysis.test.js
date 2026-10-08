import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCost } from '../src/application/use-cases/calculateCost.js';
import { runAudit } from '../src/application/use-cases/runAudit.js';
import { runBlastRadius } from '../src/application/use-cases/runBlastRadius.js';
import { generateTerraform } from '../src/application/use-cases/generateTerraform.js';
import { computeWhatIf } from '../src/application/use-cases/computeWhatIf.js';

const node = (id, cloudType, config = {}) => ({ id, data: { cloudType, label: id, config } });
test('costs add only recognized resources and keep the graph unchanged', () => {
  const nodes = [node('a', 'ec2', { instanceType: 't3.micro' }), node('b', 'rds'), node('c', 'unknown')];
  const before = JSON.stringify(nodes);
  const result = calculateCost(nodes);
  assert.equal(result.lineItems.length, 2);
  assert.equal(result.total, Math.round(result.lineItems.reduce((sum, item) => sum + item.cost, 0) * 100) / 100);
  assert.ok(result.total > 0);
  assert.equal(JSON.stringify(nodes), before);
});
test('impact follows edge direction, terminates cycles and excludes the origin', () => {
  const nodes = ['a', 'b', 'c', 'isolated'].map(id => node(id, 'ec2'));
  const edges = [{ id: '1', source: 'a', target: 'b' }, { id: '2', source: 'b', target: 'c' },
    { id: '3', source: 'c', target: 'b' }];
  assert.deepEqual(runBlastRadius('a', nodes, edges).affectedNodeIds.sort(), ['b', 'c']);
  assert.deepEqual(runBlastRadius('b', nodes, edges).affectedNodeIds, ['c']);
  assert.equal(runBlastRadius('isolated', nodes, edges).impactScore, 0);
});
test('public database finding disappears after remediation', () => {
  const database = node('db', 'rds', { publiclyAccessible: true });
  assert.ok(runAudit([database], []).findings.some(f => f.ruleId === 'SEC-001'));
  database.data.config.publiclyAccessible = false;
  assert.ok(!runAudit([database], []).findings.some(f => f.ruleId === 'SEC-001'));
});
test('What If compares alternatives without changing original configuration', () => {
  const input = node('a', 'ec2', { instanceType: 't3.micro' });
  const before = JSON.stringify(input);
  const result = computeWhatIf(input, { instanceType: 't3.small' });
  assert.ok(result.delta > 0);
  assert.equal(result.annualDelta, result.delta * 12);
  assert.equal(JSON.stringify(input), before);
});
test('Terraform exports both supported providers', () => {
  const hcl = generateTerraform([node('network', 'vpc'), node('azure', 'azure_vnet')], [], 'test');
  assert.match(hcl, /resource "aws_vpc"/);
  assert.match(hcl, /resource "azurerm_virtual_network"/);
});
