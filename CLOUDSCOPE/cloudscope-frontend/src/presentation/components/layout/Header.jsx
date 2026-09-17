import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatUSD } from '../../../application/use-cases/calculateCost.js';
import { ARCHITECTURE_PRESETS } from '../../../domain/models/ArchitecturePresets.js';
import { getCurrentProject } from '../../../infrastructure/api/projectStorage.js';
import { useEditorTheme } from '../../context/EditorThemeContext.jsx';
import {
  CloudScopeLogo, AwsLogo, AzureLogo, OracleLogo, GcpLogo,
  SaveIcon, PDFIcon, BlastIcon, StopIcon, XIcon, CheckIcon,
  UndoIcon, RedoIcon, ArrowLeftIcon, LockIcon, UserIcon,
  CreditCardIcon, UsersIcon, KeyIcon, SparkleIcon,
  PlayCircleIcon, HelpCircleIcon, HeadsetIcon, PowerIcon,
  ChevronDownIcon, SunIcon, MoonIcon
} from '../icons/CloudIcons.jsx';

export default function Header({
  costBreakdown,
  auditResult,
  onExportIaC,
  onExportPDF,
  onSave,
  blastActive,
  onClearBlast,
  onLoadPreset,
  onClearCanvas,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) {
  const navigate = useNavigate();
  const { theme, isDark, isLight, toggleTheme } = useEditorTheme();
  const [exported, setExported] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const presetsRef = useRef(null);
  const userMenuRef = useRef(null);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (presetsRef.current && !presetsRef.current.contains(e.target)) {
        setShowPresets(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sesión de usuario
  const userRaw = localStorage.getItem('cs_user');
  const user = userRaw ? JSON.parse(userRaw) : { name: 'STEVIE', email: 'dev@cloudscope.io' };
  const displayName = (user?.name || user?.username || 'STEVIE').toUpperCase();
  const userInitials = displayName.split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2) || 'GM';
  const currentProject = getCurrentProject();

  const handleLogout = () => {
    sessionStorage.setItem('cs_logout', '1');
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
    navigate('/login');
  };

  const total = costBreakdown?.total ?? 0;
  const score = auditResult?.score ?? 100;
  const issueCount = auditResult?.total ?? 0;
  const critical = auditResult?.critical ?? 0;

  const scoreColor =
    score >= 80 ? '#34d399' :
    score >= 60 ? '#f59e0b' :
    score >= 40 ? '#f97316' : '#ef4444';

  const issueColor =
    critical > 0 ? '#ef4444' :
    issueCount > 0 ? '#f97316' : '#475569';

  const handleExport = () => {
    onExportIaC?.();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const handleMenuAction = (actionTitle, detail) => {
    setShowUserMenu(false);
    setModalInfo({
      title: actionTitle,
      detail: detail || `Módulo configurado para la cuenta de ${displayName}. Todas las sincronizaciones y parámetros están activos.`
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <header
        className="flex items-center justify-between px-3 md:px-4 z-40 shrink-0 gap-2 transition-colors duration-200"
        style={{
          height: '52px',
          background: isLight ? '#ffffff' : '#0a0f1e',
          borderBottom: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
          boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.04)' : '0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* ── Izquierda: Logo + Breadcrumb Proyectos + Historial Deshacer/Rehacer ── */}
        <div className="flex items-center gap-2.5">
          {/* Logo oficial CloudScope */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            title="Ir al Dashboard de Proyectos"
          >
            <CloudScopeLogo className="w-6 h-6 shrink-0" />
            <span className="font-black text-sm tracking-tight hidden sm:block" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>
              Cloud<span style={{ color: '#f59e0b' }}>Scope</span>
            </span>
          </button>

          <span className={`text-xs select-none ${isLight ? 'text-slate-300' : 'text-slate-700'}`}>/</span>

          {/* Volver a Proyectos */}
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Volver a la lista de proyectos"
          >
            <ArrowLeftIcon className="w-3 h-3 shrink-0" />
            <span>Proyectos</span>
          </button>

          {currentProject?.name && (
            <div className={`hidden lg:flex items-center gap-1.5 pl-2 border-l ${isLight ? 'border-slate-200' : 'border-slate-800'} text-xs`}>
              <span className={`font-mono text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>PROYECTO:</span>
              <span className={`font-bold truncate max-w-[200px] ${isLight ? 'text-amber-600' : 'text-amber-400'}`} title={currentProject.name}>
                {currentProject.name}
              </span>
            </div>
          )}

          {/* Controles de Historial del Lienzo: Deshacer / Rehacer */}
          <div className={`flex items-center gap-1 ml-1 pl-2 border-l ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-[11px] transition-all"
              style={{
                background: isLight
                  ? (canUndo ? '#f1f5f9' : 'rgba(241,245,249,0.5)')
                  : (canUndo ? '#1e293b' : 'rgba(30,41,59,0.4)'),
                color: isLight
                  ? (canUndo ? '#1e293b' : '#94a3b8')
                  : (canUndo ? '#cbd5e1' : '#475569'),
                border: `1px solid ${isLight ? '#cbd5e1' : '#334155'}`,
                cursor: canUndo ? 'pointer' : 'not-allowed',
              }}
              title="Deshacer (Ctrl+Z)"
            >
              <UndoIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-[11px] transition-all"
              style={{
                background: isLight
                  ? (canRedo ? '#f1f5f9' : 'rgba(241,245,249,0.5)')
                  : (canRedo ? '#1e293b' : 'rgba(30,41,59,0.4)'),
                color: isLight
                  ? (canRedo ? '#1e293b' : '#94a3b8')
                  : (canRedo ? '#cbd5e1' : '#475569'),
                border: `1px solid ${isLight ? '#cbd5e1' : '#334155'}`,
                cursor: canRedo ? 'pointer' : 'not-allowed',
              }}
              title="Rehacer (Ctrl+Y)"
            >
              <RedoIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicador de Blast Radius activo */}
          {blastActive && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="hidden sm:inline">Blast Radius activo</span>
              <button onClick={onClearBlast} className="ml-0.5 opacity-70 hover:opacity-100" title="Detener simulación">
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Status bar central */}
        <div
          className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl text-[11px]"
          style={{
            background: isLight ? '#f8fafc' : '#0f172a',
            border: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span style={{ color: isLight ? '#64748b' : '#475569' }}>FinOps</span>
            <span className="font-black font-mono" style={{ color: '#10b981' }}>
              {formatUSD(total)}<span className="text-[9px] font-normal" style={{ color: isLight ? '#94a3b8' : '#475569' }}>/mo</span>
            </span>
          </div>
          <div className="w-px h-4" style={{ background: isLight ? '#e2e8f0' : '#1e293b' }} />
          <div className="flex items-center gap-1.5">
            <span style={{ color: isLight ? '#64748b' : '#475569' }}>Score</span>
            <span className="font-black font-mono" style={{ color: scoreColor }}>
              {score}<span className="text-[9px] font-normal" style={{ color: isLight ? '#94a3b8' : '#475569' }}>/100</span>
            </span>
          </div>
          <div className="w-px h-4" style={{ background: isLight ? '#e2e8f0' : '#1e293b' }} />
          <span
            className="font-bold px-2 py-0.5 rounded-full text-[10px]"
            style={{
              background: critical > 0 ? 'rgba(239,68,68,0.12)' : issueCount > 0 ? 'rgba(249,115,22,0.12)' : 'rgba(71,85,105,0.12)',
              color: issueColor,
              border: `1px solid ${issueColor}40`,
            }}
          >
            {issueCount === 0 ? (
              <span className="flex items-center gap-1"><CheckIcon className="w-3 h-3" /> Clean</span>
            ) : `${issueCount} Issue${issueCount !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Acciones del Editor */}
        <div className="flex items-center gap-2">
          {/* Plantillas de Arquitectura (Presets) */}
          <div className="relative" ref={presetsRef}>
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
              style={{
                background: isLight ? '#fdf4ff' : '#1e293b',
                color: isLight ? '#9333ea' : '#c084fc',
                border: `1px solid ${isLight ? '#f0abfc' : 'rgba(192,132,252,0.35)'}`,
                boxShadow: '0 2px 6px rgba(192,132,252,0.1)',
              }}
              title="Cargar arquitecturas empresariales de referencia"
            >
              <BlastIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plantillas</span>
              <span className="text-[9px] opacity-70">▼</span>
            </button>

            {showPresets && (
              <div
                className="absolute right-0 sm:left-0 mt-2 w-72 rounded-2xl p-2 z-50 shadow-2xl space-y-1"
                style={{
                  background: isLight ? '#ffffff' : '#0b1120',
                  border: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  Arquitecturas de Referencia
                </div>
                {ARCHITECTURE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onLoadPreset?.(p);
                      setShowPresets(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors border border-transparent flex flex-col gap-1 ${
                      isLight
                        ? 'hover:bg-slate-100 hover:border-slate-200'
                        : 'hover:bg-slate-800/80 hover:border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {p.provider === 'aws' ? <AwsLogo className="w-3.5 h-3.5 shrink-0" /> : p.provider === 'azure' ? <AzureLogo className="w-3.5 h-3.5 shrink-0" /> : p.provider === 'oracle' ? <OracleLogo className="w-3.5 h-3.5 shrink-0" /> : <GcpLogo className="w-3.5 h-3.5 shrink-0" />}
                        <span className={`text-[11px] font-bold truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{p.name}</span>
                      </div>
                      <span
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                        style={{ color: p.color, background: `${p.color}20` }}
                      >
                        {p.badge ?? p.provider}
                      </span>
                    </div>
                    <p className={`text-[10px] line-clamp-2 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {p.description}
                    </p>
                  </button>
                ))}
                <div className={`pt-1 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
                  <button
                    onClick={() => {
                      onClearCanvas?.();
                      setShowPresets(false);
                    }}
                    className="w-full text-center py-1 text-[10px] font-semibold text-slate-500 hover:text-red-500 transition-colors flex items-center justify-center gap-1"
                  >
                    <XIcon className="w-3 h-3" /> Limpiar lienzo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guardar */}
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shadow-sm"
            style={{
              background: isLight ? '#f1f5f9' : '#1e293b',
              color: isLight ? '#334155' : '#94a3b8',
              border: `1px solid ${isLight ? '#cbd5e1' : '#334155'}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = isLight ? '#0f172a' : '#f8fafc';
              e.currentTarget.style.borderColor = isLight ? '#94a3b8' : '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isLight ? '#334155' : '#94a3b8';
              e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : '#334155';
            }}
            title="Guardar proyecto (Ctrl+S)"
          >
            <SaveIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guardar</span>
          </button>

          {/* ── SELECTOR MODO VISUAL: BLANCO / OSCURO ── */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shadow-sm"
            style={isDark ? {
              background: '#1e293b',
              color: '#facc15',
              border: '1px solid #334155',
            } : {
              background: '#f8fafc',
              color: '#334155',
              border: '1px solid #cbd5e1',
            }}
            title={isDark ? 'Cambiar a modo visual blanco (Lienzo claro)' : 'Cambiar a modo visual oscuro'}
          >
            {isDark ? (
              <>
                <SunIcon className="w-3.5 h-3.5 text-yellow-400" />
                <span className="hidden sm:inline">Visual Blanco</span>
              </>
            ) : (
              <>
                <MoonIcon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Visual Oscuro</span>
              </>
            )}
          </button>

          {/* ── BOTÓN BLANCO: Share & Export (Estilo Brainboard del Screenshot) ── */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all shadow-sm"
            style={{
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#94a3b8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            title="Compartir arquitectura y exportar IaC / PDF"
          >
            <LockIcon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="font-bold">Share & Export</span>
          </button>

          {/* Separador */}
          <div className="w-px h-5 mx-0.5" style={{ background: isLight ? '#e2e8f0' : '#1e293b' }} />

          {/* ── PERFIL DE USUARIO CON AVATAR ROJO Y DROPDOWN BLANCO ── */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-1.5 py-1 rounded-lg transition-all hover:bg-slate-800/60"
              title={`Perfil de ${displayName}`}
            >
              {/* Badge Circular Rojo con Iniciales (ej. GM) */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-black text-[11px] text-white shadow-sm shrink-0"
                style={{ background: '#ef4444', letterSpacing: '-0.5px' }}
              >
                {userInitials}
              </div>

              {/* Nombre de usuario en mayúsculas negrita */}
              <span className="font-extrabold text-xs text-white tracking-wide hidden sm:inline">
                {displayName}
              </span>

              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Menú Desplegable Blanco Estilo Brainboard */}
            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl py-1.5 z-50 text-xs shadow-2xl animate-in fade-in slide-in-from-top-1"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Bloque 1: Configuración de cuenta y equipo */}
                <button
                  onClick={() => handleMenuAction('User settings', 'Configuración de perfil, correo y preferencias personales.')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <UserIcon className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>User settings</span>
                </button>
                <button
                  onClick={() => handleMenuAction('Subscription settings', 'Plan actual: Enterprise CloudScope. Facturación mensual habilitada.')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <CreditCardIcon className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Subscription settings</span>
                </button>
                <button
                  onClick={() => handleMenuAction('Team settings', 'Gestión de miembros de equipo, roles RBAC y permisos de workspace.')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <UsersIcon className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Team settings</span>
                </button>

                {/* Bloque 2: Cuentas de nubes y claves (AWS, Azure, Oracle, Google Cloud) */}
                <button
                  onClick={() => handleMenuAction('AWS accounts', 'Conexión con AWS Organizations y IAM Roles configurada.')}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <AwsLogo className="w-4 h-4 shrink-0" />
                    <span>AWS accounts</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Pro</span>
                </button>
                <button
                  onClick={() => handleMenuAction('Azure accounts', 'Conexión con Azure Subscriptions y Azure Active Directory activa.')}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <AzureLogo className="w-4 h-4 shrink-0" />
                    <span>Azure accounts</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Pro</span>
                </button>
                <button
                  onClick={() => handleMenuAction('Oracle accounts', 'Conexión con OCI Compartments y Oracle Cloud Infrastructure activa.')}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <OracleLogo className="w-4 h-4 shrink-0" />
                    <span>Oracle accounts</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Pro</span>
                </button>
                <button
                  onClick={() => handleMenuAction('Google Cloud accounts', 'Conexión con Google Cloud Service Accounts y Proyectos activa.')}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <GcpLogo className="w-4 h-4 shrink-0" />
                    <span>Google Cloud accounts</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Pro</span>
                </button>
                <button
                  onClick={() => handleMenuAction('API keys', 'Llaves de API generadas para CI/CD pipelines (GitHub Actions, GitLab CI).')}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <KeyIcon className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>API keys</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Pro</span>
                </button>
                <button
                  onClick={() => handleMenuAction('Security & SSO', 'Single Sign-On (SAML 2.0 / OIDC) y políticas de cifrado empresarial.')}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <LockIcon className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Security & SSO</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Enterprise</span>
                </button>

                {/* Divisor */}
                <div className="h-px bg-slate-200 my-1" />

                {/* Bloque 3: Novedades, tutorial y ayuda */}
                <button
                  onClick={() => handleMenuAction("What's new", "Versión 2.5: Integración completa de Oracle Cloud, Barra blanca de componentes y soporte Multi-Cloud.")}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <SparkleIcon className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>What's new</span>
                </button>
                <button
                  onClick={() => handleMenuAction('Start tutorial', 'Arrastra componentes desde la barra izquierda hacia el lienzo. Conecta los nodos para calcular costos FinOps y auditar la seguridad.')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <PlayCircleIcon className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Start tutorial</span>
                </button>
                <button
                  onClick={() => handleMenuAction('Help', 'Documentación interactiva disponible en docs.cloudscope.io')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <HelpCircleIcon className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Help</span>
                </button>
                <button
                  onClick={() => handleMenuAction('Contact support', 'Soporte prioritario: soporte@cloudscope.io (Tiempo de respuesta < 15 min).')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors text-left text-slate-700 font-medium"
                >
                  <HeadsetIcon className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Contact support</span>
                </button>

                {/* Divisor */}
                <div className="h-px bg-slate-200 my-1" />

                {/* Bloque 4: Cerrar Sesión */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-50 text-red-600 transition-colors text-left font-bold"
                >
                  <PowerIcon className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Sign out - {displayName}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MODAL: Share & Export ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div
            className="w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5"
            style={{ background: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1' }}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <LockIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Share & Export</h3>
                  <p className="text-xs text-slate-500">Comparte tu arquitectura o expórtala en múltiples formatos</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Opciones de Exportación */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Exportar Infraestructura como Código (IaC)
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    handleExport();
                    setShowShareModal(false);
                  }}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    TF
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Terraform (IaC)</div>
                    <div className="text-[10px] text-slate-500">Generar código .tf multi-nube</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onExportPDF?.();
                    setShowShareModal(false);
                  }}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-red-500 hover:bg-red-50/50 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    <PDFIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Reporte PDF (RF-11)</div>
                    <div className="text-[10px] text-slate-500">Auditoría y desglose FinOps</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Compartir enlace */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Enlace para Compartir
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-700 select-all font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0"
                  style={{
                    background: copiedLink ? '#10b981' : '#0084ff',
                    color: '#ffffff',
                  }}
                >
                  {copiedLink ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Cualquier miembro de tu equipo con acceso a CloudScope podrá ver esta arquitectura.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE ACCIONES DEL MENÚ ── */}
      {modalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4"
            style={{ background: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1' }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">{modalInfo.title}</h3>
              <button
                onClick={() => setModalInfo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {modalInfo.detail}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalInfo(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

