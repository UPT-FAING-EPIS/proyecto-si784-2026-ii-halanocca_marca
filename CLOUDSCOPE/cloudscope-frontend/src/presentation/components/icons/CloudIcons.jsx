/**
 * CloudIcons – Iconos vectoriales oficiales y estilizados para CloudScope.
 * Proveedores Oficiales: AWS, Microsoft Azure, Oracle Cloud (OCI), Google Cloud (GCP).
 * Tecnologías de Infraestructura: HashiCorp Terraform, Docker, Kubernetes.
 */

import React from 'react';

// ─── Logos Oficiales de Proveedores Cloud ─────────────────────────────────────

/** Logo oficial de Amazon Web Services (AWS) con la sonrisa icónica */
export function AwsLogo({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.8 12.8c0-.75.6-1.35 1.35-1.35.75 0 1.35.6 1.35 1.35 0 .74-.6 1.34-1.35 1.34-.75 0-1.35-.6-1.35-1.34z"
        fill="#FF9900"
      />
      <path
        d="M18.8 17.5c-2.4 1.7-5.5 2.6-8.5 2.5-4.3-.1-8.2-1.9-10.3-4.8-.2-.3 0-.7.3-.8.4-.1.7.1.9.4 1.9 2.5 5.3 4.1 9.1 4.2 2.7.1 5.4-.7 7.6-2.1.4-.3.9.1.9.6z"
        fill="#FF9900"
      />
      <path
        d="M19.7 16.1c-.2-.3-.9-.2-1.8.2-.9.4-1.7 1.1-1.6 1.4.1.2.7.2 1.6-.2.9-.4 1.7-1.1 1.8-1.4z"
        fill="#FF9900"
      />
      {/* Tipografía AWS vectorizada */}
      <path
        d="M5.5 9.5l1.6-4.5h1.2l1.6 4.5h-1l-.3-1h-1.8l-.3 1H5.5zm1.5-1.8h1.4l-.7-2.1-.7 2.1zm4.8 1.8l-1.1-4.5h1.1l.6 2.9.7-2.9h1.1l.7 2.9.6-2.9h1.1l-1.1 4.5h-1.1l-.7-2.8-.7 2.8h-1.2zm6.7.1c-.8 0-1.5-.4-1.8-1l.9-.5c.2.4.5.6.9.6.5 0 .8-.2.8-.5 0-.4-.3-.5-1-.7-.8-.2-1.4-.6-1.4-1.4 0-.8.7-1.4 1.7-1.4.7 0 1.3.3 1.6.8l-.8.5c-.2-.3-.4-.5-.8-.5-.4 0-.7.2-.7.5 0 .3.3.4.9.6 1 .2 1.5.6 1.5 1.4 0 .9-.7 1.6-1.7 1.6z"
        fill="#F8FAFC"
      />
    </svg>
  );
}

/** Logo oficial de Microsoft Azure (Símbolo Azure 'A' de nube moderna) */
export function AzureLogo({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.05 3.5h-4.3a.85.85 0 0 0-.8.56L2.05 19.34a.85.85 0 0 0 .8 1.16h5.36a.85.85 0 0 0 .8-.56l1.2-3.3h5.92l.85 3.3a.85.85 0 0 0 .82.56h4.15a.85.85 0 0 0 .8-1.16L13.85 4.06a.85.85 0 0 0-.8-.56zm-2.2 9.68L12.7 7.8l1.86 5.38h-3.71z"
        fill="#0078D4"
      />
      <path
        d="M13.2 3.5l4.6 13.2a.85.85 0 0 1-.8 1.1h-2.1l-1.7-5.2-2.4 7.4h-2l4.4-16.5z"
        fill="#50E6FF"
        opacity="0.9"
      />
    </svg>
  );
}

/** Logo oficial de Oracle Cloud Infrastructure (OCI) */
export function OracleLogo({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.8 4h8.4C20.5 4 24 7.5 24 11.9c0 4.4-3.5 7.9-7.8 7.9H7.8C3.5 19.8 0 16.3 0 11.9 0 7.5 3.5 4 7.8 4zm8.3 12.3c2.4 0 4.3-1.9 4.3-4.4 0-2.4-1.9-4.4-4.3-4.4H7.9c-2.4 0-4.3 2-4.3 4.4 0 2.4 1.9 4.4 4.3 4.4h8.2z"
        fill="#F80000"
      />
    </svg>
  );
}

/** Logo oficial de Google Cloud Platform (GCP 4 colores: Azul, Rojo, Amarillo, Verde) */
export function GcpLogo({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
        fill="#4285F4"
      />
      <path
        d="M19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.6.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"
        fill="#EA4335"
        opacity="0.95"
      />
      <path
        d="M12 6c1.5 0 2.9.6 3.9 1.6L14 9.5c-.5-.5-1.2-.8-2-.8-1.5 0-2.8 1-3.2 2.4l-1.8-.7C7.7 8.3 9.7 6 12 6z"
        fill="#FBBC05"
      />
      <path
        d="M8.8 11.1C8.7 11.4 8.7 11.7 8.7 12s0 .6.1.9l-1.8.7C6.7 13.1 6.6 12.6 6.6 12s.1-1.1.4-1.6l1.8.7z"
        fill="#34A853"
      />
    </svg>
  );
}

/** Logo oficial de HashiCorp Terraform */
export function TerraformLogo({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 3.5L8 7.25V14.75L1.5 11V3.5Z" fill="#844FBA" />
      <path d="M8.75 7.75L15.25 11.5V19L8.75 15.25V7.75Z" fill="#844FBA" />
      <path d="M16 12L22.5 15.75V23.25L16 19.5V12Z" fill="#844FBA" />
      <path d="M16 4.5L22.5 8.25V15.75L16 12V4.5Z" fill="#5C4EE5" />
    </svg>
  );
}

/** Logo oficial de Docker */
export function DockerLogo({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.5 10.2c-.4-.3-1.4-.4-2.1-.2-.2-.6-.6-1.2-1.3-1.6l-.6-.3-.3.6c-.4.8-.4 1.7-.1 2.5-.5.3-1.3.3-2.1.2-.5 0-1 .2-1.5.5H2c-.4 2 0 4.1 1.2 5.8 1.4 2 3.6 3.2 6.3 3.3 5.4.2 10.3-2.8 12.1-7.5.9-.2 1.9-.9 2.2-1.8.3-.9.1-1.3-.8-1.5z"
        fill="#2496ED"
      />
      <rect x="5" y="10" width="2" height="1.8" rx="0.3" fill="#FFFFFF" />
      <rect x="7.5" y="10" width="2" height="1.8" rx="0.3" fill="#FFFFFF" />
      <rect x="10" y="10" width="2" height="1.8" rx="0.3" fill="#FFFFFF" />
      <rect x="7.5" y="7.7" width="2" height="1.8" rx="0.3" fill="#FFFFFF" />
      <rect x="10" y="7.7" width="2" height="1.8" rx="0.3" fill="#FFFFFF" />
      <rect x="10" y="5.4" width="2" height="1.8" rx="0.3" fill="#FFFFFF" />
    </svg>
  );
}

/** Logo oficial de Kubernetes (K8s) */
export function KubernetesLogo({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L3 7.2v10.4L12 22l9-5.2V7.2L12 2z"
        stroke="#326CE5"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="rgba(50,108,229,0.15)"
      />
      <circle cx="12" cy="12" r="3.2" stroke="#326CE5" strokeWidth="1.8" fill="#326CE5" />
      <path
        d="M12 5.5v3.3M12 15.2v3.3M5.5 12h3.3M15.2 12h3.3M7.4 7.4l2.3 2.3M14.3 14.3l2.3 2.3M7.4 16.6l2.3-2.3M14.3 9.7l2.3-2.3"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Logo vector oficial de CloudScope */
export function CloudScopeLogo({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="csGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="csGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="#0A0F1E" stroke="#1E293B" strokeWidth="1.5" />
      <path
        d="M16 5L26 10.5V21.5L16 27L6 21.5V10.5L16 5Z"
        fill="url(#csGrad)"
        opacity="0.2"
        stroke="url(#csGrad)"
        strokeWidth="1.8"
      />
      <circle cx="16" cy="16" r="4.5" fill="url(#csGrad)" />
      <circle cx="11" cy="13" r="2" fill="#38BDF8" />
      <circle cx="21" cy="13" r="2" fill="#34D399" />
      <circle cx="16" cy="22" r="2" fill="#C084FC" />
      <line x1="11" y1="13" x2="16" y2="16" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1 1" />
      <line x1="21" y1="13" x2="16" y2="16" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1 1" />
      <line x1="16" y1="22" x2="16" y2="16" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1 1" />
    </svg>
  );
}

// ─── Iconos Oficiales de Servicios Cloud ──────────────────────────────────────

export function VpcIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
      <path d="M12 10v4M8 10v4M16 10v4" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  );
}

export function Ec2Icon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" fill={color} fillOpacity={0.2} />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

export function RdsIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" fill={color} fillOpacity={0.15} />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export function S3Icon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" fill={color} fillOpacity={0.12} />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

export function LambdaIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l7-14h3l6 14" />
      <path d="M14 14l-5 6" />
      <circle cx="12" cy="3.5" r="1.5" fill={color} />
    </svg>
  );
}

export function AlbIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v12" />
      <circle cx="18" cy="6" r="3" fill={color} fillOpacity={0.2} />
      <circle cx="6" cy="18" r="3" fill={color} fillOpacity={0.2} />
      <path d="M18 9v12" />
      <path d="M6 15l12-6" strokeWidth={2.2} />
    </svg>
  );
}

export function IgwIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity={0.1} />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9 14 14 0 0 1-4-9 14 14 0 0 1 4-9z" />
    </svg>
  );
}

// ─── Iconos de UI / Acciones ──────────────────────────────────────────────────

export function SaveIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export function PDFIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function BlastIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function StopIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <rect x="9" y="9" width="6" height="6" fill="currentColor" opacity={0.7} rx="1" />
    </svg>
  );
}

export function TrashIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

export function FolderIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}

export function ShieldIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function DollarIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

export function BeakerIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M9 3v7L4 18a1 1 0 00.9 1.5h14.2A1 1 0 0020 18l-5-8V3" />
      <path d="M6 18h12" strokeDasharray="2 2" opacity={0.5} />
    </svg>
  );
}

export function LightbulbIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" opacity={0.15} fill="currentColor" />
      <path d="M9.66 18h4.68M12 2a7 7 0 015 11.9V17H7v-3.1A7 7 0 0112 2z" />
    </svg>
  );
}

export function WarningIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function HexagonIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 5v10l-9 5-9-5V7z" />
    </svg>
  );
}

export function GridIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

export function UndoIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10h10a5 5 0 015 5v2" />
      <path d="M7 6L3 10l4 4" />
    </svg>
  );
}

export function RedoIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10H11a5 5 0 00-5 5v2" />
      <path d="M17 6l4 4-4 4" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── Función helper para obtener el icono adecuado de cualquier servicio ──────

export function getServiceIcon(type, className = "w-4 h-4", color) {
  switch (type) {
    case 'vpc':
    case 'azure_vnet':
    case 'gcp_vpc':
    case 'oci_vcn':
      return <VpcIcon className={className} color={color} />;
    case 'subnet':
    case 'azure_subnet':
    case 'gcp_subnet':
    case 'oci_subnet':
      return <VpcIcon className={className} color={color} />;
    case 'ec2':
    case 'azure_vm':
    case 'gcp_gce':
    case 'oci_compute':
      return <Ec2Icon className={className} color={color} />;
    case 'rds':
    case 'azure_sql':
    case 'gcp_cloudsql':
    case 'oci_autonomous_db':
      return <RdsIcon className={className} color={color} />;
    case 's3':
    case 'azure_blob':
    case 'gcp_gcs':
    case 'oci_object_storage':
      return <S3Icon className={className} color={color} />;
    case 'lambda':
    case 'azure_function':
    case 'gcp_cloudfunction':
    case 'oci_functions':
      return <LambdaIcon className={className} color={color} />;
    case 'alb':
    case 'azure_appgw':
    case 'gcp_lb':
    case 'oci_lb':
      return <AlbIcon className={className} color={color} />;
    case 'igw':
      return <IgwIcon className={className} color={color} />;
    case 'block':
      return <BlockIcon className={className} color={color} />;
    case 'text_label':
      return <TextLabelIcon className={className} color={color} />;
    case 'icon':
      return <SparkleIcon className={className} color={color} />;
    case 'image':
      return <ImageIcon className={className} color={color} />;
    case 'area':
      return <AreaIcon className={className} color={color} />;
    case 'auto_scaling':
      return <Ec2Icon className={className} color={color} />;
    case 'zone':
      return <VpcIcon className={className} color={color} />;
    case 'ecs_cluster':
    case 'ecs_service':
      return <DockerLogo className={className} />;
    default:
      return <span className="font-bold text-[10px]">{type?.substring(0, 3)?.toUpperCase()}</span>;
  }
}

// ─── Iconos de Interfaz estilo Brainboard ──────────────────────────────────────

export function LockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

export function UserIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export function CreditCardIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsersIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

export function KeyIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

export function SparkleIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z" />
    </svg>
  );
}

export function PlayCircleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HelpCircleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
    </svg>
  );
}

export function HeadsetIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zm18 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z" />
    </svg>
  );
}

export function PowerIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0M12 2v10" />
    </svg>
  );
}

export function ChevronDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function ChevronUpIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

export function ZoomInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function ZoomOutIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function FitViewIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );
}

export function BlockIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="3" y1="9" x2="21" y2="9" opacity="0.4" />
    </svg>
  );
}

export function TextLabelIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

export function ImageIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export function AreaIcon({ className = 'w-4 h-4', color = 'currentColor' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeDasharray="3 3">
      <rect x="3" y="3" width="18" height="18" rx="4" />
    </svg>
  );
}

export function SunIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function MoonIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

