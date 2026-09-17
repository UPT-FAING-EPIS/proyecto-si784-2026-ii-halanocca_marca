@echo off
chcp 65001 >nul
title CloudScope - Iniciador del Sistema

echo ========================================================
echo        CLOUDSCOPE - INICIANDO SISTEMA CON POSTGRESQL
echo ========================================================
echo.

set "NODE_PATH=C:\Users\HP\nodejs\PFiles64\nodejs"
set "MAVEN_PATH=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\plugins\maven-plugin\lib\maven3\bin"
set "PG_PATH=C:\Users\HP\pgsql\bin"
set "PG_DATA=C:\Users\HP\pgsql\data"
set "PATH=%PG_PATH%;%NODE_PATH%;%MAVEN_PATH%;%PATH%"

set "ROOT_DIR=%~dp0"
if exist "%ROOT_DIR%proyecto-si784-2026-ii-halanocca_marca\CLOUDSCOPE\cloudscope-backend" (
    set "BACKEND_DIR=%ROOT_DIR%proyecto-si784-2026-ii-halanocca_marca\CLOUDSCOPE\cloudscope-backend"
    set "FRONTEND_DIR=%ROOT_DIR%proyecto-si784-2026-ii-halanocca_marca\CLOUDSCOPE\cloudscope-frontend"
) else (
    set "BACKEND_DIR=%ROOT_DIR%cloudscope-backend"
    set "FRONTEND_DIR=%ROOT_DIR%cloudscope-frontend"
)

echo [1/4] Verificando Base de Datos...
if exist "%PG_PATH%\pg_isready.exe" (
    "%PG_PATH%\pg_isready.exe" -h localhost -p 5432 -U postgres >nul 2>&1
    if errorlevel 1 (
        echo Iniciando motor PostgreSQL...
        start "PostgreSQL Server (5432)" "%PG_PATH%\postgres.exe" -D "%PG_DATA%"
        timeout /t 2 >nul
    ) else (
        echo PostgreSQL ya está en ejecución en puerto 5432.
    )
) else (
    echo PostgreSQL local no detectado. Utilizando base de datos integrada H2 (modo compatible PostgreSQL).
)

echo [2/4] Verificando Backend Spring Boot...
if not exist "%BACKEND_DIR%\target\cloudscope-backend-1.0.0-SNAPSHOT.jar" (
    echo Compilando backend con Maven...
    call mvn clean package -DskipTests -f "%BACKEND_DIR%\pom.xml"
)

echo [3/4] Levantando Backend (Puerto 8080)...
start "CloudScope Backend (Spring Boot)" cmd /k "title CloudScope Backend && cd /d "%BACKEND_DIR%" && java -jar target\cloudscope-backend-1.0.0-SNAPSHOT.jar"

echo [4/4] Levantando Frontend React + Vite (Puerto 5173)...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo Instalando dependencias de Node.js...
    cd /d "%FRONTEND_DIR%"
    call npm install
)
start "CloudScope Frontend (Vite)" cmd /k "title CloudScope Frontend && cd /d "%FRONTEND_DIR%" && set PATH=%NODE_PATH%;%%PATH%% && npm run dev"

echo.
echo Esperando inicialización de servicios...
timeout /t 3 >nul

echo Abriendo navegador en http://localhost:5173/ ...
start http://localhost:5173/

echo.
echo ========================================================
echo  CloudScope está ejecutándose exitosamente:
echo  - Base de Datos: H2 / PostgreSQL (cloudscope_db)
echo  - Backend API:   http://localhost:8080/api/projects/health
echo  - Frontend Web:  http://localhost:5173/
echo ========================================================
echo.
pause
