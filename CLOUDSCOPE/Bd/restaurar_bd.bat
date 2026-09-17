@echo off
chcp 65001 >nul
title CloudScope - Restauración de Base de Datos PostgreSQL

echo ========================================================
echo   CLOUDSCOPE - RESTAURAR COPIA DE SEGURIDAD POSTGRESQL
echo ========================================================
echo.

set "PG_BIN=C:\Users\HP\pgsql\bin"
set "DB_NAME=cloudscope_db"
set "BACKUP_SQL=%~dp0cloudscope_db_backup.sql"

if not exist "%PG_BIN%\psql.exe" (
    set "PG_BIN="
    where psql >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] No se encontro psql en la ruta por defecto ni en el PATH.
        echo Asegurate de tener PostgreSQL instalado.
        pause
        exit /b 1
    )
)

echo [1/2] Verificando conexion con PostgreSQL en localhost:5432...
if defined PG_BIN (
    "%PG_BIN%\pg_isready.exe" -h localhost -p 5432 -U postgres >nul 2>&1
) else (
    pg_isready -h localhost -p 5432 -U postgres >nul 2>&1
)

if errorlevel 1 (
    echo [ERROR] PostgreSQL no esta corriendo en localhost:5432.
    echo Inicia el servicio antes de restaurar.
    pause
    exit /b 1
)

echo [2/2] Restaurando base de datos "%DB_NAME%" desde %BACKUP_SQL%...
if defined PG_BIN (
    "%PG_BIN%\createdb.exe" -h localhost -p 5432 -U postgres %DB_NAME% 2>nul
    "%PG_BIN%\psql.exe" -h localhost -p 5432 -U postgres -d %DB_NAME% -f "%BACKUP_SQL%"
) else (
    createdb -h localhost -p 5432 -U postgres %DB_NAME% 2>nul
    psql -h localhost -p 5432 -U postgres -d %DB_NAME% -f "%BACKUP_SQL%"
)

echo.
echo ========================================================
echo   ¡Restauración completada exitosamente!
echo ========================================================
echo.
pause
