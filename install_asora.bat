@echo off
title Instalador de ASORA
color 0A

echo ========================================================
echo          INSTALADOR DE DEPENDENCIAS - ASORA
echo ========================================================
echo.

echo [1/2] Instalando dependencias de Python (Backend)...
cd backend
py -3 -m pip install -r requirements.txt
cd ..

echo.
echo [2/2] Instalando paquetes de Node.js (Frontend)...
cd frontend
call npm install
cd ..

echo.
echo ========================================================
echo  Instalacion completada con exito.
echo  Ahora puedes hacer doble clic en "start_asora.bat"
echo  para iniciar la plataforma.
echo ========================================================
echo.
pause
