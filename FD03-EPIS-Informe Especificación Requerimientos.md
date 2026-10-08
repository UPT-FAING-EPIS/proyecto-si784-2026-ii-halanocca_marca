

UNIVERSIDAD PRIVADA DE TACNA

FACULTAD DE INGENIERÍA

Escuela Profesional de Ingeniería de Sistemas


Proyecto CloudScape

Curso: Calidad de Software


Docente: Mtro. Patrick Cuadros Quiroga


Integrantes:

Halanocca Rojas, Usher Damiron (2023076795)Marca Aguilar, Stevie Gerald (2023076802)






Tacna – Perú
2026


| Versión | Hecha por | Revisión y aprobación | Fecha | Motivo |
| --- | --- | --- | --- | --- |
| 1.0 | U. D. Halanocca RojasS. G. Marca Aguilar | Pendientes de revisión docente | 06/10/2026 | Especificación basada en el sistema CloudScope del repositorio. |










Sistema CloudScape
Documento de Especificación de Requerimientos de Software

Versión {1.0}














Índice general

# Introducción

CloudScape reúne el diseño visual de una arquitectura cloud y el análisis de sus configuraciones en una aplicación web. El usuario construye un grafo de componentes y conexiones, revisa hallazgos de seguridad, consulta costos mensuales referenciales, simula dependencias afectadas y obtiene archivos de intercambio e infraestructura como código.
Esta especificación toma el producto desarrollado como línea base. Su alcance abarca el registro y acceso, los proyectos, el editor, los motores de análisis, las exportaciones y el panel administrativo. Las mejoras necesarias para su uso productivo se identifican expresamente para evitar confundir el prototipo académico con un servicio certificado.

# I . Generalidades de la organización


## 1.Nombre de la organización

CloudScope

## 2 .Visión del proyecto

Disponer de un entorno de apoyo al diseño cloud que permita revisar seguridad, costos y dependencias antes de trasladar la arquitectura a un entorno real. Esta formulación corresponde al proyecto y no sustituye la visión institucional de la universidad.

## 3. Misión del proyecto

Facilitar la construcción y evaluación de topologías cloud mediante componentes configurables, reglas explícitas y artefactos reutilizables, con resultados comprensibles para estudiantes y profesionales de infraestructura.





# II.  Visionamiento de la organización


## Descripción del problema

La elaboración de diagramas, la revisión de configuraciones y la estimación de gastos suelen requerir actividades separadas. Cuando un diseño cambia, estas revisiones pueden quedar desactualizadas. El proyecto aborda esa separación utilizando el mismo grafo como entrada de los distintos análisis.

## Objetivos de negocio


| ID | Objetivo |
| --- | --- |
| OB01 | Centralizar la elaboración y revisión de arquitecturas en un entorno de trabajo. |
| OB02 | Hacer visibles configuraciones de riesgo durante el diseño. |
| OB03 | Comparar el costo referencial de alternativas. |
| OB04 | Reutilizar proyectos y generar artefactos para su revisión técnica. La reducción efectiva de tiempos o errores deberá comprobarse mediante una evaluación posterior. |




## Objetivos de diseño


| ID | Objetivo |
| --- | --- |
| OD01 | Mantener nodos, conexiones y configuración en una representación reutilizable. |
| OD02 | Ejecutar reglas y cálculos sobre el estado del editor. |
| OD03 | Separar presentación, casos de uso y modelos de dominio. |
| OD04 | Permitir persistencia local y comunicación con una API para proyectos y usuarios. |





## Alcance del proyecto

El sistema CloudScope es un aplicativo web que permite a arquitectos de soluciones, ingenieros DevOps/Cloud y especialistas en seguridad diseñar topologías de infraestructura cloud mediante un lienzo interactivo basado en grafos, validar dichas topologías contra estándares de seguridad de la industria, estimar su costo mensual proyectado y exportar el diseño final a plantillas de Terraform listas para su aprovisionamiento. El alcance comprende:
●        Lienzo web interactivo (grafos) para el modelado de componentes de infraestructura cloud (cómputo, redes, almacenamiento, bases de datos).
●        Motor de reglas de auditoría de seguridad y resiliencia alineado a Well-Architected Framework y CIS Benchmarks.
●        Módulo de estimación dinámica de costos mensuales (FinOps), calculado en tiempo real conforme se modifica el diseño.
●        Módulo de simulación de impacto (blast radius) ante cambios en componentes de la arquitectura.
●        Módulo de exportación automatizada del diseño a plantillas de Infraestructura como Código (Terraform).






## Viabilidad del sistema

La viabilidad técnica se sustenta en la existencia de un frontend React con React Flow y un backend Java 21 con Spring Boot 3.3.3, JPA y configuración para PostgreSQL. Los scripts y archivos de contenedores permiten preparar un entorno de ejecución. El equipo puede desarrollar el prototipo sin desplegar recursos reales de proveedores cloud.
La viabilidad operativa depende del acceso a un navegador de escritorio, de la comprensión de componentes cloud y de la disponibilidad del backend para las funciones de cuenta.


## Información obtenida del levantamiento

La técnica utilizada fue el análisis documental de FD01 y FD02. Se identificaron pantallas, flujos, estructuras de datos, cálculos y dependencias.
La revisión permitió precisar cuatro diferencias frente a la visión inicial: inclusión de OCI, tarifas locales, exportación HCL parcial y persistencia con predominio local. Estas
precisiones se incorporan a los requisitos finales y a la matriz de brechas.

# III Análisis de procesos


## Proceso de referencia previo al sistema


Figura 2. Actividades de referencia con información distribuida entre herramientas.


## Proceso propuesto con CloudScope


Figura 3. Flujo propuesto. La revisión de un resultado puede originar una nueva edición.


# IV Especificación de requerimientos de software


## Cuadro de requerimientos funcionales iniciales


| ID | Necesidad inicial |
| --- | --- |
| RFI01 | Diseñar topologías mediante un lienzo de grafos. |
| RFI02 | Configurar recursos de diversos proveedores cloud. |
| RFI03 | Detectar riesgos y recomendar correcciones. |
| RFI04 | Estimar costo mensual de la arquitectura. |
| RFI05 | Comparar alternativas de configuración. |
| RFI06 | Simular el radio de impacto de un componente. |
| RFI07 | Generar infraestructura como código Terraform. |
| RFI08 | Conservar y reutilizar diseños. |
| RFI09 | Intercambiar proyectos e informes. |
| RFI10 | Dar acceso a usuarios y mantener sus datos. |
| RFI11 | Apoyar la administración y aprendizaje. |





## Cuadro de requerimientos no funcionales



| ID y atributo | Requisito medible y verificación |
| --- | --- |
| RNF01Respuesta interactiva | Para un proyecto de 100 nodos y 150 aristas, actualizar costos y auditoría en p95 ≤ 1 s tras un cambio, en 30 repeticiones. Medir en un equipo de 4 núcleos, 8 GB RAM y navegador de escritorio; registrar versión. |
| RNF02Guardado local | Guardar y reabrir el proyecto de ensayo en ≤ 2 s en p95 de 30 repeticiones; comparar IDs, posiciones, configuración y conexiones. |
| RNF03Compatibilidad | Completar acceso, edición, guardado, JSON y descarga HCL en Chrome, Edge y Firefox, en las dos versiones estables más recientes disponibles al probar. Registrar las versiones. |
| RNF04Usabilidad | Al menos 4 de 5 usuarios de prueba deben crear 5 nodos, conectarlos, corregir una alerta y guardar sin asistencia en ≤ 10 minutos después de leer la guía. |
| RNF05Protección de acceso | Rechazar todas las solicitudes a datos privados sin sesión válida y toda operación administrativa sin rol autorizado. Probar ausencia, alteración y caducidad del token en servidor. |
| RNF06Credenciales | No almacenar contraseñas legibles ni aceptarlas desde respaldo local en producción. Verificar almacenamiento con hash adaptativo y ausencia de contraseñas en respuestas y registros. |






## c) Cuadro de requerimientos funcionales finales



| ID | Requisito funcional | Prioridad | Criterio de aceptación |
| --- | --- | --- | --- |
| RF01 | Registrar una cuenta | Alta | Con backend disponible, enviar datos completos crea la cuenta. Repetir el correo produce conflicto y no duplica el registro. Un campo obligatorio vacío produce rechazo. |
| RF02 | Iniciar y cerrar sesión | Alta | Credenciales válidas conducen al panel. Credenciales inválidas muestran error. Al cerrar sesión se retira el acceso a rutas privadas. |
| RF03 | Gestionar proyectos locales | Alta | Crear, buscar y abrir un proyecto recupera su contenido. Confirmar la eliminación lo retira del listado local. |
| RF04 | Guardar el estado del proyecto | Alta | Al guardar y recargar se recupera el estado local. Con API disponible, POST /api/projects/{id}/save devuelve el proyecto almacenado. |
| RF05 | Crear a partir de una plantilla | Media | Seleccionar una plantilla produce un proyecto editable con el mismo conjunto inicial de componentes y enlaces. |
| RF06 | Consultar el catálogo multicloud | Alta | Cambiar proveedor presenta su catálogo. Incorporar EC2, Azure VM, Compute Engine y OCI Compute conserva el tipo de cada nodo. |
| RF07 | Construir el grafo | Alta | Crear A → B → C y eliminar B elimina B y sus conexiones incidentes, sin borrar A ni C. |
| RF08 | Editar parámetros de recursos | Alta | Cambiar EC2 a t3.small se refleja en el nodo y actualiza su costo. Cambiar RDS a pública actualiza los hallazgos. |
| RF09 | Deshacer y rehacer operaciones | Media | Agregar un nodo, deshacer y rehacer restaura ambos estados. Editar desde un estado anterior descarta el futuro del historial. |
| RF10 | Ejecutar auditoría de seguridad | Alta | Con RDS pública aparece SEC-001. Al desactivar la exposición desaparece. Cada resultado incluye regla, descripción, recomendación y nodo o alcance global. |
| RF11 | Mostrar resumen de seguridad | Alta | Con 1 crítico, 1 alto y 1 medio el puntaje es 65. Con penalización superior a 100 el puntaje es 0. |
| RF12 | Calcular costos mensuales | Alta | Un EC2 t3.micro + RDS básico sin Multi-AZ totaliza USD 40.24. Activar Multi-AZ produce USD 65.98. |
| RF13 | Comparar escenarios What If | Media | EC2 t3.micro frente a t3.small produce diferencia mensual de USD 7.25 y anual de USD 87.00, sin modificar el grafo original. |
| RF14 | Simular el radio de impacto | Alta | En A → B → C con D aislado, simular A marca B y C, identifica B como directo y calcula 67 % de impacto. |
| RF15 | Generar y descargar Terraform | Alta | Con una VPC AWS y una VNet Azure se generan bloques aws_vpc y azurerm_virtual_network y se descarga un archivo .tf. |
| RF16 | Exportar e importar proyectos JSON | Alta | Exportar y reimportar conserva nodos y aristas, asigna otro ID y añade el sufijo imported. JSON ilegible se rechaza. |
| RF17 | Generar reporte de auditoría | Media | Desde el editor se abre el reporte. Sus totales coinciden con el estado evaluado y el navegador permite imprimir o guardar como PDF. |
| RF18 | Actualizar perfil y acceder con Google | Media | Actualizar nombres, teléfono y región devuelve los datos modificados. El flujo Google correcto conduce al panel y el fallo muestra error. |
| RF19 | Consultar panel de administración | Media | Una cuenta con rol admin accede a /admin y consulta /users, /metrics y /logs. Un usuario normal es redirigido en la interfaz. |
| RF20 | Consultar guía de uso | Media | Un usuario con sesión abre /guide y consulta la orientación del producto. Sin token, la ruta redirige al acceso. |




## d)  Reglas de negocio



| ID | Regla y efecto verificable |
| --- | --- |
| RN01 | Un proyecto contiene su identificación y una versión del grafo. El guardado conserva createdAt y actualiza updatedAt. |
| RN02 | El espacio local de proyectos se selecciona por correo. Esta separación no reemplaza la autorización por propietario en la API. |
| RN03 | El costo total es la suma de getNodeCost de los nodos reconocidos y se redondea a dos decimales. Los tipos desconocidos no aportan costo; no deben interpretarse como servicios gratuitos. |
| RN04 | Los costos son estimaciones mensuales en USD del catálogo incorporado. No constituyen precios contratados, factura ni TCO completo. |
| RN05 | El puntaje es max(0, 100 − 20C − 10A − 5M), donde C, A y M cuentan hallazgos críticos, altos y medios. LOW e INFO no descuentan. |
| RN06 | Los hallazgos se ordenan CRITICAL, HIGH, MEDIUM, LOW e INFO. Cada uno conserva ruleId y una referencia de nodo o alcance global. |
| RN07 | Una arista A → B permite propagar desde A hacia B. El nodo origen no se cuenta como afectado. No se recorre automáticamente en sentido inverso. |
| RN08 | El impacto es round(100 × afectados / (N − 1)) cuando N > 1; para N ≤ 1 es 0. El conjunto de visitados evita ciclos infinitos. |
| RN09 | El escenario alternativo combina configuración base y cambios propuestos. Delta = costo alternativo − actual; delta anual = delta × 12. La comparación no altera el diseño. |
| RN10 | La importación genera una identidad nueva para no sobrescribir el proyecto existente. La validación completa de estructura queda exigida por RNF07. |
| RN11 | La exportación solo genera bloques para tipos reconocidos por GENERATORS. Los elementos visuales o no soportados no equivalen a recursos desplegables. |
| RN12 | La aprobación de una arquitectura y el despliegue pertenecen al usuario responsable. CloudScope no ejecuta terraform apply ni certifica seguridad integral. |







# V Fase de desarrollo


## Perfiles de usuario


| Perfil funcional | Responsabilidad | Acceso previsto |
| --- | --- | --- |
| Diseñador de arquitectura | Crear y mantener el grafo, sus etiquetas y parámetros. | Proyectos y editor. |
| Auditor de seguridad | Revisar hallazgos y proponer ajustes al diseño. | Auditoría e informe. |
| Analista de costos | Comparar estimaciones y escenarios. | Costos y What If. |
| Ingeniero de infraestructura | Revisar el HCL y completar su preparación externa. | Exportación Terraform y JSON. |
| Administrador | Consultar usuarios, métricas y registros del sistema. | Panel /admin. |




## Modelo conceptual



### Diagrama de paquetes


Figura 4. Agrupación de paquetes y dependencias principales del sistema revisado.
Diagrama de casos de uso

Figura 5. Casos de uso dentro del límite de CloudScope y asociaciones con sus actores.

Escenarios de casos de uso


|  | CU01 Gestionar acceso y perfil |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; Login.jsx, Register.jsx, AuthController.java. |  |
| Objetivos asociados | OD04 Permitir acceso y comunicación con la API. |  |
| Descripción | El usuario gestiona su acceso o perfil al seleccionar iniciar sesión, registrarse o actualizar datos. |  |
| Precondición | Pantalla de acceso disponible; backend accesible para registro, perfil y Google. Actor: Usuario o visitante. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | El usuario completa sus datos o credenciales. |
|  | 2 | El frontend envía la solicitud al endpoint de autenticación correspondiente. |
|  | 3 | El sistema valida campos y verifica existencia del correo o coincidencia de credenciales. |
|  | 4 | Con respuesta satisfactoria guarda los datos de sesión y abre el panel. |
|  | 5 | El usuario puede actualizar su perfil o cerrar la sesión desde la interfaz. |
| Escenario alternativo | A1 | Registro: el visitante completa sus datos; el sistema crea la cuenta y conduce al panel. Finaliza con acceso habilitado. |
|  | A2 | Google configurado: el usuario autoriza el acceso; el sistema recibe su perfil y retoma el paso 4. |
| Postcondición | Sesión iniciada, perfil actualizado o sesión local retirada, según la operación. |  |
| Excepciones | Paso | Acción |
|  | 1 | Campos incompletos o correo duplicado: el sistema rechaza el registro. La operación termina sin crear la cuenta. |
|  | 3 | Credenciales inválidas o fallo de Google: el sistema informa el error; no inicia la sesión y termina el intento. |











|  | CU02 Gestionar proyectos |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; Dashboard.jsx, projectStorage.js, ProjectController.java. |  |
| Objetivos asociados | OB01 Centralizar proyectos; OB04 reutilizar diseños. |  |
| Descripción | El usuario crea, abre, guarda o elimina proyectos desde el panel y el editor. |  |
| Precondición | Almacenamiento local habilitado; para copia remota, backend disponible. Actor: Usuario con sesión. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | El usuario abre el listado, crea un proyecto vacío o selecciona una plantilla. |
|  | 2 | El sistema asigna identidad y conserva metadatos y grafo. |
|  | 3 | El usuario abre el proyecto y edita el contenido. |
|  | 4 | Al guardar, el sistema actualiza la copia local e intenta enviar el grafo a la API. |
|  | 5 | El usuario puede buscar, ordenar, exportar o confirmar la eliminación local. |
| Escenario alternativo | A1 | Plantilla: el usuario selecciona un ejemplo; el sistema crea un proyecto con su grafo y continúa en el paso 3. |
|  | A2 | API no disponible: si la escritura local fue correcta, el proyecto queda guardado en el navegador. Concluye sin copia remota confirmada. |
| Postcondición | Proyecto disponible localmente; copia en servidor solo si la API confirma el guardado. |  |
| Excepciones | Paso | Acción |
|  | 2 | Almacenamiento local lleno o bloqueado: no se asegura el guardado. El intento termina sin éxito; el manejo visible del error está pendiente. |
|  | 5 | El usuario cancela la eliminación: el sistema conserva el proyecto y termina esa operación sin eliminarlo. |












|  | CU03 Editar arquitectura |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; useDiagram.js, DiagramCanvas.jsx, CloudNode.js. |  |
| Objetivos asociados | OD01 Mantener nodos, conexiones y configuración del diseño. |  |
| Descripción | El diseñador construye y modifica el grafo al arrastrar componentes, conectarlos o editar sus parámetros. |  |
| Precondición | Proyecto abierto y catálogo cargado. Actor: Diseñador. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | El usuario filtra el catálogo y arrastra un componente al lienzo. |
|  | 2 | El sistema crea el nodo con identidad y valores por defecto. |
|  | 3 | El usuario conecta nodos y modifica etiquetas o parámetros. |
|  | 4 | El estado del grafo se actualiza y alimenta los cálculos de seguridad y costo. |
|  | 5 | El usuario puede eliminar un nodo o deshacer y rehacer las operaciones con historial. |
| Escenario alternativo | A1 | Deshacer: el usuario solicita revertir una operación registrada; el sistema restaura la instantánea anterior y vuelve al paso 3. |
|  | A2 | Eliminar nodo: el usuario elige la acción del editor; el sistema retira el nodo y sus enlaces, y actualiza los análisis del paso 4. |
| Postcondición | Grafo actualizado en memoria; persistencia al ejecutar guardado. |  |
| Excepciones | Paso | Acción |
|  | 2 | Un tipo no reconocido no proporciona un componente válido para el diseño. Debe impedirse su incorporación; esta validación completa está pendiente. |
|  | 5 | No existe historial: el sistema no revierte ni rehace estados. La acción solicitada termina sin cambios. |











|  | CU04 Revisar seguridad |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; SecurityRule.js, runAudit.js, RightSidebar.jsx. |  |
| Objetivos asociados | OB02 Identificar configuraciones de riesgo durante el diseño. |  |
| Descripción | El auditor o diseñador consulta los hallazgos que CloudScope obtiene al evaluar el estado actual del grafo. |  |
| Precondición | Grafo disponible, incluso vacío. Actor: Auditor o diseñador. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | El sistema entrega nodos y aristas al motor de reglas. |
|  | 2 | Cada regla evalúa las condiciones que reconoce. |
|  | 3 | El motor reúne y ordena los hallazgos por severidad. |
|  | 4 | Se calcula el puntaje y los totales de severidad. |
|  | 5 | El usuario consulta la recomendación y modifica el recurso para repetir la evaluación. |
| Escenario alternativo | A1 | Sin hallazgos: el sistema presenta total cero y puntaje 100; el usuario revisa el resultado y el caso concluye con el alcance de las reglas locales. |
|  | A2 | Corrección: el usuario modifica una configuración observada; el sistema vuelve al paso 1 y muestra una evaluación actualizada. |
| Postcondición | Resultados del grafo actual visibles sin modificar automáticamente los recursos. |  |
| Excepciones | Paso | Acción |
|  | 2 | Una regla lanza un error: el motor registra el fallo y continúa con las demás. La evaluación completa no se alcanza; debe repetirse tras corregir la causa. |
|  | 1 | Grafo inválido impide evaluar: no se obtiene una auditoría válida. Se requiere corregir la entrada y reiniciar; validación robusta pendiente. |














|  | CU05 Revisar costos y alternativas |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; calculateCost.js, computeWhatIf.js, CloudNode.js. |  |
| Objetivos asociados | OB03 Comparar el costo referencial de alternativas. |  |
| Descripción | El analista revisa el costo mensual y, cuando existen escenarios compatibles, compara alternativas sin cambiar el grafo. |  |
| Precondición | Grafo con tipos reconocidos en el catálogo local. Actor: Analista de costos. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | El sistema obtiene la configuración de cada nodo reconocido. |
|  | 2 | Aplica precio base y los multiplicadores implementados. |
|  | 3 | Suma importes y muestra desglose y total mensual en USD. |
|  | 4 | Genera alternativas compatibles y compara cada una con su configuración original. |
|  | 5 | Presenta diferencia mensual y anual sin aplicar automáticamente los cambios. |
| Escenario alternativo | A1 | Sin alternativas compatibles: el usuario consulta el desglose original y concluye la revisión de costos sin comparación What If. |
|  | A2 | Alternativa sin cambio tarifado: el sistema muestra diferencia cero según la fórmula local y retoma el paso 5; no acredita igualdad de precio real. |
| Postcondición | Estimación y comparación disponibles; grafo original conservado. |  |
| Excepciones | Paso | Acción |
|  | 2 | Tipo desconocido: se omite su costo. No se logra una estimación completa del diseño; se debe corregir el tipo antes de aceptarla. |
|  | 2 | Parámetro numérico inválido impide un total confiable: la estimación no debe aceptarse. Debe corregirse la entrada; validación completa pendiente. |










|  | CU06 Simular impacto |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; runBlastRadius.js, Editor.jsx. |  |
| Objetivos asociados | OB04 Evaluar las dependencias afectadas por un cambio. |  |
| Descripción | El diseñador solicita una simulación para conocer los recursos alcanzables desde un nodo siguiendo conexiones salientes. |  |
| Precondición | Nodo origen seleccionado y grafo cargado. Actor: Diseñador o ingeniero. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | El sistema construye la adyacencia dirigida de las conexiones. |
|  | 2 | Recorre el grafo por BFS desde el origen con control de visitados. |
|  | 3 | Separa afectados directos y transitivos y obtiene aristas involucradas. |
|  | 4 | Calcula el porcentaje respecto de los demás nodos. |
|  | 5 | La interfaz resalta el resultado y permite limpiar la simulación. |
| Escenario alternativo | A1 | Nodo aislado: el sistema devuelve cero afectados e impacto de 0 %. Presenta el resultado y concluye la simulación. |
|  | A2 | Grafo con ciclo: el recorrido omite nodos ya visitados, continúa el paso 3 y termina sin repetición infinita. |
| Postcondición | Visualización de impacto sin eliminación efectiva de infraestructura ni del grafo. |  |
| Excepciones | Paso | Acción |
|  | 1 | Sin nodo origen: el sistema devuelve un resultado vacío. La simulación solicitada no se realiza y termina el intento. |
|  | 1 | Origen inexistente o enlaces inválidos: no se debe aceptar la simulación. Se requiere corregir el grafo; el rechazo explícito está pendiente. |











|  | CU07 Exportar Terraform |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; generateTerraform.js, useDiagram.js. |  |
| Objetivos asociados | OB04 Generar artefactos reutilizables para revisión técnica. |  |
| Descripción | El ingeniero selecciona exportar IaC para obtener un archivo Terraform de partida, sin desplegar infraestructura. |  |
| Precondición | Proyecto abierto con componentes; navegador permite descargar. Actor: Ingeniero de infraestructura. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | El sistema identifica tipos presentes y proveedores relacionados. |
|  | 2 | Construye cabecera de Terraform, variables y proveedores. |
|  | 3 | Invoca los generadores disponibles para cada tipo compatible. |
|  | 4 | Concatena bloques y prepara el archivo .tf. |
|  | 5 | El usuario descarga y revisa parámetros, referencias y dependencias fuera de CloudScope. |
| Escenario alternativo | A1 | Diseño multicloud: el sistema incluye los proveedores detectados y continúa con los generadores compatibles del paso 3. |
|  | A2 | Tipo sin generador: el sistema omite ese tipo y descarga los bloques soportados. Finaliza una exportación parcial que exige revisión. |
| Postcondición | Archivo de partida descargado; no hay ejecución de Terraform. |  |
| Excepciones | Paso | Acción |
|  | 4 | El navegador bloquea o el usuario cancela la descarga: no se obtiene el archivo y termina la exportación. |
|  | 3 | La generación falla y no produce contenido HCL: no se alcanza la descarga. Corregir la entrada y repetir; manejo explícito del error pendiente. |












| RF16 | CU08 Intercambiar proyecto JSON |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; projectStorage.js, Dashboard.jsx. |  |
| Objetivos asociados | OB04 Conservar y reutilizar proyectos mediante JSON. |  |
| Descripción | El usuario intercambia diseños mediante exportación de un proyecto guardado o importación de un archivo JSON compatible. |  |
| Precondición | Para exportar: proyecto guardado. Para importar: archivo legible y almacenamiento disponible. Actor: Usuario. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | En exportación, el sistema serializa metadatos, nodos y aristas y descarga JSON. |
|  | 2 | En importación, el usuario selecciona un archivo .json. |
|  | 3 | El sistema interpreta JSON y revisa presencia de nodos y aristas. |
|  | 4 | Asigna nuevo ID y sufijo al nombre. |
|  | 5 | Agrega el proyecto al listado para abrirlo y revisarlo. |
| Escenario alternativo | A1 | Solo exportación: el sistema serializa el proyecto y descarga JSON; el caso termina sin ejecutar los pasos de importación. |
|  | A2 | Se importa una copia ya existente: el sistema conserva el contenido, asigna otro ID y continúa en el paso 5 sin sobrescribir el original. |
| Postcondición | Archivo exportado o proyecto adicional sin sobrescribir el original. |  |
| Excepciones | Paso | Acción |
|  | 2 | Selección cancelada: no se lee ni incorpora un archivo; la importación termina sin cambios. |
|  | 3 | JSON ilegible o sin nodes y edges: el sistema rechaza el archivo. La importación termina sin crear el proyecto; validación profunda pendiente. |












| RF17 | CU09 Emitir reporte de auditoría |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; generateAuditReport.js, Editor.jsx. |  |
| Objetivos asociados | OB02 y OB04 Comunicar resultados de la revisión del diseño. |  |
| Descripción | El usuario solicita un reporte para revisar y compartir los hallazgos y costos del estado actual del proyecto. |  |
| Precondición | Proyecto y resultados de análisis disponibles; ventanas emergentes permitidas. Actor: Auditor o usuario. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | El sistema obtiene nombre, grafo, auditoría y desglose de costos. |
|  | 2 | Genera HTML con fecha, indicadores y recomendaciones. |
|  | 3 | Abre la vista imprimible. |
|  | 4 | El usuario revisa los datos y activa la impresión del navegador. |
|  | 5 | El usuario elige impresora o guardado como PDF. |
| Escenario alternativo | A1 | Guardar como PDF: el usuario elige la impresora PDF del navegador y completa el paso 5 con un archivo. |
|  | A2 | Sin hallazgos: el reporte presenta cantidades cero y los demás indicadores; el usuario continúa con la impresión o guardado. |
| Postcondición | Reporte disponible para impresión o archivo según elección del usuario. |  |
| Excepciones | Paso | Acción |
|  | 3 | Ventana emergente bloqueada: no se abre el reporte y no se obtiene la salida; termina el intento. |
|  | 4 | Impresión cancelada: no se imprime ni se guarda PDF. Termina la salida solicitada y el proyecto permanece sin cambios. |













|  | CU10 Consultar administración y guía |  |
| --- | --- | --- |
| Versión | 1.1 — 01/10/2026 |  |
| Autores | Usher Damiron Halanocca RojasStevie Gerald Marca Aguilar |  |
| Fuentes | FD02; App.jsx, AdminPanel.jsx, AdminController.java, Guide.jsx. |  |
| Objetivos asociados | OD04 Consultar información administrativa y apoyo de uso. |  |
| Descripción | El administrador consulta usuarios, métricas y registros; cualquier usuario con sesión puede consultar la guía. |  |
| Precondición | Sesión activa; para administración, rol admin en la interfaz y backend disponible. Actor: Administrador para panel; usuario para guía. |  |
| Secuencia normal | Paso | Acción |
|  | 1 | El usuario elige la sección desde la navegación. |
|  | 2 | El guard de la interfaz verifica rol para la ruta administrativa. |
|  | 3 | El panel consulta usuarios, métricas y registros de la API. |
|  | 4 | El sistema muestra los datos o la guía correspondiente. |
|  | 5 | El usuario interpreta indicadores según su origen real o simulado. |
| Escenario alternativo | A1 | Guía: el usuario abre /guide; el sistema presenta la orientación sin requerir rol admin y concluye la consulta. |
|  | A2 | Sin archivo de registros: la API devuelve lista vacía; el administrador continúa revisando usuarios y métricas del paso 4. |
| Postcondición | Información presentada; no se especifica CRUD de usuarios como función existente. |  |
| Excepciones | Paso | Acción |
|  | 2 | Rol distinto de admin: la interfaz redirige al panel y termina el acceso administrativo. La autorización en servidor está pendiente. |
|  | 3 | API inaccesible: no se obtienen datos administrativos actualizados. Termina la consulta sin resultado válido; no deben confundirse con datos simulados. |





## 3.   Modelo lógico


### Análisis de objetos



| Objeto | Atributos principales | Responsabilidad y relación |
| --- | --- | --- |
| CloudProject / Project | id, name, description, version, nodes, edges, createdAt, updatedAt | Agregado del proyecto; contiene 0..* nodos y 0..* aristas. |
| Nodo del editor | id, position, data.cloudType, data.label, data.config | Representa un recurso o elemento visual. Obtiene esquema y valores del catálogo. |
| Arista | id, source, target | Conecta exactamente un origen y un destino; ambos deben existir en el proyecto. |
| NodeMeta | type, label, provider, baseCostPerMonth, configSchema | Define los tipos disponibles y la base para la configuración y costo. |
| SecurityRule | id, title, severity, framework, evaluate | Evalúa el grafo y produce 0..* hallazgos. |
| SecurityFinding | ruleId, severity, title, description, recommendation, nodeId, framework | Resultado de regla; nodeId puede ser nulo en un hallazgo global. |
| CostBreakdown | total, lineItems | Valor derivado del grafo; cada línea corresponde a un nodo reconocido. |
| BlastRadiusResult | sourceNodeId, affectedNodeIds, directNodeIds, affectedEdgeIds, impactScore | Resultado transitorio de recorrido, no una entidad persistente. |
| UserEntity | id, firstName, lastName, email, password, region, phone | Registro de usuario. La protección del atributo password está pendiente. |
| ProjectEntity | id, name, description, version, nodesJson, edgesJson, createdAt, updatedAt | Almacena el grafo serializado como texto en la tabla projects. |





### Diagrama de actividades con objetos



Figura 6. Actividades y objetos de información del flujo de edición y análisis.
||

### Diagrama de secuencia


Figura 7. Interacciones de guardado local y copia remota. La llamada HTTP es asíncrona.


### Diagrama de clases


Figura 8. Modelo lógico simplificado. CloudNode y Edge son estructuras del editor, no entidades JPA.



# Conclusiones

CloudScope dispone de una base de código que integra el modelado de arquitecturas multicloud con auditoría local, estimación de costos, análisis de impacto y exportación. El informe transforma esas capacidades en 20 requisitos funcionales y 12 requisitos no funcionales con condiciones de comprobación.
Los modelos de procesos, paquetes, c|asos de uso, actividades, secuencia y clases reflejan el funcionamiento revisado: el grafo es la fuente de los análisis y el navegador conserva la copia principal de los proyectos utilizados por la interfaz.
El producto permite elaborar y evaluar diseños, pero la seguridad de acceso, la sincronización, los precios y la generación IaC requieren trabajo adicional para usos productivos. La aceptación académica debe considerar esas brechas de manera explícita.

# Recomendaciones

1. Priorizar autorización en servidor, protección de credenciales, validación de identidad y propiedad de proyectos antes de habilitar información privada de usuarios reales.
2. Ejecutar el plan de aceptación y documentar resultados reproducibles. Verificar especialmente las conexiones dirigidas, los nodos vinculados a hallazgos y el intercambio JSON.
3. Alinear las alternativas What If con los parámetros que realmente cambian el cálculo. Añadir versión y fecha del catálogo de precios y evitar presentar estimaciones locales como tarifas vigentes.
4. Ampliar la traducción de dependencias a Terraform, identificar tipos sin generador y revisar las configuraciones exportadas antes de cualquier despliegue externo.
5. Mantener consistencia entre FD01, FD02, este FD03 y el documento de arquitectura FD04, especialmente en cobertura multicloud, persistencia y límites de calidad.




# Webgrafía


HashiCorp. Terraform Language Documentation. Describe el lenguaje declarativo usado para expresar recursos y dependencias. https://developer.hashicorp.com/terraform/language
Amazon Web Services. AWS Well-Architected Framework. Referencia de buenas prácticas para revisar decisiones arquitectónicas; no constituye por sí mismo un mecanismo de auditoría certificada. https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
Center for Internet Security. CIS Benchmarks. Catálogo de recomendaciones de configuración segura. La correspondencia entre controles oficiales y reglas locales requiere validación de versión y alcance. https://www.cisecurity.org/cis-benchmarks
FinOps Foundation. FinOps Framework Overview. Contexto de gestión del valor y costo de tecnología; CloudScope desarrolla una función acotada de estimación durante el diseño. https://www.finops.org/framework/
