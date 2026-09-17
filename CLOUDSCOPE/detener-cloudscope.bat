@echo off
chcp 65001 >nul
title CloudScope - Detener Servicios
echo ========================================================
echo        CLOUDSCOPE - DETENIENDO SERVICIOS
echo ========================================================
echo.
echo Deteniendo procesos en el puerto 8080 (Backend Spring Boot)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do taskkill /f /pid %%a 2>nul

echo Deteniendo procesos en el puerto 5173 (Frontend React/Vite)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /f /pid %%a 2>nul

echo Deteniendo motor PostgreSQL 16 (si aplica)...
if exist "C:\Users\HP\pgsql\bin\pg_ctl.exe" (
    "C:\Users\HP\pgsql\bin\pg_ctl.exe" -D "C:\Users\HP\pgsql\data" stop >nul 2>&1
)

echo.
echo Todos los servicios han sido detenidos correctamente.
echo.
pause
