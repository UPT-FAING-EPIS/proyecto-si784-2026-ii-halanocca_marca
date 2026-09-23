/**
 * Guide.jsx – Guía Interactiva y Paso a Paso para Principiantes en CloudScope.
 * Diseñada para que cualquier usuario, sin conocimientos previos, aprenda
 * a crear un proyecto de arquitectura Multi-Cloud desde cero.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudScopeLogo, AwsLogo, AzureLogo, OracleLogo, GcpLogo,
  TerraformLogo, DollarIcon, ShieldIcon, SparkleIcon,
  PlayCircleIcon, ArrowRightIcon, CheckIcon, BlastIcon,
  FolderIcon, SaveIcon, HelpCircleIcon
} from '../components/icons/CloudIcons.jsx';
import { ARCHITECTURE_PRESETS } from '../../domain/models/ArchitecturePresets.js';
import { saveProject, loadProject } from '../../infrastructure/api/projectStorage.js';

export default function Guide({ onBack }) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Estado para el Simulador Interactivo de 3 pasos dentro de la guía
  const [demoState, setDemoState] = useState({
    hasLb: false,
    hasServers: false,
    hasDb: false,
  });

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Acción para lanzar un proyecto con una plantilla de inicio recomendada
  const handleLaunchPreset = (presetId) => {
    const preset = ARCHITECTURE_PRESETS.find(p => p.id === presetId) || ARCHITECTURE_PRESETS[0];
    const saved = saveProject(
      `${preset.name} (Práctica Guía)`,
      `Proyecto creado desde la Guía interactiva paso a paso para aprender CloudScope.`,
      preset.nodes,
      preset.edges
    );
    loadProject(saved.id);
    navigate('/editor');
  };

  const handleLaunchBlank = () => {
    const saved = saveProject(
      'Mi Primer Proyecto Cloud',
      'Proyecto creado desde cero siguiendo la guía de inicio.',
      [],
      []
    );
    loadProject(saved.id);
    navigate('/editor');
  };

  const steps = [
    {
      id: 1,
      tag: 'Conceptos Clave',
      title: '1. ¿Qué es CloudScope y la Nube?',
      desc: 'Comprende los fundamentos básicos antes de diseñar tu infraestructura.',
      badgeColor: '#0284c7',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            <strong>CloudScope</strong> es una plataforma visual que te permite diseñar arquitecturas de computación en la nube para las principales plataformas del mundo: <strong>Amazon Web Services (AWS)</strong>, <strong>Microsoft Azure</strong>, <strong>Google Cloud (GCP)</strong> y <strong>Oracle Cloud (OCI)</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
              <span className="text-xs font-black uppercase text-blue-700 flex items-center gap-1.5 mb-1">
                ☁️ ¿Qué es la Computación en la Nube?
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                En lugar de comprar servidores físicos costosos para tu oficina, alquilas computadoras virtuales, almacenamiento y bases de datos por internet, pagando solo por los segundos o minutos que los usas.
              </p>
            </div>

            <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl">
              <span className="text-xs font-black uppercase text-purple-700 flex items-center gap-1.5 mb-1">
                🌐 ¿Qué significa Multi-Cloud?
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Significa que tu empresa no depende de un único proveedor. Puedes tener tu aplicación web en <strong>AWS</strong> y tu base de datos crítica en <strong>Oracle</strong> o respaldos en <strong>Azure</strong>, todo en el mismo mapa visual.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Los 4 Proveedores que puedes usar en CloudScope:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                <AwsLogo className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold text-slate-700">AWS (Amazon)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                <AzureLogo className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold text-slate-700">Azure (Microsoft)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                <GcpLogo className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold text-slate-700">Google Cloud</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                <OracleLogo className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold text-slate-700">Oracle Cloud</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      tag: 'Primer Proyecto',
      title: '2. Crear tu Primer Proyecto desde Cero',
      desc: 'Elige cómo quieres empezar: lienzo vacío o utilizando una plantilla.',
      badgeColor: '#10b981',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            Para iniciar tu trabajo en CloudScope, tienes 3 formas sencillas de empezar. No requieres conocimientos técnicos previos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-blue-400 transition-all">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-2">
                A
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-1">Botón "+ Nuevo Proyecto"</h4>
              <p className="text-xs text-slate-500 mb-3">
                Abre una ventana emergente donde ingresas el nombre de tu proyecto (ej: "Mi Tienda Online") y una breve descripción.
              </p>
              <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Recomendado para organizar
              </span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-400 transition-all">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2">
                B
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-1">Lienzo en Blanco Directo</h4>
              <p className="text-xs text-slate-500 mb-3">
                Haz clic en <em>"Lienzo en blanco"</em> en la barra izquierda para abrir el editor inmediatamente y empezar a dibujar.
              </p>
              <button
                onClick={handleLaunchBlank}
                className="w-full py-1 px-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                Abrir Lienzo en Blanco →
              </button>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-purple-400 transition-all">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm mb-2">
                C
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-1">Cargar Plantilla Prehecha</h4>
              <p className="text-xs text-slate-500 mb-3">
                Si no sabes qué componentes usar, carga una arquitectura prehecha como una Web 3-Capas o Microservicios.
              </p>
              <button
                onClick={() => handleLaunchPreset('aws_3tier')}
                className="w-full py-1 px-2 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                Cargar Plantilla de Ejemplo →
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Tip para principiantes:</strong> Te sugerimos empezar con la opción C o con el simulador interactivo al final de esta página para ver cómo se conectan los servicios.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      tag: 'El Editor',
      title: '3. Las 4 Zonas del Editor Visual',
      desc: 'Aprende a navegar por la interfaz del diseñador arquitectónico.',
      badgeColor: '#f59e0b',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            Cuando entres al Editor de CloudScope, la pantalla se divide en 4 áreas principales intuitivas:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-800">Barra Superior (Top Bar)</h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aquí ves el costo mensual total estimado en dólares ($ USD), la puntuación de seguridad (Score Well-Architected), y botones para <strong>Guardar (Ctrl+S)</strong>, <strong>Exportar a PDF</strong> y <strong>Exportar a Terraform</strong>.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-800">Paleta de Componentes (Barra Izquierda)</h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  El catálogo de servicios clasificados por pestañas: <strong>AWS</strong>, <strong>Azure</strong>, <strong>Oracle</strong>, <strong>GCP</strong> y formas visuales. Cada servicio (servidor, base de datos, balanceador) tiene su icono y precio base.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-800">El Lienzo Central (Canvas)</h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tu pizarra interactiva infinita. Puedes hacer zoom con la rueda del ratón, arrastrar para moverte por el espacio, colocar nodos y trazar flechas de conexión.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-800">Inspector de Propiedades (Barra Derecha)</h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  Al hacer clic sobre cualquier servicio en el lienzo, aquí podrás cambiar su nombre, elegir el tamaño de máquina (ej. <em>t2.micro</em> vs <em>t3.large</em>), espacio en disco (GB) y ver el desglose de costo individual.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      tag: 'Arrastrar y Soltar',
      title: '4. Arrastrar y Soltar Componentes al Lienzo',
      desc: 'Cómo añadir tus servidores y servicios a la arquitectura.',
      badgeColor: '#ec4899',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            Añadir cualquier servicio es tan fácil como arrastrar y soltar (Drag and Drop):
          </p>

          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <li className="leading-relaxed">
              En la <strong>paleta izquierda</strong>, haz clic en la pestaña de la nube que deseas (ejemplo: <strong>AWS</strong>).
            </li>
            <li className="leading-relaxed">
              Busca el servicio que necesitas (por ejemplo, <strong>EC2 Instance</strong> para un servidor web, o <strong>RDS Database</strong> para guardar datos).
            </li>
            <li className="leading-relaxed">
              Mantén presionado el clic sobre la tarjeta del componente y <strong>arrástralo hacia el centro del lienzo</strong>.
            </li>
            <li className="leading-relaxed">
              Suelta el clic. ¡Listo! El componente aparecerá en tu mapa con su ícono oficial y su costo estimado inicial.
            </li>
          </ol>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
            <span className="text-2xl">🖱️</span>
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>Atajos útiles:</strong> Puedes mover cualquier nodo libremente por el lienzo. Si deseas eliminarlo, haz clic sobre él y presiona la tecla <code>Supr / Delete</code> o usa el botón de papelera en el panel derecho.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      tag: 'Conectar Nodos',
      title: '5. Conectar Componentes y Modelar el Flujo',
      desc: 'Cómo comunicar servidores, balanceadores y bases de datos.',
      badgeColor: '#8b5cf6',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            Para que tu sistema funcione, los componentes deben comunicarse entre sí. Por ejemplo, los usuarios de internet llegan al balanceador, y el balanceador envía peticiones a los servidores web:
          </p>

          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 font-mono text-xs">
            <div className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">
              Flujo Estándar de una Aplicación Web Moderna:
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-blue-900/60 text-blue-300 rounded border border-blue-700">Internet / Usuarios</span>
              <span className="text-slate-500">➔</span>
              <span className="px-2 py-1 bg-amber-900/60 text-amber-300 rounded border border-amber-700">Load Balancer (ALB)</span>
              <span className="text-slate-500">➔</span>
              <span className="px-2 py-1 bg-emerald-900/60 text-emerald-300 rounded border border-emerald-700">Servidores Web (EC2 / VM)</span>
              <span className="text-slate-500">➔</span>
              <span className="px-2 py-1 bg-purple-900/60 text-purple-300 rounded border border-purple-700">Base de Datos (RDS / SQL)</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
            <h5 className="font-bold text-xs text-slate-800">¿Cómo crear una conexión en la pantalla?</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Pasa el cursor sobre un nodo; verás pequeños círculos en sus bordes (llamados <em>puntos conectores o handles</em>).<br />
              2. Haz clic sobre uno de esos puntos y, <strong>sin soltar el botón</strong>, arrastra la línea hacia el conector del otro nodo.<br />
              3. Cuando sueltes, se creará una flecha que representa la conexión de red entre ambos servicios.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      tag: 'FinOps y Costos',
      title: '6. Monitoreo de Costos en Tiempo Real (FinOps)',
      desc: 'Evita sorpresas: sabe exactamente cuánto costará tu sistema por mes.',
      badgeColor: '#16a34a',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            Uno de los mayores miedos de los principiantes en la nube es recibir facturas inesperadas. En CloudScope, el cálculo de costos (<strong>FinOps</strong>) se actualiza de inmediato cada vez que agregas o modificas un servicio:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5 mb-1">
                <DollarIcon className="w-4 h-4 text-emerald-600" /> Total Mensual Global
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ubicado en la barra superior. Si sumas 2 servidores de $14.60/mes y una base de datos de $35.00/mes, verás de inmediato el total de <strong>$64.20 / mes</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
              <span className="text-xs font-black uppercase text-blue-800 flex items-center gap-1.5 mb-1">
                ⚙️ Ajuste de Especificaciones
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                En el inspector derecho puedes probar cambiar a un tipo de máquina más pequeño (ej. <em>t2.micro</em>, ideal para pruebas) para ver cuánto ahorras antes de implementarlo en la vida real.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      tag: 'Auditoría',
      title: '7. Auditoría de Seguridad y Resiliencia (Score)',
      desc: 'Aprende buenas prácticas de arquitectura como un profesional.',
      badgeColor: '#dc2626',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            ¿Cómo saber si tu diseño es seguro y no se caerá si muchos usuarios entran al mismo tiempo? El motor de <strong>Auditoría Well-Architected</strong> revisa tu diseño automáticamente:
          </p>

          <div className="space-y-2">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold text-xs">🔴 Puntuación &lt; 60%</span>
                <span className="text-xs text-red-900">Riesgos críticos detectados (ej: base de datos expuesta directamente a internet sin protección).</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-bold text-xs">🟡 Puntuación 60% - 79%</span>
                <span className="text-xs text-amber-900">Aceptable, pero con advertencias (ej: falta de alta disponibilidad en otra zona geográfica).</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold text-xs">🟢 Puntuación &gt;= 80%</span>
                <span className="text-xs text-emerald-900">¡Excelente! Sigue las mejores prácticas de seguridad, respaldo y balanceo de carga.</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic">
            * Haz clic en la pestaña <strong>Auditoría</strong> en la barra derecha del editor para ver la lista de recomendaciones exactas y cómo solucionarlas con un clic.
          </p>
        </div>
      )
    },
    {
      id: 8,
      tag: 'Simulación',
      title: '8. Radio de Explosión (Blast Radius)',
      desc: 'Descubre qué pasaría si un servidor o servicio se cae.',
      badgeColor: '#f97316',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            La función <strong>Blast Radius (Radio de Explosión)</strong> te permite simular una falla en cualquier componente y ver en tiempo real qué otros servicios dejarían de funcionar en cadena:
          </p>

          <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2">
            <h5 className="font-bold text-xs text-orange-900 flex items-center gap-2">
              <BlastIcon className="w-4 h-4 text-orange-600" /> ¿Cómo probar el Radio de Explosión?
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
              <li>Haz clic sobre un nodo central (por ejemplo, tu base de datos o balanceador de carga).</li>
              <li>En el panel derecho, haz clic en el botón <strong>"Calcular Blast Radius"</strong>.</li>
              <li>Los nodos afectados se iluminarán en rojo/naranja en el lienzo, mostrándote el impacto de la caída.</li>
              <li>Así puedes identificar "puntos únicos de falla" y añadir redundancia a tu sistema.</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 9,
      tag: 'Guardar y Compartir',
      title: '9. Guardar tu Proyecto y Exportar Reporte PDF',
      desc: 'Conserva tu progreso y genera reportes para tu equipo o profesores.',
      badgeColor: '#059669',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            No perderás tu trabajo. CloudScope te ofrece múltiples formas de guardar y compartir:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                💾 Guardado en el Navegador (Ctrl + S)
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guarda tu proyecto con un nombre. Se almacenará en tu navegador localmente y aparecerá en la pestaña <em>"Mis Proyectos"</em> del Dashboard.
              </p>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                📄 Exportar Reporte Ejecutivo en PDF
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Haz clic en <strong>"Exportar PDF"</strong> en la cabecera. Descargarás un documento formal listo para imprimir con el inventario de recursos, costos y auditoría.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 10,
      tag: 'Infraestructura Real',
      title: '10. Exportar a Terraform (IaC) para la Nube Real',
      desc: 'Convierte tu diagrama visual en código real desplegable en AWS o Azure.',
      badgeColor: '#7c3aed',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            El paso final y más potente: una vez que diseñaste tu arquitectura en el lienzo, no necesitas escribir cientos de líneas de código a mano.
          </p>

          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <TerraformLogo className="w-5 h-5" />
              <span className="text-xs font-bold text-purple-300">Infraestructura como Código (IaC con HashiCorp Terraform)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Haz clic en el botón <strong>"Exportar Terraform"</strong> en la cabecera del editor. CloudScope generará automáticamente el archivo <code>main.tf</code> listo para ser ejecutado con los comandos:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-emerald-400 border border-slate-800">
              terraform init<br />
              terraform plan<br />
              terraform apply
            </div>
            <p className="text-[11px] text-slate-400">
              ¡Y tu arquitectura se creará de verdad en los servidores de la nube!
            </p>
          </div>
        </div>
      )
    }
  ];

  // Filtrado de pasos por búsqueda
  const filteredSteps = steps.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentStepData = steps.find(s => s.id === activeStep) || steps[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">

      {/* ── Header de la Guía ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                ← Volver al Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                ← Dashboard
              </button>
            )}

            <div className="flex items-center gap-2">
              <CloudScopeLogo className="w-6 h-6" />
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-slate-900">
                  CloudScope <span className="text-blue-600">Academy</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Guía Paso a Paso para Principiantes
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLaunchBlank}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              <span>+ Crear Proyecto Ahora</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Principal ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <SparkleIcon className="w-3.5 h-3.5" />
            <span>Aprende desde cero • Sin experiencia previa necesaria</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            ¿Cómo usar CloudScope? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Guía de Arquitectura Cloud para Todos
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Aprende a diseñar tu primer sistema en la nube, calcular costos mensuales en tiempo real, auditar seguridad y exportar a Terraform con esta guía paso a paso.
          </p>

          {/* Buscador de temas en la guía */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en la guía (ej. crear proyecto, costos, conectar)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
              />
              <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenido de la Guía: Stepper y Detalle ───────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Columna Izquierda: Índice de Pasos (Navegación Vertical) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm sticky top-24">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center justify-between">
                <span>Ruta de Aprendizaje</span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {activeStep} de {steps.length}
                </span>
              </div>

              <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
                {filteredSteps.map((step) => {
                  const isActive = step.id === activeStep;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-blue-50 border-2 border-blue-500 shadow-xs'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {step.id}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                            {step.title.replace(/^\d+\.\s*/, '')}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {step.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Botón rápido para empezar a practicar */}
              <div className="pt-4 mt-3 border-t border-slate-100">
                <button
                  onClick={() => handleLaunchPreset('aws_3tier')}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <PlayCircleIcon className="w-4 h-4" />
                  <span>Probar con Plantilla Lista</span>
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Paso Activo Detallado */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              {/* Badge superior del paso */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-xs"
                  style={{ background: currentStepData.badgeColor }}
                >
                  Paso {currentStepData.id}: {currentStepData.tag}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={activeStep <= 1}
                    onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ← Anterior
                  </button>
                  <button
                    disabled={activeStep >= steps.length}
                    onClick={() => setActiveStep(prev => Math.min(prev + 1, steps.length))}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mb-6 pb-4 border-b border-slate-100">
                {currentStepData.desc}
              </p>

              {/* Contenido interactivo del paso */}
              <div className="min-h-[260px]">
                {currentStepData.content}
              </div>

              {/* Botonera de pie de paso */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">
                  Paso {currentStepData.id} de {steps.length}
                </span>

                <div className="flex items-center gap-2">
                  {currentStepData.id === steps.length ? (
                    <button
                      onClick={handleLaunchBlank}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckIcon className="w-4 h-4" />
                      <span>¡Todo listo! Diseñar mi Arquitectura</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveStep(prev => prev + 1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <span>Siguiente Paso</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Simulador Interactivo Hands-on para Principiantes ──────── */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-indigo-900/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎮</span>
                <h3 className="text-lg font-black tracking-tight text-white">
                  Mini Simulador Interactivo: "Tu Primera Web en 3 Clics"
                </h3>
              </div>
              <p className="text-xs text-indigo-200 mb-6">
                Prueba interactuar aquí mismo para entender cómo se arma un sistema básico y cómo cambian el costo y la puntuación de seguridad en vivo.
              </p>

              {/* Controles de adición de componentes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setDemoState(s => ({ ...s, hasLb: !s.hasLb }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    demoState.hasLb
                      ? 'bg-blue-500/20 border-blue-400 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center justify-between">
                    <span>1. Balanceador (ALB)</span>
                    <span>{demoState.hasLb ? '✅' : '➕'}</span>
                  </div>
                  <span className="text-[10px] opacity-75">Distribuye el tráfico de internet</span>
                </button>

                <button
                  onClick={() => setDemoState(s => ({ ...s, hasServers: !s.hasServers }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    demoState.hasServers
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center justify-between">
                    <span>2. Servidores Web</span>
                    <span>{demoState.hasServers ? '✅' : '➕'}</span>
                  </div>
                  <span className="text-[10px] opacity-75">2 Instancias EC2 para procesar</span>
                </button>

                <button
                  onClick={() => setDemoState(s => ({ ...s, hasDb: !s.hasDb }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    demoState.hasDb
                      ? 'bg-purple-500/20 border-purple-400 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 flex items-center justify-between">
                    <span>3. Base de Datos</span>
                    <span>{demoState.hasDb ? '✅' : '➕'}</span>
                  </div>
                  <span className="text-[10px] opacity-75">RDS PostgreSQL Multi-AZ</span>
                </button>
              </div>

              {/* Visualización del mini-canvas resultante */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-white/10 font-mono text-xs">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-3 flex items-center justify-between">
                  <span>Esquema Resultante:</span>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 font-bold">
                      Costo Estimado: $
                      {(
                        (demoState.hasLb ? 18.00 : 0) +
                        (demoState.hasServers ? 29.20 : 0) +
                        (demoState.hasDb ? 35.00 : 0)
                      ).toFixed(2)} / mes
                    </span>
                    <span className="text-blue-400 font-bold">
                      Score: {
                        !demoState.hasLb && !demoState.hasServers && !demoState.hasDb ? '0%' :
                        demoState.hasLb && demoState.hasServers && demoState.hasDb ? '95% (Excelente)' :
                        demoState.hasServers && !demoState.hasLb ? '50% (Sin Balanceador)' :
                        '70% (Incompleto)'
                      }
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/90 rounded-lg min-h-[90px] flex items-center justify-center">
                  {!demoState.hasLb && !demoState.hasServers && !demoState.hasDb ? (
                    <span className="text-slate-500 italic text-xs">
                      Haz clic en los botones de arriba para añadir componentes y ver cómo se forma la arquitectura...
                    </span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
                        🌐 Internet
                      </span>
                      {demoState.hasLb && (
                        <>
                          <span className="text-blue-400 font-bold">➔</span>
                          <span className="px-2.5 py-1 bg-blue-900/60 rounded border border-blue-500 text-blue-200">
                            ⚖️ AWS ALB ($18/m)
                          </span>
                        </>
                      )}
                      {demoState.hasServers && (
                        <>
                          <span className="text-emerald-400 font-bold">➔</span>
                          <span className="px-2.5 py-1 bg-emerald-900/60 rounded border border-emerald-500 text-emerald-200">
                            💻 2x EC2 App ($29.20/m)
                          </span>
                        </>
                      )}
                      {demoState.hasDb && (
                        <>
                          <span className="text-purple-400 font-bold">➔</span>
                          <span className="px-2.5 py-1 bg-purple-900/60 rounded border border-purple-500 text-purple-200">
                            🗄️ RDS DB ($35/m)
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-300">
                  ¿Quieres diseñar esta arquitectura en el editor real?
                </span>
                <button
                  onClick={() => handleLaunchPreset('aws_3tier')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Abrir en Editor Visual</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* ── Preguntas Frecuentes (FAQ) ─────────────────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircleIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">
                  Preguntas Frecuentes de Principiantes
                </h3>
              </div>

              {[
                {
                  q: '¿Tengo que pagar dinero real o ingresar mi tarjeta para usar CloudScope?',
                  a: '¡No! CloudScope es una plataforma de diseño, simulación y aprendizaje arquitectónico. Todos los precios que ves son simulaciones para que sepas cuánto costaría en la realidad, sin gastar ni un solo centavo.'
                },
                {
                  q: '¿Necesito tener cuentas activas en AWS o Azure para diseñar?',
                  a: 'Tampoco. Puedes diseñar cualquier diagrama y probar configuraciones sin necesidad de tener cuentas en ningún proveedor cloud.'
                },
                {
                  q: '¿Puedo mezclar servicios de AWS y Azure en el mismo proyecto?',
                  a: '¡Absolutamente! CloudScope fue diseñado con soporte Multi-Cloud nativo. Puedes poner un servidor de Azure comunicándose con un almacenamiento de AWS o una base de datos de Oracle sin restricciones.'
                },
                {
                  q: '¿Qué pasa si cierro el navegador? ¿Se borra mi proyecto?',
                  a: 'Si presionaste el botón "Guardar" (o Ctrl+S), tu proyecto queda guardado en la memoria de tu navegador y aparecerá en tu Dashboard en la pestaña "Mis Proyectos" la próxima vez que ingreses.'
                },
                {
                  q: '¿Cómo convierto mi diagrama en servidores reales?',
                  a: 'Haz clic en "Exportar Terraform" en la parte superior del editor. Esto descargará el archivo de código de infraestructura que puedes ejecutar directamente con la herramienta Terraform en tu computadora.'
                }
              ].map((faq, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 text-sm ml-2">
                      {expandedFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
