/**
 * generateTerraform – Use case de generación de IaC.
 * Genera código Terraform (HCL2) a partir del grafo del canvas.
 * Compatible con Terraform >= 1.5 y provider aws ~> 5.0
 */

import { getNodeMeta } from '../../domain/models/CloudNode.js';

/**
 * Sanitiza un string para usarlo como nombre de recurso HCL.
 * @param {string} label
 * @returns {string}
 */
function toTfName(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/^[^a-z_]/, '_$&')
    .substring(0, 64);
}

/**
 * Genera el bloque HCL para un nodo de tipo VPC.
 */
function genVPC(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'main_vpc');
  return `
resource "aws_vpc" "${name}" {
  cidr_block           = "${cfg.cidr ?? '10.0.0.0/16'}"
  enable_dns_hostnames = ${cfg.enableDnsHostnames !== false ? 'true' : 'false'}
  enable_dns_support   = true

  tags = {
    Name        = "${node.data?.label ?? 'CloudScope VPC'}"
    ManagedBy   = "CloudScope"
    Environment = "dev"
  }
}`;
}

/**
 * Genera el bloque HCL para un nodo de tipo Subnet.
 */
function genSubnet(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'subnet');
  return `
resource "aws_subnet" "${name}" {
  # vpc_id                  = aws_vpc.<vpc_name>.id  # Conecta manualmente si tienes VPC
  cidr_block              = "${cfg.cidr ?? '10.0.1.0/24'}"
  availability_zone       = "${cfg.availabilityZone ?? 'us-east-1a'}"
  map_public_ip_on_launch = ${cfg.isPublic ? 'true' : 'false'}

  tags = {
    Name      = "${node.data?.label ?? 'CloudScope Subnet'}"
    Type      = "${cfg.isPublic ? 'Public' : 'Private'}"
    ManagedBy = "CloudScope"
  }
}`;
}

/**
 * Genera el bloque HCL para un Internet Gateway.
 */
function genIGW(node) {
  const name = toTfName(node.data?.label ?? 'igw');
  return `
resource "aws_internet_gateway" "${name}" {
  # vpc_id = aws_vpc.<vpc_name>.id  # Conecta manualmente si tienes VPC

  tags = {
    Name      = "${node.data?.label ?? 'CloudScope IGW'}"
    ManagedBy = "CloudScope"
  }
}`;
}

/**
 * Genera el bloque HCL para un ALB.
 */
function genALB(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'alb');
  return `
resource "aws_lb" "${name}" {
  name               = "${name}"
  internal           = ${cfg.scheme === 'internal' ? 'true' : 'false'}
  load_balancer_type = "application"
  # security_groups    = [aws_security_group.<sg_name>.id]
  # subnets            = [aws_subnet.<subnet_name>.id]

  enable_deletion_protection = false

  tags = {
    Name      = "${node.data?.label ?? 'CloudScope ALB'}"
    ManagedBy = "CloudScope"
  }
}`;
}

/**
 * Genera el bloque HCL para una instancia EC2.
 */
function genEC2(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'ec2');
  const amiMap = {
    'Amazon Linux 2': 'data.aws_ami.amazon_linux_2.id',
    'Ubuntu 22.04': 'data.aws_ami.ubuntu_22_04.id',
    'Windows Server 2022': 'data.aws_ami.windows_server_2022.id',
  };
  const ami = amiMap[cfg.os] ?? 'data.aws_ami.amazon_linux_2.id';
  return `
resource "aws_instance" "${name}" {
  ami           = ${ami}
  instance_type = "${cfg.instanceType ?? 't3.micro'}"
  # subnet_id     = aws_subnet.<subnet_name>.id
  # key_name      = var.key_pair_name

  root_block_device {
    volume_type = "gp3"
    volume_size = 20
    encrypted   = true
  }

  tags = {
    Name      = "${node.data?.label ?? 'CloudScope EC2'}"
    ManagedBy = "CloudScope"
  }
}`;
}

/**
 * Genera el bloque HCL para una función Lambda.
 */
function genLambda(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'lambda_fn');
  return `
resource "aws_lambda_function" "${name}" {
  function_name = "${name}"
  role          = aws_iam_role.${name}_exec.arn
  handler       = "index.handler"
  runtime       = "${cfg.runtime ?? 'python3.12'}"
  memory_size   = ${cfg.memory ?? 512}
  timeout       = 30

  filename         = "${name}.zip"
  source_code_hash = filebase64sha256("${name}.zip")

  tags = {
    Name      = "${node.data?.label ?? 'CloudScope Lambda'}"
    ManagedBy = "CloudScope"
  }
}

resource "aws_iam_role" "${name}_exec" {
  name = "${name}-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}`;
}

/**
 * Genera el bloque HCL para una instancia RDS.
 */
function genRDS(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'rds_db');
  return `
resource "aws_db_instance" "${name}" {
  identifier        = "${name}"
  engine            = "${cfg.engine ?? 'postgres'}"
  engine_version    = "${cfg.engine === 'mysql' ? '8.0' : '15.4'}"
  instance_class    = "${cfg.instanceClass ?? 'db.t3.micro'}"
  allocated_storage = 20
  storage_type      = "gp3"
  storage_encrypted = true

  username = "admin"
  password = var.db_password_${name}

  multi_az               = ${cfg.multiAz ? 'true' : 'false'}
  publicly_accessible    = ${cfg.publiclyAccessible ? 'true' : 'false'}
  skip_final_snapshot    = true
  deletion_protection    = false

  # db_subnet_group_name   = aws_db_subnet_group.<group_name>.name
  # vpc_security_group_ids = [aws_security_group.<sg_name>.id]

  tags = {
    Name      = "${node.data?.label ?? 'CloudScope RDS'}"
    ManagedBy = "CloudScope"
  }
}

variable "db_password_${name}" {
  description = "Master password for ${node.data?.label ?? 'RDS'}"
  type        = string
  sensitive   = true
}`;
}

/**
 * Genera el bloque HCL para un S3 Bucket.
 */
function genS3(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 's3_bucket');
  return `
resource "aws_s3_bucket" "${name}" {
  bucket = "${name}-\${random_id.suffix.hex}"

  tags = {
    Name      = "${node.data?.label ?? 'CloudScope S3'}"
    ManagedBy = "CloudScope"
  }
}

${cfg.versioning ? `resource "aws_s3_bucket_versioning" "${name}" {
  bucket = aws_s3_bucket.${name}.id
  versioning_configuration {
    status = "Enabled"
  }
}` : ''}

${cfg.encryption !== false ? `resource "aws_s3_bucket_server_side_encryption_configuration" "${name}" {
  bucket = aws_s3_bucket.${name}.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}` : ''}

resource "aws_s3_bucket_public_access_block" "${name}" {
  bucket = aws_s3_bucket.${name}.id

  block_public_acls       = ${cfg.publicAccess !== false ? 'true' : 'false'}
  block_public_policy     = ${cfg.publicAccess !== false ? 'true' : 'false'}
  ignore_public_acls      = ${cfg.publicAccess !== false ? 'true' : 'false'}
  restrict_public_buckets = ${cfg.publicAccess !== false ? 'true' : 'false'}
}`;
}

// ─────────────────────────────────────────────────────────────────────────
// Azure Generators
// ─────────────────────────────────────────────────────────────────────────
function genAzureVNet(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'vnet');
  return `
resource "azurerm_virtual_network" "${name}" {
  name                = "${name}"
  address_space       = ["${cfg.addressSpace ?? '10.1.0.0/16'}"]
  location            = var.azure_location
  resource_group_name = azurerm_resource_group.rg.name
  tags = { ManagedBy = "CloudScope", Environment = "Production" }
}`;
}

function genAzureSubnet(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'subnet');
  return `
resource "azurerm_subnet" "${name}" {
  name                 = "${name}"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["${cfg.addressPrefix ?? '10.1.1.0/24'}"]
}`;
}

function genAzureAppGW(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'appgw');
  return `
resource "azurerm_application_gateway" "${name}" {
  name                = "${name}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.azure_location
  sku {
    name     = "${cfg.sku ?? 'Standard_v2'}"
    tier     = "${cfg.sku ?? 'Standard_v2'}"
    capacity = 2
  }
  tags = { ManagedBy = "CloudScope" }
}`;
}

function genAzureVM(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'vm');
  return `
resource "azurerm_linux_virtual_machine" "${name}" {
  name                = "${name}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.azure_location
  size                = "${cfg.size ?? 'Standard_B1s'}"
  admin_username      = "cloudscope"
  network_interface_ids = [azurerm_network_interface.${name}_nic.id]
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }
  tags = { ManagedBy = "CloudScope" }
}`;
}

function genAzureFunction(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'func');
  return `
resource "azurerm_linux_function_app" "${name}" {
  name                = "${name}-app"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.azure_location
  service_plan_id     = azurerm_service_plan.plan.id
  storage_account_name = azurerm_storage_account.sa.name
  site_config {
    application_stack {
      node_version = "20"
    }
  }
  tags = { ManagedBy = "CloudScope" }
}`;
}

function genAzureSQL(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'sql');
  return `
resource "azurerm_mssql_database" "${name}" {
  name         = "${name}"
  server_id    = azurerm_mssql_server.sql_server.id
  sku_name     = "${cfg.tier ?? 'Basic'}"
  zone_redundant = ${cfg.zoneRedundant ? 'true' : 'false'}
  tags = { ManagedBy = "CloudScope" }
}`;
}

function genAzureBlob(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'blob');
  return `
resource "azurerm_storage_account" "${name}" {
  name                     = "${name.replace(/_/g, '')}store"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = var.azure_location
  account_tier             = "Standard"
  account_replication_type = "${cfg.replication ?? 'LRS'}"
  allow_nested_items_to_be_public = ${cfg.publicBlobAccess ? 'true' : 'false'}
  tags = { ManagedBy = "CloudScope" }
}`;
}

// ─────────────────────────────────────────────────────────────────────────
// GCP Generators
// ─────────────────────────────────────────────────────────────────────────
function genGcpVPC(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'gcp_vpc');
  return `
resource "google_compute_network" "${name}" {
  name                    = "${name}"
  auto_create_subnetworks = ${cfg.subnetMode === 'auto' ? 'true' : 'false'}
}`;
}

function genGcpSubnet(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'gcp_subnet');
  return `
resource "google_compute_subnetwork" "${name}" {
  name          = "${name}"
  ip_cidr_range = "${cfg.ipRange ?? '10.128.0.0/20'}"
  region        = var.gcp_region
  network       = google_compute_network.main.id
}`;
}

function genGcpLB(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'gcp_lb');
  return `
resource "google_compute_global_forwarding_rule" "${name}" {
  name                  = "${name}"
  target                = google_compute_target_http_proxy.default.id
  port_range            = "80"
  network_tier          = "${cfg.tier ?? 'PREMIUM'}"
}`;
}

function genGcpGCE(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'gce_vm');
  return `
resource "google_compute_instance" "${name}" {
  name         = "${name}"
  machine_type = "${cfg.machineType ?? 'e2-micro'}"
  zone         = var.gcp_zone
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
    }
  }
  network_interface {
    network = google_compute_network.main.id
  }
  labels = { managed_by = "cloudscope" }
}`;
}

function genGcpCloudFunction(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'cloud_fn');
  return `
resource "google_cloudfunctions_function" "${name}" {
  name        = "${name}"
  description = "CloudScope Managed Function"
  runtime     = "${cfg.runtime ?? 'nodejs20'}"
  available_memory_mb   = 256
  trigger_http          = true
  entry_point           = "handler"
}`;
}

function genGcpCloudSQL(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'cloud_sql');
  return `
resource "google_sql_database_instance" "${name}" {
  name             = "${name}"
  database_version = "${cfg.databaseVersion ?? 'POSTGRES_15'}"
  region           = var.gcp_region
  settings {
    tier = "${cfg.tier ?? 'db-f1-micro'}"
    availability_type = "${cfg.highAvailability ? 'REGIONAL' : 'ZONAL'}"
    ip_configuration {
      ipv4_enabled = ${cfg.publicIp ? 'true' : 'false'}
    }
  }
}`;
}

function genGcpGCS(node) {
  const cfg = node.data?.config ?? {};
  const name = toTfName(node.data?.label ?? 'gcs_bucket');
  return `
resource "google_storage_bucket" "${name}" {
  name          = "${name}-\${random_id.suffix.hex}"
  location      = "US"
  storage_class = "${cfg.storageClass ?? 'STANDARD'}"
  uniform_bucket_level_access = ${cfg.uniformAccess !== false ? 'true' : 'false'}
  versioning {
    enabled = ${cfg.versioning ? 'true' : 'false'}
  }
  labels = { managed_by = "cloudscope" }
}`;
}

const GENERATORS = {
  // AWS
  vpc: genVPC,
  subnet: genSubnet,
  igw: genIGW,
  alb: genALB,
  ec2: genEC2,
  lambda: genLambda,
  rds: genRDS,
  s3: genS3,
  // Azure
  azure_vnet: genAzureVNet,
  azure_subnet: genAzureSubnet,
  azure_appgw: genAzureAppGW,
  azure_vm: genAzureVM,
  azure_function: genAzureFunction,
  azure_sql: genAzureSQL,
  azure_blob: genAzureBlob,
  // GCP
  gcp_vpc: genGcpVPC,
  gcp_subnet: genGcpSubnet,
  gcp_lb: genGcpLB,
  gcp_gce: genGcpGCE,
  gcp_cloudfunction: genGcpCloudFunction,
  gcp_cloudsql: genGcpCloudSQL,
  gcp_gcs: genGcpGCS,
};

/**
 * Genera el archivo Terraform completo (main.tf) a partir del grafo.
 * @param {import('reactflow').Node[]} nodes
 * @param {import('reactflow').Edge[]} edges
 * @param {string} projectName
 * @returns {string} Contenido HCL del archivo main.tf
 */
export function generateTerraform(nodes, edges, projectName = 'cloudscope') {
  const tfName = toTfName(projectName);

  const hasAws = nodes.some(n => !n.data?.cloudType?.startsWith('azure_') && !n.data?.cloudType?.startsWith('gcp_'));
  const hasAzure = nodes.some(n => n.data?.cloudType?.startsWith('azure_'));
  const hasGcp = nodes.some(n => n.data?.cloudType?.startsWith('gcp_'));

  const header = `# ============================================================
# CloudScope – Multi-Cloud Terraform Configuration (IaC)
# Project: ${projectName}
# Generated: ${new Date().toISOString()}
# Providers: ${[hasAws && 'AWS', hasAzure && 'Azure', hasGcp && 'GCP'].filter(Boolean).join(', ') || 'AWS'}
# ============================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    ${hasAws ? `aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }` : ''}
    ${hasAzure ? `azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }` : ''}
    ${hasGcp ? `google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }` : ''}
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

${hasAws ? `provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}` : ''}

${hasAzure ? `provider "azurerm" {
  features {}
}

variable "azure_location" {
  description = "Azure region to deploy resources"
  type        = string
  default     = "eastus"
}

resource "azurerm_resource_group" "rg" {
  name     = "${tfName}-rg"
  location = var.azure_location
}` : ''}

${hasGcp ? `provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}

variable "gcp_project" {
  description = "GCP Project ID"
  type        = string
  default     = "my-cloudscope-project"
}

variable "gcp_region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "gcp_zone" {
  description = "GCP zone"
  type        = string
  default     = "us-central1-a"
}` : ''}

resource "random_id" "suffix" {
  byte_length = 4
}
`;

  const resourceBlocks = nodes
    .filter(n => n.data?.cloudType && GENERATORS[n.data.cloudType])
    .map(n => {
      const gen = GENERATORS[n.data.cloudType];
      return gen(n);
    })
    .join('\n');

  const footer = `
# ─────────────────────────────────────────────────────────────
# Outputs
# ─────────────────────────────────────────────────────────────
output "cloudscope_project" {
  value = "${tfName}"
}
`;

  return header + '\n' + resourceBlocks + '\n' + footer;
}

/**
 * Descarga el archivo Terraform como un archivo .tf en el navegador.
 * @param {string} content
 * @param {string} filename
 */
export function downloadTerraform(content, filename = 'main.tf') {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
