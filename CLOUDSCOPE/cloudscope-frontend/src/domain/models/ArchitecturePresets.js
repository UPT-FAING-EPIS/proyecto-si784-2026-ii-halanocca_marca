/**
 * ArchitecturePresets – Plantillas de arquitectura de referencia (RF-01, RF-02, RF-09).
 * Ofrece arquitecturas preconfiguradas para pruebas inmediatas, demostración y aprendizaje.
 */

export const ARCHITECTURE_PRESETS = [
  {
    id: 'aws-3tier',
    name: 'AWS 3-Tier Enterprise Web App',
    provider: 'aws',
    category: 'High Availability',
    badge: 'Popular',
    color: '#f59e0b',
    description: 'Arquitectura clásica de 3 capas de alta disponibilidad: ALB en subnet pública, instancias EC2 en capa privada y base de datos relacional RDS Multi-AZ.',
    nodes: [
      {
        id: 'node_vpc',
        type: 'cloudNode',
        position: { x: 50, y: 50 },
        data: {
          cloudType: 'vpc',
          label: 'Production VPC',
          config: { cidr: '10.0.0.0/16', enableDnsHostnames: true },
        },
      },
      {
        id: 'node_igw',
        type: 'cloudNode',
        position: { x: 320, y: 50 },
        data: {
          cloudType: 'igw',
          label: 'Internet Gateway',
          config: {},
        },
      },
      {
        id: 'node_subnet_pub',
        type: 'cloudNode',
        position: { x: 320, y: 170 },
        data: {
          cloudType: 'subnet',
          label: 'Public Subnet (ALB)',
          config: { cidr: '10.0.1.0/24', isPublic: true, availabilityZone: 'us-east-1a' },
        },
      },
      {
        id: 'node_alb',
        type: 'cloudNode',
        position: { x: 320, y: 290 },
        data: {
          cloudType: 'alb',
          label: 'App Load Balancer',
          config: { scheme: 'internet-facing' },
        },
      },
      {
        id: 'node_subnet_priv',
        type: 'cloudNode',
        position: { x: 320, y: 410 },
        data: {
          cloudType: 'subnet',
          label: 'Private App Subnet',
          config: { cidr: '10.0.2.0/24', isPublic: false, availabilityZone: 'us-east-1a' },
        },
      },
      {
        id: 'node_ec2_1',
        type: 'cloudNode',
        position: { x: 200, y: 530 },
        data: {
          cloudType: 'ec2',
          label: 'Web Server 01',
          config: { instanceType: 't3.medium', os: 'Amazon Linux 2' },
        },
      },
      {
        id: 'node_ec2_2',
        type: 'cloudNode',
        position: { x: 440, y: 530 },
        data: {
          cloudType: 'ec2',
          label: 'Web Server 02',
          config: { instanceType: 't3.medium', os: 'Amazon Linux 2' },
        },
      },
      {
        id: 'node_rds',
        type: 'cloudNode',
        position: { x: 320, y: 670 },
        data: {
          cloudType: 'rds',
          label: 'PostgreSQL Multi-AZ',
          config: {
            engine: 'postgres',
            instanceClass: 'db.t3.medium',
            multiAz: true,
            publiclyAccessible: false,
          },
        },
      },
      {
        id: 'node_s3',
        type: 'cloudNode',
        position: { x: 600, y: 410 },
        data: {
          cloudType: 's3',
          label: 'Static Assets S3',
          config: { versioning: true, publicAccess: true, encryption: true },
        },
      },
    ],
    edges: [
      { id: 'e_igw_vpc', source: 'node_igw', target: 'node_vpc', animated: true },
      { id: 'e_igw_subpub', source: 'node_igw', target: 'node_subnet_pub' },
      { id: 'e_subpub_alb', source: 'node_subnet_pub', target: 'node_alb' },
      { id: 'e_alb_subpriv', source: 'node_alb', target: 'node_subnet_priv' },
      { id: 'e_subpriv_ec2_1', source: 'node_subnet_priv', target: 'node_ec2_1' },
      { id: 'e_subpriv_ec2_2', source: 'node_subnet_priv', target: 'node_ec2_2' },
      { id: 'e_ec2_1_rds', source: 'node_ec2_1', target: 'node_rds' },
      { id: 'e_ec2_2_rds', source: 'node_ec2_2', target: 'node_rds' },
      { id: 'e_ec2_1_s3', source: 'node_ec2_1', target: 'node_s3', animated: true },
    ],
  },
  {
    id: 'aws-serverless',
    name: 'AWS Serverless Event-Driven Stack',
    provider: 'aws',
    category: 'Serverless',
    badge: 'FinOps Optimized',
    color: '#10b981',
    description: 'Arquitectura escalable basada en funciones serverless Lambda, bucket S3 para almacenamiento y base de datos administrada.',
    nodes: [
      {
        id: 'srv_alb',
        type: 'cloudNode',
        position: { x: 300, y: 80 },
        data: {
          cloudType: 'alb',
          label: 'API Gateway / ALB',
          config: { scheme: 'internet-facing' },
        },
      },
      {
        id: 'srv_lambda',
        type: 'cloudNode',
        position: { x: 300, y: 220 },
        data: {
          cloudType: 'lambda',
          label: 'API Processor Lambda',
          config: { runtime: 'nodejs20.x', memory: '512' },
        },
      },
      {
        id: 'srv_s3',
        type: 'cloudNode',
        position: { x: 140, y: 360 },
        data: {
          cloudType: 's3',
          label: 'Media Storage Bucket',
          config: { versioning: true, publicAccess: true, encryption: true },
        },
      },
      {
        id: 'srv_rds',
        type: 'cloudNode',
        position: { x: 460, y: 360 },
        data: {
          cloudType: 'rds',
          label: 'Serverless Aurora/RDS',
          config: { engine: 'postgres', instanceClass: 'db.t3.micro', multiAz: false, publiclyAccessible: false },
        },
      },
    ],
    edges: [
      { id: 'e_srv_alb_lambda', source: 'srv_alb', target: 'srv_lambda', animated: true },
      { id: 'e_srv_lambda_s3', source: 'srv_lambda', target: 'srv_s3' },
      { id: 'e_srv_lambda_rds', source: 'srv_lambda', target: 'srv_rds' },
    ],
  },
  {
    id: 'azure-web',
    name: 'Azure Enterprise Web & SQL',
    provider: 'azure',
    category: 'Enterprise',
    badge: 'Azure',
    color: '#0078d4',
    description: 'Infraestructura empresarial en Microsoft Azure: VNet, Application Gateway WAF, Azure VM y base de datos Azure SQL gestionada.',
    nodes: [
      {
        id: 'az_vnet',
        type: 'cloudNode',
        position: { x: 60, y: 60 },
        data: {
          cloudType: 'azure_vnet',
          label: 'Hub VNet',
          config: { addressSpace: '10.1.0.0/16' },
        },
      },
      {
        id: 'az_subnet',
        type: 'cloudNode',
        position: { x: 320, y: 60 },
        data: {
          cloudType: 'azure_subnet',
          label: 'Frontend Subnet',
          config: { addressPrefix: '10.1.1.0/24', isPublic: true },
        },
      },
      {
        id: 'az_appgw',
        type: 'cloudNode',
        position: { x: 320, y: 190 },
        data: {
          cloudType: 'azure_appgw',
          label: 'App Gateway WAF_v2',
          config: { sku: 'WAF_v2' },
        },
      },
      {
        id: 'az_vm',
        type: 'cloudNode',
        position: { x: 320, y: 330 },
        data: {
          cloudType: 'azure_vm',
          label: 'App Service VM',
          config: { size: 'Standard_B2s', os: 'Ubuntu 22.04 LTS' },
        },
      },
      {
        id: 'az_sql',
        type: 'cloudNode',
        position: { x: 200, y: 470 },
        data: {
          cloudType: 'azure_sql',
          label: 'Azure SQL Database',
          config: { tier: 'Standard_S1', zoneRedundant: true, publicAccess: false },
        },
      },
      {
        id: 'az_blob',
        type: 'cloudNode',
        position: { x: 440, y: 470 },
        data: {
          cloudType: 'azure_blob',
          label: 'Secure Blob Storage',
          config: { replication: 'ZRS', publicBlobAccess: false, versioning: true },
        },
      },
    ],
    edges: [
      { id: 'e_az_vnet_sub', source: 'az_vnet', target: 'az_subnet' },
      { id: 'e_az_sub_appgw', source: 'az_subnet', target: 'az_appgw' },
      { id: 'e_az_appgw_vm', source: 'az_appgw', target: 'az_vm', animated: true },
      { id: 'e_az_vm_sql', source: 'az_vm', target: 'az_sql' },
      { id: 'e_az_vm_blob', source: 'az_vm', target: 'az_blob' },
    ],
  },
  {
    id: 'gcp-cloud-native',
    name: 'GCP Cloud Native Stack',
    provider: 'gcp',
    category: 'Cloud Native',
    badge: 'GCP',
    color: '#ea4335',
    description: 'Topología nativa en Google Cloud Platform: VPC Network, Cloud Load Balancing, Compute Engine VM, Cloud SQL HA y Cloud Storage.',
    nodes: [
      {
        id: 'gcp_vpc_node',
        type: 'cloudNode',
        position: { x: 60, y: 60 },
        data: {
          cloudType: 'gcp_vpc',
          label: 'Main VPC Network',
          config: { subnetMode: 'custom' },
        },
      },
      {
        id: 'gcp_sub_node',
        type: 'cloudNode',
        position: { x: 320, y: 60 },
        data: {
          cloudType: 'gcp_subnet',
          label: 'Default Region Subnet',
          config: { ipRange: '10.128.0.0/20', isPublic: false },
        },
      },
      {
        id: 'gcp_lb_node',
        type: 'cloudNode',
        position: { x: 320, y: 190 },
        data: {
          cloudType: 'gcp_lb',
          label: 'Cloud Load Balancer',
          config: { tier: 'PREMIUM' },
        },
      },
      {
        id: 'gcp_gce_node',
        type: 'cloudNode',
        position: { x: 320, y: 330 },
        data: {
          cloudType: 'gcp_gce',
          label: 'Backend Compute Engine',
          config: { machineType: 'e2-medium', os: 'Debian 12' },
        },
      },
      {
        id: 'gcp_sql_node',
        type: 'cloudNode',
        position: { x: 200, y: 470 },
        data: {
          cloudType: 'gcp_cloudsql',
          label: 'Cloud SQL HA Postgres',
          config: { databaseVersion: 'POSTGRES_15', tier: 'db-f1-micro', highAvailability: true, publicIp: false },
        },
      },
      {
        id: 'gcp_gcs_node',
        type: 'cloudNode',
        position: { x: 440, y: 470 },
        data: {
          cloudType: 'gcp_gcs',
          label: 'GCS Standard Bucket',
          config: { storageClass: 'STANDARD', uniformAccess: true, versioning: true },
        },
      },
    ],
    edges: [
      { id: 'e_gcp_vpc_sub', source: 'gcp_vpc_node', target: 'gcp_sub_node' },
      { id: 'e_gcp_sub_lb', source: 'gcp_sub_node', target: 'gcp_lb_node' },
      { id: 'e_gcp_lb_gce', source: 'gcp_lb_node', target: 'gcp_gce_node', animated: true },
      { id: 'e_gcp_gce_sql', source: 'gcp_gce_node', target: 'gcp_sql_node' },
      { id: 'e_gcp_gce_gcs', source: 'gcp_gce_node', target: 'gcp_gcs_node' },
    ],
  },
];
