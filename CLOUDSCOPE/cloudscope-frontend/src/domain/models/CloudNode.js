/**
 * CloudNode – Modelo de dominio para un componente de infraestructura cloud.
 * Representa cualquier recurso que puede ser colocado en el lienzo de CloudScope.
 */

/** @typedef {'ec2'|'lambda'|'rds'|'s3'|'vpc'|'subnet'|'alb'|'igw'|'sg'} CloudNodeType */

/**
 * Catálogo de tipos de nodo disponibles con sus metadatos.
 * Precio en USD/mes (estimación base para AWS us-east-1).
 */
export const NODE_CATALOG = {
  vpc: {
    type: 'vpc',
    label: 'VPC',
    category: 'Networking',
    description: 'Virtual Private Cloud',
    baseCostPerMonth: 0,
    color: '#8b5cf6',    // purple
    bgColor: 'rgba(139,92,246,0.12)',
    borderColor: 'rgba(139,92,246,0.4)',
    icon: 'VPC',
    provider: 'aws',
    configSchema: {
      cidr: { label: 'CIDR Block', type: 'text', default: '10.0.0.0/16' },
      enableDnsHostnames: { label: 'Enable DNS Hostnames', type: 'boolean', default: true },
    },
  },
  subnet: {
    type: 'subnet',
    label: 'Subnet',
    category: 'Networking',
    description: 'Public or Private Subnet',
    baseCostPerMonth: 0,
    color: '#a78bfa',
    bgColor: 'rgba(167,139,250,0.12)',
    borderColor: 'rgba(167,139,250,0.35)',
    icon: 'SN',
    provider: 'aws',
    configSchema: {
      cidr: { label: 'CIDR Block', type: 'text', default: '10.0.1.0/24' },
      isPublic: { label: 'Public Subnet', type: 'boolean', default: false },
      availabilityZone: { label: 'Availability Zone', type: 'select', default: 'us-east-1a', options: ['us-east-1a','us-east-1b','us-east-1c'] },
    },
  },
  igw: {
    type: 'igw',
    label: 'Internet Gateway',
    category: 'Networking',
    description: 'Internet Gateway – acceso público a la VPC',
    baseCostPerMonth: 0,
    color: '#06b6d4',
    bgColor: 'rgba(6,182,212,0.12)',
    borderColor: 'rgba(6,182,212,0.35)',
    icon: 'IGW',
    provider: 'aws',
    configSchema: {},
  },
  alb: {
    type: 'alb',
    label: 'App Load Balancer',
    category: 'Networking',
    description: 'Application Load Balancer (L7)',
    baseCostPerMonth: 16.20,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.35)',
    icon: 'ALB',
    provider: 'aws',
    configSchema: {
      scheme: { label: 'Scheme', type: 'select', default: 'internet-facing', options: ['internet-facing','internal'] },
    },
  },
  ec2: {
    type: 'ec2',
    label: 'EC2 Instance',
    category: 'Compute & Serverless',
    description: 'Virtual Machine (IaaS)',
    baseCostPerMonth: 14.50,
    color: '#f97316',
    bgColor: 'rgba(249,115,22,0.12)',
    borderColor: 'rgba(249,115,22,0.35)',
    icon: 'EC2',
    provider: 'aws',
    configSchema: {
      instanceType: {
        label: 'Instance Type', type: 'select', default: 't3.micro',
        options: ['t3.micro','t3.small','t3.medium','t3.large','m5.large','m5.xlarge','c5.large'],
      },
      os: { label: 'OS', type: 'select', default: 'Amazon Linux 2', options: ['Amazon Linux 2','Ubuntu 22.04','Windows Server 2022'] },
    },
  },
  lambda: {
    type: 'lambda',
    label: 'AWS Lambda',
    category: 'Compute & Serverless',
    description: 'Function as a Service (FaaS)',
    baseCostPerMonth: 2.50,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.35)',
    icon: 'λ',
    provider: 'aws',
    configSchema: {
      runtime: { label: 'Runtime', type: 'select', default: 'python3.12', options: ['python3.12','nodejs20.x','java21','go1.x'] },
      memory: { label: 'Memory (MB)', type: 'select', default: '512', options: ['128','256','512','1024','2048','3008'] },
    },
  },
  rds: {
    type: 'rds',
    label: 'RDS Database',
    category: 'Storage & Databases',
    description: 'Managed Relational Database',
    baseCostPerMonth: 25.74,
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.12)',
    borderColor: 'rgba(59,130,246,0.35)',
    icon: 'RDS',
    provider: 'aws',
    configSchema: {
      engine: { label: 'Engine', type: 'select', default: 'postgres', options: ['postgres','mysql','mariadb','aurora-postgresql'] },
      instanceClass: { label: 'Instance Class', type: 'select', default: 'db.t3.micro', options: ['db.t3.micro','db.t3.small','db.t3.medium','db.m5.large'] },
      multiAz: { label: 'Multi-AZ', type: 'boolean', default: false },
      publiclyAccessible: { label: 'Publicly Accessible', type: 'boolean', default: false },
    },
  },
  s3: {
    type: 's3',
    label: 'S3 Bucket',
    category: 'Storage & Databases',
    description: 'Object Storage',
    baseCostPerMonth: 2.30,
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.35)',
    icon: 'S3',
    provider: 'aws',
    configSchema: {
      versioning: { label: 'Versioning', type: 'boolean', default: false },
      publicAccess: { label: 'Block Public Access', type: 'boolean', default: true },
      encryption: { label: 'Server-Side Encryption', type: 'boolean', default: true },
    },
  },
};

/**
 * Obtiene los metadatos del catálogo para un tipo de nodo.
 * @param {CloudNodeType} type
 */
export function getNodeMeta(type) {
  return NODE_CATALOG[type] ?? null;
}

/**
 * Obtiene el costo mensual estimado de un nodo según su tipo y config.
 * @param {string} type
 * @param {Object} config
 * @returns {number}
 */
export function getNodeCost(type, config = {}) {
  const meta = getNodeMeta(type);
  if (!meta) return 0;

  let cost = meta.baseCostPerMonth;

  // Multiplicadores por tipo de instancia (EC2)
  if (type === 'ec2') {
    const multipliers = {
      't3.micro': 1, 't3.small': 1.5, 't3.medium': 3,
      't3.large': 6, 'm5.large': 8, 'm5.xlarge': 16, 'c5.large': 7,
    };
    cost = 14.50 * (multipliers[config.instanceType] ?? 1);
  }

  // Multi-AZ duplica el costo de RDS
  if (type === 'rds' && config.multiAz) {
    cost *= 2;
  }

  return Math.round(cost * 100) / 100;
}

/**
 * Agrupa los tipos de nodo del catálogo por categoría.
 * @returns {Record<string, Array>}
 */
export function getNodesByCategory() {
  const groups = {};
  for (const meta of Object.values(NODE_CATALOG)) {
    if (!groups[meta.category]) groups[meta.category] = [];
    groups[meta.category].push(meta);
  }
  return groups;
}
