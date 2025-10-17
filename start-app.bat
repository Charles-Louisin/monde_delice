@echo off
echo ========================================
echo   DEMARRAGE MONDE DELICE APPLICATION
echo ========================================
echo.

echo 1. Verification de MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB n'est pas installe ou pas dans le PATH
    echo Veuillez installer MongoDB ou l'ajouter au PATH
    pause
    exit /b 1
)
echo ✅ MongoDB detecte

echo.
echo 2. Demarrage de MongoDB...
start "MongoDB" cmd /k "mongod --dbpath C:\data\db"
timeout /t 3 /nobreak >nul

echo.
echo 3. Demarrage du Backend...
cd backend
start "Backend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo 4. Demarrage du Frontend...
cd ..
start "Frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo 5. Test de connectivite...
node test-connectivity.js

echo.
echo ========================================
echo   APPLICATION DEMARREE
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo API:      http://localhost:5000/api
echo ========================================
echo.
echo Appuyez sur une touche pour fermer...
pause >nul
