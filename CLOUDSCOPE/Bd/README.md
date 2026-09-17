# Copia de Seguridad de Base de Datos — CloudScope (PostgreSQL 16)

Este directorio contiene los respaldos oficiales de la base de datos **`cloudscope_db`** generados mediante la utilidad `pg_dump` de PostgreSQL 16.

---

## Archivos Disponibles

1. **`cloudscope_db_backup.sql`**  
   - Script SQL estándar en texto plano UTF-8.
   - Contiene las sentencias DDL de la tabla `projects` (con constraints y claves primarias) y todas las filas de proyectos con sus nodos, aristas y metadatos en formato JSON.
   - Compatible con cualquier cliente SQL (pgAdmin, DBeaver, psql, etc.).

2. **`cloudscope_db_backup.dump`**  
   - Respaldo binario en formato comprimido nativo de PostgreSQL (`-F c`).
   - Optimizado para restauración de alta velocidad con `pg_restore`.

3. **`restaurar_bd.bat`**  
   - Script de Windows para restaurar la base de datos automáticamente con un solo doble clic.

---

## Métodos de Restauración

### Opción A: Mediante el script automático
Simplemente haz doble clic en:
`restaurar_bd.bat`

### Opción B: Mediante línea de comandos (psql)
```bash
# Crear la base de datos si no existe
createdb -U postgres -h localhost -p 5432 cloudscope_db

# Restaurar el script SQL
psql -U postgres -h localhost -p 5432 -d cloudscope_db -f cloudscope_db_backup.sql
```

### Opción C: Mediante pg_restore (con el archivo .dump)
```bash
pg_restore -U postgres -h localhost -p 5432 -d cloudscope_db --clean --if-exists cloudscope_db_backup.dump
```

### Opción D: En contenedor Docker (VPS o Producción)
```bash
docker exec -i cloudscope-db psql -U postgres -d cloudscope_db < cloudscope_db_backup.sql
```

---

## Contenido del Backup

El backup incluye los esquemas y datos completos de:
- Arquitectura AWS 3-Tier Enterprise Web App
- Arquitectura AWS Serverless Event-Driven Stack
- Arquitectura Azure Enterprise Web & SQL
- Arquitectura GCP Cloud Native Stack
- Proyectos personalizados creados por los usuarios
