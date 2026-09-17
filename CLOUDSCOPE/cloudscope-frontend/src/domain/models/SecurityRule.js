/**
 * SecurityRule – Modelo de dominio para las reglas de auditoría de seguridad.
 * Alineado a AWS Well-Architected Framework y CIS Benchmarks for AWS.
 * 
 * Cada regla es una función pura que recibe el grafo (nodes + edges)
 * y devuelve un array de hallazgos (findings).
 */

/**
 * @typedef {'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'|'INFO'} Severity
 */

/**
 * @typedef {Object} SecurityFinding
 * @property {string} ruleId       - Identificador de la regla (ej. "SEC-001")
 * @property {Severity} severity   - Severidad del hallazgo
 * @property {string} title        - Título corto
 * @property {string} description  - Descripción técnica del problema
 * @property {string} recommendation - Acción correctiva recomendada
 * @property {string|null} nodeId  - ID del nodo afectado (null si es global)
 * @property {string} framework    - Marco de referencia (CIS / Well-Architected / Custom)
 */

/**
 * @typedef {Object} SecurityRule
 * @property {string} id
 * @property {string} title
 * @property {Severity} severity
 * @property {string} framework
 * @property {(nodes: any[], edges: any[]) => SecurityFinding[]} evaluate
 */

/** @type {SecurityRule[]} */
export const SECURITY_RULES = [
  // ─────────────────────────────────────────────────────────────────────────
  // SEC-001 · RDS Publicly Accessible
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-001',
    title: 'RDS Instance Publicly Accessible',
    severity: 'CRITICAL',
    framework: 'CIS AWS Benchmark 2.3.1',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 'rds' && n.data?.config?.publiclyAccessible === true)
        .map(n => ({
          ruleId: 'SEC-001',
          severity: 'CRITICAL',
          title: 'RDS Instance Publicly Accessible',
          description: `La instancia RDS "${n.data.label}" tiene "Publicly Accessible" habilitado, exponiendo la base de datos a internet.`,
          recommendation: 'Deshabilita "Publicly Accessible" y coloca la RDS en una subnet privada. Usa bastion host o VPN para acceso administrativo.',
          nodeId: n.id,
          framework: 'CIS AWS Benchmark 2.3.1',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-002 · S3 Block Public Access Disabled
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-002',
    title: 'S3 Bucket with Public Access Enabled',
    severity: 'HIGH',
    framework: 'CIS AWS Benchmark 2.1.5',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 's3' && n.data?.config?.publicAccess === false)
        .map(n => ({
          ruleId: 'SEC-002',
          severity: 'HIGH',
          title: 'S3 Bucket sin Block Public Access',
          description: `El bucket S3 "${n.data.label}" tiene "Block Public Access" deshabilitado, lo que puede exponer datos sensibles.`,
          recommendation: 'Habilita las 4 configuraciones de Block Public Access a nivel de bucket y cuenta.',
          nodeId: n.id,
          framework: 'CIS AWS Benchmark 2.1.5',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-003 · S3 Encryption Disabled
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-003',
    title: 'S3 Bucket without Server-Side Encryption',
    severity: 'MEDIUM',
    framework: 'CIS AWS Benchmark 2.1.1',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 's3' && n.data?.config?.encryption === false)
        .map(n => ({
          ruleId: 'SEC-003',
          severity: 'MEDIUM',
          title: 'S3 sin cifrado en reposo',
          description: `El bucket S3 "${n.data.label}" no tiene cifrado SSE habilitado.`,
          recommendation: 'Habilita SSE-S3 o SSE-KMS en la configuración del bucket.',
          nodeId: n.id,
          framework: 'CIS AWS Benchmark 2.1.1',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-004 · No VPC en el diagrama (arquitectura plana)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-004',
    title: 'No VPC defined in architecture',
    severity: 'HIGH',
    framework: 'AWS Well-Architected – Security Pillar',
    evaluate(nodes) {
      const hasVpc = nodes.some(n => n.data?.cloudType === 'vpc');
      const hasNetworkResources = nodes.some(n => ['ec2','rds','alb'].includes(n.data?.cloudType));
      if (!hasVpc && hasNetworkResources) {
        return [{
          ruleId: 'SEC-004',
          severity: 'HIGH',
          title: 'Arquitectura sin VPC definida',
          description: 'El diagrama contiene recursos de red (EC2, RDS, ALB) pero no tiene una VPC. Los recursos quedarían en la VPC Default, lo cual no es una buena práctica.',
          recommendation: 'Agrega un nodo VPC y conecta los recursos de red a ella. Define subnets públicas y privadas.',
          nodeId: null,
          framework: 'AWS Well-Architected – Security Pillar',
        }];
      }
      return [];
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-005 · ALB expuesto sin VPC o Subnet
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-005',
    title: 'ALB internet-facing without subnet context',
    severity: 'MEDIUM',
    framework: 'AWS Well-Architected – Reliability',
    evaluate(nodes, edges) {
      return nodes
        .filter(n => n.data?.cloudType === 'alb' && n.data?.config?.scheme === 'internet-facing')
        .filter(alb => {
          const connectedIds = edges
            .filter(e => e.source === alb.id || e.target === alb.id)
            .flatMap(e => [e.source, e.target]);
          const connectedNodes = nodes.filter(n => connectedIds.includes(n.id));
          return !connectedNodes.some(n => ['subnet','vpc'].includes(n.data?.cloudType));
        })
        .map(n => ({
          ruleId: 'SEC-005',
          severity: 'MEDIUM',
          title: 'ALB internet-facing sin subnet conectada',
          description: `El ALB "${n.data.label}" está configurado como internet-facing pero no está conectado a ninguna subnet o VPC en el diagrama.`,
          recommendation: 'Conecta el ALB a subnets públicas dentro de una VPC para representar correctamente el aislamiento de red.',
          nodeId: n.id,
          framework: 'AWS Well-Architected – Reliability',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-006 · RDS sin Multi-AZ (resiliencia)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-006',
    title: 'RDS without Multi-AZ (Single Point of Failure)',
    severity: 'MEDIUM',
    framework: 'AWS Well-Architected – Reliability',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 'rds' && n.data?.config?.multiAz !== true)
        .map(n => ({
          ruleId: 'SEC-006',
          severity: 'MEDIUM',
          title: 'RDS sin Multi-AZ (SPOF)',
          description: `La instancia RDS "${n.data.label}" no tiene Multi-AZ habilitado, convirtiéndola en un Punto Único de Falla (SPOF).`,
          recommendation: 'Habilita Multi-AZ en la configuración de RDS para garantizar alta disponibilidad y failover automático.',
          nodeId: n.id,
          framework: 'AWS Well-Architected – Reliability',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-007 · Internet Gateway conectado directamente a RDS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-007',
    title: 'Internet Gateway directly connected to RDS',
    severity: 'CRITICAL',
    framework: 'CIS AWS Benchmark / Well-Architected Security',
    evaluate(nodes, edges) {
      const igwIds = nodes.filter(n => n.data?.cloudType === 'igw').map(n => n.id);
      const rdsIds = nodes.filter(n => n.data?.cloudType === 'rds').map(n => n.id);
      const directLinks = edges.filter(e =>
        (igwIds.includes(e.source) && rdsIds.includes(e.target)) ||
        (igwIds.includes(e.target) && rdsIds.includes(e.source))
      );
      return directLinks.map(e => {
        const rdsNode = nodes.find(n => n.id === e.source || n.id === e.target && rdsIds.includes(n.id));
        return {
          ruleId: 'SEC-007',
          severity: 'CRITICAL',
          title: 'Internet Gateway conectado directamente a RDS',
          description: 'Se detectó una conexión directa entre un Internet Gateway y una instancia RDS. Esto expone la base de datos directamente a internet.',
          recommendation: 'Nunca conectes un IGW directamente a RDS. La base de datos debe estar en una subnet privada, accesible solo desde capas de aplicación internas.',
          nodeId: rdsNode?.id ?? null,
          framework: 'CIS AWS Benchmark / Well-Architected Security',
        };
      });
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-008 · Azure SQL Database Public Access Enabled
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-008',
    title: 'Azure SQL Database with Public Network Access',
    severity: 'CRITICAL',
    framework: 'CIS Microsoft Azure Benchmark 4.1.1',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 'azure_sql' && n.data?.config?.publicAccess === true)
        .map(n => ({
          ruleId: 'SEC-008',
          severity: 'CRITICAL',
          title: 'Azure SQL expuesto a redes públicas',
          description: `La base de datos Azure SQL "${n.data.label}" tiene el acceso público habilitado, lo que permite conexiones externas si el firewall es permisivo.`,
          recommendation: 'Deshabilita el acceso público a nivel de servidor Azure SQL y utiliza Azure Private Endpoints para tráfico privado.',
          nodeId: n.id,
          framework: 'CIS Microsoft Azure Benchmark 4.1.1',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-009 · Azure Blob Storage Public Access Enabled
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-009',
    title: 'Azure Blob Storage Public Access Allowed',
    severity: 'HIGH',
    framework: 'CIS Microsoft Azure Benchmark 3.1',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 'azure_blob' && n.data?.config?.publicBlobAccess === true)
        .map(n => ({
          ruleId: 'SEC-009',
          severity: 'HIGH',
          title: 'Azure Blob Storage con acceso público permitido',
          description: `La cuenta de almacenamiento Azure Blob "${n.data.label}" permite el acceso anónimo a blobs y contenedores.`,
          recommendation: 'Configura "Allow Public Blob Access" en falso para forzar autenticación mediante Microsoft Entra ID o Shared Access Signatures.',
          nodeId: n.id,
          framework: 'CIS Microsoft Azure Benchmark 3.1',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-010 · GCP Cloud SQL Public IP Authorized
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-010',
    title: 'GCP Cloud SQL Instance with Public IP Enabled',
    severity: 'CRITICAL',
    framework: 'CIS Google Cloud Platform Benchmark 6.2',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 'gcp_cloudsql' && n.data?.config?.publicIp === true)
        .map(n => ({
          ruleId: 'SEC-010',
          severity: 'CRITICAL',
          title: 'GCP Cloud SQL con IP Pública asignada',
          description: `La instancia Cloud SQL "${n.data.label}" tiene habilitada la asignación de IP Pública, incrementando la superficie de ataque.`,
          recommendation: 'Configura Private IP mediante VPC Peering o Private Service Connect para aislar la base de datos del tráfico público de internet.',
          nodeId: n.id,
          framework: 'CIS Google Cloud Platform Benchmark 6.2',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-011 · GCP Cloud Storage without Uniform Bucket-Level Access
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-011',
    title: 'GCP Storage Bucket without Uniform Access Control',
    severity: 'MEDIUM',
    framework: 'CIS Google Cloud Platform Benchmark 5.2',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 'gcp_gcs' && n.data?.config?.uniformAccess === false)
        .map(n => ({
          ruleId: 'SEC-011',
          severity: 'MEDIUM',
          title: 'GCP Storage sin Uniform Bucket-Level Access',
          description: `El bucket Cloud Storage "${n.data.label}" utiliza ACLs individuales de objetos en lugar de control uniforme, dificultando la gobernanza.`,
          recommendation: 'Habilita Uniform Bucket-Level Access para unificar permisos a través de políticas Cloud IAM centrales.',
          nodeId: n.id,
          framework: 'CIS Google Cloud Platform Benchmark 5.2',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-012 · OCI Autonomous Database Access Control Disabled
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-012',
    title: 'OCI Autonomous Database Access Control Disabled',
    severity: 'CRITICAL',
    framework: 'CIS Oracle Cloud Infrastructure Benchmark 4.1',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 'oci_autonomous_db' && n.data?.config?.isAccessControlEnabled === false)
        .map(n => ({
          ruleId: 'SEC-012',
          severity: 'CRITICAL',
          title: 'OCI Autonomous DB sin lista de control de acceso (ACL)',
          description: `La base de datos autónoma "${n.data.label}" no tiene activado el control de acceso IP/VCN (ACL), permitiendo intentos de conexión desde cualquier origen.`,
          recommendation: 'Habilita "Access Control (ACL)" y restringe el acceso únicamente a VCNs privadas o bloques CIDR corporativos autorizados.',
          nodeId: n.id,
          framework: 'CIS Oracle Cloud Infrastructure Benchmark 4.1',
        }));
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEC-013 · OCI Object Storage Bucket Publicly Accessible
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'SEC-013',
    title: 'OCI Object Storage Bucket Publicly Readable',
    severity: 'HIGH',
    framework: 'CIS Oracle Cloud Infrastructure Benchmark 3.1',
    evaluate(nodes) {
      return nodes
        .filter(n => n.data?.cloudType === 'oci_object_storage' && n.data?.config?.publicAccessType !== 'NoPublicAccess')
        .map(n => ({
          ruleId: 'SEC-013',
          severity: 'HIGH',
          title: 'OCI Object Storage con lectura pública habilitada',
          description: `El bucket de almacenamiento "${n.data.label}" tiene configurado el acceso público (${n.data.config?.publicAccessType}), exponiendo datos no autenticados.`,
          recommendation: 'Configura "Public Access" en "NoPublicAccess" y utiliza Pre-Authenticated Requests (PAR) con expiración para accesos temporales.',
          nodeId: n.id,
          framework: 'CIS Oracle Cloud Infrastructure Benchmark 3.1',
        }));
    },
  },
];

/**
 * Severidad a color para la UI.
 * @param {Severity} severity
 */
export function severityColor(severity) {
  const map = {
    CRITICAL: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: '#ef4444' },
    HIGH:     { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: '#f97316' },
    MEDIUM:   { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: '#f59e0b' },
    LOW:      { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', dot: '#38bdf8' },
    INFO:     { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', dot: '#94a3b8' },
  };
  return map[severity] ?? map.INFO;
}
