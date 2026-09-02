# Diagramador y Analizador Interactivo de Infraestructura Cloud con Auditoría de Seguridad, Estimación de Costos (FinOps) y Generación de Infraestructura como Código (IaC)
> **Versión:** v1.0 | **Curso:** SI784 – Proyecto de Ingeniería de Software | **Ciclo Académico:** 2026-II
> **Autores:** Halanocca Marca | **Institución:** Universidad Privada de Tacna – Facultad de Ingeniería / EPIS

---

## 1. Título del Proyecto

```
Desarrollo de un Diagramador y Analizador Interactivo de Infraestructura Cloud
con Auditoría de Seguridad, Estimación de Costos (FinOps) y Generación de
Infraestructura como Código (IaC)
```

---

## 2. Planteamiento del Problema

### 2.1 Descripción de la Realidad Problemática

La adopción acelerada de infraestructuras en la nube ha transformado profundamente los modelos de desarrollo y despliegue de software en organizaciones de escala global. No obstante, dicha transformación ha evidenciado una brecha metodológica y tecnológica crítica: la desconexión estructural entre las herramientas de diseño arquitectónico y los mecanismos de análisis, auditoría y estimación financiera que deben operar de manera integrada desde las fases tempranas del ciclo de vida del sistema.

Las herramientas de diagramación convencionales —entre las que se cuentan Draw.io, Lucidchart y Microsoft Visio— funcionan como **"vectores pasivos"**: lienzos estáticos que permiten representar topologías de red y arquitecturas cloud de forma visual, pero que carecen por completo de capacidad analítica. Sus artefactos de salida son imágenes o documentos no computables, lo que imposibilita la ejecución de validaciones semánticas, la evaluación de conformidad con marcos de buenas prácticas (como AWS Well-Architected Framework o los CIS Benchmarks) o la inferencia de costos operativos mensuales asociados a los recursos representados. Esta limitación fuerza a los equipos de arquitectura a depender de flujos de trabajo fragmentados: el diseño se realiza en una herramienta, la auditoría de seguridad en otra (frecuentemente mediante scripts de terminal o soluciones CSPM como AWS Security Hub), y la estimación de costos en calculadoras en línea independientes (AWS Pricing Calculator, Azure Cost Estimator). La carencia de integración entre estas disciplinas introduce latencia operativa, inconsistencias entre la arquitectura diseñada y la desplegada (**Architectural Drift**), y un elevado riesgo de errores humanos de configuración (**misconfigurations**).

Según el informe *State of the Cloud 2024* de Flexera, el **82% de las organizaciones** identifica la optimización de costos en la nube como su principal desafío, mientras que el **Cloud Waste** promedio —recursos sobreaprovisionados o inactivos que generan gasto sin retorno— alcanza el **28% del presupuesto total de nube** de las empresas encuestadas. Esta problemática es consecuencia directa de la ausencia de prácticas **Shift-Left FinOps**: la estimación de costos no se integra en el momento del diseño arquitectónico, sino que se efectúa retrospectivamente, cuando las decisiones ya han sido comprometidas y el costo de cambio es significativamente mayor.

En el ámbito de la seguridad, el *Verizon Data Breach Investigations Report 2024* señala que las **misconfigurations en entornos cloud** son el vector de ataque más frecuente, responsables del **21% de los incidentes** de brecha de datos en infraestructuras IaaS/PaaS. Errores de diseño recurrentes —tales como la exposición de puertos administrativos (SSH/RDP) a internet sin restricción de CIDR, la habilitación de instancias de bases de datos con acceso público directo, o la ausencia de segmentación mediante subredes privadas— son sistemáticamente introducidos en fases tempranas del diseño cuando no existe un mecanismo de retroalimentación en tiempo real que evalúe la conformidad de la topología con marcos normativos de referencia.

Adicionalmente, la ausencia de herramientas que permitan simular el **radio de impacto** (*Blast Radius*) ante la eliminación, fallo o reconfiguración de componentes individuales de la arquitectura, impide la realización de análisis *what-if* durante el diseño. Esta carencia se traduce en arquitecturas frágiles, escasamente resilientes y con dependencias no declaradas que solo se hacen visibles en producción. Asimismo, la brecha entre el diseño arquitectónico y la generación automatizada de plantillas de **Infraestructura como Código (IaC)** —particularmente en el ecosistema Terraform de HashiCorp— obliga a los equipos de infraestructura a reescribir manualmente la arquitectura diseñada en forma de código declarativo, proceso propenso a errores y altamente demandante en tiempo.

En síntesis, la problemática se articula en cuatro dimensiones interdependientes: **(1)** la pasividad analítica de las herramientas de diagramación actuales; **(2)** la introducción temprana de vulnerabilidades de seguridad por ausencia de retroalimentación normativa en diseño; **(3)** el desperdicio financiero derivado de la ausencia de estimación predictiva de costos; y **(4)** la incapacidad de evaluar el impacto sistémico de cambios arquitectónicos antes del despliegue.

### 2.2 Formulación de la Pregunta General de Investigación

> **¿En qué medida el desarrollo de un diagramador web interactivo de infraestructura cloud, integrado con un motor de auditoría de seguridad basado en reglas, un módulo de estimación dinámica de costos FinOps, y un generador automatizado de plantillas IaC (Terraform), contribuye a reducir las brechas de seguridad por misconfiguration, el desperdicio financiero por sobreaprovisionamiento y el esfuerzo manual de codificación de infraestructura durante las fases tempranas del diseño arquitectónico?**

---

## 3. Objetivos

### 3.1 Objetivo General

Desarrollar un sistema web interactivo de diagramación y análisis de infraestructura cloud que, operando sobre una representación computacional de grafos, integre de forma cohesionada un motor de auditoría de seguridad basado en los estándares CIS Benchmarks y AWS Well-Architected Framework, un módulo de estimación dinámica de costos mensuales alineado con los principios FinOps, un simulador de radio de impacto (*Blast Radius*) para análisis *what-if* arquitectónico, y un exportador automatizado de plantillas de Infraestructura como Código en formato Terraform HCL, con el propósito de reducir las brechas de seguridad por misconfiguration, mitigar el Cloud Waste financiero y acelerar el ciclo de materialización del diseño arquitectónico en infraestructura desplegable.

---

### 3.2 Objetivos Específicos

#### OE1 — Diseño del Lienzo Web Interactivo Basado en Grafos

Diseñar e implementar un lienzo web interactivo de alta fidelidad que permita la construcción visual e intuitiva de topologías de infraestructura cloud mediante la composición de componentes parametrizables (instancias de cómputo, balanceadores de carga, bases de datos gestionadas, redes virtuales, subredes, grupos de seguridad, entre otros), representando la arquitectura internamente como un **grafo dirigido y ponderado** (estructura de nodos y aristas) que habilite la captura semántica de la topología para su procesamiento analítico posterior, garantizando la exportación e importación del estado del diagrama en formato JSON canónico.

#### OE2 — Implementación del Motor de Reglas para Auditoría de Seguridad y Resiliencia

Implementar un motor de evaluación de reglas de conformidad que, operando sobre la representación grafo de la arquitectura diseñada, ejecute validaciones estáticas en tiempo real contra un conjunto codificado de controles de seguridad derivados del **CIS Benchmarks for Cloud Providers** (v1.5+) y del **AWS Well-Architected Framework** (pilares de Seguridad y Fiabilidad), generando un informe de hallazgos (*findings*) clasificados por nivel de severidad (CRITICAL / HIGH / MEDIUM / LOW) con descripción del control vulnerado, evidencia técnica sobre el componente incumplidor y recomendaciones de remediación accionables.

#### OE3 — Integración del Módulo de Estimación Dinámica de Costos Mensuales (FinOps)

Integrar un módulo de estimación de costos operativos mensuales que, a partir de los atributos configurados en cada componente del diagrama (tipo de instancia, región geográfica, capacidad de almacenamiento, políticas de escalado), consulte un catálogo de precios actualizable vinculado a los modelos tarifarios de los principales proveedores cloud (AWS, Azure, GCP) y calcule en tiempo real el **Total Cost of Ownership (TCO) estimado** de la arquitectura diseñada, desglosado por servicio y agrupado por dominio funcional, implementando los principios de **Shift-Left FinOps** conforme a la taxonomía de la FinOps Foundation, con el objetivo de habilitar decisiones de diseño informadas financieramente antes del aprovisionamiento.

#### OE4 — Implementación del Módulo de Simulación de Impacto (Blast Radius) y Exportación Automatizada a Terraform IaC

Implementar un módulo de análisis de impacto sistémico que, mediante algoritmos de traversal sobre el grafo arquitectónico (BFS/DFS con propagación de dependencias), permita simular el **radio de impacto** (*Blast Radius*) ante la eliminación, fallo o reconfiguración de cualquier componente del diagrama, identificando los recursos dependientes afectados y calculando métricas de resiliencia; y, de forma complementaria, desarrollar un motor de generación automatizada de plantillas de **Infraestructura como Código** en formato **Terraform HCL** (HashiCorp Configuration Language), capaz de traducir la topología diseñada en código declarativo, parametrizado y ejecutable, conforme a las convenciones del Terraform Registry para los principales proveedores cloud.

---

## 4. Justificación

### 4.1 Justificación Teórica

La presente investigación se fundamenta en la convergencia de marcos normativos, estándares industriales y hallazgos empíricos de alto impacto en la disciplina de la arquitectura cloud. El *Gartner Magic Quadrant for Cloud Management Platforms 2024* proyecta que, para el año 2027, las organizaciones que implementen prácticas de **FinOps integradas en el ciclo de diseño** reducirán su Cloud Waste en un 35% respecto a aquellas que operan con modelos reactivos de gestión del gasto. La **FinOps Foundation** establece en su marco de referencia la fase de *Inform* como prerequisito crítico para la optimización del gasto, indicando que la visibilidad de costos debe estar disponible en tiempo de diseño (*design-time cost awareness*) y no únicamente en tiempo de operación.

Desde la perspectiva de la seguridad, el **CIS Controls v8** y los **CIS Benchmarks para AWS, Azure y GCP** proveen un conjunto de controles prescriptivos y medibles que constituyen el estándar de facto para la evaluación de la postura de seguridad en infraestructuras cloud. La incorporación de estos controles en un motor de validación automatizada responde al paradigma **Shift-Left Security** —también denominado *DevSecOps*— que postula la detección temprana de vulnerabilidades en las fases de diseño y desarrollo como mecanismo de reducción del costo de remediación (Modelo de IBM: el costo de corrección de un defecto de seguridad se multiplica por un factor de 30× si se detecta en producción versus en diseño). Finalmente, el ecosistema Terraform de HashiCorp, con más de 1.9 millones de módulos publicados en el Terraform Registry, se ha consolidado como el estándar predominante de IaC, justificando su adopción como formato de exportación principal del sistema propuesto.

### 4.2 Justificación Práctica

La solución propuesta responde directamente a necesidades operativas verificables en equipos de arquitectura de software y plataformas cloud: (a) la eliminación del contexto fragmentado entre herramientas de diagramación, auditoría y estimación de costos; (b) la habilitación de retroalimentación inmediata sobre postura de seguridad durante el diseño, antes de que las decisiones arquitectónicas sean codificadas e implementadas; (c) la reducción del tiempo de generación de código IaC mediante automatización de la traducción diagrama → Terraform; y (d) la provisión de un análisis cuantificado del riesgo sistémico mediante la simulación del *Blast Radius*, herramienta de alto valor para la planificación de continuidad de negocio y recuperación ante desastres (DR/BCP). El sistema propuesto representa, por tanto, un avance sustancial hacia la unificación del ciclo de vida del diseño arquitectónico cloud en una plataforma cohesionada, inteligente e interactiva.

---

## 5. Referencias Clave

| # | Fuente | Relevancia |
|---|--------|-----------|
| 1 | Flexera. (2024). *State of the Cloud Report 2024*. Flexera Software LLC. | Cloud Waste (28%) y desafíos de optimización de costos (82% organizaciones). |
| 2 | Verizon. (2024). *Data Breach Investigations Report 2024*. Verizon Communications Inc. | Misconfigurations como vector de ataque principal (21% de brechas en cloud). |
| 3 | Gartner. (2024). *Magic Quadrant for Cloud Management Platforms*. Gartner Inc. | Proyecciones de ahorro mediante FinOps integrado en diseño (−35% Cloud Waste). |
| 4 | FinOps Foundation. (2023). *FinOps Framework: Inform, Optimize, Operate*. The Linux Foundation. | Marco de referencia para Shift-Left FinOps y design-time cost awareness. |
| 5 | Center for Internet Security. (2023). *CIS Benchmarks for AWS, Azure & GCP* (v1.5+). CIS. | Base normativa para el motor de auditoría de seguridad y controles prescriptivos. |
| 6 | Amazon Web Services. (2023). *AWS Well-Architected Framework*. AWS Documentation. | Pilares de Seguridad y Fiabilidad como referencia para reglas de resiliencia. |
| 7 | HashiCorp. (2024). *Terraform Language Documentation – HCL*. HashiCorp Inc. | Especificación formal del formato de exportación IaC del sistema. |
| 8 | IBM Systems Sciences Institute. (2022). *Cost of Defect Detection by Phase*. IBM Corp. | Modelo de multiplicación de costo (30×) para detección tardía de defectos de seguridad. |

---

> *Documento generado en el marco del Proyecto de Ingeniería SI784 – 2026-II.*
> *Universidad Privada de Tacna – Escuela Profesional de Ingeniería de Sistemas.*
