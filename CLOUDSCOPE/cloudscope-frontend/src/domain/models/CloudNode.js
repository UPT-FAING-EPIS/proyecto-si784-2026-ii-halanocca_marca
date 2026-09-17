/**
 * CloudNode – Modelo de dominio para un componente de infraestructura cloud.
 * Soporta arquitectura Multi-Cloud: AWS, Azure, Oracle y Google Cloud (RF-02).
 */

/** 
 * @typedef {'ec2'|'lambda'|'rds'|'s3'|'vpc'|'subnet'|'alb'|'igw'|
 *           'azure_vnet'|'azure_subnet'|'azure_appgw'|'azure_vm'|'azure_function'|'azure_sql'|'azure_blob'|
 *           'oci_vcn'|'oci_subnet'|'oci_lb'|'oci_compute'|'oci_functions'|'oci_autonomous_db'|'oci_object_storage'|
 *           'gcp_vpc'|'gcp_subnet'|'gcp_lb'|'gcp_gce'|'gcp_cloudfunction'|'gcp_cloudsql'|'gcp_gcs'} CloudNodeType 
 */

/**
 * Catálogo de tipos de nodo disponibles con sus metadatos.
 * Precio base en USD/mes (estimación en us-east / eastus).
 */
export const NODE_CATALOG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // Common Components (Brainboard style)
  // ═══════════════════════════════════════════════════════════════════════════
  block: {
    type: 'block',
    label: 'BLOCK',
    category: 'Common',
    description: 'Generic resource container block',
    baseCostPerMonth: 0,
    color: '#0284c7',
    bgColor: 'rgba(2,132,199,0.12)',
    borderColor: 'rgba(2,132,199,0.4)',
    icon: 'BLK',
    provider: 'common',
    configSchema: {
      notes: { label: 'Block Note', type: 'text', default: 'Architecture Block' },
    },
  },
  text_label: {
    type: 'text_label',
    label: 'TEXT LABEL',
    category: 'Common',
    description: 'Architecture label or annotation',
    baseCostPerMonth: 0,
    color: '#0284c7',
    bgColor: 'rgba(2,132,199,0.12)',
    borderColor: 'rgba(2,132,199,0.4)',
    icon: 'TXT',
    provider: 'common',
    configSchema: {
      text: { label: 'Label Text', type: 'text', default: 'Text Label' },
    },
  },
  icon: {
    type: 'icon',
    label: 'ICON',
    category: 'Common',
    description: 'Custom architectural icon',
    baseCostPerMonth: 0,
    color: '#0284c7',
    bgColor: 'rgba(2,132,199,0.12)',
    borderColor: 'rgba(2,132,199,0.4)',
    icon: 'ICO',
    provider: 'common',
    configSchema: {},
  },
  image: {
    type: 'image',
    label: 'IMAGE',
    category: 'Common',
    description: 'Custom architecture graphic / image',
    baseCostPerMonth: 0,
    color: '#0284c7',
    bgColor: 'rgba(2,132,199,0.12)',
    borderColor: 'rgba(2,132,199,0.4)',
    icon: 'IMG',
    provider: 'common',
    configSchema: {},
  },
  area: {
    type: 'area',
    label: 'AREA',
    category: 'Common',
    description: 'Group boundary / security zone box',
    baseCostPerMonth: 0,
    color: '#0284c7',
    bgColor: 'rgba(2,132,199,0.12)',
    borderColor: 'rgba(2,132,199,0.4)',
    icon: 'ARA',
    provider: 'common',
    configSchema: {
      zoneName: { label: 'Zone Name', type: 'text', default: 'Public Subnet Zone' },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AWS (Amazon Web Services)
  // ═══════════════════════════════════════════════════════════════════════════
  auto_scaling: {
    type: 'auto_scaling',
    label: 'AUTO SCALING',
    category: 'Compute',
    description: 'Auto scale EC2 group capacity',
    baseCostPerMonth: 0,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.4)',
    icon: 'ASG',
    provider: 'aws',
    configSchema: {
      minSize: { label: 'Min Capacity', type: 'select', default: '1', options: ['1', '2', '4'] },
      maxSize: { label: 'Max Capacity', type: 'select', default: '4', options: ['2', '4', '8', '16'] },
    },
  },
  zone: {
    type: 'zone',
    label: 'ZONE',
    category: 'Compute',
    description: 'Availability zone',
    baseCostPerMonth: 0,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.4)',
    icon: 'AZ',
    provider: 'aws',
    configSchema: {
      zone: { label: 'Zone', type: 'select', default: 'us-east-1a', options: ['us-east-1a', 'us-east-1b', 'us-east-1c'] },
    },
  },
  ecs_cluster: {
    type: 'ecs_cluster',
    label: 'ECS CLUSTER',
    category: 'Containers',
    description: 'Logical grouping of tasks or services',
    baseCostPerMonth: 0,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.4)',
    icon: 'ECS',
    provider: 'aws',
    configSchema: {},
  },
  ecs_service: {
    type: 'ecs_service',
    label: 'ECS SERVICE',
    category: 'Containers',
    description: 'Run a specified number of tasks',
    baseCostPerMonth: 12.00,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.4)',
    icon: 'SVC',
    provider: 'aws',
    configSchema: {
      desiredCount: { label: 'Desired Tasks', type: 'select', default: '2', options: ['1', '2', '4', '8'] },
    },
  },
  vpc: {
    type: 'vpc',
    label: 'VPC',
    category: 'Networking',
    description: 'Virtual Private Cloud (AWS)',
    baseCostPerMonth: 0,
    color: '#8b5cf6',
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
    description: 'Public / Private Subnet (AWS)',
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
    description: 'Internet Gateway (AWS)',
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
    description: 'Application Load Balancer L7 (AWS)',
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
    description: 'Elastic Compute Cloud VM (AWS)',
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
    description: 'Serverless Function (AWS)',
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
    description: 'Relational Database Service (AWS)',
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
    description: 'Simple Storage Service (AWS)',
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

  // ═══════════════════════════════════════════════════════════════════════════
  // AZURE (Microsoft Azure)
  // ═══════════════════════════════════════════════════════════════════════════
  azure_vnet: {
    type: 'azure_vnet',
    label: 'Azure VNet',
    category: 'Networking',
    description: 'Virtual Network (Azure)',
    baseCostPerMonth: 0,
    color: '#0078d4',
    bgColor: 'rgba(0,120,212,0.12)',
    borderColor: 'rgba(0,120,212,0.4)',
    icon: 'VNet',
    provider: 'azure',
    configSchema: {
      addressSpace: { label: 'Address Space', type: 'text', default: '10.1.0.0/16' },
    },
  },
  azure_subnet: {
    type: 'azure_subnet',
    label: 'Azure Subnet',
    category: 'Networking',
    description: 'VNet Subnet (Azure)',
    baseCostPerMonth: 0,
    color: '#50e6ff',
    bgColor: 'rgba(80,230,255,0.12)',
    borderColor: 'rgba(80,230,255,0.35)',
    icon: 'Subnet',
    provider: 'azure',
    configSchema: {
      addressPrefix: { label: 'Address Prefix', type: 'text', default: '10.1.1.0/24' },
      isPublic: { label: 'Public Subnet', type: 'boolean', default: false },
    },
  },
  azure_appgw: {
    type: 'azure_appgw',
    label: 'App Gateway',
    category: 'Networking',
    description: 'Application Gateway L7 (Azure)',
    baseCostPerMonth: 18.50,
    color: '#0078d4',
    bgColor: 'rgba(0,120,212,0.12)',
    borderColor: 'rgba(0,120,212,0.4)',
    icon: 'AGW',
    provider: 'azure',
    configSchema: {
      sku: { label: 'SKU Tier', type: 'select', default: 'Standard_v2', options: ['Standard_v2', 'WAF_v2'] },
    },
  },
  azure_vm: {
    type: 'azure_vm',
    label: 'Azure VM',
    category: 'Compute & Serverless',
    description: 'Virtual Machine (Azure)',
    baseCostPerMonth: 15.20,
    color: '#008ad7',
    bgColor: 'rgba(0,138,215,0.12)',
    borderColor: 'rgba(0,138,215,0.4)',
    icon: 'VM',
    provider: 'azure',
    configSchema: {
      size: { label: 'VM Size', type: 'select', default: 'Standard_B1s', options: ['Standard_B1s', 'Standard_B2s', 'Standard_D2s_v3', 'Standard_D4s_v3'] },
      os: { label: 'OS', type: 'select', default: 'Ubuntu 22.04 LTS', options: ['Ubuntu 22.04 LTS', 'Windows Server 2022'] },
    },
  },
  azure_function: {
    type: 'azure_function',
    label: 'Azure Function',
    category: 'Compute & Serverless',
    description: 'Serverless Functions (Azure)',
    baseCostPerMonth: 2.80,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.4)',
    icon: 'Func',
    provider: 'azure',
    configSchema: {
      runtime: { label: 'Runtime', type: 'select', default: 'Node.js 20', options: ['Node.js 20', 'Python 3.11', '.NET 8'] },
    },
  },
  azure_sql: {
    type: 'azure_sql',
    label: 'Azure SQL DB',
    category: 'Storage & Databases',
    description: 'Managed SQL Database (Azure)',
    baseCostPerMonth: 27.50,
    color: '#0078d4',
    bgColor: 'rgba(0,120,212,0.12)',
    borderColor: 'rgba(0,120,212,0.4)',
    icon: 'SQL',
    provider: 'azure',
    configSchema: {
      tier: { label: 'Service Tier', type: 'select', default: 'Basic', options: ['Basic', 'Standard_S1', 'GeneralPurpose_GP_Gen5_2'] },
      zoneRedundant: { label: 'Zone Redundant (HA)', type: 'boolean', default: false },
      publicAccess: { label: 'Public Network Access', type: 'boolean', default: false },
    },
  },
  azure_blob: {
    type: 'azure_blob',
    label: 'Azure Blob Storage',
    category: 'Storage & Databases',
    description: 'Blob Object Storage (Azure)',
    baseCostPerMonth: 2.50,
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.4)',
    icon: 'Blob',
    provider: 'azure',
    configSchema: {
      replication: { label: 'Replication', type: 'select', default: 'LRS', options: ['LRS', 'ZRS', 'GRS'] },
      publicBlobAccess: { label: 'Allow Public Blob Access', type: 'boolean', default: false },
      versioning: { label: 'Versioning Enabled', type: 'boolean', default: true },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GCP (Google Cloud Platform)
  // ═══════════════════════════════════════════════════════════════════════════
  gcp_vpc: {
    type: 'gcp_vpc',
    label: 'GCP VPC Network',
    category: 'Networking',
    description: 'Virtual Private Cloud (GCP)',
    baseCostPerMonth: 0,
    color: '#ea4335',
    bgColor: 'rgba(234,67,53,0.12)',
    borderColor: 'rgba(234,67,53,0.4)',
    icon: 'VPC',
    provider: 'gcp',
    configSchema: {
      subnetMode: { label: 'Subnet Mode', type: 'select', default: 'custom', options: ['custom', 'auto'] },
    },
  },
  gcp_subnet: {
    type: 'gcp_subnet',
    label: 'Cloud Subnet',
    category: 'Networking',
    description: 'Regional VPC Subnet (GCP)',
    baseCostPerMonth: 0,
    color: '#fbbc05',
    bgColor: 'rgba(251,188,5,0.12)',
    borderColor: 'rgba(251,188,5,0.4)',
    icon: 'Subnet',
    provider: 'gcp',
    configSchema: {
      ipRange: { label: 'IP Range', type: 'text', default: '10.128.0.0/20' },
      isPublic: { label: 'Public Access', type: 'boolean', default: false },
    },
  },
  gcp_lb: {
    type: 'gcp_lb',
    label: 'Cloud Load Balancing',
    category: 'Networking',
    description: 'Global HTTP(S) Load Balancer (GCP)',
    baseCostPerMonth: 18.00,
    color: '#4285f4',
    bgColor: 'rgba(66,133,244,0.12)',
    borderColor: 'rgba(66,133,244,0.4)',
    icon: 'CLB',
    provider: 'gcp',
    configSchema: {
      tier: { label: 'Network Tier', type: 'select', default: 'PREMIUM', options: ['PREMIUM', 'STANDARD'] },
    },
  },
  gcp_gce: {
    type: 'gcp_gce',
    label: 'Compute Engine VM',
    category: 'Compute & Serverless',
    description: 'Virtual Machine Instance (GCP)',
    baseCostPerMonth: 14.80,
    color: '#4285f4',
    bgColor: 'rgba(66,133,244,0.12)',
    borderColor: 'rgba(66,133,244,0.4)',
    icon: 'GCE',
    provider: 'gcp',
    configSchema: {
      machineType: { label: 'Machine Type', type: 'select', default: 'e2-micro', options: ['e2-micro', 'e2-small', 'e2-medium', 'e2-standard-2'] },
      os: { label: 'Boot Disk OS', type: 'select', default: 'Debian 12', options: ['Debian 12', 'Ubuntu 22.04 LTS', 'Rocky Linux 9'] },
    },
  },
  gcp_cloudfunction: {
    type: 'gcp_cloudfunction',
    label: 'Cloud Functions',
    category: 'Compute & Serverless',
    description: 'Serverless Functions (GCP)',
    baseCostPerMonth: 2.20,
    color: '#34a853',
    bgColor: 'rgba(52,168,83,0.12)',
    borderColor: 'rgba(52,168,83,0.4)',
    icon: 'CFn',
    provider: 'gcp',
    configSchema: {
      runtime: { label: 'Runtime', type: 'select', default: 'nodejs20', options: ['nodejs20', 'python311', 'go121'] },
    },
  },
  gcp_cloudsql: {
    type: 'gcp_cloudsql',
    label: 'Cloud SQL',
    category: 'Storage & Databases',
    description: 'Managed PostgreSQL/MySQL (GCP)',
    baseCostPerMonth: 26.10,
    color: '#4285f4',
    bgColor: 'rgba(66,133,244,0.12)',
    borderColor: 'rgba(66,133,244,0.4)',
    icon: 'SQL',
    provider: 'gcp',
    configSchema: {
      databaseVersion: { label: 'Engine', type: 'select', default: 'POSTGRES_15', options: ['POSTGRES_15', 'MYSQL_8_0'] },
      tier: { label: 'Tier', type: 'select', default: 'db-f1-micro', options: ['db-f1-micro', 'db-g1-small', 'db-custom-2-7680'] },
      highAvailability: { label: 'High Availability (HA)', type: 'boolean', default: false },
      publicIp: { label: 'Authorized Public Networks', type: 'boolean', default: false },
    },
  },
  gcp_gcs: {
    type: 'gcp_gcs',
    label: 'Cloud Storage Bucket',
    category: 'Storage & Databases',
    description: 'Cloud Storage (GCP)',
    baseCostPerMonth: 2.40,
    color: '#ea4335',
    bgColor: 'rgba(234,67,53,0.12)',
    borderColor: 'rgba(234,67,53,0.4)',
    icon: 'GCS',
    provider: 'gcp',
    configSchema: {
      storageClass: { label: 'Storage Class', type: 'select', default: 'STANDARD', options: ['STANDARD', 'NEARLINE', 'COLDLINE'] },
      uniformAccess: { label: 'Uniform Bucket Access', type: 'boolean', default: true },
      versioning: { label: 'Versioning', type: 'boolean', default: false },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Oracle Cloud Infrastructure (OCI)
  // ═══════════════════════════════════════════════════════════════════════════
  oci_vcn: {
    type: 'oci_vcn',
    label: 'OCI VCN',
    category: 'Networking',
    description: 'Virtual Cloud Network (Oracle)',
    baseCostPerMonth: 0,
    color: '#f80000',
    bgColor: 'rgba(248,0,0,0.12)',
    borderColor: 'rgba(248,0,0,0.4)',
    icon: 'VCN',
    provider: 'oracle',
    configSchema: {
      cidr: { label: 'CIDR Block', type: 'text', default: '10.0.0.0/16' },
      dnsLabel: { label: 'DNS Label', type: 'text', default: 'cloudscopevcn' },
    },
  },
  oci_subnet: {
    type: 'oci_subnet',
    label: 'OCI Subnet',
    category: 'Networking',
    description: 'Regional VCN Subnet (Oracle)',
    baseCostPerMonth: 0,
    color: '#ea580c',
    bgColor: 'rgba(234,88,12,0.12)',
    borderColor: 'rgba(234,88,12,0.4)',
    icon: 'Subnet',
    provider: 'oracle',
    configSchema: {
      cidr: { label: 'CIDR Block', type: 'text', default: '10.0.1.0/24' },
      isPublic: { label: 'Public Subnet', type: 'boolean', default: false },
    },
  },
  oci_lb: {
    type: 'oci_lb',
    label: 'Flexible Load Balancer',
    category: 'Networking',
    description: 'OCI Flexible Load Balancer (Oracle)',
    baseCostPerMonth: 16.50,
    color: '#f80000',
    bgColor: 'rgba(248,0,0,0.12)',
    borderColor: 'rgba(248,0,0,0.4)',
    icon: 'LB',
    provider: 'oracle',
    configSchema: {
      bandwidth: { label: 'Bandwidth (Mbps)', type: 'select', default: '100Mbps', options: ['100Mbps', '400Mbps', '8000Mbps'] },
      isPrivate: { label: 'Private Load Balancer', type: 'boolean', default: false },
    },
  },
  oci_compute: {
    type: 'oci_compute',
    label: 'Compute Instance (VM)',
    category: 'Compute & Serverless',
    description: 'OCI Compute VM Instance (Oracle)',
    baseCostPerMonth: 15.00,
    color: '#c74634',
    bgColor: 'rgba(199,70,52,0.12)',
    borderColor: 'rgba(199,70,52,0.4)',
    icon: 'VM',
    provider: 'oracle',
    configSchema: {
      shape: { label: 'Shape', type: 'select', default: 'VM.Standard.E4.Flex', options: ['VM.Standard.E4.Flex', 'VM.Standard.A1.Flex', 'VM.Standard3.Flex'] },
      ocpus: { label: 'OCPUs', type: 'select', default: '2', options: ['1', '2', '4', '8'] },
      memoryGb: { label: 'Memory (GB)', type: 'select', default: '16', options: ['8', '16', '32', '64'] },
      os: { label: 'Operating System', type: 'select', default: 'Oracle Linux 9', options: ['Oracle Linux 9', 'Ubuntu 22.04', 'CentOS 8 Stream'] },
    },
  },
  oci_functions: {
    type: 'oci_functions',
    label: 'OCI Functions',
    category: 'Compute & Serverless',
    description: 'Serverless Functions (Oracle)',
    baseCostPerMonth: 2.50,
    color: '#f97316',
    bgColor: 'rgba(249,115,22,0.12)',
    borderColor: 'rgba(249,115,22,0.4)',
    icon: 'Fn',
    provider: 'oracle',
    configSchema: {
      runtime: { label: 'Runtime', type: 'select', default: 'java17', options: ['java17', 'python310', 'node18', 'go120'] },
    },
  },
  oci_autonomous_db: {
    type: 'oci_autonomous_db',
    label: 'Autonomous Database (ATP)',
    category: 'Storage & Databases',
    description: 'Oracle Autonomous Transaction Processing (Oracle)',
    baseCostPerMonth: 32.00,
    color: '#f80000',
    bgColor: 'rgba(248,0,0,0.12)',
    borderColor: 'rgba(248,0,0,0.4)',
    icon: 'ADB',
    provider: 'oracle',
    configSchema: {
      dbWorkload: { label: 'Workload', type: 'select', default: 'OLTP', options: ['OLTP', 'DW', 'APEX', 'JSON'] },
      dataStorageSizeInTBs: { label: 'Storage (TB)', type: 'select', default: '1', options: ['1', '2', '4'] },
      isDedicated: { label: 'Dedicated Infrastructure', type: 'boolean', default: false },
      isAccessControlEnabled: { label: 'Access Control (ACL)', type: 'boolean', default: true },
    },
  },
  oci_object_storage: {
    type: 'oci_object_storage',
    label: 'OCI Object Storage',
    category: 'Storage & Databases',
    description: 'Object Storage Bucket (Oracle)',
    baseCostPerMonth: 2.20,
    color: '#ea580c',
    bgColor: 'rgba(234,88,12,0.12)',
    borderColor: 'rgba(234,88,12,0.4)',
    icon: 'OS',
    provider: 'oracle',
    configSchema: {
      storageTier: { label: 'Storage Tier', type: 'select', default: 'Standard', options: ['Standard', 'Archive'] },
      publicAccessType: { label: 'Public Access', type: 'select', default: 'NoPublicAccess', options: ['NoPublicAccess', 'ObjectRead', 'ObjectReadWithoutList'] },
      versioning: { label: 'Versioning Enabled', type: 'boolean', default: true },
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

  // AWS EC2
  if (type === 'ec2') {
    const multipliers = {
      't3.micro': 1, 't3.small': 1.5, 't3.medium': 3,
      't3.large': 6, 'm5.large': 8, 'm5.xlarge': 16, 'c5.large': 7,
    };
    cost = 14.50 * (multipliers[config.instanceType] ?? 1);
  }

  // AWS RDS Multi-AZ
  if (type === 'rds' && config.multiAz) {
    cost *= 2;
  }

  // Azure VM
  if (type === 'azure_vm') {
    const multipliers = {
      'Standard_B1s': 1, 'Standard_B2s': 2, 'Standard_D2s_v3': 5.5, 'Standard_D4s_v3': 11,
    };
    cost = 15.20 * (multipliers[config.size] ?? 1);
  }

  // Azure SQL Database
  if (type === 'azure_sql') {
    if (config.tier === 'Standard_S1') cost += 15;
    if (config.tier === 'GeneralPurpose_GP_Gen5_2') cost += 110;
    if (config.zoneRedundant) cost *= 1.8;
  }

  // GCP GCE
  if (type === 'gcp_gce') {
    const multipliers = {
      'e2-micro': 1, 'e2-small': 1.6, 'e2-medium': 3.2, 'e2-standard-2': 6.5,
    };
    cost = 14.80 * (multipliers[config.machineType] ?? 1);
  }

  // GCP Cloud SQL High Availability
  if (type === 'gcp_cloudsql' && config.highAvailability) {
    cost *= 1.9;
  }

  // Oracle Compute VM
  if (type === 'oci_compute') {
    const ocpus = Number(config.ocpus ?? 2);
    cost = 7.50 * ocpus;
  }

  // Oracle Autonomous Database
  if (type === 'oci_autonomous_db') {
    const tbs = Number(config.dataStorageSizeInTBs ?? 1);
    cost = 32.00 * tbs;
    if (config.isDedicated) cost *= 2.5;
  }

  return Math.round(cost * 100) / 100;
}

/**
 * Agrupa los tipos de nodo del catálogo por categoría, con filtro opcional de proveedor.
 * @param {'all'|'aws'|'azure'|'oracle'|'gcp'} provider
 * @returns {Record<string, Array>}
 */
export function getNodesByCategory(provider = 'all') {
  const groups = {};
  for (const meta of Object.values(NODE_CATALOG)) {
    if (provider !== 'all' && meta.provider !== provider && meta.provider !== 'common') continue;
    if (!groups[meta.category]) groups[meta.category] = [];
    groups[meta.category].push(meta);
  }
  return groups;
}
