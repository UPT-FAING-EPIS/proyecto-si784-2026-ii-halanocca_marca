**![C:\\Users\\EPIS\\Documents\\upt.png][image1]**

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERÍA**

**Escuela Profesional de Ingeniería de Sistemas**

**CloudScope: Diagramador y Analizador Interactivo de Infraestructura Cloud con Auditoría de Seguridad, Estimación de Costos y Generación de Infraestructura como Código**

Curso: *Calidad de Software*

Docente: Mtro. Patrick Cuadros Quiroga

Integrantes:

***Halanocca Rojas, Usher Damiron			(2023076795)***  
***Marca Aguilar, Stevie Gerald 				(2023076802)***

														  
**Tacna – Perú**  
***2026***

# 

# 

# 

# 

# 

# 

# 

# 

# 

# 

# 

**CloudScope: Diagramador y Analizador Interactivo de Infraestructura Cloud con Auditoría de Seguridad, Estimación de Costos (FinOps) y Generación de Infraestructura como Código (IaC)** 

# 

# **Versión *1.0***

| CONTROL DE VERSIONES |  |  |  |  |  |
| :---: | :---: | ----- | :---: | :---: | ----- |
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 |  UDHR  |  |  | 26/08/2026  | Versión Original |

**ÍNDICE GENERAL**

1\.	Introducción	1

1.1	Propósito	1

1.2	Alcance	1

1.3	Definiciones, Siglas y Abreviaturas	1

1.4	Referencias	1

1.5	Visión General	1

2\.	Posicionamiento	1

2.1	Oportunidad de negocio	1

2.2	Definición del problema	2

3\.	Descripción de los interesados y usuarios	3

3.1	Resumen de los interesados	3

3.2	Resumen de los usuarios	3

3.3	Entorno de usuario	4

3.4	Perfiles de los interesados	4

3.5	Perfiles de los Usuarios	4

3.6	Necesidades de los interesados y usuarios	6

4\.	Vista General del Producto	7

4.1	Perspectiva del producto	7

4.2	Resumen de capacidades	8

4.3	Suposiciones y dependencias	8

4.4	Costos y precios	9

4.5	Licenciamiento e instalación	9

5\.	Características del producto	9

6\.	Restricciones	10

7\.	Rangos de calidad	10

8\.	Precedencia y Prioridad	10

9\.	Otros requerimientos del producto	10

	[b) Estándares legales](#heading=h.3ori4pjzimw3)	32

	[c) Estándares de comunicación](#heading=h.3ori4pjzimw3)	37

	[d) Estándares de cumplimiento de la plataforma](#heading=h.3ori4pjzimw3)	42

	[e) Estándares de calidad y seguridad](#heading=h.3ori4pjzimw3)	42

[CONCLUSIONES](#heading=h.tsr4jona1id0)	46

[RECOMENDACIONES](#heading=h.548o199ph1m1)	46

[BIBLIOGRAFÍA](#heading=h.1kg2ja3kg0i5)	46

[WEBGRAFÍA](#heading=h.k47i0o4mxsku)	46

### **1\. Introducción**

#### **1.1 Propósito**

El presente documento tiene como propósito describir la visión general del sistema "CloudScope", una plataforma web interactiva orientada al diseño visual de arquitecturas de infraestructura en la nube, integrando en un solo entorno la auditoría automatizada de seguridad, la estimación dinámica de costos (FinOps) y la generación automatizada de Infraestructura como Código (IaC). Este documento establece las necesidades y características del producto desde la perspectiva de los interesados, y constituye la base para la especificación de requisitos de software (SRS) del proyecto. 

#### **1.2 Alcance**

El sistema CloudScope es un aplicativo web que permite a arquitectos de soluciones, ingenieros DevOps/Cloud y especialistas en seguridad diseñar topologías de infraestructura cloud mediante un lienzo interactivo basado en grafos, validar dichas topologías contra estándares de seguridad de la industria, estimar su costo mensual proyectado y exportar el diseño final a plantillas de Terraform listas para su aprovisionamiento. El alcance comprende:

* Lienzo web interactivo (grafos) para el modelado de componentes de infraestructura cloud (cómputo, redes, almacenamiento, bases de datos).  
* Motor de reglas de auditoría de seguridad y resiliencia alineado a Well-Architected Framework y CIS Benchmarks.  
* Módulo de estimación dinámica de costos mensuales (FinOps), calculado en tiempo real conforme se modifica el diseño.  
* Módulo de simulación de impacto (blast radius) ante cambios en componentes de la arquitectura.  
* Módulo de exportación automatizada del diseño a plantillas de Infraestructura como Código (Terraform).

Exclusión: el sistema no ejecuta el aprovisionamiento real de los recursos en la nube; su función concluye en la generación del código IaC, siendo responsabilidad del usuario la ejecución de dicho código en el proveedor cloud correspondiente.

#### **1.3 Definiciones, Siglas y Abreviaturas**

| Término | Definición |
| :---- | :---- |
| IaC | Infraestructura como Código (Infrastructure as Code). |
| FinOps | Financial Operations; disciplina de gestión financiera del gasto en la nube. |
| CIS Benchmarks | Estándares de configuración segura del Center for Internet Security. |
| Blast Radius | Radio de impacto; alcance de afectación ante un cambio o fallo en un componente. |
| Well-Architected Framework | Marco de buenas prácticas arquitectónicas propuesto por proveedores cloud (AWS, Azure, GCP). |
| Misconfiguration | Configuración incorrecta o insegura de un recurso en la nube. |
| Cloud Waste | Desperdicio de recursos financieros por sobreaprovisionamiento o mal uso de servicios cloud. |
| Shift-Left | Práctica de anticipar validaciones (seguridad, costos) a etapas tempranas del diseño. |
| Terraform | Herramienta de IaC para el aprovisionamiento de infraestructura mediante código declarativo (HCL). |
| SPA | Single Page Application; aplicación web de una sola página. |
| API | Interfaz de Programación de Aplicaciones. |

#### **1.4 Referencias**

* Gartner (2024). Cloud Cost Management and FinOps Trends.

* Flexera (2024). State of the Cloud Report.

* FinOps Foundation (2023). FinOps Framework.

* Center for Internet Security (2023). CIS Benchmarks for Cloud Providers.

* AWS, Azure y GCP (2023). Well-Architected Frameworks.


#### **1.5 Visión General**

El presente documento se organiza en secciones que abordan el posicionamiento del producto en el mercado, la descripción de los interesados y usuarios, la vista general del producto, sus características principales, restricciones, rangos de calidad, precedencia y prioridad, y otros requerimientos relevantes para el desarrollo del sistema CloudScope. 

### **2\. Posicionamiento**

#### **2.1 Oportunidad de negocio**

El diseño y aprovisionamiento de arquitecturas en la nube enfrenta una fragmentación crítica entre la representación visual y la validación técnica. Las herramientas tradicionales de diagramación (por ejemplo, Draw.io o Lucidchart) operan como lienzos estáticos o "vectores pasivos", mientras que las soluciones de seguridad e infraestructura como código entregan reportes en texto o terminal, sin un mapa interactivo que los vincule al diseño.

Esta desconexión genera tres problemas clave para las organizaciones: brechas de seguridad por error humano al diseñar sin validación inmediata (bases de datos en subredes públicas, puertos administrativos expuestos); desperdicio financiero o "Cloud Waste" por falta de visibilidad de costos en tiempo de diseño; y desalineación arquitectónica ("Architectural Drift") ante la ausencia de herramientas que permitan evaluar el impacto de un cambio antes de implementarlo.

Según reportes de la industria (Flexera, Gartner), el gasto en la nube continúa creciendo sin la visibilidad financiera necesaria en las fases tempranas de diseño. Esta situación representa una oportunidad de negocio para el desarrollo de una plataforma que integre, en un solo entorno interactivo, la representación visual de arquitecturas cloud con capacidades de auditoría de seguridad, estimación financiera (FinOps) y generación automatizada de código de infraestructura, reduciendo el tiempo, el costo y el riesgo asociados al diseño manual y desconectado de arquitecturas en la nube.

#### **2.2 Definición del problema**

| Elemento | Descripción |
| ----- | ----- |
| El problema de | La desconexión entre las herramientas de diagramación de arquitecturas cloud y los motores de análisis técnico (seguridad, costos y resiliencia). |
| Afecta a | Arquitectos de soluciones, ingenieros DevOps/Cloud, especialistas en seguridad (DevSecOps) y organizaciones que diseñan y aprovisionan infraestructura en la nube. |
| El impacto de lo cual es | La introducción de brechas de seguridad por error humano, el desperdicio financiero por falta de visibilidad de costos en tiempo de diseño (Cloud Waste) y la desalineación arquitectónica (Architectural Drift) ante la ausencia de herramientas para evaluar el impacto de los cambios (blast radius) antes de su implementación. |
| Una solución exitosa sería | Un diagramador interactivo basado en grafos que integre, en tiempo real, un motor de auditoría de seguridad alineado a estándares de la industria, un módulo de estimación dinámica de costos mensuales (FinOps) y un módulo de simulación de impacto con exportación automatizada a plantillas de Infraestructura como Código (Terraform). |

### **3\. Descripción de los interesados y usuarios**

#### **3.1 Resumen de los interesados**

| Nombre | Descripción | Responsabilidades |
| ----- | ----- | ----- |
| Arquitecto de Soluciones Cloud | Profesional encargado del diseño de arquitecturas en la nube. | Definir la topología de infraestructura y validar su viabilidad técnica. |
| Ingeniero DevOps/Cloud | Encargado del aprovisionamiento y despliegue de infraestructura. | Implementar y mantener la infraestructura generada por el sistema. |
| Especialista en Seguridad (DevSecOps) | Responsable de garantizar el cumplimiento de estándares de seguridad. | Auditar las configuraciones propuestas en el diseño. |
| Responsable de FinOps | Encargado del control del gasto en la nube. | Supervisar la estimación y optimización de costos. |
| Docente / Asesor del proyecto | Supervisa el desarrollo académico del proyecto. | Validar el cumplimiento de los objetivos y la metodología. |

#### **3.2 Resumen de los usuarios**

| Usuario | Descripción | Subsistemas de interés |
| ----- | ----- | ----- |
| Diseñador de arquitectura | Usa el lienzo interactivo para modelar la infraestructura. | Módulo de diagramación (grafos). |
| Auditor de seguridad | Revisa las alertas generadas por el motor de reglas. | Módulo de auditoría de seguridad. |
| Analista de costos | Revisa las estimaciones financieras del diseño. | Módulo de estimación de costos (FinOps). |
| Ingeniero de infraestructura | Exporta y ejecuta el código generado. | Módulo de exportación a IaC (Terraform). |

#### **3.3 Entorno de usuario**

Los usuarios interactuarán con el sistema a través de una aplicación web accesible desde navegadores modernos (Google Chrome, Microsoft Edge, Mozilla Firefox), en equipos de escritorio o laptops con conexión a internet estable. El entorno de trabajo típico corresponde a oficinas de tecnología o equipos remotos de desarrollo, donde el sistema se utilizará como herramienta de apoyo durante las fases de diseño, validación y aprovisionamiento de infraestructura cloud. 

#### **3.4 Perfiles de los interesados**

#### **Arquitecto de Soluciones Cloud**

| Atributo | Descripción |
| ----- | ----- |
| Representante | Encargado del área de arquitectura de TI. |
| Tipo | Interesado clave (usuario principal). |
| Responsabilidades | Definir requerimientos funcionales del diagramador y validar la correcta representación de la topología. |

#### 

#### **Especialista en Seguridad**

| Atributo | Descripción |
| ----- | ----- |
| Representante | Encargado del área de ciberseguridad. |
| Tipo | Interesado técnico. |
| Responsabilidades | Definir las reglas de auditoría a implementar en el motor de análisis. |

#### 

#### **3.5 Perfiles de los Usuarios**

#### **Diseñador de arquitectura**

| Atributo | Descripción |
| ----- | ----- |
| Rol | Arquitecto de soluciones / ingeniero cloud. |
| Nivel de experiencia | Conocimiento técnico en servicios cloud (AWS, Azure, GCP). |
| Actividades | Creación y edición de diagramas de infraestructura mediante el lienzo interactivo. |
| Necesidades principales | Retroalimentación inmediata de seguridad y costos al modificar el diseño. |

#### 

#### **Auditor de seguridad**

| Atributo | Descripción |
| ----- | ----- |
| Rol | Especialista en seguridad de la información (DevSecOps). |
| Nivel de experiencia | Conocimiento en estándares CIS y Well-Architected Framework. |
| Actividades | Revisión de alertas de seguridad generadas automáticamente por el sistema. |
| Necesidades principales | Trazabilidad de las reglas incumplidas y su ubicación exacta en el diagrama. |

#### 

#### **3.6 Necesidades de los interesados y usuarios**

| Necesidad | Prioridad | Preocupaciones | Solución actual | Solución propuesta |
| ----- | ----- | ----- | ----- | ----- |
| Visualizar la arquitectura cloud de forma interactiva. | Alta | Las herramientas actuales son lienzos estáticos. | Draw.io, Lucidchart. | Lienzo web interactivo basado en grafos. |
| Detectar errores de seguridad en el diseño. | Alta | Falta de validación en tiempo de diseño. | Revisión manual o herramientas de terminal. | Motor de reglas de auditoría integrado. |
| Estimar el costo mensual de la arquitectura. | Alta | Ausencia de visibilidad financiera temprana. | Calculadoras externas desconectadas. | Módulo de estimación dinámica de costos (FinOps). |
| Evaluar el impacto de cambios en la arquitectura. | Media | Desalineación arquitectónica (drift). | Análisis manual. | Simulación de blast radius. |
| Generar código de infraestructura automáticamente. | Alta | Proceso manual y propenso a errores. | Escritura manual de scripts Terraform. | Exportación automatizada a IaC. |

### **4\. Vista General del Producto**

#### **4.1 Perspectiva del producto**

CloudScope es un producto independiente, de tipo aplicación web, que integra en una sola plataforma funcionalidades que tradicionalmente se encuentran fragmentadas en herramientas distintas: diagramación (Draw.io, Lucidchart), auditoría de seguridad (herramientas de línea de comandos), estimación de costos (calculadoras cloud) y generación de infraestructura como código (scripts manuales de Terraform). El sistema no reemplaza los servicios cloud de los proveedores, sino que actúa como una capa de diseño, validación y generación previa al aprovisionamiento real.

La arquitectura del sistema se compone de las siguientes capas: un frontend SPA que aloja el lienzo interactivo basado en grafos; un backend que expone una API REST encargada de ejecutar el motor de reglas de auditoría, el cálculo de costos y la generación de plantillas Terraform; y una capa de persistencia para almacenar los proyectos, diagramas y catálogos de precios de los proveedores cloud.

#### **4.2 Resumen de capacidades**

| Beneficio para el cliente | Características que lo soportan |
| ----- | ----- |
| Diseño visual intuitivo de arquitecturas cloud. | Lienzo interactivo basado en grafos (nodos y conexiones). |
| Prevención temprana de brechas de seguridad. | Motor de reglas alineado a CIS Benchmarks y Well-Architected Framework. |
| Control financiero desde el diseño (Shift-Left FinOps). | Módulo de estimación dinámica de costos mensuales. |
| Reducción del riesgo ante cambios arquitectónicos. | Simulación de impacto (blast radius). |
| Automatización del aprovisionamiento. | Exportación automatizada a plantillas Terraform (IaC). |

#### 

#### **4.3 Suposiciones y dependencias**

**Suposiciones**

* Los usuarios cuentan con conocimientos básicos de arquitectura cloud.  
* El equipo docente y los interesados estarán disponibles para las validaciones funcionales del proyecto.  
* Los catálogos de precios públicos de los proveedores cloud (AWS, Azure, GCP) se mantendrán accesibles durante el desarrollo.

**Dependencias**

* El sistema depende de la disponibilidad y actualización de los catálogos de precios públicos de los proveedores cloud para la estimación de costos.  
* El motor de auditoría depende de la actualización periódica de las reglas conforme evolucionen los estándares CIS y Well-Architected.  
* La exportación a IaC depende de la compatibilidad con la sintaxis vigente de Terraform (HCL2).


#### **4.4 Costos y precios**

El proyecto se desarrolla con fines académicos. De proyectarse como producto comercial, se contempla un modelo de precios por suscripción (SaaS), diferenciado por número de usuarios, cantidad de arquitecturas diseñadas y frecuencia de auditorías, considerando un plan gratuito limitado y planes premium con funcionalidades avanzadas de FinOps e IaC. 

#### 

#### **4.5 Licenciamiento e instalación**

El sistema será desplegado como una aplicación web, sin requerir instalación local por parte del usuario final. El acceso se realizará mediante navegador web bajo un modelo de licenciamiento por cuenta de usuario, a definir según el alcance académico o comercial del proyecto. 

### **5\. Características del producto**

A continuación, se detallan los requerimientos funcionales (RF) del sistema CloudScope.

| ID | Descripción del Requerimiento Funcional |
| ----- | ----- |
| RF-01 | El sistema debe proporcionar un lienzo web interactivo basado en grafos que permita a los usuarios agregar, conectar y organizar componentes de infraestructura cloud (cómputo, redes, almacenamiento, bases de datos). |
| RF-02 | El sistema debe ofrecer una paleta de componentes predefinidos que represente los servicios más comunes de los proveedores cloud (AWS, Azure, GCP). |
| RF-03 | El sistema debe ejecutar, en tiempo real, un motor de reglas de auditoría de seguridad que evalúe la topología diseñada contra estándares CIS Benchmarks y Well-Architected Framework. |
| RF-04 | El sistema debe mostrar un panel de alertas visuales integrado directamente en el lienzo, señalando el componente específico que incumple una regla de seguridad. |
| RF-05 | El sistema debe calcular y mostrar de forma dinámica el costo mensual estimado de la arquitectura diseñada, actualizándose ante cada modificación del diagrama. |
| RF-06 | El sistema debe permitir comparar el costo estimado entre distintas configuraciones alternativas de una misma arquitectura (análisis what-if). |
| RF-07 | El sistema debe permitir simular el radio de impacto (blast radius) de un componente ante un cambio o fallo, resaltando los elementos dependientes en el lienzo. |
| RF-08 | El sistema debe generar y exportar automáticamente el diseño de la arquitectura a plantillas de Infraestructura como Código en formato Terraform (HCL). |
| RF-09 | El sistema debe permitir guardar, versionar y recuperar los proyectos de arquitectura diseñados por cada usuario. |
| RF-10 | El sistema debe requerir autenticación de usuario y gestionar el acceso a las funcionalidades según el rol asignado. |
| RF-11 | El sistema debe permitir la generación y descarga de un reporte de auditoría de seguridad y costos en formato PDF. |
| RF-12 | El sistema debe presentar un panel resumen (dashboard) con los indicadores clave de seguridad y costo del proyecto activo. |

### 

### **6\. Restricciones**

**Técnicas**

* El sistema debe operar bajo un modelo web, accesible desde navegadores estándar (Chrome, Edge, Firefox).  
* La estimación de costos depende de la disponibilidad de las APIs públicas de precios de los proveedores cloud.  
* El motor de auditoría se limitará, en su primera versión, a un subconjunto priorizado de reglas de seguridad.  
* La exportación IaC se limitará, en su primera versión, a la generación de plantillas para Terraform.

**Cronograma**

El desarrollo del proyecto debe ajustarse al cronograma y a los recursos definidos por la asignatura de Programación Web I, con fecha de inicio y fin a definir según el sílabo del curso.

**Presupuesto**

El proyecto se desarrolla con fines académicos, por lo que no contempla, en esta etapa, un presupuesto de adquisición o contrato comercial; los recursos utilizados corresponden a herramientas de desarrollo de uso libre o con planes gratuitos.

### **7\. Rangos de calidad**

## **7.1 Seguridad**

Autenticación y autorización controladas mediante tokens JSON Web Tokens (JWT) con tiempo de expiración determinado.

Las contraseñas se almacenan obligatoriamente utilizando un algoritmo de hash seguro (bcrypt).

Todo el tráfico entre el cliente web y el servidor viaja bajo protocolo seguro HTTPS (SSL/TLS).

## **7.2 Disponibilidad**

El sistema debe estar disponible como servicio web con una disponibilidad objetivo del 99% en el entorno de despliegue.

Las ventanas de mantenimiento se programarán en horarios de baja actividad.

## **7.3 Rendimiento**

* El motor de auditoría de seguridad debe evaluar la topología y mostrar alertas en un tiempo cercano al real (near real-time) ante cada cambio en el diseño.  
* El cálculo de costos estimados debe actualizarse en un tiempo no mayor a 2 segundos tras cada modificación del diagrama.  
* La exportación a plantillas Terraform debe completarse en un tiempo no mayor a 5 segundos para arquitecturas de complejidad media.

## **7.4 Usabilidad**

La interfaz debe permitir a un arquitecto cloud diseñar una topología sin requerir capacitación previa extensa, mediante una paleta de componentes clara y retroalimentación visual inmediata.

## **7.5 Escalabilidad**

El sistema debe soportar el crecimiento en número de usuarios y en la complejidad de las arquitecturas diseñadas, sin degradar el tiempo de respuesta del motor de auditoría ni del módulo de costos.

### **8\. Precedencia y Prioridad**

### Los requerimientos funcionales se priorizan de la siguiente manera para gestionar su implementación en las cuatro fases clave del proyecto (OE1 a OE4):

| ID | Requerimiento Funcional | Prioridad | Justificación |
| :---- | :---- | :---- | :---- |
| RF-01 | Lienzo interactivo basado en grafos | Alta | Es la base funcional del sistema; sin el lienzo no puede capturarse la topología. |
| RF-02 | Paleta de componentes cloud | Alta | Necesaria para que el usuario pueda modelar la infraestructura. |
| RF-10 | Autenticación y control de acceso | Alta | Requisito de seguridad base para diferenciar roles desde el inicio. |
| RF-03 | Motor de reglas de auditoría de seguridad | Alta | Componente diferenciador principal de la propuesta de valor. |
| RF-04 | Panel de alertas visuales | Alta | Complementa directamente al motor de auditoría (RF-03). |
| RF-05 | Estimación dinámica de costos (FinOps) | Media-Alta | Depende de contar primero con el lienzo y los componentes definidos. |
| RF-09 | Guardado y versionado de proyectos | Media | Necesario para la persistencia del trabajo, pero no bloquea el MVP inicial. |
| RF-06 | Comparación de costos (what-if) | Media | Funcionalidad analítica que se apoya en el módulo de costos (RF-05). |
| RF-07 | Simulación de blast radius | Media | Depende de contar con la topología y las reglas de auditoría ya definidas. |
| RF-08 | Exportación automatizada a Terraform (IaC) | Media | Fase final del flujo; requiere que el diseño esté validado. |
| RF-11 | Reporte de auditoría en PDF | Baja | Funcionalidad complementaria, no indispensable para el MVP. |
| RF-12 | Dashboard resumen | Baja | Requiere que los demás módulos ya estén generando datos. |

### 

### **9\. Otros requerimientos del producto**

## **a) Estándares aplicables**

* W3C (World Wide Web Consortium): desarrollo del frontend respetando los estándares de maquetación HTML5 y CSS3 semántico.

* Guía de estilos visual consistente para los componentes de la interfaz de usuario, garantizando un aspecto moderno e intuitivo.

* Documentación técnica del código bajo estándares reconocidos (JSDoc, PHPDoc o equivalentes según el stack elegido).


## **b) Estándares legales**

El sistema debe considerar la protección de los datos de configuración e infraestructura de los usuarios, restringiendo el acceso a la información sensible únicamente a los usuarios autenticados y autorizados según su rol, en línea con los principios generales de protección de datos personales aplicables en el Perú (Ley N.º 29733). 

## **c) Estándares de comunicación**

* APIs RESTful: intercambio de datos estructurado en formato JSON a través de verbos HTTP estándar (GET, POST, PUT, DELETE).

* OpenAPI (Swagger): documentación estandarizada de los endpoints de la API para facilitar su mantenimiento e integración.

## **d) Estándares de cumplimiento de la plataforma**

* Compatibilidad con los principales navegadores web de escritorio (Chrome, Edge, Firefox).

* Compatibilidad de las plantillas generadas con la sintaxis vigente de Terraform (HCL2).

* Alineación de las reglas de auditoría con las versiones vigentes de los CIS Benchmarks y los Well-Architected Frameworks de AWS, Azure y GCP.

## **e) Estándares de calidad y seguridad**

* Control de versiones del código fuente mediante Git.

* Pruebas funcionales del motor de reglas para validar que las alertas de seguridad se generen correctamente ante configuraciones inseguras conocidas.

* Validación de las estimaciones de costos contra los catálogos de precios oficiales de los proveedores cloud.

### **CONCLUSIONES**

1. La fragmentación actual entre las herramientas de diagramación y los motores de análisis técnico (seguridad, costos, resiliencia) representa una necesidad real y vigente en el diseño de arquitecturas cloud, lo que valida la pertinencia del proyecto CloudScope.

2. La integración de un enfoque Shift-Left, tanto en seguridad (CIS Benchmarks, Well-Architected Framework) como en costos (FinOps), permite anticipar riesgos y sobrecostos desde la etapa de diseño, en lugar de detectarlos después del aprovisionamiento.

3. La exportación automatizada a Infraestructura como Código (Terraform) reduce el riesgo de errores manuales en la transcripción del diseño hacia scripts de aprovisionamiento.

   

### **RECOMENDACIONES**

4. Priorizar la implementación del lienzo interactivo y del motor de auditoría de seguridad (OE1 y OE2) como base funcional antes de abordar los módulos de costos e IaC.

5. Mantener actualizado el catálogo de precios de los proveedores cloud utilizado por el módulo de estimación de costos, dado que estos catálogos cambian con frecuencia.

6. Actualizar periódicamente las reglas del motor de auditoría conforme evolucionen los estándares CIS Benchmarks y Well-Architected Framework.

7. Evaluar, en versiones futuras, la incorporación de otros lenguajes de Infraestructura como Código además de Terraform (por ejemplo, Pulumi o CloudFormation).

### **BIBLIOGRAFÍA**

* Gartner. (2024). Cloud Cost Management and FinOps Trends.

* Flexera. (2024). State of the Cloud Report.

* Project Management Institute. (2017). A Guide to the Project Management Body of Knowledge (PMBOK® Guide) (6th ed.). Project Management Institute.


### **WEBGRAFÍA**

* FinOps Foundation. (2024). FinOps Framework. [https://www.finops.org/framework/](https://www.finops.org/framework/)  
* Center for Internet Security. (2024). CIS Benchmarks. [https://www.cisecurity.org/cis-benchmarks](https://www.cisecurity.org/cis-benchmarks)  
* Amazon Web Services. (2024). AWS Well-Architected Framework. [https://aws.amazon.com/architecture/well-architected/](https://aws.amazon.com/architecture/well-architected/)  
* HashiCorp. (2024). Terraform Documentation. [https://developer.hashicorp.com/terraform/docs](https://developer.hashicorp.com/terraform/docs)


  


[image1]: <data:image/png;base64,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>