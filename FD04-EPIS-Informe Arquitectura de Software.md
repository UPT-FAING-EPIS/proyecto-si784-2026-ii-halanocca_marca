

UNIVERSIDAD PRIVADA DE TACNA

FACULTAD DE INGENIERIA

Escuela Profesional de Ingeniería de Sistemas


Proyecto CloudScope

Curso: Calidad de Software


Docente: Mtro. Patrick Cuadros Quiroga


Integrantes:

Halanocca Rojas, Usher Damiron (2023076795)Marca Aguilar, Stevie Gerald (2023076802)








Tacna – Perú
2026

CloudScope
Documento de Arquitectura de Software
FD04 · Versión 1.0 · 7 de octubre de 2026
Diagramador y analizador interactivo de infraestructura cloud con auditoría de seguridad, estimación de costos y generación de infraestructura como código.
Control de versiones

| Versión | Elaboración | Revisión y aprobación | Fecha |
| --- | --- | --- | --- |
| 1.0 | Usher Halanocca RojasStevie Marca Aguilar | Pendientes | 07/10/2026 |



Motivo de la versión: desarrollo del informe de arquitectura a partir de FD02, FD03 y del código disponible en el repositorio del proyecto.
Resumen de la arquitectura
CloudScope utiliza una aplicación web React para construir y analizar grafos de infraestructura. La auditoría, el cálculo de costos, la simulación de impacto y la generación de Terraform se ejecutan en el navegador. Un backend Spring Boot expone servicios de proyectos, acceso y administración; PostgreSQL conserva los registros del servidor.
La interfaz consulta los proyectos desde localStorage y, al guardar, intenta enviar una copia al servidor de forma asíncrona. Esta decisión facilita la continuidad de edición, pero todavía no constituye una sincronización bidireccional con resolución de conflictos. La seguridad del acceso y la propiedad de los proyectos requieren completar controles en el servidor.
Este informe describe la arquitectura observada y sus límites. Los escenarios de calidad son criterios de aceptación; no se presentan como resultados de pruebas ejecutadas.

Índice general
1 Introducción4
1.1 Propósito y modelo 4 más 14
1.2 Alcance4
1.3 Definiciones siglas y abreviaturas4
1.4 Organización del documento4
2 Objetivos y restricciones arquitectónicas5
2.1 Priorización de requerimientos5
2.1.1 Requerimientos funcionales5
2.1.2 Requerimientos no funcionales y calidad5
2.2 Restricciones y decisiones de diseño6
3 Representación de la arquitectura del sistema7
3.1 Vista de casos de uso7
3.1.1 Diagrama de casos de uso7
3.2 Vista lógica8
3.2.1 Diagrama de subsistemas8
3.2.2 Diagrama de secuencia9
3.2.3 Diagrama de colaboración10
3.2.4 Diagrama de objetos11
3.2.5 Diagrama de clases12
3.2.6 Diagrama de base de datos13
3.3 Vista de implementación14
3.3.1 Diagrama de arquitectura de software14
3.3.2 Diagrama de componentes15
3.4 Vista de procesos16
3.4.1 Diagrama de actividades16
3.5 Vista de despliegue17
3.5.1 Diagrama de despliegue17
4 Atributos de calidad del software18
4.1 Escenario de funcionalidad18
4.2 Escenario de usabilidad18
4.3 Escenario de confiabilidad18
4.4 Escenario de rendimiento18
4.5 Escenario de mantenibilidad19
4.6 Otros escenarios19
Conclusiones y recomendaciones20



# 1 Introducción


## 1.1 Propósito y modelo 4 más 1

Documentar las decisiones y elementos que permiten desarrollar, mantener y evaluar CloudScope. El informe está dirigido al equipo del proyecto y al docente del curso Calidad de Software. Las vistas relacionan los requisitos con los módulos, las interacciones y la infraestructura que los soporta.

Figura 1. Organización de la arquitectura mediante cuatro vistas y escenarios de casos de uso.

## 1.2 Alcance

Se incluyen acceso, proyectos locales, edición de grafos, catálogo multicloud, auditoría, costos, What If, impacto, intercambio JSON, Terraform, reportes y consulta administrativa. Se describe el despliegue definido con Docker Compose, sin afirmar disponibilidad del servidor remoto. Quedan fuera el aprovisionamiento real de recursos cloud, la colaboración simultánea y la facturación de proveedores.

## 1.3 Definiciones siglas y abreviaturas

API REST es la interfaz HTTP que intercambia JSON. BFS es el recorrido en anchura de un grafo de nodos y aristas. FinOps se concreta aquí en estimaciones durante el diseño. HCL es el lenguaje de Terraform e IaC significa infraestructura como código. JPA corresponde a persistencia Java y SPA a una aplicación web de una sola página. El radio de impacto identifica nodos alcanzables desde un origen siguiendo las aristas.

## 1.4 Organización del documento

La sección 2 prioriza requisitos y restricciones; la sección 3 desarrolla las vistas y los diagramas solicitados; la sección 4 establece escenarios medibles. El cierre reúne conclusiones, mejoras y fuentes internas de trazabilidad.


# 2 Objetivos y restricciones arquitectónicas

La prioridad es conservar un grafo consistente, ofrecer retroalimentación durante la edición y permitir recuperar los proyectos guardados. La separación de presentación, casos de uso y dominio facilita modificar reglas y catálogos. La protección del servidor es una condición pendiente para usar información privada de usuarios reales.

## 2.1 Priorización de requerimientos

Se mantienen los identificadores RF de FD03. Alta indica una función central o un requisito previo de acceso y conservación; Media identifica funciones complementarias del flujo principal. La prioridad no equivale a una afirmación de cumplimiento.

### 2.1.1 Requerimientos funcionales


| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF01–RF02 | Registrar cuenta e iniciar o cerrar sesión. | Alta |
| RF03–RF04 | Gestionar proyectos locales y guardar su estado. | Alta |
| RF05 | Crear proyectos a partir de plantillas. | Media |
| RF06–RF08 | Consultar catálogo, construir el grafo y editar parámetros. | Alta |
| RF09 | Deshacer y rehacer operaciones. | Media |
| RF10–RF12 | Ejecutar auditoría, resumir seguridad y calcular costos. | Alta |
| RF13 | Comparar escenarios What If. | Media |
| RF14–RF16 | Simular impacto, generar Terraform e intercambiar JSON. | Alta |
| RF17–RF20 | Reporte, perfil y Google, administración y guía. | Media |




### 2.1.2 Requerimientos no funcionales y calidad


| ID de FD03 | Prioridad | Decisión arquitectónica asociada |
| --- | --- | --- |
| RNF01 | Alta | Calcular costos y auditoría sobre el estado del navegador; medir respuesta. |
| RNF02 | Alta | Persistir localmente antes del intento de copia remota. |
| RNF03–RNF04 | Media | Interfaz web, guía y controles visuales; verificar compatibilidad y usabilidad. |
| RNF05–RNF06 | Alta | Completar autorización en servidor y protección de credenciales. |





## 2.2 Restricciones y decisiones de diseño


| Decisión | Fundamento | Consecuencia y límite |
| --- | --- | --- |
| AD01 Grafo en JSON | El editor comparte nodos y aristas con los análisis. | El modelo facilita intercambio; requiere validar estructura y referencias. |
| AD02 Análisis en el cliente | Retroalimentación sin petición HTTP por cada cambio. | El tiempo depende del tamaño del grafo y del equipo; no hay trabajador separado. |
| AD03 Guardado local primero | Mantener la copia que la interfaz puede recuperar. | Sin reintentos, confirmación ni reconciliación de la copia remota. |
| AD04 Puertos y adaptadores | ProjectService usa interfaces de aplicación y repositorio. | La separación está implementada para proyectos; acceso y administración usan JPA directamente. |
| AD05 Grafo serializado en BD | Persistir estructuras flexibles sin tablas por tipo de nodo. | No existen claves foráneas entre los nodos contenidos en JSON. |
| AD06 Despliegue con contenedores | Empaquetar frontend, API y base de datos. | Un solo host no proporciona alta disponibilidad. |



La configuración revisada declara React 18, React Flow 11 y Vite 5 en el frontend; Java 21 y Spring Boot 3.3.3 en el backend; PostgreSQL 16 y Caddy 2 en los contenedores. Son versiones declaradas por el repositorio, no una comprobación de los procesos actualmente desplegados.
Los precios provienen del catálogo incorporado. La generación HCL cubre únicamente tipos con generador y puede contener valores de ejemplo; no ejecuta Terraform. La evaluación de reglas inspecciona el grafo dibujado y no consulta cuentas cloud ni certifica el cumplimiento integral de estándares.
El historial del editor conserva hasta 30 estados anteriores. El importador admite archivos de hasta 10 MB y comprueba IDs, posiciones, tipos de nodo y extremos de aristas antes de persistir. Estas comprobaciones no sustituyen la validación semántica de una infraestructura real.


# 3 Representación de la arquitectura del sistema


## 3.1 Vista de casos de uso

Los escenarios principales conectan al usuario con la edición y el análisis. El administrador consulta usuarios, métricas y registros; la guía pertenece al flujo del usuario con sesión. El rol administrativo se comprueba en la navegación, pero no se encontró autorización equivalente en los controladores revisados.

### 3.1.1 Diagrama de casos de uso


Figura 2. Agrupación de los casos CU01 a CU10 de FD03 y sus actores. La guía de CU10 también corresponde al usuario.

| Escenario | Realización y módulos | Requisitos |
| --- | --- | --- |
| Diseñar y evaluar | Editor y useDiagram actualizan el grafo; runAudit y calculateCost derivan resultados. | RF06–RF12 |
| Guardar y recuperar | projectStorage escribe localStorage y envía un POST; al abrir consulta la copia local. | RF03–RF04 |
| Comparar y exportar | computeWhatIf y runBlastRadius analizan; generateTerraform y exportProjectJSON descargan archivos. | RF13–RF16 |





## 3.2 Vista lógica

El grafo constituye el modelo de trabajo del frontend. Sus resultados analíticos se calculan a partir de nodos, configuración y aristas; no se almacenan como entidades JPA. El backend conserva Project y lo adapta a ProjectEntity para persistirlo.

### 3.2.1 Diagrama de subsistemas


Figura 3. Dependencias lógicas principales del frontend. Las flechas representan llamadas o consulta.

| Subsistema | Responsabilidad |
| --- | --- |
| Presentación | Renderizar el lienzo, recibir acciones y mostrar resultados. useDiagram mantiene nodos, aristas, selección e historial. |
| Aplicación | Ejecutar auditoría, costos, escenarios, impacto, Terraform y reporte. |
| Dominio | Definir tipos cloud, esquemas de configuración, precios base y reglas evaluables. |
| Infraestructura | Persistencia local, intento de guardado remoto y validación de importaciones. |



El dominio del backend no depende de JPA. ProjectUseCase define operaciones de aplicación y ProjectRepositoryPort define operaciones de persistencia; ProjectService coordina ambas. PostgresProjectRepository es el adaptador principal seleccionado por @Primary.


### 3.2.2 Diagrama de secuencia


Figura 4. Guardado local y envío remoto. La devolución local puede ocurrir antes de completar la persistencia remota.
El usuario solicita guardar desde el editor. saveProject preserva createdAt si existe el proyecto, actualiza updatedAt, escribe la lista y el proyecto activo en localStorage y luego inicia fetch. La interfaz recibe el objeto local sin esperar la respuesta del servidor.
ProjectController busca o crea el proyecto, aplica nombre, descripción, nodos y aristas, y llama a ProjectService. El adaptador JPA serializa el grafo en texto y persiste ProjectEntity. El backend devuelve el proyecto guardado.
Si la petición falla por red, el cliente ignora el error. Tampoco revisa response.ok, por lo que un error HTTP no provoca una advertencia de sincronización. Si localStorage falla, la escritura ocurre antes del bloque de envío remoto y no se puede asegurar el guardado.


### 3.2.3 Diagrama de colaboración


Figura 5. Objetos que colaboran en el guardado; los números señalan el orden de los mensajes.
La responsabilidad de conservar el estado utilizado por la interfaz pertenece a projectStorage. El controlador transforma la petición en cambios sobre Project; el servicio delega por el puerto de repositorio. La base de datos recibe la representación adaptada del agregado.
Las llamadas de listar, abrir y eliminar en projectStorage trabajan sobre almacenamiento local. Aunque existen rutas GET y DELETE en la API, esas operaciones del cliente no las utilizan para reconciliar datos. Eliminar localmente no elimina la copia remota.
Contratos de intercambio

| Contrato | Contenido y comportamiento |
| --- | --- |
| POST /api/projects/{id}/save | JSON con name, description, nodes y edges. Devuelve status, message y project. |
| GET /api/projects y GET /{id} | Listan proyectos del servidor u obtienen uno; no filtran por propietario. |
| DELETE /api/projects/{id} | Elimina un registro remoto. La eliminación local no invoca este contrato. |
| POST /api/projects/estimate-cost | Responde metadatos; no implementa el cálculo del frontend. |





### 3.2.4 Diagrama de objetos


Figura 6. Instantánea ilustrativa del modelo en memoria. No representa una topología cloud validada.
El proyecto de ejemplo contiene tres nodos y dos aristas. Para e1 de a hacia b y e2 de b hacia c, la simulación iniciada en a visita b y c. El resultado excluye al origen de affectedNodeIds. El nodo b pertenece al primer nivel de propagación.
El recorrido implementado sigue source hacia target. Por tanto, la interpretación del radio de impacto depende de que el usuario represente la dependencia con esa convención. El resultado es alcanzabilidad sobre el grafo, no una predicción de fallos de servicios en ejecución.
Valores derivados
El puntaje de impacto es el porcentaje de nodos alcanzados respecto de todos los nodos salvo el origen. En este ejemplo es 100 %. El puntaje de auditoría se calcula como máximo entre cero y 100 menos las penalizaciones: 20 por hallazgo crítico, 10 por alto y 5 por medio. Estos puntajes tienen objetivos distintos y no deben combinarse como una misma medida.


### 3.2.5 Diagrama de clases


Figura 7. Estructuras del grafo y clases centrales del guardado. Node y Edge son objetos JavaScript, no tablas JPA.
Project agrupa la identificación y el estado serializable. Cada Edge referencia por ID un origen y un destino. ProjectService implementa ProjectUseCase y depende de ProjectRepositoryPort; el adaptador PostgresProjectRepository implementa este último y traduce entre Project y ProjectEntity.
SecurityRule contiene id, title, severity, framework y evaluate. Cada ejecución produce cero o más SecurityFinding con regla, severidad, descripción, recomendación y nodeId opcional para hallazgos globales. NodeMeta aporta proveedor, etiqueta, configuración y costo base. Son estructuras y funciones del dominio del frontend.


### 3.2.6 Diagrama de base de datos


Figura 8. Modelo de persistencia declarado por las entidades JPA. No existe relación de propiedad entre users y projects.
Las dos entidades identificadas son users y projects. No se declara user_id en projects ni una clave foránea que asocie cada proyecto con un usuario. La separación por correo aplicada en localStorage es una convención del cliente y no un control de acceso sobre los registros remotos.
nodes_json y edges_json son columnas TEXT con JSON serializado por ObjectMapper. Las fechas se manejan como String en las entidades, por lo que el modelo no aplica tipos temporales nativos. Las longitudes de 255 reflejan el valor predeterminado del mapeo JPA; el esquema efectivo debe contrastarse con la base desplegada.
application.yml utiliza ddl-auto: update. Esta configuración facilita el prototipo, pero no proporciona un historial explícito de migraciones. El volumen cloudscope_pgdata conserva datos entre recreaciones del contenedor; se necesita un procedimiento probado de respaldo y restauración para recuperar pérdidas del host.
El campo password se almacena y compara sin hash en el flujo revisado. Como evolución se requiere protección de credenciales y una relación de propietario validada en cada operación de proyecto. Estas mejoras no se representan como relaciones existentes en el diagrama.


## 3.3 Vista de implementación


### 3.3.1 Diagrama de arquitectura de software


Figura 9. Distribución del código y artefactos de construcción.
El frontend organiza páginas, componentes y hooks en presentation; los cálculos y exportaciones se encuentran en application/use-cases; el catálogo y las reglas en domain/models. infrastructure/api contiene almacenamiento e importación. Vite produce los archivos estáticos dist que se incluyen en la imagen de Caddy.
El backend organiza Project en domain/models, los contratos en application/ports, el servicio en application/services y los controladores y repositorios en infrastructure/adapters. Maven produce un JAR que se ejecuta sobre JRE 21. AuthController y AdminController acceden directamente a SpringDataUserRepository, por lo que la separación hexagonal no es uniforme en todos los módulos.


### 3.3.2 Diagrama de componentes


Figura 10. Componentes ejecutables, almacenamiento y protocolos.
La SPA ejecuta los módulos analíticos y utiliza APIs del navegador para archivos y almacenamiento. Caddy sirve los recursos estáticos y dirige /api/* al backend. Spring Boot recibe JSON y usa Spring Data JPA para persistir en PostgreSQL. Los proveedores AWS, Azure, GCP y OCI son categorías del catálogo y de la salida HCL, no conexiones de aprovisionamiento activas.
generateTerraform selecciona generadores por cloudType y omite los tipos sin generador. La traducción no garantiza equivalencia completa entre aristas y dependencias HCL. El reporte de auditoría abre una vista imprimible, desde la cual el usuario decide imprimir o guardar en PDF.


## 3.4 Vista de procesos


### 3.4.1 Diagrama de actividades


Figura 11. Flujo principal de edición y guardado. El análisis se ejecuta en el navegador.
Los cambios del grafo actualizan el estado de React y recalculan valores derivados. No se identificó un Web Worker ni una cola independiente para análisis; los costos y las reglas comparten el entorno JavaScript de la interfaz. Los controladores REST y PostgreSQL se ejecutan como procesos separados y se comunican mediante HTTP y JDBC.
La auditoría recorre las reglas y acumula hallazgos; si una regla lanza una excepción se registra una advertencia y se continúa. Esto mantiene la respuesta del editor, pero puede producir un informe parcial sin una señal explícita al usuario. El análisis de impacto construye adyacencias dirigidas y aplica BFS, evitando revisitar nodos.
No hay transacción distribuida entre localStorage y PostgreSQL. Dos clientes pueden conservar estados diferentes del mismo ID y no existe un mecanismo de versión para rechazar escrituras obsoletas. Se requiere confirmación de sincronización y una política de conflictos antes de habilitar trabajo colaborativo.


## 3.5 Vista de despliegue


### 3.5.1 Diagrama de despliegue


Figura 12. Topología configurada en Docker Compose. Los tres contenedores pertenecen al mismo host previsto.
El frontend usa una construcción en Node 20 y una imagen de ejecución Caddy 2. El backend se compila con Maven 3.9 y Java 21. PostgreSQL 16 incorpora una comprobación de disponibilidad; el backend depende de que esa comprobación sea satisfactoria. Los servicios declaran reinicio automático.
El Caddyfile define un sitio HTTPS y un proxy hacia cloudscope-backend:8080. La configuración Compose también publica 8080 y 5432 en el host. Para restringir el acceso productivo, se debe limitar la exposición de API y base de datos y sustituir las credenciales de demostración. El diagrama documenta configuración, no una verificación de puertos accesibles desde Internet.
En desarrollo se utiliza Vite y una API en 8080. En HTTPS, projectStorage usa rutas del mismo origen. La base de datos dispone de un volumen persistente y Caddy dispone de volúmenes para datos y configuración; no hay réplica, balanceo entre hosts ni conmutación automática declarada.


# 4 Atributos de calidad del software

Cada escenario especifica fuente del estímulo, condición, respuesta y medida. Los umbrales derivados de FD03 conservan su carácter de aceptación pendiente. Los criterios adicionales se identifican como propuestos para FD04. Este trabajo documenta el sistema; no acredita resultados de rendimiento ni de pruebas con usuarios.

## 4.1 Escenario de funcionalidad

Fuente y estímulo: un usuario cambia una base RDS de privada a pública en un proyecto abierto. Ambiente y artefacto: editor cargado y reglas locales. Respuesta: runAudit incorpora SEC-001 con el nodo, severidad y recomendación; al revertir la exposición, desaparece el hallazgo. Medida: coincide el resultado antes y después en todos los casos de ensayo definidos para RF10. La revisión de código acredita el mecanismo; falta registrar la ejecución de aceptación.

## 4.2 Escenario de usabilidad

Fuente y estímulo: cinco usuarios nuevos intentan crear un diseño después de consultar la guía. Ambiente: navegador de escritorio y proyecto vacío. Respuesta: crear cinco nodos, conectarlos, corregir una alerta y guardar. Medida RNF04: al menos cuatro de cinco completan el flujo sin asistencia en diez minutos o menos. Se registrarán tiempos, errores y pasos donde requieren ayuda.

## 4.3 Escenario de confiabilidad

Fuente y estímulo: la API deja de estar disponible después de abrir el editor. Artefacto: proyecto en memoria y localStorage. Respuesta esperada: guardar localmente y recuperar IDs, posiciones, configuración y conexiones al recargar, siempre que la escritura local haya concluido. Medida RNF02: guardado y reapertura en p95 de dos segundos o menos en treinta repeticiones. La conservación remota no puede darse por confirmada. Debe añadirse un ensayo de cuota agotada y un aviso explícito de fallo, como criterio propuesto de FD04.

## 4.4 Escenario de rendimiento

Fuente y estímulo: el usuario modifica un recurso en un grafo de cien nodos y ciento cincuenta aristas. Ambiente: equipo de cuatro núcleos, ocho GB de RAM y navegador de escritorio con versión registrada. Respuesta: actualizar costos y auditoría. Medida RNF01: p95 de un segundo o menos en treinta repeticiones. Se medirá desde el cambio hasta la actualización visible, incluyendo el trabajo de la interfaz. El resultado está pendiente de medición.


## 4.5 Escenario de mantenibilidad

Fuente y estímulo: el equipo incorpora una regla de seguridad y un nuevo tipo cloud. Artefacto: catálogo, reglas y generadores. Respuesta: añadir el tipo y su configuración, regla y generador sin modificar contratos de almacenamiento ni controladores de proyectos. Medida propuesta para FD04: conservar los ensayos existentes y añadir casos de aceptación positivo, negativo y límite para la nueva regla, además de un caso de costo y otro de HCL. La separación actual facilita esta extensión; no implica cobertura automática de un proveedor completo.

## 4.6 Otros escenarios


| Atributo | Estímulo y respuesta esperada | Medida y situación |
| --- | --- | --- |
| Seguridad | Petición privada sin identidad válida o acceso administrativo con rol insuficiente: el servidor debe rechazarla. | RNF05: rechazo de todos los casos sin token, alterado o caducado. Pendiente en el backend revisado. |
| Credenciales | Registro y acceso: proteger el secreto almacenado y evitar su exposición. | RNF06: hash adaptativo y ausencia de contraseña legible en respuestas y logs. Pendiente. |
| Compatibilidad | Ejecutar acceso, edición, guardado, JSON y descarga HCL en navegadores de escritorio. | RNF03: Chrome, Edge y Firefox en las dos versiones estables disponibles al probar. Registrar evidencia. |
| Integridad de importación | Archivo ilegible, IDs repetidos o aristas huérfanas: rechazar antes de guardar. | Criterio FD04: mantener intactos los proyectos existentes en cada rechazo. Validaciones presentes; completar ensayos. |
| Recuperabilidad | Pérdida de la base: restaurar un respaldo y comparar los proyectos. | Criterio FD04: comparar cantidad, IDs y contenido; medir tiempo real. No se declara RTO o RPO garantizado. |



Los datos administrativos requieren interpretación: CPU, memoria y tiempo de ejecución se obtienen del entorno de la JVM; otros indicadores, como tráfico y peticiones, incluyen valores simulados. No deben emplearse como evidencia de capacidad o disponibilidad del sistema.


# Conclusiones y recomendaciones

CloudScope integra edición y análisis sobre un mismo grafo dentro del navegador. La estructura del frontend permite reutilizar nodos y aristas para auditoría, costos, impacto y exportación. El backend proporciona una separación por puertos y adaptadores para proyectos y un mapeo del grafo hacia PostgreSQL.
La arquitectura conserva la copia principal de la interfaz en localStorage. El envío remoto es complementario y no confirma sincronización; por ello, la disponibilidad de la API, los proyectos de otros dispositivos y la recuperación desde servidor requieren un flujo adicional. Las vistas de secuencia, colaboración y despliegue hacen explícito ese límite.
Las principales mejoras son completar autenticación y autorización en servidor, proteger contraseñas, asociar proyectos a propietarios y validar entradas también en la API. Después corresponde incorporar confirmación y reintentos de sincronización, control de conflictos y migraciones de base de datos. Los módulos analíticos necesitan ensayos reproducibles, catálogo de precios identificado y revisión de los archivos HCL generados.
Fuentes internas y trazabilidad
Base documental: FD02 Informe de Visión, FD03 Informe de Especificación de Requerimientos y README del proyecto. Fecha de revisión del código: 7 de octubre de 2026. Se utilizó el estado local disponible, incluidos cambios aún no confirmados en Git.

| Vista o tema | Archivos del repositorio bajo CLOUDSCOPE |
| --- | --- |
| Edición y análisis | cloudscope-frontend/src/presentation/hooks/useDiagram.js; application/use-cases de su árbol src. |
| Catálogo y reglas | cloudscope-frontend/src/domain/models/CloudNode.js y SecurityRule.js. |
| Persistencia local | cloudscope-frontend/src/infrastructure/api/projectStorage.js y parseProjectJSON.js. |
| API y datos | cloudscope-backend/src/main/java/com/cloudscope: application, domain e infrastructure/adapters. |
| Despliegue | docker-compose.yml; Dockerfile de cada aplicación; cloudscope-frontend/Caddyfile; backend src/main/resources/application.yml. |



Nota de consistencia: el importador local revisado utiliza el sufijo «(importado)» y añade validaciones estructurales. Estas precisiones actualizan la descripción previa de FD03; no alteran los identificadores de los requisitos. Los diagramas de este informe son elaboración del equipo a partir de los archivos indicados.