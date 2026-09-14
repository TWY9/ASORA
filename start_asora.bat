@echo off
title Lanzador de ASORA
color 0B

echo ========================================================
echo                 BIENVENIDO A ASORA
echo      Plataforma Digital para Asesorias Escolares
echo ========================================================
echo.

:: Verificar dependencias del backend
cd backend
if not exist "instance\project.db" (
    echo [!] Base de datos no encontrada. Inicializando y poblando datos...
    set FLASK_APP=run.py
    py -3 -m flask init-db
    py -3 -m flask seed
)
cd ..

:: Iniciar Backend en una nueva ventana
echo [+] Levantando Backend (API Flask) en el puerto 5000...
start "ASORA Backend (API)" cmd /c "cd backend && set FLASK_APP=run.py && py -3 -m flask run --port 5000"

:: Iniciar Frontend en una nueva ventana
echo [+] Levantando Frontend (React/Vite)...
start "ASORA Frontend (Web)" cmd /c "cd frontend && npm run dev"

echo.
echo ========================================================
echo  Todo listo. ASORA se esta ejecutando.
echo.
echo  - Frontend Web: http://localhost:5173
echo  - Backend API:  http://localhost:5000
echo.
echo  Puedes cerrar esta ventana, pero NO cierres las
echo  dos ventanas negras nuevas si quieres seguir usando la app.
echo ========================================================
echo.
pause
