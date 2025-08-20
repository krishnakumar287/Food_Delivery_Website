@echo off
echo Starting Food Delivery Application Development Servers...
echo.

:: Start Backend Server
echo [1/3] Starting Backend Server on port 4000...
cd backend
start cmd /k "npm run server"
timeout /t 3 /nobreak > nul

:: Start Frontend Server
echo [2/3] Starting Frontend Server on port 5173...
cd ../frontend
start cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

:: Start Admin Panel
echo [3/3] Starting Admin Panel on port 5174...
cd ../admin
start cmd /k "npm run dev -- --port 5174"

echo.
echo ============================================
echo All servers started successfully!
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:5173
echo Admin:    http://localhost:5174
echo.
echo Press any key to close this window...
echo ============================================
pause > nul
