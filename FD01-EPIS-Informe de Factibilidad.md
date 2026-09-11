![C:\\Users\\EPIS\\Documents\\upt.png][image1]

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERÍA**

**Escuela Profesional de Ingeniería de Sistemas**

 **CloudScope: Diagramador y Analizador Interactivo de Infraestructura Cloud con Auditoría de Seguridad, Estimación de Costos y Generación de Infraestructura como Código**

Curso: CALIDAD Y PRUEBAS DE SOFTWARE 

Docente: Mtro. Patrick Cuadros Quiroga

Integrantes: 

Stevie Gerald Marca Aguilar (2023076802)  
Usher Damiron Halanocca Rojas (2023076795)

**Tacna – Perú**  
***2026***

# **Sistema *CLOUDSCOPE***

# **Informe de Factibilidad**

# 

# **Versión *{1.0}***

| CONTROL DE VERSIONES |  |  |  |  |  |
| :---: | :---: | :---: | :---: | :---: | ----- |
| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
| 1.0 | MPV | ELV | ARV | 26/08/2026 | Versión Original |

**ÍNDICE GENERAL**

**[Informe de Factibilidad	5](#informe-de-factibilidad)**

[1\. Descripción del Proyecto	5](#descripción-del-proyecto)

[1.1 Nombre del proyecto	5](#nombre-del-proyecto)

[1.2 Duración del proyecto	5](#duración-del-proyecto)

[1.3 Descripción	5](#descripción)

[1.4 Objetivos	5](#1.4-objetivos)

[1.4.1 Objetivo general	5](#1.4.1-objetivo-general)

[1.4.2 Objetivos Específicos	6](#1.4.2-objetivos-específicos)

[**2\. Riesgos	6**](#riesgos)

[**3\. Análisis de la Situación actual	7**](#análisis-de-la-situación-actual)

[3.1 Planteamiento del problema	7](#planteamiento-del-problema)

[3.2 Consideraciones de hardware y software	8](#consideraciones-de-hardware-y-software)

[**4\. Estudio de Factibilidad	9**](#estudio-de-factibilidad)

[4.1 Factibilidad Técnica	9](#factibilidad-técnica)

[4.2 Factibilidad Económica	9](#factibilidad-económica)

[4.2.1 Costos Generales	9](#costos-generales)

[4.2.2 Costos operativos durante el desarrollo	10](#costos-operativos-durante-el-desarrollo)

[4.2.3 Costos del ambiente	10](#costos-del-ambiente)

[4.2.4 Costos de personal	11](#costos-de-personal)

[4.2.5 Costos totales del desarrollo del sistema	11](#costos-totales-del-desarrollo-del-sistema)

[4.3 Factibilidad Operativa	12](#factibilidad-operativa)

[4.4 Factibilidad Legal	12](#factibilidad-legal)

[4.5 Factibilidad Social	12](#factibilidad-social)

[4.6 Factibilidad Ambiental	13](#factibilidad-ambiental)

[**5\. Análisis Financiero	13**](#análisis-financiero)

[5.1 Justificación de la Inversión	14](#justificación-de-la-inversión)

[5.1.1 Beneficios del Proyecto	14](#5.1.1-beneficios-del-proyecto)

[5.1.2 Criterios de Inversión	15](#5.1.2-criterios-de-inversión)

[**6\. Conclusiones	15**](#conclusiones)

# **Informe de Factibilidad** {#informe-de-factibilidad}

1. # **Descripción del Proyecto** {#descripción-del-proyecto}

   1. ## **Nombre del proyecto** {#nombre-del-proyecto}

CloudScope: Diagramador y Analizador Interactivo de Infraestructura Cloud con Auditoría de Seguridad, Estimación de Costos y Generación de Infraestructura como Código 

2. ## **Duración del proyecto** {#duración-del-proyecto}

3 meses

3. ## **Descripción**  {#descripción}

El proyecto consiste en una plataforma web interactiva enfocada en cerrar la brecha existente entre el diseño gráfico de arquitecturas en la nube y su posterior validación técnica, de costos y de seguridad. A diferencia de los lienzos estáticos convencionales (como Draw.io o Lucidchart) que funcionan como representaciones gráficas pasivas, esta herramienta integra un motor de reglas en tiempo de diseño y un módulo de simulación de impacto interactivo, el cual permite modelar fallos de componentes, evaluar la propagación de riesgos de seguridad y proyectar variaciones de costos antes del despliegue en producción.

## **1.4 Objetivos** {#1.4-objetivos}

###        **1.4.1 Objetivo general** {#1.4.1-objetivo-general}

Desarrollar un sistema interactivo de diagramación y análisis de infraestructura cloud que unifique el diseño visual con la auditoría en tiempo real de seguridad, estimación de costos y generación de código de infraestructura para optimizar el ciclo de diseño y aprovisionamiento en la nube. 

###         **1.4.2 Objetivos Específicos** {#1.4.2-objetivos-específicos}

- [ ] Diseñar e implementar un lienzo web interactivo basado en grafos que permita construir, editar y visualizar topologías de arquitectura cloud y sus dependencias de red de manera dinámica.   
- [ ] Construir un motor de reglas de análisis estático que audite la topología en tiempo de diseño frente a estándares de la industria (*AWS Well-Architected Framework* y *CIS Benchmarks*), alertando vulnerabilidades, configuraciones erróneas y puntos únicos de falla (SPOF).   
- [ ] Integrar un módulo de cálculo financiero predictivo que estime de forma dinámica el gasto mensual acumulado de la arquitectura según los componentes, tipos de instancia y conexiones agregadas al lienzo.   
- [ ] Implementar la simulación interactiva de radio de impacto ante modificaciones o caídas de componentes, y habilitar la exportación automatizada de la arquitectura a plantillas reproducibles de Infraestructura como Código en formato *Terraform*. 

2. # **Riesgos** {#riesgos}

| *ID* | *Riesgo* | *Probabilidad* | *Impacto* | *Estrategia de Mitigación* |
| :---- | :---- | ----- | ----- | :---- |
| ***R01*** | *Complejidad en el renderizado y manipulación de grafos de arquitectura extensos.* | *Media* | *Alto* | *Empleo de librerías especializadas en renderizado reactivo como **React Flow**.* |
| ***R02*** | *Variabilidad de tarifas públicas de los proveedores cloud.* | *Media* | *Medio* | *Consumo de catálogos y esquemas estandarizados de precios mediante endpoints o datasets cacheados.* |
| ***R03*** | *Restricción temporal de entrega (3 meses).* | *Media* | *Alto* | *Delimitación estricta a un Producto Mínimo Viable (MVP) enfocado en los servicios principales de AWS (VPC, Subnets, EC2, RDS, ALB, S3).* |

3. # **Análisis de la Situación actual** {#análisis-de-la-situación-actual}

   1. ## **Planteamiento del problema** {#planteamiento-del-problema}

Las organizaciones que migran cargas de trabajo a la nube enfrentan de forma recurrente dos problemas: incidentes de seguridad originados en errores de configuración y un gasto significativo desperdiciado por sobredimensionamiento de recursos. Según Gartner, a través de 2023 al menos el 99% de las fallas de seguridad en entornos cloud serían atribuibles a errores del cliente —principalmente configuraciones incorrectas— y no a fallas del proveedor de nube \[1\]. En la misma línea, el reporte Flexera 2026 State of the Cloud Report, elaborado a partir de una encuesta a 753 profesionales de TI, encontró que el gasto estimado como desperdiciado en servicios IaaS y PaaS subió a 29% en 2026, revirtiendo cinco años consecutivos de disminución, en parte por la creciente complejidad introducida por cargas de trabajo de inteligencia artificial \[2\].

Frente a este escenario, las soluciones actuales están fragmentadas: herramientas de diagramación como Draw.io o Lucidchart funcionan como lienzos de dibujo sin capacidad de validación (“ciegos” a la configuración real), mientras que los analizadores de seguridad como Checkov o Prowler entregan reportes técnicos en consola, sin una representación visual accesible para perfiles no especializados. Esta fragmentación obliga a los equipos a alternar entre herramientas desconectadas entre sí, retrasando la detección de errores hasta etapas avanzadas del ciclo de vida del proyecto, cuando corregirlos resulta más costoso. Existe, por tanto, la necesidad de una herramienta unificada y accesible que permita evaluar y simular la infraestructura desde la propia etapa de diseño gráfico.     	

2. ## **Consideraciones de hardware y software** {#consideraciones-de-hardware-y-software}

Las organizaciones que migran cargas de trabajo a la nube enfrentan de forma recurrente dos problemas: incidentes de seguridad originados en errores de configuración y un gasto significativo desperdiciado por sobredimensionamiento de recursos. Según Gartner, a través de 2023 al menos el 99% de las fallas de seguridad en entornos cloud serían atribuibles a errores del cliente —principalmente configuraciones incorrectas— y no a fallas del proveedor de nube \[1\]. En la misma línea, el reporte Flexera 2026 State of the Cloud Report, elaborado a partir de una encuesta a 753 profesionales de TI, encontró que el gasto estimado como desperdiciado en servicios IaaS y PaaS subió a 29% en 2026, revirtiendo cinco años consecutivos de disminución, en parte por la creciente complejidad introducida por cargas de trabajo de inteligencia artificial \[2\].

Frente a este escenario, las soluciones actuales están fragmentadas: herramientas de diagramación como Draw.io o Lucidchart funcionan como lienzos de dibujo sin capacidad de validación (“ciegos” a la configuración real), mientras que los analizadores de seguridad como Checkov o Prowler entregan reportes técnicos en consola, sin una representación visual accesible para perfiles no especializados. Esta fragmentación obliga a los equipos a alternar entre herramientas desconectadas entre sí, retrasando la detección de errores hasta etapas avanzadas del ciclo de vida del proyecto, cuando corregirlos resulta más costoso. Existe, por tanto, la necesidad de una herramienta unificada y accesible que permita evaluar y simular la infraestructura desde la propia etapa de diseño gráfico.

4. # **Estudio de Factibilidad** {#estudio-de-factibilidad}

El estudio de factibilidad busca determinar si CLOUD SCOPE  puede desarrollarse con los recursos técnicos, económicos, operativos, legales, sociales y ambientales disponibles para un equipo de 2 integrantes, dentro del plazo de 3 meses establecido. 

1. ## **Factibilidad Técnica** {#factibilidad-técnica}

El proyecto es técnicamente viable gracias a la madurez del ecosistema Java y frameworks como Spring Boot para la construcción de la API REST. El uso de librerías especializadas en renderizado reactivo mitigará la complejidad gráfica, mientras que la integración con los SDKs oficiales de proveedores cloud (como AWS SDK for Java) elimina la necesidad de montar infraestructura de simulación propia. El equipo cuenta con la capacidad de manejar bases de datos PostgreSQL y control de versiones vía GitHub. 

2. ## **Factibilidad Económica** {#factibilidad-económica}

El proyecto será autofinanciado por sus 2 integrantes, sin inversión externa ni deuda: se apoya en herramientas de código abierto y en los créditos/niveles gratuitos que ofrecen los proveedores cloud para reducir el capital de arranque necesario durante la fase de desarrollo y validación del producto. Los montos y tarifas usados a continuación provienen de fuentes de mercado peruanas e internacionales verificadas, citadas al pie de cada sección.

Definir los siguientes costos:

1. ### **Costos Generales**  {#costos-generales}

| Concepto General | Detalle Administrativo | Costo Mensual | Costo Total (3 meses) |
| ----- | ----- | ----- | ----- |
| Luz Proporcional | Subsidio de consumo eléctrico (S/40 por integrante) | S/ 80.00 | S/ 240.00 |
| Suite de Oficina | Cuentas Google Workspace y almacenamiento | S/ 60.00 | S/ 180.00 |
| **TOTAL GENERALES** | **Soporte administrativo y operativo base** | **S/ 140.00** | **S/ 420.00** |

   2. ### **Costos operativos durante el desarrollo**  {#costos-operativos-durante-el-desarrollo}

| Concepto de Gasto Operativo | Detalle Comercial del Recurso | Costo Mensual | Costo Total (3 meses) |
| ----- | ----- | ----- | ----- |
| **Bono de Internet** | Internet de Fibra Óptica (2 integrantes) | S/ 240.00 | S/ 720.00 |
| **Movilidad / Pasajes** | Taxis/Transporte para Sprints presenciales | S/ 320.00 | S/ 960.00 |
| **Licencias Técnicas** | Figma Pro y herramientas de diseño | S/ 140.00 | S/ 420.00 |
| **TOTALES** | **Gastos de Ejecución Técnica CloudScope** | **S/ 700.00** | **S/ 2,100.00** |

      3. ### **Costos del ambiente** {#costos-del-ambiente}

| Componente de Infraestructura | Especificación Comercial (AWS) | Costo Mensual | Costo Total (3 meses) |
| ----- | ----- | ----- | ----- |
| **Hosting Frontend** | AWS Amplify (Plan On-Demand Corporativo) | S/ 93.80 | S/ 281.40 |
| **Servidor Backend** | AWS EC2 \+ 80GB SSD gp3 | S/ 133.00 | S/ 399.00 |
| **Base de Datos** | AWS RDS PostgreSQL \+ 50GB gp3 | S/ 216.41 | S/ 649.23 |
| **Sandbox de Pruebas IaC** | Orquestación y destrucción dinámica de recursos | S/ 117.25 | S/ 351.75 |
| **TOTALES** | **Infraestructura Cloud de CloudScope** | **S/ 560.46** | **S/ 1,681.** |

      4. ### **Costos de personal** {#costos-de-personal}

| Rol Técnico Especializado | Cantidad | Pago Mensual | Costo Total (3 meses) |
| ----- | ----- | ----- | ----- |
| Líder de Proyecto / Arquitecto Cloud | 1 | S/ 6,000.00 | S/ 18,000.00 |
| Desarrollador Fullstack Senior | 1 | S/ 5,000.00 | S/ 15,000.00 |
| **Subtotal Personal** | **2** | **S/ 11,000.00** | **S/ 33,000.00** |

      5. ### **Costos totales del desarrollo del sistema**  {#costos-totales-del-desarrollo-del-sistema}

| *Categoría Presupuestaria* | *Componente Clave Incluido* | *Costo Mensual* | *Costo Total (3 meses)* |
| ----- | ----- | ----- | ----- |
| ***Costos Generales*** | *Luz proporcional \+ Google Workspace corporativo* | *S/ 140.00* | *S/ 420.00* |
| ***Costos Operativos*** | *Internet de fibra óptica \+ Movilidad presencial \+ Figma Pro* | *S/ 700.00* | *S/ 2,100.00* |
| ***Costos del Ambiente*** | *Infraestructura Cloud de nivel empresarial (AWS)* | *S/ 560.46* | *S/ 1,681.38* |
| ***Costos de Personal*** | *1 Arquitecto Cloud/DevOps \+ 1 Desarrollador Fullstack* | *S/ 11,000.00* | *S/ 33,000.00* |
| ***TOTAL CONSOLIDADO*** | ***Presupuesto de Ejecución del Proyecto*** | ***S/ 12,400.46*** | ***S/ 37,201.38***  |

   3. ## **Factibilidad Operativa** {#factibilidad-operativa}

CloudScope beneficia principalmente a estudiantes y equipos pequeños de desarrollo en Perú que diseñan arquitecturas cloud sin contar con un especialista en seguridad o FinOps dedicado, permitiéndoles detectar errores de configuración y sobrecostos antes del despliegue real. Al ser una aplicación web sin instalación local, el propio equipo desarrollador puede mantenerla operativa durante y después del curso con un esfuerzo de mantenimiento bajo, dado que se apoya en servicios administrados (base de datos y hosting gestionados).

4. ## **Factibilidad Legal** {#factibilidad-legal}

El proyecto cumple con la Ley N.º 29733 (Ley de Protección de Datos Personales de Perú) al implementar cifrado y autenticación para proteger la identidad y diagramas de los usuarios. Además, se apoya íntegramente en tecnologías con licencias de código abierto permisivas (Apache 2.0 / MIT), lo que blinda al proyecto ante riesgos de propiedad intelectual. 

5. ## **Factibilidad Social** {#factibilidad-social}

El proyecto presenta un impacto social netamente positivo, enfocado en el ámbito educativo y profesional. Contribuye directamente a fortalecer la cultura de seguridad y las buenas prácticas cloud entre los estudiantes de Ingeniería de Sistemas y pequeños equipos de desarrollo. Al hacer visibles y accesibles conceptos de auditoría y control de costos que normalmente están restringidos a herramientas empresariales de pago, CloudGuard democratiza este conocimiento técnico. Asimismo, tras el análisis del entorno, no se ha identificado ningún tipo de riesgo o conflicto de índole social, cultural o política asociado a la implementación o uso del sistema. 

6. ## **Factibilidad Ambiental** {#factibilidad-ambiental}

Desde la perspectiva de la sustentabilidad, el proyecto es altamente viable. En primer lugar, al ser una plataforma 100% digital bajo el modelo SaaS, reduce significativamente la dependencia de representaciones impresas y la generación de documentación física asociada al diseño de arquitecturas. En segundo lugar, y de forma mucho más estratégica, su funcionalidad de estimación de costos y detección de sobredimensionamiento (oversizing) genera un impacto ecológico indirecto muy valioso. Al evitar que los usuarios aprovisionen recursos en la nube más grandes de lo estrictamente necesario, CloudGuard ayuda a mitigar el consumo energético excesivo e injustificado en los centros de datos de los proveedores 

5. # **Análisis Financiero** {#análisis-financiero}

Cloud Scope Studio se plantea como un producto real, con un modelo de negocio de suscripción (SaaS) dirigido a equipos pequeños de desarrollo que hoy no cuentan con un especialista dedicado en seguridad cloud o FinOps. El análisis financiero compara la inversión valorizada del proyecto (sección 4.2.5) con los ingresos que generaría dicho modelo de suscripción, usando como referencia precios y comportamiento de mercado de herramientas comparables ya validadas comercialmente.

1. ## **Justificación de la Inversión** {#justificación-de-la-inversión}

La inversión en el desarrollo e implementación del sistema CloudScope se justifica al abordar de manera directa dos de las problemáticas más recurrentes y costosas en la adopción de la nube: el gasto desperdiciado por sobredimensionamiento de recursos (que alcanza hasta un 29% según la industria) y los incidentes de seguridad originados por errores de configuración humana. Bajo un modelo de negocio SaaS, el proyecto demuestra viabilidad financiera al recuperar rápidamente la inversión y, simultáneamente, generar un alto valor para sus usuarios mediante la prevención proactiva de errores técnicos y financieros 

### ***5.1.1 Beneficios*** **del Proyecto** {#5.1.1-beneficios-del-proyecto}

***Beneficios tangibles:***

* Reducción de costos operativos cloud (FinOps): Ahorro económico directo para los equipos al detectar y prevenir el sobredimensionamiento de la infraestructura (oversizing) antes de su despliegue en producción, empleando el módulo de cálculo financiero predictivo.  
* Optimización de horas-hombre: Disminución significativa del tiempo que el personal técnico invierte realizando auditorías manuales de seguridad y programando plantillas de Infraestructura como Código (IaC) desde cero, gracias a la exportación automatizada a Terraform.  
* Generación de ingresos (Modelo SaaS): Flujo de caja constante y directo proveniente de las suscripciones de los equipos de desarrollo y organizaciones que utilicen la plataforma para diseñar sus arquitecturas.  
* Prevención de gastos de remediación: Ahorro asociado a la mitigación de costos legales, operativos y técnicos que surgen al tener que corregir vulnerabilidades o fallas de arquitectura en etapas productivas tardías

***Beneficios intangibles:***

* Fortalecimiento de la cultura DevSecOps: Democratización del conocimiento técnico sobre seguridad en la nube y control de costos para estudiantes de Ingeniería de Sistemas y pequeños equipos, integrando estas buenas prácticas desde la fase inicial de diseño gráfico.  
* Reducción de la huella de carbono: Impacto ecológico positivo, ya que, al evitar que los usuarios aprovisionen recursos informáticos más grandes de lo estrictamente necesario, se ayuda a mitigar el consumo energético excesivo en los centros de datos de los proveedores cloud.  
* Incremento de la confianza técnica y operativa: Mayor tranquilidad para los desarrolladores y líderes de proyecto al tener la certeza de que su arquitectura está siendo auditada en tiempo de diseño frente a estándares globales como el AWS Well-Architected Framework y CIS Benchmarks.  
* Mejora en la resiliencia del sistema: Capacidad de visualizar y anticipar riesgos mediante la simulación interactiva de propagación de fallos de componentes (SPOF), mejorando estratégicamente la toma de decisiones del equipo antes de impactar el entorno real.

Tabla de Costos de Mantenimiento Anual

| Concepto | Costo Anual | Costo Mensual |
| :---- | :---- | :---- |
| Infraestructura Cloud (Azure SQL Database) | S/ 3,000.00 | S/ 250.00 |
| Soporte Técnico y Gestión de Incidencias | S/ 4,000.00 | S/ 333.33 |
| Bolsa de Contingencias de Operación | S/ 1,440.00 | S/ 120.00 |
| Actualizaciones y mejoras | S/ 1,500.00 | S/ 125.00 |
| Total Mantenimiento Anual | S/ 9,940.00 | S/ 828.33 |

Tabla de Ingresos / Ahorros Estimados

| Concepto | Estimación Anual | Estimación Mensual |
| :---- | :---- | :---- |
| Eliminación Total de Logística y Materiales Físicos | S/ 12,000.00 | S/ 1,000.00 |
| Optimización de Horas-Hombre del Personal Técnico | S/ 29,000.00 | S/ 2,416.67 |
| Automatización del Proceso de Evaluación y Reportes | S/ 7,000.00 | S/ 583.33 |
| Mitigación de Gastos en Asistencia Social y Legal | S/ 15,000.00 | S/ 1,250.00 |
| Total Beneficios Anuales | S/ 63,000.00 | S/ 5,250.00 |

Tabla de Inversión

| Periodo | Beneficios Brutos | Costos (Inversión \+ Mantenimiento) | Flujo Neto (Beneficios \- Costos) |
| :---: | :---: | :---: | :---: |
| 0 | S/ 0.00 | S/ 38,519.60 | \-S/ 38,519.60 |
| 1 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 2 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 3 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 4 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 5 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 6 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 7 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 8 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 9 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 10 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 11 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| 12 | S/ 5,250.00 | S/ 828.33 | S/ 4,421.67 |
| Totales | S/ 63,000.00 | S/ 48,459.56 | S/ 14,540.44 |

### 

### 

### 

### 

### 

### 

### 

### 

### 

### 

### 

### 

### 

### 

### **5.1.2 Criterios de Inversión** {#5.1.2-criterios-de-inversión}

   
*5.1.2.1 Relación Beneficio/Costo (B/C)*

*La Relación Beneficio/Costo compara el valor presente de todos los ingresos frente al valor presente de todos los costos (incluyendo la inversión inicial).*

* ***Fórmula Aplicada:***  
  ***![][image2]***  
* ***Valor Presente de Ingresos:** S/ 59,716.17*  
* ***Valor Presente de Costos:** S/ 47,941.45*  
* ***Resultado B/C:** **1.08***  
* ***Evaluación:** Como el resultado es mayor a uno B/C \> 1, **se acepta el proyecto**. Esto significa que, por cada sol invertido y ajustado al valor del dinero en el tiempo, el proyecto no solo recupera ese sol, sino que genera **S/ 0.25** adicionales de ganancia pura.*


                    *5.1.2.2 Valor Actual Neto (VAN)*  
*El VAN determina cuánto valor extra genera el proyecto en moneda de hoy, descontando la inversión y el costo de oportunidad.*

* ***Fórmula Aplicada:***  
  *![][image3]*  
* ***Resultado VAN:** **S/ 11,774.72***  
* ***Evaluación:** Como el VAN es mayor que cero VAN\> 0, **se acepta el proyecto**. CloudScope genera un valor agregado de más de once mil soles en su primer año de operación, cubriendo por completo la expectativa de rentabilidad (COK).*

  *5.1.2.3 Tasa Interna de Retorno (TIR)*


*La TIR indica la rentabilidad promedio porcentual que genera el capital invertido por los propios flujos del sistema.*

* ***Fórmula Aplicada:**  La tasa r que hace que el VAN \= 0\.*  
* ***Resultado TIR Mensual:** **5.31%***  
* ***Resultado TIR Anualizada:** **86.00%***  
* ***Evaluación:** Como la TIR 86.00 es ampliamente mayor que el Costo de Oportunidad de Capital 10.00, **se acepta el proyecto**. El rendimiento del capital invertido en CloudScope es excepcionalmente alto durante estos primeros 12 meses.*


    
    
    
    
    
  


6. # Conclusiones {#conclusiones}

El desarrollo del sistema CloudScope es plenamente factible a nivel técnico, operativo y financiero, demostrando ser un proyecto de alta rentabilidad con una recuperación de inversión proyectada para el noveno mes, un VAN positivo y una relación Beneficio/Costo favorable. Su implementación estratégica soluciona de forma unificada el sobredimensionamiento de recursos cloud y las vulnerabilidades de configuración desde la etapa inicial de diseño gráfico. Adicionalmente, el proyecto es viable desde la perspectiva legal al cumplir con la Ley N.º 29733 y emplear tecnologías de código abierto, generando a su vez un impacto socioambiental positivo al democratizar el conocimiento técnico y reducir la huella de carbono asociada al consumo energético innecesario en los centros de datos .  
 

7\. Referencias

*\[1\] Gartner. (2019). How to Make Cloud More Secure Than Your Own Data Center (N. MacDonald & T. Croll, autores). Gartner, Inc.*

*\[2\] Flexera. (2026). State of the Cloud Report 2026\. Flexera. https://info.flexera.com/CM-REPORT-State-of-the-Cloud*

*\[3\] Congreso de la República del Perú. (2011). Ley N.º 29733, Ley de Protección de Datos Personales.*

*\[4\] Amazon Web Services. (2026). AWS Free Tier – preguntas frecuentes y estructura de créditos para cuentas nuevas (vigente desde el 15 de julio de 2025). https://aws.amazon.com/free/*

*\[5\] CostBench. (2026, junio). AWS Pricing 2026: Free Tier to $50,000/month. https://costbench.com/software/cloud-infrastructure/aws/*

*\[6\] Indeed Perú. (2025, noviembre). Sueldo de Desarrollador/a Java en Perú. https://pe.indeed.com/career/desarrollador-java/salaries*

*\[7\] Cloudaware. (2026). 17 Top Cloud Security Posture Management Vendors 2026 Compared by Capability (precios de Snyk). https://cloudaware.com/blog/top-cloud-security-posture-management-vendors/*

*\[8\] Banco Central de Reserva del Perú (BCRP). (2026, julio). Programa Monetario de Julio 2026: tasa de interés de referencia en 4.25%. https://www.bcrp.gob.pe/*

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,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>