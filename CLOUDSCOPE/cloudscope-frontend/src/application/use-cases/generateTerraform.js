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

const GENERATORS = {
  vpc: genVPC,
  subnet: genSubnet,
  igw: genIGW,
  alb: genALB,
  ec2: genEC2,
  lambda: genLambda,
  rds: genRDS,
  s3: genS3,
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

  const header = `# ============================================================
# CloudScope – Generated Terraform Configuration
# Project: ${projectName}
# Generated: ${new Date().toISOString()}
# 
# WARNING: This file was auto-generated. Review all resource
# configurations before applying to a real AWS environment.
# ============================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

resource "random_id" "suffix" {
  byte_length = 4
}

# ─────────────────────────────────────────────────────────────
# AMI Data Sources (used by EC2 resources)
# ─────────────────────────────────────────────────────────────
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

data "aws_ami" "ubuntu_22_04" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
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
